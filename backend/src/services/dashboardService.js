const { getDatabase } = require("../config/database");


// Get dashboard overview
async function getDashboardOverview() {
  const db = getDatabase();

  const membersCollection = db.collection("members");
  const trainersCollection = db.collection("trainers");
  const membershipsCollection = db.collection("memberships");
  const paymentsCollection = db.collection("payments");
  const attendanceCollection = db.collection("attendance");
  const expensesCollection = db.collection("expenses");


  // -----------------------------
  // TOTAL MEMBERS
  // -----------------------------

  const totalMembers = await membersCollection.countDocuments();


  // -----------------------------
  // ACTIVE MEMBERS
  // -----------------------------

  const activeMembers = await membersCollection.countDocuments({
    status: "ACTIVE"
  });


  // -----------------------------
  // TOTAL TRAINERS
  // -----------------------------

  const totalTrainers = await trainersCollection.countDocuments();


  // -----------------------------
  // ACTIVE TRAINERS
  // -----------------------------

  const activeTrainers = await trainersCollection.countDocuments({
    status: "ACTIVE"
  });


  // -----------------------------
  // ACTIVE MEMBERSHIPS
  // -----------------------------

  const activeMemberships =
    await membershipsCollection.countDocuments({
      status: "ACTIVE"
    });


  // -----------------------------
  // TOTAL REVENUE
  // -----------------------------

  const revenueResult =
    await paymentsCollection.aggregate([
      {
        $match: {
          status: "PAID"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount"
          }
        }
      }
    ]).toArray();


  const totalRevenue =
    revenueResult.length > 0
      ? revenueResult[0].totalRevenue
      : 0;


  // -----------------------------
  // TOTAL EXPENSES
  // -----------------------------

  const expenseResult =
    await expensesCollection.aggregate([
      {
        $match: {
          status: "PAID"
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: "$amount"
          }
        }
      }
    ]).toArray();


  const totalExpenses =
    expenseResult.length > 0
      ? expenseResult[0].totalExpenses
      : 0;


  // -----------------------------
  // NET PROFIT
  // -----------------------------

  const netProfit =
    totalRevenue - totalExpenses;


  // -----------------------------
  // TODAY'S ATTENDANCE
  // -----------------------------

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );


  const todayAttendance =
    await attendanceCollection.countDocuments({
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });


  return {
    members: {
      total: totalMembers,
      active: activeMembers
    },

    trainers: {
      total: totalTrainers,
      active: activeTrainers
    },

    memberships: {
      active: activeMemberships
    },

    financial: {
      totalRevenue,
      totalExpenses,
      netProfit
    },

    attendance: {
      today: todayAttendance
    }
  };
}


// Get monthly financial statistics
async function getMonthlyFinancialStats(year, month) {
  const db = getDatabase();

  const paymentsCollection =
    db.collection("payments");

  const expensesCollection =
    db.collection("expenses");


  const startDate = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  const endDate = new Date(
    Number(year),
    Number(month),
    1
  );


  // -----------------------------
  // MONTHLY REVENUE
  // -----------------------------

  const revenueResult =
    await paymentsCollection.aggregate([
      {
        $match: {
          status: "PAID",
          paymentDate: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount"
          },
          transactionCount: {
            $sum: 1
          }
        }
      }
    ]).toArray();


  const revenue =
    revenueResult.length > 0
      ? revenueResult[0].totalRevenue
      : 0;

  const transactionCount =
    revenueResult.length > 0
      ? revenueResult[0].transactionCount
      : 0;


  // -----------------------------
  // MONTHLY EXPENSES
  // -----------------------------

  const expenseResult =
    await expensesCollection.aggregate([
      {
        $match: {
          status: "PAID",
          expenseDate: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: "$amount"
          },
          expenseCount: {
            $sum: 1
          }
        }
      }
    ]).toArray();


  const expenses =
    expenseResult.length > 0
      ? expenseResult[0].totalExpenses
      : 0;

  const expenseCount =
    expenseResult.length > 0
      ? expenseResult[0].expenseCount
      : 0;


  return {
    year: Number(year),
    month: Number(month),

    revenue,

    expenses,

    netProfit: revenue - expenses,

    transactionCount,

    expenseCount
  };
}


// Get membership statistics
async function getMembershipStats() {
  const db = getDatabase();

  const result =
    await db.collection("memberships").aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1
          }
        }
      }
    ]).toArray();


  const stats = {
    ACTIVE: 0,
    EXPIRED: 0,
    CANCELLED: 0
  };


  result.forEach(item => {
    stats[item._id] = item.count;
  });


  return stats;
}


// Get attendance statistics
async function getAttendanceStats() {
  const db = getDatabase();

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );


  const todayVisits =
    await db.collection("attendance").countDocuments({
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });


  const currentlyCheckedIn =
    await db.collection("attendance").countDocuments({
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: "CHECKED_IN"
    });


  return {
    todayVisits,
    currentlyCheckedIn
  };
}

//expiring memberships function
async function getExpiringMemberships(days = 7) {
  const db = getDatabase();

  const now = new Date();

  const futureDate = new Date();

  futureDate.setDate(
    futureDate.getDate() + Number(days)
  );


  const memberships =
    await db.collection("memberships").aggregate([
      {
        $match: {
          status: "ACTIVE",
          endDate: {
            $gte: now,
            $lte: futureDate
          }
        }
      },

      {
        $sort: {
          endDate: 1
        }
      }
    ]).toArray();


  return memberships;
}

module.exports = {
  getDashboardOverview,
  getMonthlyFinancialStats,
  getMembershipStats,
  getAttendanceStats,
  getExpiringMemberships
};