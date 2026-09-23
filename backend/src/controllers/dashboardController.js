const dashboardService =
  require("../services/dashboardService");

async function getOverview(req, res) {
  try {
    const data =
      await dashboardService.getDashboardOverview();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function getMonthlyFinancial(req, res) {
  try {
    const year =
      parseInt(req.query.year) ||
      new Date().getFullYear();

    const month =
      parseInt(req.query.month) ||
      new Date().getMonth() + 1;

    const data =
      await dashboardService.getMonthlyFinancialStats(
        year,
        month
      );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(
      "Monthly financial error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function getMembershipStats(req, res) {
  try {
    const data =
      await dashboardService.getMembershipStats();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(
      "Membership stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function getAttendanceStats(req, res) {
  try {
    const data =
      await dashboardService.getAttendanceStats();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(
      "Attendance stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function getExpiringMemberships(req, res) {
  try {
    const days =
      parseInt(req.query.days) || 7;

    const data =
      await dashboardService.getExpiringMemberships(
        days
      );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(
      "Expiring memberships error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  getOverview,
  getMonthlyFinancial,
  getMembershipStats,
  getAttendanceStats,
  getExpiringMemberships
};