const MEMBERSHIP_STATUSES = [
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
  "PENDING"
];

function validateCreatePlan(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Plan name is required.");
  }

  if (
    data.durationInDays === undefined ||
    isNaN(Number(data.durationInDays)) ||
    Number(data.durationInDays) <= 0
  ) {
    errors.push("Duration must be greater than 0.");
  }

  if (
    data.price === undefined ||
    isNaN(Number(data.price)) ||
    Number(data.price) < 0
  ) {
    errors.push("Price must be a valid number.");
  }

  return errors;
}

function validateCreateMembership(data) {
  const errors = [];

  if (!data.memberId) {
    errors.push("Member ID is required.");
  }

  if (!data.planId) {
    errors.push("Plan ID is required.");
  }

  if (!data.startDate) {
    errors.push("Start date is required.");
  }

  return errors;
}

module.exports = {
  validateCreatePlan,
  validateCreateMembership,
  MEMBERSHIP_STATUSES
};