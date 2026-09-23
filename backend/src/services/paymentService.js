const { ObjectId } = require("mongodb");

const { getDatabase } = require("../config/database");

function generateReceiptNumber() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `GYM-${year}${month}${day}-${random}`;
}


// ==========================================
// CREATE PAYMENT
// ==========================================

async function createPayment(data) {
  const db = getDatabase();

  const payments = db.collection("payments");
  const members = db.collection("members");
  const memberships = db.collection("memberships");

  if (!ObjectId.isValid(data.memberId)) {
    throw new Error("Invalid member ID.");
  }

  if (!ObjectId.isValid(data.membershipId)) {
    throw new Error("Invalid membership ID.");
  }

  const member = await members.findOne({
    _id: new ObjectId(data.memberId),
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const membership = await memberships.findOne({
    _id: new ObjectId(data.membershipId),
    memberId: new ObjectId(data.memberId),
  });

  if (!membership) {
    throw new Error(
      "Membership not found for this member."
    );
  }

  const payment = {
    memberId: member._id,

    membershipId: membership._id,

    receiptNumber: generateReceiptNumber(),

    amount: Number(data.amount),

    paymentMethod: data.paymentMethod,

    paymentDate: data.paymentDate
      ? new Date(data.paymentDate)
      : new Date(),

    status: "PAID",

    notes: data.notes || null,

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  const result = await payments.insertOne(payment);

  return {
    id: result.insertedId,
    ...payment,
  };
}


// ==========================================
// GET ALL PAYMENTS
// ==========================================

async function getAllPayments(options = {}) {
  const db = getDatabase();

  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = Math.min(parseInt(options.limit) || 10, 100);

  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by member
  if (options.memberId) {
    filter.memberId = new ObjectId(options.memberId);
  }

  // Filter by membership
  if (options.membershipId) {
    filter.membershipId = new ObjectId(options.membershipId);
  }

  // Filter by payment method
  if (options.paymentMethod) {
    filter.paymentMethod = options.paymentMethod;
  }

  // Filter by payment status
  if (options.status) {
    filter.status = options.status;
  }

  // Filter by date range
  if (options.from || options.to) {
    filter.paymentDate = {};

    if (options.from) {
      const fromDate = new Date(options.from);
      fromDate.setHours(0, 0, 0, 0);

      filter.paymentDate.$gte = fromDate;
    }

    if (options.to) {
      const toDate = new Date(options.to);
      toDate.setHours(23, 59, 59, 999);

      filter.paymentDate.$lte = toDate;
    }
  }

  const total = await db
    .collection("payments")
    .countDocuments(filter);

  const payments = await db
    .collection("payments")
    .find(filter)
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1
    }
  };
}


// ==========================================
// GET MEMBER PAYMENT HISTORY
// ==========================================

async function getMemberPayments(memberId) {
  const db = getDatabase();

  const payments = db.collection("payments");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  return payments
    .find({
      memberId: new ObjectId(memberId),
    })
    .sort({
      paymentDate: -1,
    })
    .toArray();
}


// ==========================================
// GET PAYMENT BY ID
// ==========================================

async function getPaymentById(paymentId) {
  const db = getDatabase();

  const payments = db.collection("payments");

  if (!ObjectId.isValid(paymentId)) {
    throw new Error("Invalid payment ID.");
  }

  const payment = await payments.findOne({
    _id: new ObjectId(paymentId),
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return payment;
}


// ==========================================
// REVENUE SUMMARY
// ==========================================

async function getRevenueSummary() {
  const db = getDatabase();

  const payments = db.collection("payments");

  const result = await payments
    .aggregate([
      {
        $match: {
          status: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
          totalPayments: {
            $sum: 1,
          },
        },
      },
    ])
    .toArray();

  if (result.length === 0) {
    return {
      totalRevenue: 0,
      totalPayments: 0,
    };
  }

  return {
    totalRevenue: result[0].totalRevenue,
    totalPayments: result[0].totalPayments,
  };
}


module.exports = {
  createPayment,
  getAllPayments,
  getMemberPayments,
  getPaymentById,
  getRevenueSummary,
};