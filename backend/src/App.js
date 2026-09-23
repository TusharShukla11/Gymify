const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const trainerAssignmentRoutes = require("./routes/trainerAssignmentRoutes");
const dietRoutes = require("./routes/dietRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const errorMiddleware =
  require("./middlewares/errorMiddleware");

const notFoundMiddleware =
  require("./middlewares/notFoundMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gym Management System API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/members", memberRoutes);

app.use("/api/trainers", trainerRoutes);

app.use("/api/memberships", membershipRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/attendance",attendanceRoutes);

app.use("/api/workouts", workoutRoutes);

app.use("/api/trainer-assignments", trainerAssignmentRoutes);

app.use("/api/diets", dietRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/notifications", notificationRoutes);

// Error handling — MUST BE LAST
app.use(notFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;