const User = require("../Models/user");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const createToken = (_id) => {
  return jwt.sign(
    { _id },
    process.env.SECRET || "yguihkndeuiwkjsbnilwehsbdjnnc798082ohjbnm",
    { expiresIn: "3d" }
  );
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const username = user.username;
    //create a token
    const token = createToken(user._id);
    res.status(200).json({ username, token, userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup
const Signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    // create a token
    const token = createToken(user._id);
    res.status(200).json({ username, token, userId: user._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
};

module.exports = { login, Signup, getUser };
