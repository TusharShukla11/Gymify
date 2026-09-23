const { ObjectId } = require("mongodb");

const { getDatabase } = require("../config/database");


// ==========================================
// CHECK IN
// ==========================================

async function checkIn(memberId) {
  const db = getDatabase();

  const members = db.collection("members");
  const memberships = db.collection("memberships");
  const attendance = db.collection("attendance");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const memberObjectId = new ObjectId(memberId);

  // Check member
  const member = await members.findOne({
    _id: memberObjectId,
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  // Check active membership
  const now = new Date();

  const activeMembership =
    await memberships.findOne({
      memberId: memberObjectId,

      status: "ACTIVE",

      startDate: {
        $lte: now,
      },

      endDate: {
        $gte: now,
      },
    });

  if (!activeMembership) {
    throw new Error(
      "Member does not have an active membership."
    );
  }

  // Check whether already checked in
  const existingAttendance =
    await attendance.findOne({
      memberId: memberObjectId,

      status: "CHECKED_IN",
    });

  if (existingAttendance) {
    throw new Error(
      "Member is already checked in."
    );
  }

  const record = {
    memberId: memberObjectId,

    membershipId: activeMembership._id,

    checkIn: now,

    checkOut: null,

    durationMinutes: null,

    status: "CHECKED_IN",

    createdAt: now,

    updatedAt: now,
  };

  const result = await attendance.insertOne(record);

  return {
    id: result.insertedId,
    ...record,
  };
}


// ==========================================
// CHECK OUT
// ==========================================

async function checkOut(memberId) {
  const db = getDatabase();

  const attendance = db.collection("attendance");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const memberObjectId = new ObjectId(memberId);

  const record = await attendance.findOne({
    memberId: memberObjectId,

    status: "CHECKED_IN",
  });

  if (!record) {
    throw new Error(
      "Member is not currently checked in."
    );
  }

  const checkOutTime = new Date();

  const durationMilliseconds =
    checkOutTime.getTime() -
    record.checkIn.getTime();

  const durationMinutes = Math.max(
    0,
    Math.round(
      durationMilliseconds / (1000 * 60)
    )
  );

  await attendance.updateOne(
    {
      _id: record._id,
    },
    {
      $set: {
        checkOut: checkOutTime,

        durationMinutes,

        status: "COMPLETED",

        updatedAt: checkOutTime,
      },
    }
  );

  return attendance.findOne({
    _id: record._id,
  });
}


// ==========================================
// GET MEMBER ATTENDANCE
// ==========================================

async function getMemberAttendance(
  memberId
) {
  const db = getDatabase();

  const attendance =
    db.collection("attendance");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  return attendance
    .find({
      memberId: new ObjectId(memberId),
    })
    .sort({
      checkIn: -1,
    })
    .toArray();
}


// ==========================================
// GET TODAY'S ATTENDANCE
// ==========================================

async function getTodayAttendance() {
  const db = getDatabase();

  const attendance =
    db.collection("attendance");

  const now = new Date();

  const startOfDay = new Date(now);

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const endOfDay = new Date(now);

  endOfDay.setHours(
    23,
    59,
    59,
    999
  );

  return attendance
    .find({
      checkIn: {
        $gte: startOfDay,

        $lte: endOfDay,
      },
    })
    .sort({
      checkIn: -1,
    })
    .toArray();
}


// ==========================================
// GET CURRENTLY CHECKED-IN MEMBERS
// ==========================================

async function getCurrentlyCheckedIn() {
  const db = getDatabase();

  const attendance =
    db.collection("attendance");

  return attendance
    .find({
      status: "CHECKED_IN",
    })
    .sort({
      checkIn: -1,
    })
    .toArray();
}


// ==========================================
// ATTENDANCE STATISTICS
// ==========================================

async function getAttendanceStats(
  memberId
) {
  const db = getDatabase();

  const attendance =
    db.collection("attendance");

  if (!ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const memberObjectId =
    new ObjectId(memberId);

  const totalVisits =
    await attendance.countDocuments({
      memberId: memberObjectId,

      status: "COMPLETED",
    });

  const totalMinutesResult =
    await attendance
      .aggregate([
        {
          $match: {
            memberId: memberObjectId,

            status: "COMPLETED",
          },
        },

        {
          $group: {
            _id: null,

            totalMinutes: {
              $sum: "$durationMinutes",
            },
          },
        },
      ])
      .toArray();

  const totalMinutes =
    totalMinutesResult.length > 0
      ? totalMinutesResult[0].totalMinutes
      : 0;

  return {
    totalVisits,

    totalMinutes,

    totalHours:
      Math.round(
        (totalMinutes / 60) * 100
      ) / 100,
  };
}

async function getAllAttendance(options = {}) {
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

  // Filter by status
  if (options.status) {
    filter.status = options.status;
  }

  // Filter by date
  if (options.date) {
    const startDate = new Date(options.date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(options.date);
    endDate.setHours(23, 59, 59, 999);

    filter.checkIn = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const total = await db
    .collection("attendance")
    .countDocuments(filter);

  const attendance = await db
    .collection("attendance")
    .find(filter)
    .sort({ checkIn: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    attendance,
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
  checkIn,
  checkOut,
  getMemberAttendance,
  getTodayAttendance,
  getCurrentlyCheckedIn,
  getAttendanceStats,
  getAllAttendance
};