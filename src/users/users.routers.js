const router = require("express").Router();
const authenticateToken = require("./users.middleware");
const {
  login,
  getDataUser,
  refreshTokenCrl,
  logout,
  changePassword,
} = require("./users.controller");

router.get("/posts", authenticateToken, getDataUser);

router.post("/token", refreshTokenCrl);

router.post("/login", login);

router.delete("/logout/:uuid", logout);

router.patch("/change_password/:uuid", changePassword);

module.exports = router;
