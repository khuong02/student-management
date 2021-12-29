const Joi = require("@hapi/joi");

const subjectValidation = (data) => {
  const schema = Joi.object({
    nameSubject: Joi.string().required(),
    majorCode: Joi.string().required(),
    typeSubject: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = subjectValidation;
