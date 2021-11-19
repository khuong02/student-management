const router = require("express").Router();

const { authenticateToken, authUser, authRole } = require("./users.middleware");
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

router.post(
  "/create_class",
  authUser,
  authRole([process.env.TEACHER, process.env.ADMIN]),
  createClass
);

router.delete(
  "/delete_student/:uuid",
  authUser,
  authRole([process.env.TEACHER, process.env.ADMIN]),
  deleteStudent
);

router.post(
  "/add_student",
  authUser,
  authRole([process.env.TEACHER, process.env.ADMIN]),
  addStudent
);

router.delete(
  "/delete_class/:classCode",
  authUser,
  authRole([process.env.TEACHER, process.env.ADMIN]),
  deleteClass
);

router.delete(
  "/delete_teacher/:uuid",
  authUser,
  authRole([process.env.ADMIN]),
  deleteTeacher
);

router.post(
  "/create_subject",
  authUser,
  authRole([process.env.ADMIN]),
  subjectMiddleware,
  createSubject
);

router.delete(
  "/delete_subject/:subjectCode",
  authUser,
  authRole([process.env.ADMIN]),
  deleteSubject
);

router.post(
  "/add_point",
  authUser,
  authRole([process.env.TEACHER, process.env.ADMIN]),
  learningOutcomesMiddleware,
  addPointToStudent
);

router.get("/get_point", authUser, getPoint);

router.patch(
  "/update_point/:studentCode",
  authUser,
  authRole([process.env.TEACHER, process.env.ADMIN]),
  updatePoint
);

module.exports = router;
