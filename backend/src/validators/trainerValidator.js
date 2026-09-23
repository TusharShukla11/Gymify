function validateCreateTrainer(data) {
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

  if (data.specialization && data.specialization.trim().length < 2) {
    errors.push("Specialization is invalid.");
  }

  if (
    data.experience !== undefined &&
    (isNaN(Number(data.experience)) || Number(data.experience) < 0)
  ) {
    errors.push("Experience must be a valid number.");
  }

  return errors;
}

function validateUpdateTrainer(data) {
  const errors = [];

  if (
    data.name !== undefined &&
    data.name.trim().length < 2
  ) {
    errors.push("Name must contain at least 2 characters.");
  }

  if (
    data.experience !== undefined &&
    (isNaN(Number(data.experience)) || Number(data.experience) < 0)
  ) {
    errors.push("Experience must be a valid number.");
  }

  return errors;
}

module.exports = {
  validateCreateTrainer,
  validateUpdateTrainer,
};