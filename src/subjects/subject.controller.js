const SubjectsModels = require("./subjects.models");

const getSubjects = async (req, res) => {
  try {
    const subjects = await SubjectsModels.find();
    if (!subjects || subjects.length === 0)
      return res.json({ success: false, msg: "Subject is empty." });

    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getSubjects,
};
