const { v4: uuid_v4 } = require("uuid");

const CurrentYear = new Date().getFullYear() % 100;
const { Student, Teacher } = require("../users/users.models");

const saveData = require("../../validation/saveData");

class Classes {
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
    const count = await this.models
      .countDocuments({ majorCode: this.major })
      .count();

    const className = this.divideClass(nameMajor, count + 1);

    const informationOfClass = {
      className,
      classCode: uuid_v4(),
      majorCode: this.major,
    };

    await saveData(this.models, informationOfClass);
  };

  addStudentForClass = async (list_student) => {
    const find_class = await this.models.findOne({ classCode: this.classCode });
    const current_quantity = find_class.quantity ? find_class.quantity : 0;
    const len = list_student.length;
    //max student in class is 15
    const max = 15;

    const new_quantity = current_quantity + len;
    if (new_quantity > max || current_quantity > max)
      throw new Error(`Max student in class is ${max}`);

    for (let i = 0; i < max; i++) {
      const find_student = await Student.findOne({
        studentCode: list_student[i],
      });
      if (!find_student)
        throw new Error(
          `Students with student code ${list_student[i]}  does not exist`
        );
      if (find_student.classCode)
        throw new Error(
          `Students with student code ${list_student[i]}  already have classes`
        );
      if (find_student.majorCode !== find_class.majorCode)
        throw new Error(
          `Students with student code ${list_student[i]} not in this major `
        );
    }

    await this.models.findOneAndUpdate(
      { classCode: this.classCode },
      { quantity: new_quantity }
    );
    await Student.updateMany(
      {
        studentCode: { $in: list_student },
      },
      { $set: { classCode: this.classCode } }
    );
  };
}

module.exports = Classes;
