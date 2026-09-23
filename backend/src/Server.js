require("dotenv").config();

const app = require("./App");
const { connectDatabase } = require("./config/database");
const {
  startScheduler
} = require("./services/schedulerService");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:");
    console.error(error);

    process.exit(1);
  }
}

startServer();
startScheduler();