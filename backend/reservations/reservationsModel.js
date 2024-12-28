const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  reservationID: { type: String, required: true, unique: true }, // Unique reservation ID
  classID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = { Reservation };
