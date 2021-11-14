const admissionStudentCrl = async (req, res) => {
  res.json(res.results);
};

const admissionTeacherCrl = async (req, res) => {
  res.json(res.results);
};

module.exports = { admissionStudentCrl, admissionTeacherCrl };
