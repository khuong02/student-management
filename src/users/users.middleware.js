const jwt = require("jsonwebtoken");

const { UserModels } = require("./users.models");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, msg: "Token has expired !" });
    req.user = { uuid: user.uuid, account: user.account };
    next();
  });
};

const authUser = async (req, res, next) => {
  if (!req.user) return res.status(400).json({ msg: "You need sign in." });
  next();
};

const authRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles.toLowerCase())) {
      return res.status(400).json({ msg: "Not allowed" });
    }

    next();
  };
};

const setUser = async (req, res, next) => {
  const { uuid } = req.body;
  if (uuid) {
    req.user = await UserModels.findOne({ uuid: req.body.uuid });
    console.log(req.user);
  }
  next();
};

module.exports = { authenticateToken, authUser, setUser, authRole };
