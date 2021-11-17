const { Admission } = require("./Admission");
const AdmissionModels = require("./admission.models");

const admissionCrl = async (req, res) => {
  res.json(res.results);
};

const getAllStudentAdmission = async (req, res) => {
  try {
    const admission = new Admission(null, AdmissionModels);
    const results = await admission.getAllStudentAdmission();
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteAllStudentAdmission = async (req, res) => {
  try {
    const admission = new Admission(null, AdmissionModels);
    await admission.removeAllStudentAdmission();
    res.json({ msg: "Success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  admissionCrl,
  getAllStudentAdmission,
  deleteAllStudentAdmission,
};
