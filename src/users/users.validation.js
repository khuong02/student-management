const Joi = require("@hapi/joi");

const usersValidation = (account) => {
  const regex = /^([0-9]+)@caothang.edu.vn$/g;

  return regex.test(account);
};

const checkRoles = (roles) => {
  return roles === "01" ? "Teacher" : "Student";
};

const passwordValidation = (data) => {
  const schema = Joi.object({
    roles: Joi.string().equal("01").equal("03").required(),
    password: Joi.string()
      .regex(/[a-z]{1,}/)
      .regex(/[A-Z]{1,}/)
      .regex(/[0-9]{1,}/)
      .regex(/[!@#$%&*]{1,}/)
      .message(
        "Password must be at least 8 characters long and must contain numbers, letters, uppercase letters and special characters"
      )
      .min(8)
      .required(),
    cf_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });
  return schema.validate(data);
};

module.exports = { usersValidation, checkRoles, passwordValidation };
