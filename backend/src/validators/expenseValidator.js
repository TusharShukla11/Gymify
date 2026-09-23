const EXPENSE_CATEGORIES = [
  "RENT",
  "ELECTRICITY",
  "WATER",
  "EQUIPMENT",
  "MAINTENANCE",
  "STAFF_SALARY",
  "CLEANING",
  "MARKETING",
  "OTHER"
];

const PAYMENT_METHODS = [
  "CASH",
  "UPI",
  "CARD",
  "BANK_TRANSFER"
];

const EXPENSE_STATUSES = [
  "PAID",
  "PENDING",
  "CANCELLED"
];

function validateExpense(data) {
  const errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Expense title is required.");
  }

  if (
    data.amount === undefined ||
    data.amount === null ||
    isNaN(Number(data.amount)) ||
    Number(data.amount) <= 0
  ) {
    errors.push("Amount must be greater than 0.");
  }

  if (!data.category) {
    errors.push("Expense category is required.");
  } else if (!EXPENSE_CATEGORIES.includes(data.category)) {
    errors.push("Invalid expense category.");
  }

  if (data.paymentMethod) {
    if (!PAYMENT_METHODS.includes(data.paymentMethod)) {
      errors.push("Invalid payment method.");
    }
  }

  if (data.status) {
    if (!EXPENSE_STATUSES.includes(data.status)) {
      errors.push("Invalid expense status.");
    }
  }

  if (!data.expenseDate) {
    errors.push("Expense date is required.");
  }

  return errors;
}

module.exports = {
  validateExpense,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  EXPENSE_STATUSES
};