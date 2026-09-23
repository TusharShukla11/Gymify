const express = require("express");

const {
  create,
  getAll,
  getByMember,
  getOne,
  revenue,
} = require("../controllers/paymentController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.use(authenticate);


// Record payment
router.post(
  "/",
  authorizeRoles("ADMIN"),
  create
);


// All payments
router.get(
  "/",
  authorizeRoles("ADMIN"),
  getAll
);


// Revenue summary
router.get(
  "/revenue",
  authorizeRoles("ADMIN"),
  revenue
);


// Member payment history
router.get(
  "/member/:memberId",
  authorizeRoles("ADMIN", "TRAINER"),
  getByMember
);


// Single payment
router.get(
  "/:id",
  authorizeRoles("ADMIN"),
  getOne
);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  paymentController.getPayments
);

module.exports = router;