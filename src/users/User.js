const { v4: uuid_v4 } = require("uuid");

const RefreshToken = require("../../models/refreshToken.models");
const StudentInMajor = require("../studentInMajor/studentInMajor.models");
const ClassModels = require("../class/class.models");
const { StudentModels, TeacherModels } = require("./users.models");
const AssignMentModels = require("../assignment/assignment.models");

const bcrypt = require("bcrypt");
const hashPassword = require("../../validation/hashPassword");
const jwt = require("jsonwebtoken");

const saveData = require("../../validation/saveData");
const { usersValidation, passwordValidation } = require("./users.validation");
const divideClass = require("../class/classDivide");

class User {
  constructor(account, password, roles, models) {
    this.account = account;
    this.password = password;
    this.roles = roles;
    this.models = models;
  }

  login = async (model, cb) => {
    //check account
    if (!usersValidation(this.account)) return { msg: "Account is correct." };

    const user = await this.models[model].findOne({ account: this.account });
    if (!user) return { msg: "Account does not already exists." };

    const checkRefreshTokenInvalid = await RefreshToken.findOne({
      user: user.uuid,
    });

    if (checkRefreshTokenInvalid)
      return { msg: "Refresh token has not expired!" };

    //Checking if password is correct.
    const checkingPassword = await bcrypt.compare(this.password, user.password);

    if (!checkingPassword) return { msg: "Password is not correct" };

    const payload = { account: this.account };

    const accessToken = cb(payload);

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

    await saveData(RefreshToken, { refreshToken, user: user.uuid });

    return { accessToken };
  };

  logout = async (uuid) => {
    await RefreshToken.findOneAndDelete({ user: uuid });

    return { msg: "Logout success!" };
  };

  getInformation = async (model) => {
    const user = await this.models[model].findOne({ account: this.account });
    if (!user) return { msg: "User does not exist." };
    return { userInfo: user };
  };

  changePassword = async (model, uuid, data) => {
    if (!uuid) return { success: false, msg: "Uuid of user is not exist." };

    const { error } = passwordValidation(data);
    if (error) return { success: false, msg: error.details[0].message };
    const { password } = data;

    const hash_password = await hashPassword(password);

    const update = { password: hash_password };
    const user = await this.models[model].findOneAndUpdate({ uuid }, update);
    if (!user) return { success: false, msg: "Change password fall!" };

    return { success: true, msg: "Change password success!" };
  };
}

class Student extends User {
  getPoint = () => {};
}

class Teacher extends User {
  removeStudent = async (uuid) => {
    const check_delete = await StudentModels.findOneAndDelete({ uuid });
    if (!check_delete)
      throw new Error(`Student with student code ${uuid} does not exist`);
    await StudentInMajor.findOneAndDelete({ uuid });
  };

  createClass = async (nameMajor, majorCode) => {
    //count class in major
    const count = await ClassModels.countDocuments({ majorCode }).count();

    const className = divideClass(nameMajor, count + 1);

    if (!className) throw new Error("Class name error");

    const informationOfClass = {
      className,
      classCode: uuid_v4(),
      majorCode,
    };

    await saveData(ClassModels, informationOfClass);
  };

  addStudentForClass = async (list_student, classCode) => {
    const find_class = await ClassModels.findOne({ classCode });
    if (!find_class) throw new Error("This class does not exist");
    const current_quantity = find_class.quantity ? find_class.quantity : 0;
    const len = list_student.length;
    //max student in class is 15
    const max = 15;

    const new_quantity = current_quantity + len;
    if (new_quantity > max || current_quantity > max)
      throw new Error(`Max student in class is ${max}`);

    for (let i = 0; i < list_student.length; i++) {
      const find_student = await StudentModels.findOne({
        studentCode: list_student[i],
      });

      if (!find_student)
        throw new Error(
          `Students with student code ${list_student[i]}  does not exist`
        );
      if (find_student.classCode.trim() !== "")
        throw new Error(
          `Students with student code ${list_student[i]}  already have classes`
        );
      if (find_student.majorCode !== find_class.majorCode)
        throw new Error(
          `Students with student code ${list_student[i]} not in this major `
        );
    }

    await StudentModels.updateMany(
      {
        studentCode: { $in: list_student },
      },
      { $set: { classCode } }
    );
    await ClassModels.findOneAndUpdate(
      { classCode },
      { quantity: new_quantity }
    );
  };

  deleteClass = async (classCode) => {
    const check_delete = await ClassModels.findOneAndDelete({
      classCode,
    });
    if (check_delete.quantity > 0) {
      await StudentModels.updateMany(
        {
          classCode,
        },
        { $set: { classCode: "" } }
      );
    }
    if (!check_delete) throw new Error("This class does not exist.");
  };

  updatePointForStudent = () => {};
}

class Admin extends Teacher {
  removeTeacher = async (uuid) => {
    const check_delete = await TeacherModels.findOneAndDelete({ uuid });

    if (!check_delete)
      throw new Error(`Teacher with teacher code ${uuid} does not exist`);

    //check Has the teacher been assigned yet?
    const check_teacher = await AssignMentModels.findOne({ uuid });

    if (check_teacher)
      await AssignMentModels.findOneAndDelete({
        uuid,
      });
  };
}

module.exports = { User, Student, Teacher, Admin };
