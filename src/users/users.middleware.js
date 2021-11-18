const jwt = require("jsonwebtoken");

const { UserModels } = require("./users.models");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = { account: user.account };
    next();
  });
};

const authRoles = async (req, res, next) => {
  if (!req.user) return res.status(400).json({ msg: "You need sign in." });
  next();
};

const setUser = async (req, res, next) => {
  const { uuid } = req.body;
  if (uuid) {
    req.user = await UserModels.findOne({ uuid: req.body.uuid });
  }
  next();
};

module.exports = { authenticateToken, authRoles, setUser };
