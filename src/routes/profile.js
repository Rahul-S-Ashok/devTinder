const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

// ======================= VIEW PROFILE =======================
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
});

// ======================= EDIT PROFILE =======================
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    // Validate incoming fields
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    // Update only allowed fields
    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = req.body[key])
    );

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
