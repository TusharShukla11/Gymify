function validateCreateMember(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must contain at least 2 characters.");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("Valid email is required.");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must contain at least 6 characters.");
  }

  if (data.gender && !["MALE", "FEMALE", "OTHER"].includes(data.gender)) {
    errors.push("Invalid gender.");
  }

  if (data.height !== undefined && isNaN(Number(data.height))) {
    errors.push("Height must be a number.");
  }

  if (data.weight !== undefined && isNaN(Number(data.weight))) {
    errors.push("Weight must be a number.");
  }

  return errors;
}

function validateUpdateMember(data) {
  const errors = [];

  if (data.name !== undefined && data.name.trim().length < 2) {
    errors.push("Name must contain at least 2 characters.");
  }

  if (
    data.gender !== undefined &&
    !["MALE", "FEMALE", "OTHER"].includes(data.gender)
  ) {
    errors.push("Invalid gender.");
  }

  if (data.height !== undefined && isNaN(Number(data.height))) {
    errors.push("Height must be a number.");
  }

  if (data.weight !== undefined && isNaN(Number(data.weight))) {
    errors.push("Weight must be a number.");
  }

  return errors;
}

module.exports = {
  validateCreateMember,
  validateUpdateMember,
};