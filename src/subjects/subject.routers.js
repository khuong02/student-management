const router = require("express").Router();

const { getSubjects } = require("./subject.controller");

router.get("/", getSubjects);

module.exports = router;
