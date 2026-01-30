require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

require("./utils/cronjob");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://3.111.150.62"],
    credentials: true,
  })
);

// ✅ RAW body ONLY for Razorpay webhook
app.use("/payment/webhook", express.raw({ type: "application/json" }));

// ✅ Normal middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/request", require("./routes/request"));
app.use("/user", require("./routes/user"));
app.use("/payment", require("./routes/payment"));

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  });