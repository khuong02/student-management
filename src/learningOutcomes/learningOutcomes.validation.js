const Joi = require("@hapi/joi");

const learningOutcomesValidation = (data) => {
  const schema = Joi.object({
    studentCode: Joi.string().required(),
    subjectCode: Joi.string().required(),
    classCode: Joi.string().required(),
    semester: Joi.number().required(),
    point: Joi.number().required(),
    teacherCode: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = learningOutcomesValidation;
