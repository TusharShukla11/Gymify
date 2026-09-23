const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const workoutController = require("../controllers/workoutController");


// All workout routes require login
router.use(authenticate);


// Create workout plan
router.post(
  "/",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.createWorkoutPlan
);


// Get all workout plans
router.get(
  "/",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.getAllWorkoutPlans
);


// Get workout plan by ID
router.get(
  "/:id",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.getWorkoutPlanById
);


// Get member workout plans
router.get(
  "/member/:memberId",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.getMemberWorkoutPlans
);


// Get trainer workout plans
router.get(
  "/trainer/:trainerId",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.getTrainerWorkoutPlans
);


// Update workout plan
router.put(
  "/:id",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.updateWorkoutPlan
);


// Deactivate workout plan
router.patch(
  "/:id/deactivate",
  authorizeRoles("ADMIN", "TRAINER"),
  workoutController.deactivateWorkoutPlan
);


module.exports = router;