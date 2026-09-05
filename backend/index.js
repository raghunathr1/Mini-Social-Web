const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoute");

require("dotenv").config();

const app = express();

// Middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Static uploads folder

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Test Route

app.get("/", (req, res) => {
  res.send("TaskPlanet Backend is Running");
});

// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
  });