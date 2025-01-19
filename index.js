// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const mongoDB = process.env.DB_URI;
// const { User, Lesson } = require('./models/user');
const app = express();
const port = 3000;
const appRoutes = require("./appRoutes.js");

app.use(express.json());
app.use(cors());
app.use("/studio", appRoutes);

if (!mongoDB) {
  console.error("MongoDB URI is undefined. Please check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log("Successfully connected to DB!");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

app.listen(port, () => console.log(`Server running on port ${port}`));
