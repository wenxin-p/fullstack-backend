const { Class } = require("./classModel.js");

// // Function to retrieve all lessons available.
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error retrieving classes:", error);
    res.status(500).json({ message: "Error retrieving classes" });
  }
};

const classID = async (req, res) => {
  try {
    const { classID } = req.params;
    const classes = await Class.findOne({ classID });
    if (!classes) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classes);
  } catch (err) {
    console.error("Error fetching class details:", err);
    res.status(500).json({ message: "Error fetching class details" });
  }
};

module.exports = { getAllClasses, classID };
