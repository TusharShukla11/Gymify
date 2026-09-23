const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const controller =
  require("../controllers/trainerAssignmentController");


// Authentication required
router.use(authenticate);


// Assign member to trainer
router.post(
  "/",
  authorizeRoles("ADMIN"),
  controller.assignMember
);


// Get all assignments
router.get(
  "/",
  authorizeRoles("ADMIN"),
  controller.getAllAssignments
);


// Get members of trainer
router.get(
  "/trainer/:trainerId/members",
  authorizeRoles("ADMIN", "TRAINER"),
  controller.getTrainerMembers
);


// Get trainers of member
router.get(
  "/member/:memberId/trainers",
  authorizeRoles("ADMIN", "TRAINER"),
  controller.getMemberTrainers
);


// Remove assignment
router.patch(
  "/:id/remove",
  authorizeRoles("ADMIN"),
  controller.removeAssignment
);


module.exports = router;