const { ObjectId } = require("mongodb");

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

function validateObjectId(id, fieldName = "ID") {
  if (!ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${fieldName}.`);
    error.statusCode = 400;
    throw error;
  }

  return new ObjectId(id);
}

module.exports = {
  isValidObjectId,
  validateObjectId
};