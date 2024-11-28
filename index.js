require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// Connect to the database
connectWithDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Parse cookies
app.use(cookieParser());

// Initialize cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production", // Only secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust based on environment
    httpOnly: true, // Prevent client-side access to the cookie
  })
);

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Frontend URL
    credentials: true, // Include cookies in CORS
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

// Load routes
app.use("/", require("./routes"));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  }
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
