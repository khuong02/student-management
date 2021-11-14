const addMajors = async (req, res) => {
  res.json(res.results);
};

const changeBenchmark = async (req, res) => {
  res.json({ msg: "Update success." });
};

const majorsController = {
  addMajors,
  changeBenchmark,
};

module.exports = majorsController;
