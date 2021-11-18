const ClassModels = require("../class/class.models");
const { StudentModels, TeacherModels } = require("../users/users.models");
const SubjectsModels = require("../subjects/subjects.models");
const LearningOutcomesModels = require("./learningOutcomes.models");

const learningOutcomesValidation = require("./learningOutcomes.validation");

const learningOutcomesMiddleware = async (req, res, next) => {
  try {
    const { studentCode, teacherCode, classCode, subjectCode, semester } =
      req.body;
    const { error } = learningOutcomesValidation(req.body);

    if (error) return res.status(400).json({ msg: error.details[0].message });

    const check_class = await ClassModels.findOne({ classCode });

    if (!check_class)
      return res
        .status(400)
        .json({ msg: `Class with class code ${classCode} does not exist.` });

    const check_student = await StudentModels.findOne({ uuid: studentCode });

    if (!check_student)
      return res.status(400).json({
        msg: `student with student code ${studentCode} does not exist.`,
      });

    if (classCode !== check_student.classCode)
      return res
        .status(400)
        .json({ msg: "Students do not study in this class" });

    const check_teacher = await TeacherModels.findOne({ uuid: teacherCode });

    if (!check_teacher)
      return res.status(400).json({
        msg: `Teacher with teacher code ${teacherCode} does not exist.`,
      });

    const check_subject = await SubjectsModels.findOne({ subjectCode });

    if (!check_subject)
      return res.status(400).json({
        msg: `Subject with subject code ${subjectCode} does not exist.`,
      });

    if (semester !== check_subject.semester)
      return res.status(400).json({ msg: "Subject not taught this semester" });

    const check_learning = await LearningOutcomesModels.findOne({
      subjectCode,
      studentCode,
    });

    if (check_learning)
      return res
        .status(400)
        .json({ msg: "Student has been pointed to this subject" });

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = learningOutcomesMiddleware;
