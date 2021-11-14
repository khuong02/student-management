const RefreshToken = require("../../models/refreshToken.models");

const bcrypt = require("bcrypt");
const hashPassword = require("../../validation/hashPassword");
const jwt = require("jsonwebtoken");

const saveData = require("../../validation/saveData");
const { usersValidation, passwordValidation } = require("./users.validation");

class User {
  constructor(account, password, roles, models) {
    this.account = account;
    this.password = password;
    this.roles = roles;
    this.models = models;
  }

  login = async (model, cb) => {
    //check account
    if (!usersValidation(this.account)) return { msg: "Account is correct." };

    const user = await this.models[model].findOne({ account: this.account });
    if (!user) return { msg: "Account does not already exists." };

    const checkRefreshTokenInvalid = await RefreshToken.findOne({
      user: user.uuid,
    });

    if (checkRefreshTokenInvalid)
      return { msg: "Refresh token has not expired!" };

    //Checking if password is correct.
    const checkingPassword = await bcrypt.compare(this.password, user.password);

    if (!checkingPassword) return { msg: "Password is not correct" };

    const payload = { account: this.account };

    const accessToken = cb(payload);

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

    await saveData(RefreshToken, { refreshToken, user: user.uuid });

    return { accessToken };
  };

  logout = async (uuid) => {
    await RefreshToken.findOneAndDelete({ user: uuid });

    return { msg: "Logout success!" };
  };

  getInformation = async (model) => {
    const user = await this.models[model].findOne({ account: this.account });
    if (!user) return { msg: "User does not exist." };
    return { userInfo: user };
  };

  changePassword = async (model, uuid, data) => {
    if (!uuid) return { success: false, msg: "Uuid of user is not exist." };

    const { error } = passwordValidation(data);
    if (error) return { success: false, msg: error.details[0].message };
    const { password } = data;

    const hash_password = await hashPassword(password);

    const update = { password: hash_password };
    const user = await this.models[model].findOneAndUpdate({ uuid }, update);
    if (!user) return { success: false, msg: "Change password fall!" };

    return { success: true, msg: "Change password success!" };
  };
}

module.exports = User;
