function validateWorkoutPlan(data) {
  const errors = [];

  if (!data.memberId) {
    errors.push("Member ID is required.");
  }

  if (!data.trainerId) {
    errors.push("Trainer ID is required.");
  }

  if (!data.name) {
    errors.push("Workout plan name is required.");
  }

  if (!data.goal) {
    errors.push("Workout goal is required.");
  }

  if (!data.level) {
    errors.push("Workout level is required.");
  }

  if (!Array.isArray(data.days)) {
    errors.push("Workout days must be an array.");
  }

  return errors;
}

module.exports = {
  validateWorkoutPlan
};