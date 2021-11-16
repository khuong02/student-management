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

module.exports = assignmentCrl;
