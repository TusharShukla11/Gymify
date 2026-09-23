function validateNotification(data) {
  const errors = [];

  if (!data.userId) {
    errors.push("User ID is required.");
  }

  if (!data.type) {
    errors.push("Notification type is required.");
  }

  if (!data.title) {
    errors.push("Notification title is required.");
  }

  if (!data.message) {
    errors.push("Notification message is required.");
  }

  return errors;
}

module.exports = {
  validateNotification
};