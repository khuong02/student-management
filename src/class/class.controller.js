const ClassesModels = require("./class.models");

const getClass = async (req, res) => {
  try {
    const classesData = await ClassesModels.find();

    if (!classesData || classesData.length === 0)
      return res.json({ success: false, msg: "Classes is empty." });

    res.json({ success: true, data: classesData });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { getClass };
