const router = require("express").Router();
const { createClass, addStudent } = require("./class.controller");

router.post("/create_class", createClass);

router.post("/add_student", addStudent);

module.exports = router;
