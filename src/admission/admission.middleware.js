const { StudentAdmission, TeacherAdmission } = require("./Admission");

const hashPassword = require("../../validation/hashPassword");
const { v4: uuid_v4 } = require("uuid");

const majorModel = require("../majors/majors.models");
const { Student, Teacher } = require("../users/users.models");
const saveData = require("../../validation/saveData");
const { sendMailFunc } = require("../sendMail");

const admissionStudentMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      const student = new StudentAdmission(req.body, Student);
      //check information
      student.checkInfo();

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

      if (!resultMajors) {
        await sendMailFunc({ name, email }, false);
        return res
          .status(400)
          .json({ msg: "Please wait and check when is the announcement." });
      }
      if (resultMajors.msg)
        return res.status(400).json({ msg: resultMajors.msg });

      const { majorsCode, nameMajors } = resultMajors;

      //   const infoRegister = {
      //     name,
      //     email,
      //     address,
      //     point,
      //     aspirations_arr,
      //     birthday,
      //     major: majorsCode,
      //   };

      //   await saveData(model, infoRegister);

      const { accountOfStudent, studentCode } = await student.createCode(
        majorsCode
      );

      const { account, password } = accountOfStudent;
      const information = {
        name,
        address,
        majorsCode,
        studentCode,
        birthday: new Date(birthday),
        schoolYear: student.CurrentYear,
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
        nameMajors,
      };

      Promise.all([
        sendMailFunc(contentMail, true),
        saveData(Student, information),
      ])
        .then(() => {
          res.results = {
            msg: "Please wait and check when is the announcement.",
          };
          next();
        })
        .catch((err) => {
          res.results = { msg: err };
          next();
        });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

const admissionTeacherMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      //check data request
      const teacher = new TeacherAdmission(req.body, Teacher);
      //check information
      teacher.checkInfo();

      const { name, email, address, birthday, major } = req.body;

      //check major
      const checkMajor = await majorModel.findOne({ majorCode: major });

      if (!checkMajor)
        return res.status(400).json({ msg: "Major does not exist" });

      const { accountOfTeacher, teacherCode } = await teacher.createCode(major);

      const { account, password } = accountOfTeacher;
      const information = {
        name,
        address,
        majorsCode: major,
        teacherCode,
        birthday: new Date(birthday),
        account,
        password: await hashPassword(password),
        uuid: uuid_v4(),
      };

      const contentMail = {
        name,
        email,
        code: teacherCode,
        account,
        password,
        nameMajors: checkMajor.nameMajors,
      };

      Promise.all([sendMailFunc(contentMail), saveData(Teacher, information)])
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
