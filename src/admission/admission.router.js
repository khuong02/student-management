const router = require("express").Router();
const admissionCrl = require("./admission.controller");
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

module.exports = router;
