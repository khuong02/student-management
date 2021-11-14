const mongoose = require("mongoose");

const mongooseConnection = (URI) => {
  return mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) console.log("Error: ", err);
      console.log("Connected to mongodb");
    }
  );

  //   mongoose.connection
  //     .on("open", () => console.log("Connected to mongodb"))
  //     .once("error", (error) => console.log("Error: ", error));
};

module.exports = mongooseConnection;
