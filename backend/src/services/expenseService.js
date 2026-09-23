const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");

const { validateDate } =
  require("../utils/dateUtils.js");


// Create expense
async function createExpense(data, userId) {
  const db = getDatabase();

  const expense = {
    title: data.title,

    category: data.category,

    amount: Number(data.amount),

    expenseDate: new Date(data.expenseDate),

    description: data.description || "",

    paymentMethod: data.paymentMethod || "CASH",

    status: data.status || "PAID",

    createdBy: new ObjectId(userId),

    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db
    .collection("expenses")
    .insertOne(expense);

  return {
    _id: result.insertedId,
    ...expense
  };
}


// Get all expenses
async function getAllExpenses(options = {}) {
  const db = getDatabase();

  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = Math.min(parseInt(options.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by category
  if (options.category) {
    filter.category = options.category;
  }

  // Filter by status
  if (options.status) {
    filter.status = options.status;
  }

  // Filter by date range
if (options.from) {
  filter.expenseDate.$gte =
    validateDate(options.from, "from date");
}

if (options.to) {
  const toDate =
    validateDate(options.to, "to date");

  toDate.setHours(23, 59, 59, 999);

  filter.expenseDate.$lte = toDate;
}

  // Count total records
  const total = await db
    .collection("expenses")
    .countDocuments(filter);

  // Get paginated expenses
  const expenses = await db
    .collection("expenses")
    .find(filter)
    .sort({ expenseDate: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalPages = Math.ceil(total / limit);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}


// Get expense by ID
async function getExpenseById(id) {
  const db = getDatabase();

  const expense = await db.collection("expenses").findOne({
    _id: new ObjectId(id)
  });

  if (!expense) {
    throw new Error("Expense not found.");
  }

  return expense;
}


// Update expense
async function updateExpense(id, data) {
  const db = getDatabase();

  const updateData = {
    updatedAt: new Date()
  };

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.category !== undefined) {
    updateData.category = data.category;
  }

  if (data.amount !== undefined) {
    updateData.amount = Number(data.amount);
  }

  if (data.expenseDate !== undefined) {
    updateData.expenseDate = new Date(data.expenseDate);
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.paymentMethod !== undefined) {
    updateData.paymentMethod = data.paymentMethod;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  const result = await db.collection("expenses").findOneAndUpdate(
    {
      _id: new ObjectId(id)
    },
    {
      $set: updateData
    },
    {
      returnDocument: "after"
    }
  );

  if (!result) {
    throw new Error("Expense not found.");
  }

  return result;
}


// Delete expense
async function deleteExpense(id) {
  const db = getDatabase();

  const result = await db.collection("expenses").deleteOne({
    _id: new ObjectId(id)
  });

  if (result.deletedCount === 0) {
    throw new Error("Expense not found.");
  }

  return {
    message: "Expense deleted successfully."
  };
}


// Get total expenses
async function getTotalExpenses() {
  const db = getDatabase();

  const result = await db.collection("expenses").aggregate([
    {
      $match: {
        status: "PAID"
      }
    },
    {
      $group: {
        _id: null,
        totalExpenses: {
          $sum: "$amount"
        },
        count: {
          $sum: 1
        }
      }
    }
  ]).toArray();

  if (result.length === 0) {
    return {
      totalExpenses: 0,
      count: 0
    };
  }

  return result[0];
}


// Monthly expense summary
async function getMonthlyExpenseSummary(year, month) {
  const db = getDatabase();

  const startDate = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  const endDate = new Date(
    Number(year),
    Number(month),
    1
  );

  const result = await db.collection("expenses").aggregate([
    {
      $match: {
        status: "PAID",
        expenseDate: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
    {
      $group: {
        _id: "$category",
        total: {
          $sum: "$amount"
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        total: -1
      }
    }
  ]).toArray();

  let total = 0;

  result.forEach(item => {
    total += item.total;
  });

  return {
    year: Number(year),
    month: Number(month),
    totalExpenses: total,
    categories: result
  };
}


module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
  getMonthlyExpenseSummary
};