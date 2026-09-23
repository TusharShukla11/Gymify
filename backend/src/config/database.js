const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DATABASE_URL);

let database = null;

async function connectDatabase() {
  try {
    await client.connect();

    database = client.db("gym_management");

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);

    process.exit(1);
  }
}

function getDatabase() {
  if (!database) {
    throw new Error("Database is not connected.");
  }

  return database;
}

async function closeDatabase() {
  await client.close();
}

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase,
};