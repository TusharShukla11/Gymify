const { ObjectId } = require("mongodb");

const { getDatabase } = require("../config/database");


// ==========================================
// MEMBERSHIP PLANS
// ==========================================

async function createPlan(data) {
  const db = getDatabase();

  const plans = db.collection("membershipPlans");

  const existingPlan = await plans.findOne({
    name: {
      $regex: `^${data.name.trim()}$`,
      $options: "i",
    },
  });

  if (existingPlan) {
    throw new Error("A plan with this name already exists.");
  }

  const plan = {
    name: data.name.trim(),
    durationInDays: Number(data.durationInDays),
    price: Number(data.price),
    description: data.description || null,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await plans.insertOne(plan);

  return {
    id: result.insertedId,
    ...plan,
  };
}


async function getAllPlans() {
  const db = getDatabase();

  const plans = db.collection("membershipPlans");

  return plans
    .find({})
    .sort({ durationInDays: 1 })
    .toArray();
}


async function getPlanById(planId) {
  const db = getDatabase();

  const plans = db.collection("membershipPlans");

  if (!ObjectId.isValid(planId)) {
    throw new Error("Invalid plan ID.");
  }

  const plan = await plans.findOne({
    _id: new ObjectId(planId),
  });

  if (!plan) {
    throw new Error("Membership plan not found.");
  }

  return plan;
}


async function updatePlan(planId, data) {
  const db = getDatabase();

  const plans = db.collection("membershipPlans");

  if (!ObjectId.isValid(planId)) {
    throw new Error("Invalid plan ID.");
  }

  const updateData = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }

  if (data.durationInDays !== undefined) {
    updateData.durationInDays =
      Number(data.durationInDays);
  }

  if (data.price !== undefined) {
    updateData.price = Number(data.price);
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.status !== undefined) {
    if (!["ACTIVE", "INACTIVE"].includes(data.status)) {
      throw new Error("Invalid plan status.");
    }

    updateData.status = data.status;
  }

  const result = await plans.updateOne(
    {
      _id: new ObjectId(planId),
    },
    {
      $set: updateData,
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Membership plan not found.");
  }

  return getPlanById(planId);
}


// ==========================================
// MEMBERSHIPS
// ==========================================

async function createMembership(data) {
  const db = getDatabase();

  const memberships = db.collection("memberships");
  const members = db.collection("members");
  const plans = db.collection("membershipPlans");

  if (!ObjectId.isValid(data.memberId)) {
    throw new Error("Invalid member ID.");
  }

  if (!ObjectId.isValid(data.planId)) {
    throw new Error("Invalid plan ID.");
  }

  const member = await members.findOne({
    _id: new ObjectId(data.memberId),
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const plan = await plans.findOne({
    _id: new ObjectId(data.planId),
    status: "ACTIVE",
  });

  if (!plan) {
    throw new Error("Active membership plan not found.");
  }

  const startDate = new Date(data.startDate);

  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid start date.");
  }

  const endDate = new Date(startDate);

  endDate.setDate(
    endDate.getDate() + plan.durationInDays
  );

  const membership = {
    memberId: member._id,
    planId: plan._id,
    startDate,
    endDate,
    amount: plan.price,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await memberships.insertOne(
    membership
  );

  return {
    id: result.insertedId,
    ...membership,
  };
}


async function getMemberMemberships(memberId) {
  const db = getDatabase();

  const memberships = db.collection("memberships");
  const plans = db.collection("membershipPlans");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const list = await memberships
    .find({
      memberId: new ObjectId(memberId),
    })
    .sort({
      startDate: -1,
    })
    .toArray();

  const result = [];

  for (const membership of list) {
    const plan = await plans.findOne({
      _id: membership.planId,
    });

    result.push({
      ...membership,
      plan: plan
        ? {
            id: plan._id,
            name: plan.name,
            durationInDays: plan.durationInDays,
            price: plan.price,
          }
        : null,
    });
  }

  return result;
}


async function getActiveMembership(memberId) {
  const db = getDatabase();

  const memberships = db.collection("memberships");
  const plans = db.collection("membershipPlans");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const now = new Date();

  const membership = await memberships.findOne({
    memberId: new ObjectId(memberId),
    startDate: {
      $lte: now,
    },
    endDate: {
      $gte: now,
    },
    status: "ACTIVE",
  });

  if (!membership) {
    return null;
  }

  const plan = await plans.findOne({
    _id: membership.planId,
  });

  return {
    ...membership,
    plan,
  };
}


async function updateExpiredMemberships() {
  const db = getDatabase();

  const memberships = db.collection("memberships");

  const now = new Date();

  const result = await memberships.updateMany(
    {
      status: "ACTIVE",
      endDate: {
        $lt: now,
      },
    },
    {
      $set: {
        status: "EXPIRED",
        updatedAt: now,
      },
    }
  );

  return result.modifiedCount;
}

async function getAllMemberships(options = {}) {
  const db = getDatabase();

  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = Math.min(parseInt(options.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by member
  if (options.memberId) {
    filter.memberId = new ObjectId(options.memberId);
  }

  // Filter by plan
  if (options.planId) {
    filter.planId = new ObjectId(options.planId);
  }

  // Filter by status
  if (options.status) {
    filter.status = options.status;
  }

  // Expiring within specified number of days
  if (options.expiringIn) {
    const days = parseInt(options.expiringIn);

    if (!isNaN(days) && days > 0) {
      const now = new Date();

      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + days);

      filter.status = "ACTIVE";

      filter.endDate = {
        $gte: now,
        $lte: futureDate
      };
    }
  }

  const total = await db
    .collection("memberships")
    .countDocuments(filter);

  const memberships = await db
    .collection("memberships")
    .find(filter)
    .sort({ endDate: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    memberships,
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


module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  createMembership,
  getMemberMemberships,
  getActiveMembership,
  updateExpiredMemberships,
  getAllMemberships
};