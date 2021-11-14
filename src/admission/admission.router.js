const router = require("express").Router();
const {
  admissionStudentCrl,
  admissionTeacherCrl,
} = require("./admission.controller");
const admissionMiddleware = require("./admission.middleware");
const {
  admissionStudentMiddleware,
  admissionTeacherMiddleware,
} = require("./admissionCheckData.middleware");
const { Student, Teacher } = require("../users/users.models");
const Admission = require("./admission.models");

router.post(
  "/student",
  admissionStudentMiddleware(Admission),
  admissionMiddleware(Student),
  admissionStudentCrl
);

router.post(
  "/teacher",
  admissionTeacherMiddleware(Admission),
  admissionMiddleware(Teacher),
  admissionTeacherCrl
);

module.exports = router;
