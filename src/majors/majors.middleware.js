const majorsValidation = require("./majors.validation");
const { v4: uuid_v4 } = require("uuid");
const saveData = require("../../validation/saveData");

const addMajors = (model) => {
  return async (req, res, next) => {
    try {
      const { error } = majorsValidation(req.body);

      if (error) return res.status(400).json({ msg: error.details[0].message });

      const { nameMajors, majorsCode, benchmark, quantity } = req.body;

      const majors = await model.findOne({ majorsCode });
      if (majors) return res.status(400).json({ msg: "Majors does exist." });

      const content = {
        nameMajors,
        majorsCode,
        benchmark,
        uuid: uuid_v4(),
        quantity,
      };

      saveData(model, content)
        .then(() => {
          res.results = { msg: "Save majors success." };
          next();
        })
        .catch((err) => res.status(400).json({ msg: err }));
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

const changeBenchmark = (model) => {
  return async (req, res, next) => {
    try {
      const { majorsCode, newBenchmark } = req.body;

      if (!majorsCode)
        return res.status(400).json("Please choose majors you want to change.");

      if (!newBenchmark) return;

      const update = { benchmark: newBenchmark };

      await model.findOneAndUpdate({ majorsCode }, update);

      next();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

const majorsMiddleware = {
  addMajors,
  changeBenchmark,
};

module.exports = majorsMiddleware;
