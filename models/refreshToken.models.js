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
  createdAt: { type: Date, expires: 86400, default: Date.now },
});

refreshTokenSchema.index(
  { lastModifiedDate: 1 },
  { expireAfterSeconds: 86400 }
);

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "RefreshToken"
);

module.exports = RefreshToken;
