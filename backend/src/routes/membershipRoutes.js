const express = require("express");

const {
  createPlanController,
  getPlans,
  getPlan,
  updatePlanController,
  createMembershipController,
  getMemberships,
  getActive,
} = require("../controllers/membershipController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const membershipController = require("../controllers/membershipController");

const router = express.Router();

router.use(authenticate);


// ==========================================
// MEMBERSHIP PLANS
// ==========================================

router.post(
  "/plans",
  authorizeRoles("ADMIN"),
  createPlanController
);

router.get(
  "/plans",
  authorizeRoles("ADMIN", "TRAINER"),
  getPlans
);

router.get(
  "/plans/:id",
  authorizeRoles("ADMIN", "TRAINER"),
  getPlan
);

router.put(
  "/plans/:id",
  authorizeRoles("ADMIN"),
  updatePlanController
);


// ==========================================
// MEMBER MEMBERSHIPS
// ==========================================

router.post(
  "/",
  authorizeRoles("ADMIN"),
  createMembershipController
);

router.get(
  "/member/:memberId",
  authorizeRoles("ADMIN", "TRAINER"),
  getMemberships
);

router.get(
  "/member/:memberId/active",
  authorizeRoles("ADMIN", "TRAINER"),
  getActive
);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  membershipController.getMemberships
);

module.exports = router;