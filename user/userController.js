const { User } = require("./userModel.js");
const { Reservation } = require("../reservations/reservationsModel.js");
const { Class } = require("../class/classModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const registerUserAcct = async (req, res) => {
  const { name, email, userName, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const generateRandomMembershipID = () => {
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    // Generate a unique membershipID
    const membershipID = generateRandomMembershipID();

    // Function to calculate membership validity as two years from date of registration
    const calculateMembershipEndDate = (registrationDate) => {
      const endDate = new Date(registrationDate);
      endDate.setFullYear(endDate.getFullYear() + 2);
      return endDate;
    };

    const registrationDate = new Date();
    const membershipValidTill = calculateMembershipEndDate(registrationDate);

    const newUser = new User({
      name,
      email,
      userName,
      password: hashedPassword,
      membershipID,
      membershipTier: "Beginner",
      membershipValidTill,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Function to authenticate user aka Login.
const userAuth = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName }).populate({
      path: "reservations",
      populate: {
        path: "classID", // Populate class details
        select: "className classDate instructorName",
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        membershipID: user.membershipID,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      userInfo: {
        userName: user.userName,
        name: user.name,
        email: user.email,
        membershipID: user.membershipID,
        membershipTier: user.membershipTier,
        membershipValidTill: user.membershipValidTill,
        reservations: user.reservations,
      },
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Error authenticating user" });
  }
};

// Additional functions for Admin's use.
// Function to retrieve all user profiles.
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Function to retrieve a specific user's profile.
const getUser = async (req, res) => {
  const { membershipID } = req.params;

  try {
    // Find the user by membershipID and populate reservations
    const user = await User.findOne({ membershipID }).populate({
      path: "reservations",
      populate: {
        path: "classID",
        select: "className classDate instructorName",
      },
    });

    // Format the date so that it only appears as YYYY-MM-DD (without the time)
    const formattedUser = {
      ...user._doc, // Spread user data
      membershipValidTill: user.membershipValidTill
        ? user.membershipValidTill.toISOString().split("T")[0]
        : null,
    };

    if (!formattedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

module.exports = { getUser, getAllUsers, registerUserAcct, userAuth };
