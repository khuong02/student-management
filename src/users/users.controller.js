const Users = require("./users.models");
const RefreshToken = require("../../models/refreshToken.models");

const User = require("./User");

const { checkRoles } = require("./users.validation");

const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `60s`,
  });
};

const login = async (req, res) => {
  try {
    const { account, password } = req.body;

    const roles = account[0] + account[1];
    const model = checkRoles(roles);

    if (!model) return res.status(400).json({ msg: "Model does not exist." });

    const user = new User(account, password, null, Users);

    const results = await user.login(model, generateAccessToken);

    const { msg, accessToken } = results;

    if (msg) return res.status(400).json({ msg });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (uuid == null) return res.sendStatus(401);

    const user = new User();

    const msg = await user.logout(uuid);

    if (!msg) return res.sendStatus(403);

    res.json(msg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getDataUser = async (req, res) => {
  const { account } = req.user;
  //two number of account is roles
  const roles = account[0] + account[1];
  const model = checkRoles(roles);

  //   const model = checkModel(account);
  const user = new User(account, null, null, Users);
  const { userInfo, msg } = await user.getInformation(model);

  if (msg) return res.status(400).json({ msg });

  res.json({ success: true, user: userInfo });
};

const refreshTokenCrl = async (req, res) => {
  const { uuid } = req.body;

  if (uuid == null) return res.sendStatus(401);

  const token = await RefreshToken.findOne({ user: uuid });

  if (!token) return res.sendStatus(403);

  jwt.verify(
    token.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAccessToken({
        account: user.account,
      });

      res.json({ accessToken });
    }
  );
};

const changePassword = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { roles } = req.body;

    const model = checkRoles(roles);
    const user = new User(null, null, null, Users);
    const { msg } = await user.changePassword(model, uuid, req.body);
    res.json({ msg: msg });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  login,
  getDataUser,
  refreshTokenCrl,
  logout,
  changePassword,
};
