const subjectValidation = require("./subject.validation");
const MajorsModel = require("../majors/majors.models");

const subjectMiddleware = async (req, res, next) => {
  try {
    const { error } = subjectValidation(req.body);

    if (error) return res.status(400).json({ msg: error.details[0].message });

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = subjectMiddleware;
