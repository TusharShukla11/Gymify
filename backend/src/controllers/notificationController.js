const notificationService = require("../services/notificationService");


async function getNotifications(req, res) {
  try {
    const notifications =
      await notificationService.getUserNotifications(req.user.userId);

    res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function getUnreadNotifications(req, res) {
  try {
    const notifications =
      await notificationService.getUnreadNotifications(req.user.userId);

    res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function markAsRead(req, res) {
  try {
    const result = await notificationService.markAsRead(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


async function markAllAsRead(req, res) {
  try {
    const result =
      await notificationService.markAllAsRead(req.user.userId);

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead
};