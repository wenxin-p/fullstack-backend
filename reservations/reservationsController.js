const { Reservation } = require("./reservationsModel.js");
const { Class } = require("../class/classModel.js");
const { User } = require("../user/userModel.js");

// Used to generate a random reservation ID.
const crypto = require("crypto");
const authenticateToken = require("../user/authenticateTokenController");

// Function to create a reservation for class selected by user.
const createReservation = async (req, res) => {
  try {
    const { classID } = req.body;

    // Get membershipID from the authenticated user
    const membershipID = req.user.membershipID;

    // Check if the class exists.
    const classDocument = await Class.findOne({ classID });
    if (!classDocument) {
      return res.status(404).json({ message: "Class not found" });
    }
    console.log(classID);

    // Find a particular user.
    const user = await User.findOne({ membershipID }).populate("reservations");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(membershipID);

    // Check if the user has already booked this class.
    const hasAlreadyBooked = user.reservations.some(
      (reservation) =>
        reservation.classID.toString() === classDocument._id.toString()
    );

    if (hasAlreadyBooked) {
      return res.status(400).json({
        message:
          "You have already booked this class. Please select another class.",
      });
    }

    // Ensure that user only reserves a class that is compatible with their membership tier.
    if (
      (user.membershipTier === "Beginner" &&
        classDocument.classTier !== "Beginner") ||
      (user.membershipTier === "Intermediate" &&
        classDocument.classTier === "Master")
    ) {
      return res.status(400).json({
        message: `Sorry, as a ${
          user.membershipTier
        } user, you can only reserve classes for ${user.membershipTier} levels${
          user.membershipTier === "Intermediate" ? " or Beginner levels" : ""
        }.`,
      });
    }

    // Ensure that user can only reserve a maximum of 3 classes at any time.
    if (user.reservations.length >= 3) {
      return res.status(400).json({
        message:
          "Sorry, only a maximum of 3 reservations are allowed at any time.",
      });
    }

    // Generate a unique reservation ID.
    const reservationID = crypto.randomBytes(6).toString("hex");
    console.log(reservationID);

    // Create a new reservation.
    const newReservation = new Reservation({
      classID: classDocument._id,
      reservationID,
    });
    console.log(newReservation);

    // Save the reservation.
    const savedReservation = await newReservation.save();

    // Add the reservation to the user's reservations array.
    user.reservations.push(savedReservation._id);
    await user.save();

    // Return reservation and class details.
    res.status(201).json({
      message: "Reservation successful",
      reservationID: savedReservation.reservationID,
      classDetails: {
        classID: classDocument.classID,
        category: classDocument.category,
        className: classDocument.className,
        instructorName: classDocument.instructorName,
        classDate: classDocument.classDate,
        classTiming: classDocument.classTiming,
      },
    });
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ message: "Error creating reservation" });
  }
};

// Function to retrieve reservation details by reservation ID.
const getReservationByID = async (req, res) => {
  const { reservationID } = req.params;

  try {
    // Fetch reservation by reservationID and populate class details.
    const reservation = await Reservation.findOne({ reservationID }).populate(
      "classID"
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (err) {
    console.error("Error fetching reservation details:", err);
    res.status(500).json({ message: "Error fetching reservation details" });
  }
};

// Function to cancel a reservation.
const cancelReservation = async (req, res) => {
  const { reservationID } = req.params;

  try {
    const reservation = await Reservation.findOneAndDelete({ reservationID });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Remove the reservation ID from the user's reservations array
    const user = await User.findOneAndUpdate(
      { reservations: reservation._id },
      { $pull: { reservations: reservation._id } }, // Pull the reservation ID
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found while updating reservations" });
    }

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (err) {
    console.error("Error canceling reservation:", err);
    res.status(500).json({ message: "Error canceling reservation" });
  }
};

module.exports = {
  createReservation,
  getReservationByID,
  cancelReservation,
  authenticateToken,
};
