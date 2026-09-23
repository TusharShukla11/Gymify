const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const dietController = require("../controllers/dietController");


// Authentication required
router.use(authenticate);


// Create diet plan
router.post(
  "/",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.createDietPlan
);


// Get all diet plans
router.get(
  "/",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.getAllDietPlans
);


// Get member diet plans
router.get(
  "/member/:memberId",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.getMemberDietPlans
);


// Get trainer diet plans
router.get(
  "/trainer/:trainerId",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.getTrainerDietPlans
);


// Get diet plan by ID
router.get(
  "/:id",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.getDietPlanById
);


// Update
router.put(
  "/:id",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.updateDietPlan
);


// Deactivate
router.patch(
  "/:id/deactivate",
  authorizeRoles("ADMIN", "TRAINER"),
  dietController.deactivateDietPlan
);


module.exports = router;