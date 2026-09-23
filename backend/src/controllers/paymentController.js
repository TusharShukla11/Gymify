const {
  createPayment,
  getAllPayments,
  getMemberPayments,
  getPaymentById,
  getRevenueSummary,
} = require("../services/paymentService");

const {
  validateCreatePayment,
} = require("../validators/paymentValidator");


// ==========================================
// CREATE PAYMENT
// ==========================================

async function create(req, res) {
  try {
    const errors = validateCreatePayment(
      req.body
    );

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const payment = await createPayment(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully.",
      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// ==========================================
// GET ALL PAYMENTS
// ==========================================

async function getAll(req, res) {
  try {
    const payments = await getAllPayments();

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ==========================================
// GET MEMBER PAYMENTS
// ==========================================

async function getByMember(req, res) {
  try {
    const payments = await getMemberPayments(
      req.params.memberId
    );

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// ==========================================
// GET PAYMENT
// ==========================================

async function getOne(req, res) {
  try {
    const payment = await getPaymentById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// ==========================================
// REVENUE
// ==========================================

async function revenue(req, res) {
  try {
    const summary = await getRevenueSummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getPayments(req, res) {
  try {
    const result = await paymentService.getAllPayments({
      page: req.query.page,
      limit: req.query.limit,
      memberId: req.query.memberId,
      membershipId: req.query.membershipId,
      paymentMethod: req.query.paymentMethod,
      status: req.query.status,
      from: req.query.from,
      to: req.query.to
    });

    res.status(200).json({
      success: true,
      data: result.payments,
      pagination: result.pagination
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  create,
  getAll,
  getByMember,
  getOne,
  revenue,
  getPayments
};