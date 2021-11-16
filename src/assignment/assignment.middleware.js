const assignmentModels = require("./assignment.models");
const { Teacher } = require("../users/users.models");
const ClassModels = require("../class/class.models");

const assignmentValidation = require("./assignment.validation");

const check_data = async (models, data) => {
  return await models.findOne(data);
};

const assignmentMiddleware = async (req, res, next) => {
  try {
    const { teacherCode, classCode, subjectCode, semester } = req.body;
    const { error } = assignmentValidation(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    //check Do teacher exist?
    const teacher = await check_data(Teacher, { teacherCode });

    if (!teacher)
      return res.status(400).json({ msg: "Teacher does not exist" });

    //check Do class exist?
    const check_class = await check_data(ClassModels, { classCode });

    if (!check_class)
      return res.status(400).json({ msg: "Class does not exist" });

    //check. Has the teacher been assigned yet?
    const check = await check_data(assignmentModels, {
      classCode,
      teacherCode,
    });

    if (check)
      return res
        .status(400)
        .json({ msg: "The teacher has been assigned to teach in this class." });

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = assignmentMiddleware;
