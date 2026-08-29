const User = require("../models/User");
const Trip = require("../models/Trip");

// ==========================================
// GET PUBLIC PROFILE
// GET /api/users/:username/profile
// PUBLIC
// ==========================================

const getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username
      ?.trim()
      .toLowerCase();

    const user = await User.findOne({
      username,
    }).select("name username bio");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const trips = await Trip.find({
      user: user._id,
    })
      .select(
        "title destination startDate endDate rating coverImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio || "",
      },
      trips,
    });
  } catch (error) {
    console.error(
      "Public profile error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load public profile",
    });
  }
};

// ==========================================
// UPDATE OWN PROFILE
// PUT /api/users/profile
// PRIVATE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const name =
      req.body.name?.trim();

    const username =
      req.body.username
        ?.trim()
        .toLowerCase();

    const bio =
      req.body.bio?.trim();

    if (
      name !== undefined &&
      !name
    ) {
      return res.status(400).json({
        message:
          "Name cannot be empty",
      });
    }

    if (
      username !== undefined
    ) {
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

      const usernamePattern =
        /^[a-z0-9_]+$/;

      if (
        !usernamePattern.test(
          username
        )
      ) {
        return res.status(400).json({
          message:
            "Username can only contain letters, numbers and underscores",
        });
      }

      const existingUser =
        await User.findOne({
          username,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "This username is already taken",
        });
      }

      user.username = username;
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    const updatedUser =
      await user.save();

    res.status(200).json({
      message:
        "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username:
          updatedUser.username,
        email: updatedUser.email,
        bio:
          updatedUser.bio || "",
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "This username is already taken",
      });
    }

    res.status(500).json({
      message:
        "Failed to update profile",
    });
  }
};

module.exports = {
  getPublicProfile,
  updateProfile,
};