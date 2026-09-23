const expenseService = require("../services/expenseService");

const {
  validateExpense
} = require("../validators/expenseValidator");



// Create expense
async function createExpense(req, res) {
  try {
    const errors = validateExpense(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const expense = await expenseService.createExpense(
      req.body,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: expense
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// Get all expenses
async function getAllExpenses(req, res) {
  try {
    const expenses = await expenseService.getAllExpenses();

    res.json({
      success: true,
      data: expenses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Get expense by ID
async function getExpenseById(req, res) {
  try {
    const expense = await expenseService.getExpenseById(
      req.params.id
    );

    res.json({
      success: true,
      data: expense
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// Update expense
async function updateExpense(req, res) {
  try {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Expense updated successfully.",
      data: expense
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// Delete expense
async function deleteExpense(req, res) {
  try {
    const result = await expenseService.deleteExpense(
      req.params.id
    );

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// Total expenses
async function getTotalExpenses(req, res) {
  try {
    const result = await expenseService.getTotalExpenses();

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Monthly summary
async function getMonthlyExpenseSummary(req, res) {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required."
      });
    }

    const result =
      await expenseService.getMonthlyExpenseSummary(
        year,
        month
      );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getExpenses(req, res) {
  try {
    const result = await expenseService.getAllExpenses({
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      status: req.query.status,
      from: req.query.from,
      to: req.query.to
    });

    res.status(200).json({
      success: true,
      data: result.expenses,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Get expenses error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  createExpense,
  getAllExpenses,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
  getMonthlyExpenseSummary
};