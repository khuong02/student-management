const Joi = require("@hapi/joi");

const majorsValidation = (data) => {
  const schema = Joi.object({
    nameMajors: Joi.string().min(1).max(256).required(),
    majorsCode: Joi.string().required(),
    benchmark: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(data);
};

module.exports = majorsValidation;
