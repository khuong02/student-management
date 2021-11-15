const { v4: uuid_v4 } = require("uuid");

const CurrentYear = new Date().getFullYear() % 100;
const { Student, Teacher } = require("../users/users.models");

const saveData = require("../../validation/saveData");

class ClassOfSchool {
  constructor(classCode, major, models) {
    this.classCode = classCode;
    this.major = major;
    this.models = models;
  }

  divideClass = (nameMajor, num) => {
    let name = "";
    switch (nameMajor.toLowerCase()) {
      case "cntt":
        name = "TH";
        break;

      default:
        name = nameMajor;
        break;
    }

    return `CD${name}${CurrentYear}${String.fromCharCode(64 + num)}`;
  };

  createClass = async (nameMajor) => {
    //count class in major
    const count = await this.models({ majorCode: this.major }).count();
    const className = this.divideClass(nameMajor, count + 1);

    const informationOfClass = {
      className,
      classCode: uuid_v4(),
      majorCode,
    };

    await saveData(this.models, informationOfClass);
  };

  addStudentForClass = async (list_student) => {
    const find_class = await this.models.findOne({ classCode: this.classCode });
    const current_quantity = find_class.quantity ? find_class.quantity : 0;
    const len = list_student.length;

    //max student in class is 15
    const new_quantity = current_quantity + len;
    if (new_quantity > 15 || current_quantity > 15)
      throw new Error("Max student in class is 15");

    await this.models.findOneAndUpdate(
      { classCode },
      { quantity: new_quantity }
    );
    await Student.updateMany(
      {
        studentCode: list_student,
      },
      { $set: { classCode: this.classCode } }
    );
  };
}

module.exports = ClassOfSchool;
