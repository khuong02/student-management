const Joi = require("@hapi/joi");

const assignmentValidation = (data) => {
  const schema = Joi.object({
    teacherCode: Joi.string().required(),
    classCode: Joi.string().required(),
    subjectCode: Joi.string().required(),
    semester: Joi.number().required(),
    typeAssignment: Joi.number().required(),
  });
  return schema.validate(data);
};

const assignmentHomeRoomTeacherValidation = (data) => {
  const schema = Joi.object({
    teacherCode: Joi.string().required(),
    classCode: Joi.string().required(),
    typeAssignment: Joi.number().required(),
  });
  return schema.validate(data);
};

module.exports = { assignmentValidation, assignmentHomeRoomTeacherValidation };
