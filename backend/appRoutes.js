const userController = require("./user/userController.js");
const classController = require("./class/classController.js");
const reservationsController = require("./reservations/reservationsController.js");
const instructorController = require("./instructors/instructorController.js");
const router = require("express").Router();

router.get("/users/:membershipID", userController.getUser);
router.get("/users", userController.getAllUsers);
router.post("/register", userController.registerUserAcct);
router.post("/login", userController.userAuth);
router.get("/instructors", instructorController.getAllInstructors);
router.get("/instructors/:instructorID", instructorController.getInstructor);
router.get("/users", userController.getAllUsers);
router.get("/classes/:classID", classController.classID);
router.get("/classes", classController.getAllClasses);
router.post("/reservations", reservationsController.createReservation);
router.get(
  "/reservations/:reservationID",
  reservationsController.getReservationByID
);
router.delete(
  "/reservations/:reservationID",
  reservationsController.cancelReservation
);

module.exports = router;
