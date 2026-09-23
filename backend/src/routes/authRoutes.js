const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated.",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin. You have access to this route.",
      user: req.user,
    });
  }
);

module.exports = router;