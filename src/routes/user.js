const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAVE_DATA =
  "firstName lastName photoUrl age gender about skills";

// ======================= RECEIVED REQUESTS =======================
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAVE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ======================= CONNECTIONS =======================
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ======================= FEED (🔥 FIXED 🔥) =======================
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // 1️⃣ Find all requests involving logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // 2️⃣ Build exclusion list (ALL STRINGS)
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Exclude self
    hideUsersFromFeed.add(loggedInUser._id.toString());

    // 3️⃣ Fetch feed users
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAVE_DATA)
      .skip(skip)
      .limit(limit);

    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ======================= EDIT PROFILE =======================
userRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        photoUrl: req.body.photoUrl || req.body.photoURL,
        age: req.body.age,
        gender: req.body.gender,
        about: req.body.about,
        skills: req.body.skills,
      },
      { new: true, runValidators: true }
    ).select(USER_SAVE_DATA);

    res.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
