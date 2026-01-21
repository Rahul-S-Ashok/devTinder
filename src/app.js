require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// --------------------
// Middlewares
// --------------------
app.use(
  cors({
    origin: "http://localhost:5173", // change later to domain
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// --------------------
// Routes
// --------------------
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

// --------------------
// Server + DB (CORRECT WAY)
// --------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

connectDB()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
