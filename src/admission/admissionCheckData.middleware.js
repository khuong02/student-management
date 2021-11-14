const { v4: uuid_v4 } = require("uuid");
const validation = require("./admission.validation");
const createAccount = require("./createAccount");
const {
  formatStudentCode,
  formatTeacherCode,
} = require("./formatStudentAndTeacherCode");
const majorModel = require("../majors/majors.models");
const { Student, Teacher } = require("../users/users.models");
const countData = require("../../validation/countData");
const saveData = require("../../validation/saveData");

const CurrentYear = new Date().getFullYear() % 100;

const createAccountFunc = async (model, majorsCode, nameAccount, nameCode) => {
  const count = await countData(model);
  const quantity = count == 0 ? 1 : count + 1;

  const resultCode =
    nameAccount.toLowerCase() === "student"
      ? formatStudentCode(majorsCode, CurrentYear, quantity)
      : formatTeacherCode(majorsCode, CurrentYear, quantity);

  //check studentCode
  const check = await model.findOne({ [nameCode]: resultCode });

  if (check) return {};

  return { resultAccount: createAccount(resultCode), resultCode };
};

const admissionStudentMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      //check information
      const { error } = validation.admissionStudentValidation(req.body);

      if (error) return res.status(400).json({ msg: error.details[0].message });

      const { name, email, address, point, aspirations_arr, birthday } =
        req.body;

      //achieve a major
      const resultMajors = await majorModel
        .find({
          majorsCode: { $in: aspirations_arr },
        })
        .then((aspirations) => {
          if (aspirations.length === 0)
            return { msg: "Majors does not exist." };

          return aspirations.filter((item) => point >= item.benchmark)[0];
        });

      if (!resultMajors)
        return res.status(400).json({ msg: "You don't have enough points." });

      if (resultMajors.msg)
        return res.status(400).json({ msg: resultMajors.msg });

      const { majorsCode, nameMajors } = resultMajors;

      const infoRegister = {
        name,
        email,
        address,
        point,
        aspirations_arr,
        birthday,
        major: majorsCode,
      };

      await saveData(model, infoRegister);

      const quantityMajor = await majorModel.findOne({ majorsCode });
      const quantityRegister = await model.find({ major: majorsCode });

      if (quantityRegister.length >= quantityMajor.quantity)
        return res.status(400).json({ msg: "Target has been reached" });

      const { resultAccount, resultCode } = await createAccountFunc(
        Student,
        majorsCode,
        "student",
        "studentCode"
      );

      if (!resultAccount || !resultCode)
        return res.status(400).json({ msg: `Student code does exist.` });

      const { account, password } = resultAccount;
      const information = {
        name,
        address,
        majorsCode,
        studentCode: resultCode,
        birthday: new Date(birthday),
        schoolYear: CurrentYear,
        account,
        password,
        uuid: uuid_v4(),
      };

      res.results = {
        nameMajors,
        job: "student",
        email,
        information,
      };
      next();
    } catch (err) {
      console.log(err);

      res.status(500).json({ msg: err.message });
    }
  };
};

const admissionTeacherMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      //check data request
      const { error } = validation.admissionTeacherValidation(req.body);

      if (error) return res.status(400).json({ msg: error.details[0].message });

      const { name, email, address, birthday, major } = req.body;

      //check major
      const checkMajor = await majorModel.findOne({ majorCode: major });

      if (!checkMajor)
        return res.status(400).json({ msg: "Major does not exist" });

      const { resultAccount, resultCode } = await createAccountFunc(
        Teacher,
        major,
        "teacher",
        "teacherCode"
      );

      if (!resultAccount || !resultCode)
        return res.status(400).json({ msg: `Teacher code does exist.` });

      const { account, password } = resultAccount;
      const information = {
        name,
        address,
        majorsCode: major,
        teacherCode: resultCode,
        birthday: new Date(birthday),
        account,
        password,
        uuid: uuid_v4(),
      };

      res.results = {
        nameMajors: checkMajor.nameMajors,
        job: "teacher",
        email,
        information,
      };

      next();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

module.exports = { admissionStudentMiddleware, admissionTeacherMiddleware };
