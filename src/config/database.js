const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://rahulashok:rahulashok1234@cluster0.voxxk1z.mongodb.net/devtinderDB?retryWrites=true&w=majority&appName=Cluster0");
  console.log("✅ MongoDB Atlas connected successfully!");
};

module.exports = connectDB;
