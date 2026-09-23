const {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  createMembership,
  getMemberMemberships,
  getActiveMembership,
} = require("../services/membershipService");

const {
  validateCreatePlan,
  validateCreateMembership,
} = require("../validators/membershipValidator");

const membershipService =
  require("../services/membershipService");


// ==========================================
// PLANS
// ==========================================

async function createPlanController(req, res) {
  try {
    const errors = validateCreatePlan(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const plan = await createPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Membership plan created successfully.",
      data: plan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


async function getPlans(req, res) {
  try {
    const plans = await getAllPlans();

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


async function getPlan(req, res) {
  try {
    const plan = await getPlanById(req.params.id);

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


async function updatePlanController(req, res) {
  try {
    const plan = await updatePlan(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Membership plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// ==========================================
// MEMBERSHIPS
// ==========================================

async function createMembershipController(req, res) {
  try {
    const errors = validateCreateMembership(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const membership = await createMembership(req.body);

    return res.status(201).json({
      success: true,
      message: "Membership assigned successfully.",
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


async function getMemberships(req, res) {
  try {
    const result = await membershipService.getAllMemberships({
      page: req.query.page,
      limit: req.query.limit,
      memberId: req.query.memberId,
      planId: req.query.planId,
      status: req.query.status,
      expiringIn: req.query.expiringIn
    });

    res.status(200).json({
      success: true,
      data: result.memberships,
      pagination: result.pagination
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function getActive(req, res) {
  try {
    const membership = await getActiveMembership(
      req.params.memberId
    );

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  createPlanController,
  getPlans,
  getPlan,
  updatePlanController,
  createMembershipController,
  getMemberships,
  getActive,
};