const { StudentAdmission, TeacherAdmission } = require("./Admission");

const hashPassword = require("../../validation/hashPassword");
const { v4: uuid_v4 } = require("uuid");

const majorModel = require("../majors/majors.models");
const {
  StudentModels,
  TeacherModels,
  UserModels,
} = require("../users/users.models");
const saveData = require("../../validation/saveData");
const sendMailFunc = require("../sendMail/sendMail");

const admissionStudentMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      const student = new StudentAdmission(req.body, StudentModels);
      //check information
      student.checkInfo();
      const setAspiration = [];

      const { name, email, address, point, aspirations_arr, birthday } =
        req.body;

      if (aspirations_arr.length > 3)
        return res.status(400).json({ msg: "Max aspiration is 3" });

      for (let i = 0; i < aspirations_arr.length; i++) {
        const find_major = await majorModel.findOne({
          majorCode: aspirations_arr[i].value,
        });
        if (!find_major)
          return res.status(400).json({ msg: "Majors does not exist" });
        if (+point >= find_major.benchmark) setAspiration.push(find_major);
      }

      const resultMajors = setAspiration[0];

      if (!resultMajors || resultMajors.length === 0) {
        await sendMailFunc({ name, email }, false);
        return res
          .status(400)
          .json({ msg: "Please wait and check when is the announcement." });
      }

      const { majorCode, nameMajor } = resultMajors;

      const infoRegister = {
        name,
        email,
        address,
        point,
        aspirations_arr,
        birthday,
        major: majorCode,
      };

      const { accountOfStudent, studentCode } = await student.createCode(
        majorCode
      );

      const { account, password } = accountOfStudent;
      const information = {
        name,
        address,
        majorCode,
        studentCode,
        birthday: new Date(birthday),
        schoolYear: new Date().getFullYear(),
        account,
        password: await hashPassword(password),
        uuid: uuid_v4(),
      };

      const contentMail = {
        name,
        email,
        code: studentCode,
        account,
        password,
        nameMajor,
      };

      const infoUser = {
        uuid: information.uuid,
        account,
        password: information.password,
        roles: account[0] + account[1],
      };

      await saveData(StudentModels, information);
      await saveData(model, infoRegister);
      await saveData(UserModels, infoUser);
      await sendMailFunc(contentMail, true);
      res.results = {
        msg: "Please wait and check when is the announcement.",
      };
      next();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

const admissionTeacherMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      //check data request
      const teacher = new TeacherAdmission(req.body, TeacherModels);
      //check information
      teacher.checkInfo();

      const { name, email, address, birthday, major } = req.body;
      console.log(req.body);

      //check major
      const checkMajor = await majorModel.findOne({ majorCode: major });

      if (!checkMajor)
        return res.status(400).json({ msg: "Major does not exist" });

      const { accountOfTeacher, teacherCode } = await teacher.createCode(major);

      const { account, password } = accountOfTeacher;
      const information = {
        name,
        address,
        majorCode: major,
        teacherCode,
        birthday: new Date(birthday),
        account,
        year: new Date().getFullYear(),
        password: await hashPassword(password),
        uuid: uuid_v4(),
      };

      const contentMail = {
        name,
        email,
        code: teacherCode,
        account,
        password,
        nameMajor: checkMajor.nameMajor,
      };

      const infoUser = {
        uuid: information.uuid,
        account,
        password: information.password,
        roles: account[0] + account[1],
      };

      Promise.all([
        sendMailFunc(contentMail, true),
        saveData(TeacherModels, information),
        saveData(UserModels, infoUser),
      ])
        .then(() => {
          res.results = {
            msg: "Please wait and check when is the announcement.",
          };
          next();
        })
        .catch((err) => (res.results = { msg: err }));
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

module.exports = { admissionStudentMiddleware, admissionTeacherMiddleware };
