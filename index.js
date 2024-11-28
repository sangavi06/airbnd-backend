require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// connect with database
connectWithDB();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// For handling cookies
app.use(cookieParser());

// Initialize cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin cookies in production
    httpOnly: true, // Makes the cookie accessible only on the server-side
  })
);

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Frontend live URL
    credentials: true, // Allow cookies in requests
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Use express router
app.use("/", require("./routes"));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, (err) => {
  if (err) {
    console.error("Error in connecting to server: ", err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});

module.exports = app;
