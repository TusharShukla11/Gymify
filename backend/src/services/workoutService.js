const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");

async function createWorkoutPlan(data) {
  const db = getDatabase();

  const member = await db.collection("members").findOne({
    _id: new ObjectId(data.memberId)
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const trainer = await db.collection("trainers").findOne({
    _id: new ObjectId(data.trainerId)
  });

  if (!trainer) {
    throw new Error("Trainer not found.");
  }

  const workoutPlan = {
    memberId: new ObjectId(data.memberId),
    trainerId: new ObjectId(data.trainerId),

    name: data.name,
    goal: data.goal,
    level: data.level,

    days: data.days || [],

    status: "ACTIVE",

    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db
    .collection("workoutPlans")
    .insertOne(workoutPlan);

  return {
    _id: result.insertedId,
    ...workoutPlan
  };
}


// Get all workout plans
async function getAllWorkoutPlans() {
  const db = getDatabase();

  const plans = await db
    .collection("workoutPlans")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return plans;
}


// Get workout plan by ID
async function getWorkoutPlanById(id) {
  const db = getDatabase();

  const plan = await db.collection("workoutPlans").findOne({
    _id: new ObjectId(id)
  });

  if (!plan) {
    throw new Error("Workout plan not found.");
  }

  return plan;
}


// Get plans for a member
async function getMemberWorkoutPlans(memberId) {
  const db = getDatabase();

  return await db
    .collection("workoutPlans")
    .find({
      memberId: new ObjectId(memberId)
    })
    .sort({ createdAt: -1 })
    .toArray();
}


// Get plans assigned by trainer
async function getTrainerWorkoutPlans(trainerId) {
  const db = getDatabase();

  return await db
    .collection("workoutPlans")
    .find({
      trainerId: new ObjectId(trainerId)
    })
    .sort({ createdAt: -1 })
    .toArray();
}


// Update workout plan
async function updateWorkoutPlan(id, data) {
  const db = getDatabase();

  const updateData = {
    updatedAt: new Date()
  };

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.goal !== undefined) {
    updateData.goal = data.goal;
  }

  if (data.level !== undefined) {
    updateData.level = data.level;
  }

  if (data.days !== undefined) {
    updateData.days = data.days;
  }

  const result = await db.collection("workoutPlans").findOneAndUpdate(
    {
      _id: new ObjectId(id)
    },
    {
      $set: updateData
    },
    {
      returnDocument: "after"
    }
  );

  if (!result) {
    throw new Error("Workout plan not found.");
  }

  return result;
}


// Deactivate workout plan
async function deactivateWorkoutPlan(id) {
  const db = getDatabase();

  const result = await db.collection("workoutPlans").findOneAndUpdate(
    {
      _id: new ObjectId(id)
    },
    {
      $set: {
        status: "INACTIVE",
        updatedAt: new Date()
      }
    },
    {
      returnDocument: "after"
    }
  );

  if (!result) {
    throw new Error("Workout plan not found.");
  }

  return result;
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