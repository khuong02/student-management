const router = require("express").Router();
const assignmentMiddleware = require("./assignment.middleware");
const assignmentCrl = require("./assignment.controller");

router.post("/", assignmentMiddleware, assignmentCrl);

module.exports = router;
