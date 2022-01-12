const assignmentModels = require("./assignment.models");
const { TeacherModels } = require("../users/users.models");
const ClassModels = require("../class/class.models");

const {
  assignmentValidation,
  assignmentHomeRoomTeacherValidation,
} = require("./assignment.validation");

const assignmentTeacherSubjectMiddleware = async (req, res, next) => {
  try {
    const { teacherCode, classCode, subjectCode, semester, typeAssignment } =
      req.body;
    const { error } =
      typeAssignment === +process.env.HOME_ROOM_TEACHER
        ? assignmentHomeRoomTeacherValidation(req.body)
        : assignmentValidation(req.body);

    if (error) return res.status(400).json({ msg: error.details[0].message });
    //check Do teacher exist?
    const teacher = await TeacherModels.findOne({ uuid: teacherCode });

    if (!teacher)
      return res.status(400).json({ msg: "Teacher does not exist" });

    //check Do class exist?
    const check_class = await ClassModels.findOne({ classCode });

    if (!check_class)
      return res.status(400).json({ msg: "Class does not exist" });

    //check. Has the teacher been assigned yet?
    let check = null;
    if (typeAssignment === +process.env.HOME_ROOM_TEACHER) {
      check = await assignmentModels.findOne({
        classCode,
        teacherCode,
        typeAssignment,
      });
    }

    if (check)
      return res.status(400).json({
        msg: "The teacher has been assigned to home room teacher in this class.",
      });

    if (typeAssignment === +process.env.SUBJECT_TEACHER) {
      const checkSubject = await assignmentModels.findOne({
        classCode,
        subjectCode,
      });

      if (checkSubject)
        return res
          .status(400)
          .json({ msg: "This subject has been teach in this class." });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { assignmentTeacherSubjectMiddleware };
