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
    origin: "http://3.111.150.62", // frontend domain
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// --------------------
// Routes
// --------------------
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/request", require("./routes/request"));
app.use("/user", require("./routes/user"));

// --------------------
// Server + DB (CORRECT ORDER)
// --------------------
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
