const express = require("express");
const router = express.Router();

// user Controller
const { login, Signup, getUser } = require("../Controller/user");
const requireAuth = require("../middlerware/requireAuth");

// login
router.post("/login", login);

//signup
router.post("/signup", Signup);

// getUser

router.post("/getUser", requireAuth, getUser);

module.exports = router;
