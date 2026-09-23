const cron = require("node-cron");

const {
  processMembershipExpiry
} = require("./membershipExpiryService");


function startScheduler() {

  // Runs every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {

    console.log(
      "Running membership expiry check..."
    );

    try {

      const result =
        await processMembershipExpiry();

      console.log(
        "Membership expiry check completed:",
        result
      );

    } catch (error) {

      console.error(
        "Membership expiry check failed:",
        error.message
      );
    }
  });


  console.log(
    "Scheduler started successfully."
  );
}


module.exports = {
  startScheduler
};