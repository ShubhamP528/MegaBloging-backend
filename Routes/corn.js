const express = require("express");
const router = express.Router();

const { contact } = require("../Controller/corn");

router.post("/contact", contact);

module.exports = router;
