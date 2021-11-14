const router = require("express").Router();
const { joinStudent, joinTeacher } = require("./class.controller");

router.post("/join_student", joinStudent);

router.post("/join_teacher", joinTeacher);

module.exports = router;
