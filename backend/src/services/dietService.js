const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");


// Create diet plan
async function createDietPlan(data) {
  const db = getDatabase();

  // Check member
  const member = await db.collection("members").findOne({
    _id: new ObjectId(data.memberId)
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  // Check trainer
  const trainer = await db.collection("trainers").findOne({
    _id: new ObjectId(data.trainerId)
  });

  if (!trainer) {
    throw new Error("Trainer not found.");
  }

  const dietPlan = {
    memberId: new ObjectId(data.memberId),
    trainerId: new ObjectId(data.trainerId),

    name: data.name,
    goal: data.goal,

    dailyCalories: Number(data.dailyCalories) || 0,
    dailyProtein: Number(data.dailyProtein) || 0,
    dailyCarbs: Number(data.dailyCarbs) || 0,
    dailyFat: Number(data.dailyFat) || 0,

    meals: data.meals || [],

    status: "ACTIVE",

    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db
    .collection("dietPlans")
    .insertOne(dietPlan);

  return {
    _id: result.insertedId,
    ...dietPlan
  };
}


// Get all diet plans
async function getAllDietPlans() {
  const db = getDatabase();

  return await db
    .collection("dietPlans")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}


// Get diet plan by ID
async function getDietPlanById(id) {
  const db = getDatabase();

  const plan = await db.collection("dietPlans").findOne({
    _id: new ObjectId(id)
  });

  if (!plan) {
    throw new Error("Diet plan not found.");
  }

  return plan;
}


// Get member diet plans
async function getMemberDietPlans(memberId) {
  const db = getDatabase();

  return await db
    .collection("dietPlans")
    .find({
      memberId: new ObjectId(memberId)
    })
    .sort({ createdAt: -1 })
    .toArray();
}


// Get trainer diet plans
async function getTrainerDietPlans(trainerId) {
  const db = getDatabase();

  return await db
    .collection("dietPlans")
    .find({
      trainerId: new ObjectId(trainerId)
    })
    .sort({ createdAt: -1 })
    .toArray();
}


// Update diet plan
async function updateDietPlan(id, data) {
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

  if (data.dailyCalories !== undefined) {
    updateData.dailyCalories = Number(data.dailyCalories);
  }

  if (data.dailyProtein !== undefined) {
    updateData.dailyProtein = Number(data.dailyProtein);
  }

  if (data.dailyCarbs !== undefined) {
    updateData.dailyCarbs = Number(data.dailyCarbs);
  }

  if (data.dailyFat !== undefined) {
    updateData.dailyFat = Number(data.dailyFat);
  }

  if (data.meals !== undefined) {
    updateData.meals = data.meals;
  }

  const result = await db.collection("dietPlans").findOneAndUpdate(
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
    throw new Error("Diet plan not found.");
  }

  return result;
}


// Deactivate diet plan
async function deactivateDietPlan(id) {
  const db = getDatabase();

  const result = await db.collection("dietPlans").findOneAndUpdate(
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
    throw new Error("Diet plan not found.");
  }

  return result;
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