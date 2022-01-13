const ClassesModels = require("./class.models");
const AssignmentModels = require("../assignment/assignment.models");
const { StudentModels, TeacherModels } = require("../users/users.models");
const MajorModels = require("../majors/majors.models");

const getAllClass = async (req, res) => {
  try {
    const classesData = await ClassesModels.find().lean();
    const majorData = await MajorModels.find().lean();
    const assignmentData = await AssignmentModels.find({
      typeAssignment: 0,
    }).lean();
    const teacherData = await TeacherModels.find().lean();

    if (!classesData || classesData.length === 0)
      return res.json({ success: false, msg: "Classes is empty." });

    // if (!majorData|| majorData.length === 0)  return res.json({ success: false, msg: "Classes is empty." });
    const data = classesData.map((obj) => {
      const nameMajor = majorData.find(
        (majors) => majors.majorCode === obj.majorCode
      ).nameMajor;

      const findTeacherInAssignment = assignmentData.find(
        (assign) => assign.classCode === obj.classCode
      );
      const nameTeacher = !findTeacherInAssignment
        ? "Not teacher ♥"
        : teacherData.find(
            (teachers) => teachers.uuid === findTeacherInAssignment.teacherCode
          ).name;
      return { ...obj, nameMajor, nameTeacher };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getClass = async (req, res) => {
  try {
    const { classesId } = req.params;

    const findClass = await ClassesModels.findOne({
      classCode: classesId,
    }).lean();

    const findAssignment = await AssignmentModels.findOne({
      classCode: classesId,
      typeAssignment: 0,
    });

    if (!findClass)
      return res
        .status(400)
        .json({ success: false, msg: "Not found this classes." });

    if (!findAssignment) return res.json({ success: true, data: findClass });

    const nameTeacher = await TeacherModels.findOne({
      uuid: findAssignment.teacherCode,
    });

    res.json({
      success: true,
      data: { ...findClass, nameTeacher: nameTeacher.name },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getStudentInClass = async (req, res) => {
  try {
    const { classesId } = req.params;

    const listStudent = await StudentModels.find({ classCode: classesId });

    if (listStudent.length === 0 || !listStudent)
      return res.status(400).json({ success: false, msg: "Not allow student" });

    res.json({ success: true, data: listStudent });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { getAllClass, getClass, getStudentInClass };
