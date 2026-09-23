const PAYMENT_METHODS = [
  "CASH",
  "UPI",
  "CARD",
  "BANK_TRANSFER"
];

const PAYMENT_STATUSES = [
  "PAID",
  "PENDING",
  "FAILED",
  "REFUNDED"
];

function validateCreatePayment(data) {
  const errors = [];

  if (!data.memberId) {
    errors.push("Member ID is required.");
  }

  if (!data.membershipId) {
    errors.push("Membership ID is required.");
  }

  if (
    data.amount === undefined ||
    isNaN(Number(data.amount)) ||
    Number(data.amount) <= 0
  ) {
    errors.push("Amount must be greater than 0.");
  }

  const allowedMethods = [
    "CASH",
    "UPI",
    "CARD",
    "BANK_TRANSFER",
  ];

  if (
    !data.paymentMethod ||
    !allowedMethods.includes(data.paymentMethod)
  ) {
    errors.push(
      "Payment method must be CASH, UPI, CARD or BANK_TRANSFER."
    );
  }

  return errors;
}

module.exports = {
  validateCreatePayment,
  PAYMENT_METHODS,
  PAYMENT_STATUSES

};