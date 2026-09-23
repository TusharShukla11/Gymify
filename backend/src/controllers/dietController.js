const dietService = require("../services/dietService");

const {
  validateDietPlan
} = require("../validators/dietValidator");


// Create diet plan
async function createDietPlan(req, res) {
  try {
    const errors = validateDietPlan(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const plan = await dietService.createDietPlan(req.body);

    res.status(201).json({
      success: true,
      message: "Diet plan created successfully.",
      data: plan
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// Get all diet plans
async function getAllDietPlans(req, res) {
  try {
    const plans = await dietService.getAllDietPlans();

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


// Get diet plan by ID
async function getDietPlanById(req, res) {
  try {
    const plan = await dietService.getDietPlanById(
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


// Member diet plans
async function getMemberDietPlans(req, res) {
  try {
    const plans = await dietService.getMemberDietPlans(
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


// Trainer diet plans
async function getTrainerDietPlans(req, res) {
  try {
    const plans = await dietService.getTrainerDietPlans(
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


// Update diet plan
async function updateDietPlan(req, res) {
  try {
    const plan = await dietService.updateDietPlan(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Diet plan updated successfully.",
      data: plan
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// Deactivate diet plan
async function deactivateDietPlan(req, res) {
  try {
    const plan = await dietService.deactivateDietPlan(
      req.params.id
    );

    res.json({
      success: true,
      message: "Diet plan deactivated successfully.",
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
  createDietPlan,
  getAllDietPlans,
  getDietPlanById,
  getMemberDietPlans,
  getTrainerDietPlans,
  updateDietPlan,
  deactivateDietPlan
};