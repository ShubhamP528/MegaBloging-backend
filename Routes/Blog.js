const express = require("express");
const router = express.Router();
const requireAuth = require("../middlerware/requireAuth");

const {
  addBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  featuredProduct,
  lessThanPrice,
  ratingGreaterThan,
} = require("../Controller/Blog");

router.get("/hii", (req, res) => {
  console.log("done");
});

router.get("/blogs", getBlogs);

router.post("/blog", addBlog);

router.get("/blog/:blogId", getBlogById);

router.patch("/blog/:blogId", updateBlog);

router.delete("/blog/:blogId", deleteBlog);

router.get("/featuredProduct", requireAuth, featuredProduct);

router.get("/lessThanPrice/:price", requireAuth, lessThanPrice);

router.get("/ratingGreaterThan/:rating", requireAuth, ratingGreaterThan);

module.exports = router;
