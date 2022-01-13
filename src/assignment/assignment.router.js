const router = require("express").Router();
const {
  assignmentTeacherSubjectMiddleware,
} = require("./assignment.middleware");
const { assignmentCrl, getAssignment } = require("./assignment.controller");

router.post("/", assignmentTeacherSubjectMiddleware, assignmentCrl);

router.get("/getAssignment", getAssignment);

module.exports = router;
