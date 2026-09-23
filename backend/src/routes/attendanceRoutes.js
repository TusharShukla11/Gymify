const express = require("express");

const {
  checkInController,
  checkOutController,
  memberHistory,
  today,
  currentlyCheckedIn,
  stats,
} = require("../controllers/attendanceController");

const authenticate = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

const attendanceController = require("../controllers/attendanceController");

const router = express.Router();

router.use(authenticate);


// ==========================================
// CHECK IN
// ==========================================

router.post(
  "/check-in",

  authorizeRoles("ADMIN", "TRAINER"),

  checkInController
);


// ==========================================
// CHECK OUT
// ==========================================

router.patch(
  "/check-out/:memberId",

  authorizeRoles("ADMIN", "TRAINER"),

  checkOutController
);


// ==========================================
// TODAY'S ATTENDANCE
// ==========================================

router.get(
  "/today",

  authorizeRoles("ADMIN", "TRAINER"),

  today
);


// ==========================================
// CURRENTLY CHECKED IN
// ==========================================

router.get(
  "/checked-in",

  authorizeRoles("ADMIN", "TRAINER"),

  currentlyCheckedIn
);


// ==========================================
// MEMBER HISTORY
// ==========================================

router.get(
  "/member/:memberId",

  authorizeRoles("ADMIN", "TRAINER"),

  memberHistory
);


// ==========================================
// MEMBER STATS
// ==========================================

router.get(
  "/member/:memberId/stats",

  authorizeRoles("ADMIN", "TRAINER"),

  stats
);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  attendanceController.getAttendance
);


module.exports = router;