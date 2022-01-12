const router = require("express").Router();
const {
  assignmentTeacherSubjectMiddleware,
} = require("./assignment.middleware");
const assignmentCrl = require("./assignment.controller");

router.post("/", assignmentTeacherSubjectMiddleware, assignmentCrl);

module.exports = router;
