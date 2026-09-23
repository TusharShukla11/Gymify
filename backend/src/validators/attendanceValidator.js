function validateCheckIn(data) {
  const errors = [];

  if (!data.memberId) {
    errors.push("Member ID is required.");
  }

  return errors;
}

module.exports = {
  validateCheckIn,
};