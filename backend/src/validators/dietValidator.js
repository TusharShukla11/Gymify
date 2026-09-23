function validateDietPlan(data) {
  const errors = [];

  if (!data.memberId) {
    errors.push("Member ID is required.");
  }

  if (!data.trainerId) {
    errors.push("Trainer ID is required.");
  }

  if (!data.name) {
    errors.push("Diet plan name is required.");
  }

  if (!data.goal) {
    errors.push("Diet goal is required.");
  }

  if (data.dailyCalories === undefined) {
    errors.push("Daily calories are required.");
  }

  if (!Array.isArray(data.meals)) {
    errors.push("Meals must be an array.");
  }

  return errors;
}

module.exports = {
  validateDietPlan
};