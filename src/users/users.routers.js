const router = require("express").Router();
const authenticateToken = require("./users.middleware");
const {
  login,
  getDataUser,
  refreshTokenCrl,
  logout,
  changePassword,
  removeStudent,
  addStudent,
  createClass,
  deleteClass,
  removeTeacher,
} = require("./users.controller");

router.get("/posts", authenticateToken, getDataUser);

router.post("/token", refreshTokenCrl);

router.post("/login", login);

router.delete("/logout/:uuid", logout);

router.patch("/change_password/:uuid", changePassword);

router.post("/create_class", createClass);

router.delete("/remove_student/:uuid", removeStudent);

router.post("/add_student", addStudent);

router.delete("/delete_class/:classCode", deleteClass);

router.delete("/remove_teacher/:uuid", removeTeacher);

module.exports = router;
