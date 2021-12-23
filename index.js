require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectionMongodb = require("./connection/Connection");
// const { setUser } = require("./src/users/users.middleware");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(setUser);

//routers
app.use("/api/admission", require("./src/admission/admission.router"));
app.use("/api/majors", require("./src/majors/majors.routers"));
app.use("/api/subjects", require("./src/subjects/subject.routers"));
app.use("/api/classes", require("./src/class/class.routers"));
app.use("/api/user", require("./src/users/users.routers"));
app.use("/api/assignment", require("./src/assignment/assignment.router"));

//connection with mongodb
const URI = process.env.MONGODB_URL;
connectionMongodb(URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
