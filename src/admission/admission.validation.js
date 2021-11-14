const Joi = require("@hapi/joi");

const admissionStudentValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(256).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    point: Joi.number().required(),
    aspirations_arr: Joi.array().required(),
    birthday: Joi.date().required(),
  });
  return schema.validate(data);
};

const admissionTeacherValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(256).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    major: Joi.string().required(),
    birthday: Joi.date().required(),
  });
  return schema.validate(data);
};

const admissionValidation = (data) => {
  const schema = Joi.object({
    nameMajors: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    information: Joi.object().required(),
    job: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  admissionStudentValidation,
  admissionValidation,
  admissionTeacherValidation,
};
