const RefreshToken = require("../../models/refreshToken.models");
const { StudentModels, UserModels } = require("./users.models");
const Majors = require("../majors/majors.models");
const LearningOutcomesModels = require("../learningOutcomes/learningOutcomes.models");

const { User, Student, Teacher, Admin } = require("./User");

const { checkRoles } = require("./users.validation");

const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `60s`,
  });
};

const login = async (req, res) => {
  try {
    const { account, password } = req.body;

    const roles = account[0] + account[1];
    const model = checkRoles(roles);

    if (!model) return res.json({ msg: "Model does not exist." });

    const user = new User(account, password, null, UserModels);

    const results = await user.login(model, generateAccessToken);

    const { accessToken, msg } = results;

    if (msg) return res.json({ msg });

    res.json({ accessToken, account });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = new User();

    if (uuid == null) return res.sendStatus(401);

    const msg = await user.logout(uuid);

    if (!msg) return res.sendStatus(403);

    res.json(msg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getDataUser = async (req, res) => {
  const { account } = req.user;

  //two number of account is roles
  const roles = account[0] + account[1];
  const model = checkRoles(roles);

  //   const model = checkModel(account);
  const user = new User(account, null, null, UserModels);
  const { userInfo, msg } = await user.getInformation(model);

  if (msg) return res.status(400).json({ msg });

  res.json({ success: true, user: userInfo });
};

const refreshTokenCrl = async (req, res) => {
  const { account } = req.body;

  if (account == null) return res.sendStatus(401);
  const user = await UserModels.findOne({ account });

  const token = await RefreshToken.findOne({ user: user.uuid });

  if (!token)
    return res.json({ success: false, msg: "Refresh token has expired!" });

  jwt.verify(
    token.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err)
        return res.json({ success: false, msg: "Refresh token has expired!" });

      const accessToken = generateAccessToken({
        uuid: user.uuid,
        account: user.account,
      });

      res.json({ accessToken, account: user.account });
    }
  );
};

const changePassword = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { roles } = req.body;

    const model = checkRoles(roles);
    const user = new User(null, null, null, Users);
    const { msg } = await user.changePassword(model, uuid, req.body);
    res.json({ msg: msg });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { major } = req.body;
    const teacher = new Teacher();

    const find_major = await Majors.findOne({ majorCode: major });

    if (!find_major)
      return res.status(400).json({ msg: "Major does not exist" });

    teacher.createClass(find_major.nameMajor, major);
    res.json({ msg: "Create class success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { uuid } = req.params;
    const teacher = new Teacher();
    await teacher.deleteStudent(uuid);
    res.json({ msg: "Delete student success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const { list_student, classCode } = req.body;
    const teacher = new Teacher();
    await teacher.addStudentForClass(list_student, classCode);

    res.json({ msg: "success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { classCode } = req.params;
    const teacher = new Teacher();

    await teacher.deleteClass(classCode);
    res.json({ msg: "Delete class success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { uuid } = req.params;
    const admin = new Admin();
    await admin.deleteTeacher(uuid);
    res.json({ msg: "Delete teacher success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const admin = new Admin();
    await admin.createSubject(req.body);

    res.json({ msg: "Create subject success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const admin = new Admin();
    await admin.deleteSubject(subjectCode);

    res.json({ msg: "Delete subject success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addPointToStudent = async (req, res) => {
  try {
    const teacher = new Teacher();
    await teacher.addPointToStudent(req.body);

    res.json({ msg: "Update point to student success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getPoint = async (req, res) => {
  try {
    const { studentCode } = req.body;
    const user = new User();
    const results = await user.getPoint(studentCode);

    if (!results) return res.status(400).json({ msg: "Student has no point" });

    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updatePoint = async (req, res) => {
  try {
    const { studentCode } = req.params;
    const { teacherCode, subjectCode, point } = req.body;

    const check_exist = await LearningOutcomesModels.findOne({
      studentCode,
      teacherCode,
      subjectCode,
    });
    if (!check_exist)
      return res
        .status(400)
        .json({ msg: "Students have not received points yet" });

    const update = { point };

    const teacher = new Teacher();
    await teacher.updatePointToStudent(
      studentCode,
      teacherCode,
      subjectCode,
      update
    );

    res.json({ msg: "Update success!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  login,
  getDataUser,
  refreshTokenCrl,
  logout,
  changePassword,
  deleteStudent,
  addStudent,
  createClass,
  deleteClass,
  deleteTeacher,
  createSubject,
  deleteSubject,
  addPointToStudent,
  getPoint,
  updatePoint,
};
