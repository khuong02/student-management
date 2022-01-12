const ClassesModels = require("./class.models");
const { StudentModels } = require("../users/users.models");

const getAllClass = async (req, res) => {
  try {
    const classesData = await ClassesModels.find();

    if (!classesData || classesData.length === 0)
      return res.json({ success: false, msg: "Classes is empty." });

    res.json({ success: true, data: classesData });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getClass = async (req, res) => {
  try {
    const { classesId } = req.params;

    const findClass = await ClassesModels.findOne({ classCode: classesId });

    if (!findClass)
      return res
        .status(400)
        .json({ success: false, msg: "Not found this classes." });

    res.json({ success: true, data: findClass });
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
