function validateRegister(data) {
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

  return errors;
}

function validateLogin(data) {
  const errors = [];

  if (!data.email || !data.email.includes("@")) {
    errors.push("Valid email is required.");
  }

  if (!data.password) {
    errors.push("Password is required.");
  }

  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
};