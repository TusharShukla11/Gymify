const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const notificationController =
  require("../controllers/notificationController");


// Get all notifications
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  notificationController.getNotifications
);


// Get unread notifications
router.get(
  "/unread",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  notificationController.getUnreadNotifications
);


// Mark one notification as read
router.patch(
  "/:id/read",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  notificationController.markAsRead
);


// Mark all notifications as read
router.patch(
  "/read-all",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  notificationController.markAllAsRead
);


module.exports = router;