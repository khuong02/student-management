const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    required: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    required: true,
  },
});

refreshTokenSchema.indexes({ createAt: 1 }, { expireAfterSeconds: 86400 });

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "RefreshToken"
);

module.exports = RefreshToken;
