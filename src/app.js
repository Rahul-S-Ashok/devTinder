require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initSocket = require("./utils/socket");

const app = express();
const server = http.createServer(app);

require("./utils/cronjob");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://3.111.150.62"],
    credentials: true,
  })
);

app.use("/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/request", require("./routes/request"));
app.use("/user", require("./routes/user"));
app.use("/payment", require("./routes/payment"));
app.use("/", require("./routes/chat"));

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  initSocket(server);
  server.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
