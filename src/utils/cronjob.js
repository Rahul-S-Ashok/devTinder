const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

const MAX_EMAILS_PER_DAY = 150;

// Runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("CRON RAN AT:", new Date());

  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("toUserId", "emailId");

    if (pendingRequests.length === 0) {
      console.log("No requests found for yesterday");
      return;
    }

    // Deduplicate emails
    const uniqueEmails = [
      ...new Set(
        pendingRequests
          .map(req => req.toUserId?.emailId)
          .filter(Boolean)
      ),
    ];

    let sentCount = 0;

    for (const email of uniqueEmails) {
      if (sentCount >= MAX_EMAILS_PER_DAY) {
        console.log("Daily email limit reached");
        break;
      }

      try {
        await sendEmail.run(
          "New Friend Requests Pending",
          "You have new friend requests pending. Please login to DevTinder and take action."
        );
        sentCount++;
        console.log("Email sent to:", email);
      } catch (err) {
        console.error("Email failed for:", email, err);
      }
    }

    console.log("Total emails sent:", sentCount);
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
