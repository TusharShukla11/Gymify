const express = require("express");

const router = express.Router();

const authenticate =
  require("../middlewares/authMiddleware");

const authorizeRoles =
  require("../middlewares/roleMiddleware");

const dashboardController =
  require("../controllers/dashboardController");


// Dashboard overview
router.get(
  "/overview",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboardController.getOverview
);


// Monthly financial statistics
router.get(
  "/financial/monthly",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboardController.getMonthlyFinancial
);


// Membership statistics
router.get(
  "/memberships",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboardController.getMembershipStats
);


// Attendance statistics
router.get(
  "/attendance",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboardController.getAttendanceStats
);


// Expiring memberships
router.get(
  "/memberships/expiring",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboardController.getExpiringMemberships
);


module.exports = router;