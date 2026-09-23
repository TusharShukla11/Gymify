const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");

async function createNotification(data) {
  const db = getDatabase();

  const notification = {
    userId: new ObjectId(data.userId),
    type: data.type,
    title: data.title,
    message: data.message,
    relatedId: data.relatedId
      ? new ObjectId(data.relatedId)
      : null,
    isRead: false,
    createdAt: new Date()
  };

  const result = await db.collection("notifications").insertOne(notification);

  return {
    _id: result.insertedId,
    ...notification
  };
}


async function getUserNotifications(userId) {
  const db = getDatabase();

  return db
    .collection("notifications")
    .find({
      userId: new ObjectId(userId)
    })
    .sort({ createdAt: -1 })
    .toArray();
}


async function getUnreadNotifications(userId) {
  const db = getDatabase();

  return db
    .collection("notifications")
    .find({
      userId: new ObjectId(userId),
      isRead: false
    })
    .sort({ createdAt: -1 })
    .toArray();
}


async function markAsRead(notificationId, userId) {
  const db = getDatabase();

  const result = await db.collection("notifications").updateOne(
    {
      _id: new ObjectId(notificationId),
      userId: new ObjectId(userId)
    },
    {
      $set: {
        isRead: true
      }
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Notification not found.");
  }

  return {
    message: "Notification marked as read."
  };
}


async function markAllAsRead(userId) {
  const db = getDatabase();

  const result = await db.collection("notifications").updateMany(
    {
      userId: new ObjectId(userId),
      isRead: false
    },
    {
      $set: {
        isRead: true
      }
    }
  );

  return {
    message: "All notifications marked as read.",
    updatedCount: result.modifiedCount
  };
}


module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead
};