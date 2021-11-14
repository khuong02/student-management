const router = require("express").Router();
const { addMajors, changeBenchmark } = require("./majors.middleware");
const controller = require("./majors.controller");
const model = require("./majors.models");

router.post("/add_major", addMajors(model), controller.addMajors);

router.patch(
  "/change_benchmark",
  changeBenchmark(model),
  controller.changeBenchmark
);

module.exports = router;
