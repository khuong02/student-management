const router = require("express").Router();

const {
  getAllClass,
  getClass,
  getStudentInClass,
} = require("./class.controller");

router.get("/", getAllClass);

router.get("/:classesId", getClass);

router.get("/getStudent/:classesId", getStudentInClass);

module.exports = router;
