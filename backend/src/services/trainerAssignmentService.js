const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");


// Assign member to trainer
async function assignMember(data) {
  const db = getDatabase();

  const trainer = await db.collection("trainers").findOne({
    _id: new ObjectId(data.trainerId)
  });

  if (!trainer) {
    throw new Error("Trainer not found.");
  }

  const member = await db.collection("members").findOne({
    _id: new ObjectId(data.memberId)
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  // Check if already assigned
  const existingAssignment = await db
    .collection("trainerAssignments")
    .findOne({
      trainerId: new ObjectId(data.trainerId),
      memberId: new ObjectId(data.memberId),
      status: "ACTIVE"
    });

  if (existingAssignment) {
    throw new Error("Member is already assigned to this trainer.");
  }

  const assignment = {
    trainerId: new ObjectId(data.trainerId),
    memberId: new ObjectId(data.memberId),

    assignedDate: new Date(),

    status: "ACTIVE",

    notes: data.notes || "",

    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db
    .collection("trainerAssignments")
    .insertOne(assignment);

  return {
    _id: result.insertedId,
    ...assignment
  };
}


// Get all assignments
async function getAllAssignments() {
  const db = getDatabase();

  return await db
    .collection("trainerAssignments")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}


// Get members assigned to a trainer
async function getTrainerMembers(trainerId) {
  const db = getDatabase();

  const assignments = await db
    .collection("trainerAssignments")
    .find({
      trainerId: new ObjectId(trainerId),
      status: "ACTIVE"
    })
    .toArray();

  const members = [];

  for (const assignment of assignments) {
    const member = await db.collection("members").findOne({
      _id: assignment.memberId
    });

    if (member) {
      members.push({
        assignmentId: assignment._id,
        assignedDate: assignment.assignedDate,
        notes: assignment.notes,
        member
      });
    }
  }

  return members;
}


// Get trainers assigned to a member
async function getMemberTrainers(memberId) {
  const db = getDatabase();

  const assignments = await db
    .collection("trainerAssignments")
    .find({
      memberId: new ObjectId(memberId),
      status: "ACTIVE"
    })
    .toArray();

  const trainers = [];

  for (const assignment of assignments) {
    const trainer = await db.collection("trainers").findOne({
      _id: assignment.trainerId
    });

    if (trainer) {
      trainers.push({
        assignmentId: assignment._id,
        assignedDate: assignment.assignedDate,
        notes: assignment.notes,
        trainer
      });
    }
  }

  return trainers;
}


// Remove trainer-member assignment
async function removeAssignment(id) {
  const db = getDatabase();

  const result = await db
    .collection("trainerAssignments")
    .findOneAndUpdate(
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
    throw new Error("Assignment not found.");
  }

  return result;
}


module.exports = {
  assignMember,
  getAllAssignments,
  getTrainerMembers,
  getMemberTrainers,
  removeAssignment
};