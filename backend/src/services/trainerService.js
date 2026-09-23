const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const { getDatabase } = require("../config/database");

async function createTrainer(data) {
  const db = getDatabase();

  const users = db.collection("users");
  const trainers = db.collection("trainers");

  const email = data.email.toLowerCase().trim();

  const existingUser = await users.findOne({ email });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = {
    name: data.name.trim(),
    email,
    password: hashedPassword,
    phone: data.phone || null,
    role: "TRAINER",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userResult = await users.insertOne(user);

  const trainer = {
    userId: userResult.insertedId,
    specialization: data.specialization || null,
    experience:
      data.experience !== undefined
        ? Number(data.experience)
        : 0,
    salary:
      data.salary !== undefined
        ? Number(data.salary)
        : null,
    joiningDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const trainerResult = await trainers.insertOne(trainer);

  return {
    id: trainerResult.insertedId,
    userId: userResult.insertedId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    specialization: trainer.specialization,
    experience: trainer.experience,
    salary: trainer.salary,
    joiningDate: trainer.joiningDate,
  };
}

async function getAllTrainers(options = {}) {
  const db = getDatabase();

  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = Math.min(parseInt(options.limit) || 10, 100);

  const skip = (page - 1) * limit;

  const filter = {};

  if (options.status) {
    filter.status = options.status;
  }

  if (options.specialization) {
    filter.specialization = {
      $regex: options.specialization,
      $options: "i"
    };
  }

  const total = await db
    .collection("trainers")
    .countDocuments(filter);

  const trainers = await db
    .collection("trainers")
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    trainers,
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

async function getTrainerById(trainerId) {
  const db = getDatabase();

  const users = db.collection("users");
  const trainers = db.collection("trainers");

  if (!ObjectId.isValid(trainerId)) {
    throw new Error("Invalid trainer ID.");
  }

  const trainer = await trainers.findOne({
    _id: new ObjectId(trainerId),
  });

  if (!trainer) {
    throw new Error("Trainer not found.");
  }

  const user = await users.findOne({
    _id: trainer.userId,
    role: "TRAINER",
  });

  if (!user) {
    throw new Error("Trainer user account not found.");
  }

  return {
    id: trainer._id,
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    specialization: trainer.specialization,
    experience: trainer.experience,
    salary: trainer.salary,
    joiningDate: trainer.joiningDate,
  };
}

async function updateTrainer(trainerId, data) {
  const db = getDatabase();

  const users = db.collection("users");
  const trainers = db.collection("trainers");

  if (!ObjectId.isValid(trainerId)) {
    throw new Error("Invalid trainer ID.");
  }

  const trainer = await trainers.findOne({
    _id: new ObjectId(trainerId),
  });

  if (!trainer) {
    throw new Error("Trainer not found.");
  }

  const userUpdate = {};
  const trainerUpdate = {};

  if (data.name !== undefined) {
    userUpdate.name = data.name.trim();
  }

  if (data.phone !== undefined) {
    userUpdate.phone = data.phone;
  }

  if (data.status !== undefined) {
    if (!["ACTIVE", "INACTIVE"].includes(data.status)) {
      throw new Error("Invalid status.");
    }

    userUpdate.status = data.status;
  }

  if (data.specialization !== undefined) {
    trainerUpdate.specialization =
      data.specialization;
  }

  if (data.experience !== undefined) {
    trainerUpdate.experience =
      Number(data.experience);
  }

  if (data.salary !== undefined) {
    trainerUpdate.salary =
      Number(data.salary);
  }

  userUpdate.updatedAt = new Date();
  trainerUpdate.updatedAt = new Date();

  if (Object.keys(userUpdate).length > 0) {
    await users.updateOne(
      { _id: trainer.userId },
      { $set: userUpdate }
    );
  }

  if (Object.keys(trainerUpdate).length > 0) {
    await trainers.updateOne(
      { _id: trainer._id },
      { $set: trainerUpdate }
    );
  }

  return getTrainerById(trainerId);
}

async function deactivateTrainer(trainerId) {
  const db = getDatabase();

  const users = db.collection("users");
  const trainers = db.collection("trainers");

  if (!ObjectId.isValid(trainerId)) {
    throw new Error("Invalid trainer ID.");
  }

  const trainer = await trainers.findOne({
    _id: new ObjectId(trainerId),
  });

  if (!trainer) {
    throw new Error("Trainer not found.");
  }

  await users.updateOne(
    { _id: trainer.userId },
    {
      $set: {
        status: "INACTIVE",
        updatedAt: new Date(),
      },
    }
  );

  return {
    message: "Trainer deactivated successfully.",
  };
}

module.exports = {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deactivateTrainer,
};