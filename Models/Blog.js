const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Img: {
    type: String,
  },
  Video: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Technology", "Lifestyle", "Education", "Health", "Entertainment"], // Add or modify categories as needed
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to a User model
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
