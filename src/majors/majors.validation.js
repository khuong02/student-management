const Joi = require("@hapi/joi");

const majorsValidation = (data) => {
  const schema = Joi.object({
    nameMajor: Joi.string().min(1).max(256).required(),
    majorCode: Joi.string().required(),
    benchmark: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(data);
};

module.exports = majorsValidation;
