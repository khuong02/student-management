const router = require("express").Router();

const { getClass } = require("./class.controller");

router.get("/", getClass);

module.exports = router;
