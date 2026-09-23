function validateTrainerAssignment(data) {
  const errors = [];

  if (!data.trainerId) {
    errors.push("Trainer ID is required.");
  }

  if (!data.memberId) {
    errors.push("Member ID is required.");
  }

  return errors;
}

module.exports = {
  validateTrainerAssignment
};