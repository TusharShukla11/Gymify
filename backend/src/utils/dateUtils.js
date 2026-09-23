function isValidDate(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return !isNaN(date.getTime());
}

function validateDate(value, fieldName = "Date") {
  if (!isValidDate(value)) {
    const error = new Error(`Invalid ${fieldName}.`);
    error.statusCode = 400;
    throw error;
  }

  return new Date(value);
}

module.exports = {
  isValidDate,
  validateDate
};