const assignmentModels = require("./assignment.models");

const saveData = require("../../validation/saveData");

const assignmentCrl = async (req, res) => {
  try {
    await saveData(assignmentModels, req.body);
    res.json({ msg: "Assignment success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getAssignment = async (req, res) => {
  try {
    const data = await assignmentModels.find();

    if (data.length === 0) return res.json({ msg: "Not yet assignment", data });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { assignmentCrl, getAssignment };
