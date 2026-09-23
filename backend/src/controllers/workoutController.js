const workoutService = require("../services/workoutService");
const { validateWorkoutPlan } = require("../validators/workoutValidator");


// Create workout plan
async function createWorkoutPlan(req, res) {
  try {
    const errors = validateWorkoutPlan(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const plan = await workoutService.createWorkoutPlan(req.body);

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully.",
      data: plan
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Get all plans
async function getAllWorkoutPlans(req, res) {
  try {
    const plans = await workoutService.getAllWorkoutPlans();

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Get plan by ID
async function getWorkoutPlanById(req, res) {
  try {
    const plan = await workoutService.getWorkoutPlanById(
      req.params.id
    );

    res.json({
      success: true,
      data: plan
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// Member plans
async function getMemberWorkoutPlans(req, res) {
  try {
    const plans = await workoutService.getMemberWorkoutPlans(
      req.params.memberId
    );

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Trainer plans
async function getTrainerWorkoutPlans(req, res) {
  try {
    const plans = await workoutService.getTrainerWorkoutPlans(
      req.params.trainerId
    );

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Update plan
async function updateWorkoutPlan(req, res) {
  try {
    const plan = await workoutService.updateWorkoutPlan(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Workout plan updated successfully.",
      data: plan
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// Deactivate plan
async function deactivateWorkoutPlan(req, res) {
  try {
    const plan = await workoutService.deactivateWorkoutPlan(
      req.params.id
    );

    res.json({
      success: true,
      message: "Workout plan deactivated successfully.",
      data: plan
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  createWorkoutPlan,
  getAllWorkoutPlans,
  getWorkoutPlanById,
  getMemberWorkoutPlans,
  getTrainerWorkoutPlans,
  updateWorkoutPlan,
  deactivateWorkoutPlan
};