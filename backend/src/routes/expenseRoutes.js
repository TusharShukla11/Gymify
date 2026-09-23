const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const expenseController =
  require("../controllers/expenseController");


// Authentication required
router.use(authenticate);


// Create expense
router.post(
  "/",
  authorizeRoles("ADMIN"),
  expenseController.createExpense
);


// Get all expenses
router.get(
  "/",
  authorizeRoles("ADMIN"),
  expenseController.getAllExpenses
);


// Total expenses
router.get(
  "/summary/total",
  authorizeRoles("ADMIN"),
  expenseController.getTotalExpenses
);


// Monthly summary
router.get(
  "/summary/monthly",
  authorizeRoles("ADMIN"),
  expenseController.getMonthlyExpenseSummary
);


// Get expense by ID
router.get(
  "/:id",
  authorizeRoles("ADMIN"),
  expenseController.getExpenseById
);


// Update expense
router.put(
  "/:id",
  authorizeRoles("ADMIN"),
  expenseController.updateExpense
);


// Delete expense
router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  expenseController.deleteExpense
);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  expenseController.getExpenses
);


module.exports = router;