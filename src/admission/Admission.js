const majorModel = require("../majors/majors.models");

const validation = require("./admission.validation");
const saveData = require("../../validation/saveData");

const StudentInMajors = require("../studentInMajor/studentInMajor.models");
const {
  formatStudentCode,
  formatTeacherCode,
} = require("./formatStudentAndTeacherCode");

class Admission {
  CurrentYear = new Date().getFullYear() % 100;

  constructor(information, models) {
    this.information = information;
    this.models = models;
  }

  createAccount = (code) => {
    return {
      account: code + "@caothang.edu.vn",
      password: "123456789",
    };
  };
}

class StudentAdmission extends Admission {
  checkInfo = () => {
    const { error } = validation.admissionStudentValidation(this.information);
    if (error) throw new Error(error.details[0].message);
  };

  // create code of student
  createCode = async (majorCode) => {
    const count = await StudentInMajors.countDocuments({ majorCode }).exec();
    const Major = await majorModel.findOne({ majorsCode: majorCode });
    const quantity = count == 0 ? 1 : count + 1;

    if (quantity >= Major.quantity) {
      await majorModel.findOneAndUpdate(
        { majorsCode: majorCode },
        { acceptStudent: false }
      );
      throw new Error("Target has been reached.");
    }

    const formatCode = formatStudentCode(majorCode, this.CurrentYear, quantity);
    //check studentCode
    const check = await this.models.findOne({ studentCode: formatCode });

    if (check) throw new Error("Student does exist.");

    await saveData(StudentInMajors, { majorCode, studentCode: formatCode });

    return {
      accountOfStudent: this.createAccount(formatCode),
      studentCode: formatCode,
    };
  };
}

class TeacherAdmission extends Admission {
  checkInfo = () => {
    const { error } = validation.admissionTeacherValidation(this.information);
    if (error) throw new Error(error.details[0].message);
  };

  // create code of teacher
  createCode = async (majorCode) => {
    const count = await this.models.countDocuments({ majorCode }).exec();
    const quantity = count == 0 ? 1 : count + 1;
    const formatCode = formatTeacherCode(majorCode, this.CurrentYear, quantity);

    //check studentCode
    const check = await this.models.findOne({ teacherCode: formatCode });

    if (check) throw new Error("Teacher does exist.");

    return {
      accountOfTeacher: this.createAccount(formatCode),
      teacherCode: formatCode,
    };
  };
}

module.exports = { StudentAdmission, TeacherAdmission };
