const validation = require("./admission.validation");
const { sendMailFunc } = require("../sendMail");
const saveData = require("../../validation/saveData");
const hashPassword = require("../../validation/hashPassword");

const admissionMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      const { error } = validation.admissionValidation(res.results);

      if (error) return res.status(400).json({ msg: error.details[0].message });

      const { nameMajors, email, information, job } = res.results;
      const { name, account, password } = information;
      const code =
        job.toLowerCase() === "student"
          ? information.studentCode
          : information.teacherCode;

      const contentMail = {
        name,
        email,
        code,
        account,
        password,
        nameMajors,
      };

      information.password = await hashPassword(password);

      Promise.all([sendMailFunc(contentMail), saveData(model, information)])
        .then(() => {
          res.results = { msg: "Please check your mail!" };
          next();
        })
        .catch((err) => (res.results = { msg: err }));
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

module.exports = admissionMiddleware;
