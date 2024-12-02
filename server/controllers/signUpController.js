const bcrypt = require("bcrypt");
const userCredential = require("../models/userSchema.js");

const signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const signUpUserCredentials = new userCredential({
      username: username,
      password: hashedPassword,
    });
    await signUpUserCredentials.save();

    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    res.status(500).json({ error: "user creation failed" });
  }
};

module.exports = { signUp };
