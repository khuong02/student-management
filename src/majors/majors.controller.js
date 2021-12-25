const MajorModels = require("./majors.models");

const addMajors = async (req, res) => {
  res.json(res.results);
};

const changeBenchmark = async (req, res) => {
  res.json({ msg: "Update success." });
};

const getMajor = async (req, res) => {
  try {
    const major = await MajorModels.find();

    if (!major || major.length === 0)
      return res.json({ success: false, msg: "data is empty" });

    res.json({ success: true, data: major });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const majorsController = {
  addMajors,
  changeBenchmark,
  getMajor,
};

module.exports = majorsController;
