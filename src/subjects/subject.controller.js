const SubjectsModels = require("./subjects.models");
const MajorModels = require("../majors/majors.models");

const getSubjects = async (req, res) => {
  try {
    const subjects = await SubjectsModels.find().lean();
    const majors = await MajorModels.find().lean();

    if (!subjects || subjects.length === 0)
      return res.json({ success: false, msg: "Subject is empty." });

    const data = subjects.map((subject) => {
      const nameMajor =
        majors.length > 0
          ? majors.find((major) => major.majorCode === subject.majorCode)
              .nameMajor
          : "Not found major";

      return { ...subject, nameMajor };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getSubjects,
};
