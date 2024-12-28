const { Instructor } = require("./instructorModel.js");

// // Function to retrieve all instructors available.
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error retrieving class:", error);
    res.status(500).json({ message: "Error retrieving class" });
  }
};

const getInstructor = async (req, res) => {
  try {
    const { instructorID } = req.params;
    const instructors = await Instructor.findOne({ instructorID });
    if (!instructors) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.status(200).json(instructors);
  } catch (err) {
    console.error("Error fetching instructors details:", err);
    res.status(500).json({ message: "Error fetching instructors details" });
  }
};

module.exports = { getAllInstructors, getInstructor };
