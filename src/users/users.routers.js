const router = require("express").Router();

const {
  authenticateToken,
  authUser,
  authRole,
  setUser,
} = require("./users.middleware");
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
  getListStudent,
  getListTeacher
} = require("./users.controller");

router.get("/posts", authenticateToken, getDataUser);

router.post("/token", refreshTokenCrl);

router.post("/login", login);

router.delete("/logout/:uuid", logout);

router.patch("/change_password/:uuid", changePassword);

router.post(
  "/create_class",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  createClass
);

router.delete(
  "/delete_student/:uuid",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  deleteStudent
);

router.post(
  "/add_student",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  addStudent
);

router.delete(
  "/delete_class/:classCode",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  deleteClass
);

router.delete(
  "/delete_teacher/:uuid",
//   authRole([process.env.ADMIN]),
  deleteTeacher
);

router.post(
  "/create_subject",
//   authRole([process.env.ADMIN]),
  subjectMiddleware,
  createSubject
);

router.delete(
  "/delete_subject/:subjectCode",
//   authRole([process.env.ADMIN]),
  deleteSubject
);

router.post(
  "/add_point",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  learningOutcomesMiddleware,
  addPointToStudent
);

router.get("/get_point", getPoint);

router.get(
  "/get_student_list",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  getListStudent
);

router.get(
  "/get_teacher_list",
//   authRole([process.env.ADMIN]),
  getListTeacher
);

router.patch(
  "/update_point/:studentCode",
//   authRole([process.env.TEACHER, process.env.ADMIN]),
  updatePoint
);

module.exports = router;
