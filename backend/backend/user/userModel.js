const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  name: String,
  email: String,
  membershipID: String,
  membershipTier: String,
  membershipValidTill: Date,
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
