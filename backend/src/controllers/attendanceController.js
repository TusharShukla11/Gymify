const {
  checkIn,
  checkOut,
  getMemberAttendance,
  getTodayAttendance,
  getCurrentlyCheckedIn,
  getAttendanceStats,
} = require("../services/attendanceService");

const {
  validateCheckIn,
} = require("../validators/attendanceValidator");

const attendanceService = require("../services/attendanceService");


// ==========================================
// CHECK IN
// ==========================================

async function checkInController(
  req,
  res
) {
  try {
    const errors = validateCheckIn(
      req.body
    );

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const record = await checkIn(
      req.body.memberId
    );

    return res.status(201).json({
      success: true,

      message:
        "Member checked in successfully.",

      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
}


// ==========================================
// CHECK OUT
// ==========================================

async function checkOutController(
  req,
  res
) {
  try {
    const record = await checkOut(
      req.params.memberId
    );

    return res.status(200).json({
      success: true,

      message:
        "Member checked out successfully.",

      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
}


// ==========================================
// MEMBER HISTORY
// ==========================================

async function memberHistory(
  req,
  res
) {
  try {
    const records =
      await getMemberAttendance(
        req.params.memberId
      );

    return res.status(200).json({
      success: true,

      count: records.length,

      data: records,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
}


// ==========================================
// TODAY
// ==========================================

async function today(
  req,
  res
) {
  try {
    const records =
      await getTodayAttendance();

    return res.status(200).json({
      success: true,

      count: records.length,

      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// ==========================================
// CURRENTLY CHECKED IN
// ==========================================

async function currentlyCheckedIn(
  req,
  res
) {
  try {
    const records =
      await getCurrentlyCheckedIn();

    return res.status(200).json({
      success: true,

      count: records.length,

      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// ==========================================
// MEMBER STATISTICS
// ==========================================

async function stats(
  req,
  res
) {
  try {
    const result =
      await getAttendanceStats(
        req.params.memberId
      );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
}

async function getAttendance(req, res) {
  try {
    const result = await attendanceService.getAllAttendance({
      page: req.query.page,
      limit: req.query.limit,
      memberId: req.query.memberId,
      membershipId: req.query.membershipId,
      status: req.query.status,
      date: req.query.date
    });

    res.status(200).json({
      success: true,
      data: result.attendance,
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
  checkInController,
  checkOutController,
  memberHistory,
  today,
  currentlyCheckedIn,
  stats,
  getAttendance
};