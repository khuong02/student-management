const router = require("express").Router();
const {
  admissionCrl,
  getAllStudentAdmission,
  deleteAllStudentAdmission,
} = require("./admission.controller");
const {
  admissionStudentMiddleware,
  admissionTeacherMiddleware,
} = require("./admission.middleware");
const admission_models = require("./admission.models");

router.post(
  "/student",
  admissionStudentMiddleware(admission_models),
  admissionCrl
);

router.post(
  "/teacher",
  admissionTeacherMiddleware(admission_models),
  admissionCrl
);

router.get("/", getAllStudentAdmission);

router.delete("/delete", deleteAllStudentAdmission);

module.exports = router;
