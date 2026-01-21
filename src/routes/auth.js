const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// ======================= SIGNUP =======================
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate input
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    // Auto login after signup
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
    });

    // Send user back to frontend
    res.status(201).send({
      message: "User added successfully",
      user: savedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ======================= LOGIN =======================
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
    });

    // Send user to frontend
    res.send({
      message: "Login successful",
      user: user,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ======================= LOGOUT =======================
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.send("Logout Successful");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;
