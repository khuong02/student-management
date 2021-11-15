const { v4: uuid_v4 } = require("uuid");
const ClassOfSchool = require("./Class");

const { Student, Teacher } = require("../users/users.models");
const ClassModels = require("./class.models");
const Majors = require("../majors/majors.models");

const saveData = require("../../validation/saveData");

const classDivide = require("./classDivide");

const CurrentYear = new Date().getFullYear() % 100;

const joinStudent = async (req, res) => {
  try {
    const classOfSchool = new ClassOfSchool();
    const { list_student, major } = req.body;

    const quantityStudentInMajor = await Student.find({
      majorsCode: major,
    }).count();
    if (quantityStudentInMajor === 0)
      return res.status(400).json({ msg: "Student of major does not exist." });

    const getMajor = await Majors.findOne({ majorsCode: major });

    let index = 1;
    // max in class is 45 student
    //getMajor.quantity
    let limit = 3;
    do {
      const startIndex = (index - 1) * limit;
      const nameClass = classDivide(getMajor.nameMajors, CurrentYear, index);
      const arr_uuid_student = [];

      const students = await Student.find({ majorsCode: major })
        .limit(limit)
        .skip(startIndex)
        .then((student) =>
          student.map((obj) => arr_uuid_student.push(obj.uuid))
        );

      if (students.length === 0) break;

      const infoClass = {
        nameClass,
        classCode: uuid_v4(),
        major,
        codeStudents: arr_uuid_student,
      };

      const checkClass = await ClassModels.findOne({ nameClass });

      if (checkClass) {
        index++;
        continue;
      }

      await saveData(ClassModels, infoClass);
      index++;
    } while (true);

    res.json({ msg: "Join student success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { major } = req.body;
    const classOfSchool = new ClassOfSchool(null, major, ClassModels);

    const find_major = await Majors.findOne({ majorCode: major });

    classOfSchool.createClass(find_major.nameMajor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const { list_student, classCode } = req.body;
    const classOfSchool = new ClassOfSchool(classCode, null, ClassModels);
    await classOfSchool.addStudentForClass(list_student);

    res.json({ msg: "success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const joinTeacher = async (req, res) => {
  try {
    const { uuid_teacher, classCode, major } = req.body;

    const teacher = await Teacher.findOne({ uuid: uuid_teacher });

    if (teacher.majorsCode !== major)
      return res.status(400).json({ msg: "Teacher not this major." });

    if (!teacher)
      return res.status(400).json({ msg: "Teacher does not exist." });

    const updateClass = {
      teacherCode: uuid_teacher,
    };

    const updateTeacher = {
      class: classCode,
    };

    const arr_update = [
      await ClassModels.findOneAndUpdate({ classCode }, updateClass),
      await Teacher.findOneAndUpdate(
        { teacherCode: uuid_teacher },
        updateTeacher
      ),
    ];

    Promise.all(arr_update)
      .then(() => res.json({ msg: "Add teacher in class success!" }))
      .catch((err) => res.status(400).json({ msg: err }));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createClass, addStudent };
