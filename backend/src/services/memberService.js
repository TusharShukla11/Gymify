const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const { getDatabase } = require("../config/database");

async function createMember(data) {
  const db = getDatabase();

  const users = db.collection("users");
  const members = db.collection("members");

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
    role: "MEMBER",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userResult = await users.insertOne(user);

  const member = {
    userId: userResult.insertedId,
    gender: data.gender || null,
    dateOfBirth: data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : null,
    height: data.height ? Number(data.height) : null,
    weight: data.weight ? Number(data.weight) : null,
    joiningDate: new Date(),
    trainerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const memberResult = await members.insertOne(member);

  return {
    id: memberResult.insertedId,
    userId: userResult.insertedId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    height: member.height,
    weight: member.weight,
    joiningDate: member.joiningDate,
  };
}

async function getAllMembers(options = {}) {
  const db = getDatabase();

  const page = Math.max(
    parseInt(options.page) || 1,
    1
  );

  const limit = Math.min(
    parseInt(options.limit) || 10,
    100
  );

  const skip = (page - 1) * limit;

  const matchConditions = [];

  // STATUS FILTER
  if (options.status) {
    matchConditions.push({
      "user.status": options.status
    });
  }

  // SEARCH
  if (options.search) {
    const searchRegex = new RegExp(
      options.search,
      "i"
    );

    matchConditions.push({
      $or: [
        {
          "user.name": {
            $regex: searchRegex
          }
        },
        {
          "user.email": {
            $regex: searchRegex
          }
        },
        {
          "user.phone": {
            $regex: searchRegex
          }
        }
      ]
    });
  }

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },

    {
      $unwind: "$user"
    },

    {
      $match: {
        "user.role": "MEMBER",
        ...(matchConditions.length > 0
          ? { $and: matchConditions }
          : {})
      }
    },

    {
      $sort: {
        createdAt: -1
      }
    },

    {
      $facet: {
        metadata: [
          {
            $count: "total"
          }
        ],

        members: [
          {
            $skip: skip
          },
          {
            $limit: limit
          },

          {
            $project: {
              _id: 1,

              userId: "$user._id",

              name: "$user.name",
              email: "$user.email",
              phone: "$user.phone",
              status: "$user.status",

              gender: 1,
              dateOfBirth: 1,
              height: 1,
              weight: 1,
              joiningDate: 1,

              createdAt: 1,
              updatedAt: 1
            }
          }
        ]
      }
    }
  ];

  const result = await db
    .collection("members")
    .aggregate(pipeline)
    .toArray();

  const total =
    result[0]?.metadata[0]?.total || 0;

  const members =
    result[0]?.members || [];

  const totalPages = Math.ceil(
    total / limit
  );

  return {
    members,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

async function getMemberById(memberId) {
  const db = getDatabase();

  const users = db.collection("users");
  const members = db.collection("members");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const member = await members.findOne({
    _id: new ObjectId(memberId),
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const user = await users.findOne({
    _id: member.userId,
    role: "MEMBER",
  });

  if (!user) {
    throw new Error("Member user account not found.");
  }

  return {
    id: member._id,
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    height: member.height,
    weight: member.weight,
    joiningDate: member.joiningDate,
  };
}

async function updateMember(memberId, data) {
  const db = getDatabase();

  const users = db.collection("users");
  const members = db.collection("members");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const member = await members.findOne({
    _id: new ObjectId(memberId),
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const userUpdate = {};
  const memberUpdate = {};

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

  if (data.gender !== undefined) {
    memberUpdate.gender = data.gender;
  }

  if (data.dateOfBirth !== undefined) {
    memberUpdate.dateOfBirth = new Date(data.dateOfBirth);
  }

  if (data.height !== undefined) {
    memberUpdate.height = Number(data.height);
  }

  if (data.weight !== undefined) {
    memberUpdate.weight = Number(data.weight);
  }

  userUpdate.updatedAt = new Date();
  memberUpdate.updatedAt = new Date();

  if (Object.keys(userUpdate).length > 0) {
    await users.updateOne(
      { _id: member.userId },
      { $set: userUpdate }
    );
  }

  if (Object.keys(memberUpdate).length > 0) {
    await members.updateOne(
      { _id: member._id },
      { $set: memberUpdate }
    );
  }

  return getMemberById(memberId);
}

async function deactivateMember(memberId) {
  const db = getDatabase();

  const users = db.collection("users");
  const members = db.collection("members");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const member = await members.findOne({
    _id: new ObjectId(memberId),
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  await users.updateOne(
    { _id: member.userId },
    {
      $set: {
        status: "INACTIVE",
        updatedAt: new Date(),
      },
    }
  );

  return {
    message: "Member deactivated successfully.",
  };
}




module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deactivateMember,

};