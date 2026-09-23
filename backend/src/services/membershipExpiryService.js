const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");

const notificationService =
  require("./notificationService");


async function processMembershipExpiry() {
  const db = getDatabase();

  const now = new Date();

  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 7);


  // ------------------------------------------------
  // 1. Mark expired memberships
  // ------------------------------------------------

  const expiredMemberships = await db
    .collection("memberships")
    .find({
      status: "ACTIVE",
      endDate: {
        $lt: now
      }
    })
    .toArray();


  for (const membership of expiredMemberships) {

    await db.collection("memberships").updateOne(
      {
        _id: membership._id
      },
      {
        $set: {
          status: "EXPIRED",
          updatedAt: new Date()
        }
      }
    );


    // Find member
    const member = await db.collection("members").findOne({
      _id: membership.memberId
    });


    if (!member) {
      continue;
    }


    // Notify member's user
    if (member.userId) {

      await createExpiryNotification(
        member.userId,
        membership._id,
        "MEMBERSHIP_EXPIRED",
        "Membership Expired",
        "Your gym membership has expired. Please renew your membership."
      );
    }
  }


  // ------------------------------------------------
  // 2. Find memberships expiring within 7 days
  // ------------------------------------------------

  const expiringMemberships = await db
    .collection("memberships")
    .find({
      status: "ACTIVE",
      endDate: {
        $gte: now,
        $lte: futureDate
      }
    })
    .toArray();


  for (const membership of expiringMemberships) {

    const member = await db.collection("members").findOne({
      _id: membership.memberId
    });


    if (!member) {
      continue;
    }


    const daysRemaining = Math.ceil(
      (
        membership.endDate.getTime() - now.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );


    // Member notification
    if (member.userId) {

      await createExpiryNotification(
        member.userId,
        membership._id,
        "MEMBERSHIP_EXPIRING",
        "Membership Expiring Soon",
        `Your gym membership will expire in ${daysRemaining} day(s). Please renew it soon.`
      );
    }
  }


  return {
    expiredCount: expiredMemberships.length,
    expiringCount: expiringMemberships.length
  };
}


async function createExpiryNotification(
  userId,
  membershipId,
  type,
  title,
  message
) {

  const db = getDatabase();

  // Prevent duplicate notification for same membership/type/day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);


  const existing = await db.collection("notifications").findOne({
    userId: new ObjectId(userId),
    relatedId: new ObjectId(membershipId),
    type,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });


  if (existing) {
    return;
  }


  await notificationService.createNotification({
    userId,
    relatedId: membershipId,
    type,
    title,
    message
  });
}


module.exports = {
  processMembershipExpiry
};