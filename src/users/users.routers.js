const router = require("express").Router();

const { authenticateToken, authRoles } = require("./users.middleware");
const subjectMiddleware = require("../subjects/subject.middleware");
const learningOutcomesMiddleware = require("../learningOutcomes/learningOutcomes.middleware");

const {
  login,
  getDataUser,
  refreshTokenCrl,
  logout,
  changePassword,
  deleteStudent,
  addStudent,
  createClass,
  deleteClass,
  createSubject,
  deleteTeacher,
  deleteSubject,
  addPointToStudent,
  getPoint,
  updatePoint,
} = require("./users.controller");

router.get("/posts", authenticateToken, getDataUser);

router.post("/token", refreshTokenCrl);

router.post("/login", login);

router.delete("/logout/:uuid", logout);

router.patch("/change_password/:uuid", changePassword);

router.post("/create_class", createClass);

router.delete("/delete_student/:uuid", deleteStudent);

router.post("/add_student", addStudent);

router.delete("/delete_class/:classCode", deleteClass);

router.delete("/delete_teacher/:uuid", deleteTeacher);

router.post("/create_subject", subjectMiddleware, createSubject);

router.delete("/delete_subject/:subjectCode", deleteSubject);

router.post("/add_point", learningOutcomesMiddleware, addPointToStudent);

router.get("/get_point", authRoles, getPoint);

router.patch("/update_point", updatePoint);

module.exports = router;
