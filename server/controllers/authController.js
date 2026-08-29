const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// CREATE JWT TOKEN
// ==========================================

const signToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

// ==========================================
// SAFE USER DATA
// ==========================================

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  bio: user.bio || "",
});

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();

    const username = req.body.username
      ?.trim()
      .toLowerCase();

    const email = req.body.email
      ?.trim()
      .toLowerCase();

    const password = req.body.password;

    // Required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message:
          "Name, username, email and password are required",
      });
    }

    // Username validation
    if (username.length < 3) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters",
      });
    }

    if (username.length > 30) {
      return res.status(400).json({
        message:
          "Username cannot be more than 30 characters",
      });
    }

    // Only allow letters, numbers and underscore
    const usernamePattern = /^[a-z0-9_]+$/;

    if (!usernamePattern.test(username)) {
      return res.status(400).json({
        message:
          "Username can only contain letters, numbers and underscores",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // Check email
    const emailExists = await User.exists({
      email,
    });

    if (emailExists) {
      return res.status(409).json({
        message:
          "An account with this email already exists",
      });
    }

    // Check username
    const usernameExists = await User.exists({
      username,
    });

    if (usernameExists) {
      return res.status(409).json({
        message:
          "This username is already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      bio: "",
    });

    // Send response
    res.status(201).json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    // MongoDB duplicate field error
    if (error.code === 11000) {
      const field = Object.keys(
        error.keyPattern || {}
      )[0];

      return res.status(409).json({
        message:
          field === "username"
            ? "This username is already taken"
            : "An account with this email already exists",
      });
    }

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

const login = async (req, res) => {
  try {
    const email = req.body.email
      ?.trim()
      .toLowerCase();

    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    res.status(200).json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// ==========================================
// CURRENT LOGGED-IN USER
// GET /api/auth/me
// ==========================================

const me = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(
      publicUser(user)
    );
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch user information",
    });
  }
};

module.exports = {
  register,
  login,
  me,
};