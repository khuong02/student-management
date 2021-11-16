const { v4: uuid_v4 } = require("uuid");
const Classes = require("./Class");

const { Student, Teacher } = require("../users/users.models");
const ClassModels = require("./class.models");
const Majors = require("../majors/majors.models");

const CurrentYear = new Date().getFullYear() % 100;

const createClass = async (req, res) => {
  try {
    const { major } = req.body;
    const classes = new Classes(null, major, ClassModels);

    const find_major = await Majors.findOne({ majorCode: major });

    classes.createClass(find_major.nameMajor);
    res.json({ msg: "Create class success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const { list_student, classCode } = req.body;
    const classes = new Classes(classCode, null, ClassModels);
    await classes.addStudentForClass(list_student);

    res.json({ msg: "success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createClass, addStudent };
