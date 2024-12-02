const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCredential = require("../models/userSchema.js");

const JWT_SECRET = "testing1234";

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Search for the user in the collection by their username
    const user = await userCredential.findOne({ username: username });

    if (!user) {
      // If no user found with the provided username, send an appropriate response
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If the password does not match, return an unauthorized response
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create JWT token using user ID and username as payload
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // The token will expire in 1 hour
    );

    // If the password matches, return a success response along with the user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({ error: "Login failed due to server error" });
  }
};

module.exports = { loginController };
