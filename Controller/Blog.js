const Blog = require("../Models/Blog");
const imageUpload = require("./ImgUpload");
const videoUpload = require("./VideoUpload");
const cloudinary = require("cloudinary").v2;

// Add a new Blog
// const addBlog = async (req, res) => {
//   console.log(req.body);
//   console.log(req.files);
//   try {
//     const blog = req.body;
//     const blogFile = req.files;

//     if (blogFile?.img && blogFile?.videoFile) {
//       // console.log(blogFile.img);
//       const imgurl = await imageUpload.imageUpload(blogFile.img);
//       console.log("response as secure url for image " + imgurl);
//       const videourl = await videoUpload.videoFileUpload(blogFile.videoFile);
//       console.log("response as secure url for video " + videourl);
//       const response = await Blog.create({
//         Title: blog.title,
//         Content: blog.content,
//         Video: videourl,
//         Img: imgurl,
//       });
//       console.log(response);
//       res.status(200).json({ resonse: "Blog created successfully" });
//       return;
//     }

//     if (blogFile?.img || blogFile?.videoFile) {
//       if (blogFile?.img) {
//         const imgurl = await imageUpload.imageUpload(blogFile.img);
//         console.log("response as secure url for image " + imgurl);

//         const response = await Blog.create({
//           Title: blog.title,
//           Content: blog.content,
//           Img: imgurl,
//         });
//         console.log(response);
//       }
//       if (blogFile?.videoFile) {
//         const videourl = await videoUpload.videoFileUpload(blogFile.videoFile);
//         console.log("response as secure url for video " + videourl);

//         const response = await Blog.create({
//           Title: blog.title,
//           Content: blog.content,
//           Video: videourl,
//         });
//         console.log(response);
//       }
//       res.status(200).json({ resonse: "Blog created successfully" });
//       return;
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err });
//   }
// };

const addBlog = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  try {
    const blog = req.body;
    const blogFile = req.files;

    let imgurl = blog.imageUrl || null; // Check if image URL is provided in the request body
    let videourl = null;

    // If image file is uploaded, override the imageUrl with the uploaded image URL
    if (blogFile?.img) {
      imgurl = await imageUpload.imageUpload(blogFile.img);
      console.log("response as secure url for image " + imgurl);
    }

    // If video file is uploaded, process it
    if (blogFile?.videoFile) {
      videourl = await videoUpload.videoFileUpload(blogFile.videoFile);
      console.log("response as secure url for video " + videourl);
    }

    // Now, proceed with blog creation using either the uploaded files or the URL
    const response = await Blog.create({
      Title: blog.title,
      Content: blog.content,
      Img: imgurl, // Will either be the image URL provided by user or the uploaded file URL
      Video: videourl, // Only included if a video file is uploaded
      category: blog.category, // Include the category field
      userId: blog.userId, // Include the userId field
    });

    console.log(response);
    res.status(200).json({ message: "Blog created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// geting all Blog

const getBlogs = async (req, res) => {
  try {
    const blog = await Blog.find({}).populate("userId");
    console.log(blog);
    res.status(200).json({ response: blog });
    console.log("come back");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

// get a Blog

const getBlogById = async (req, res) => {
  try {
    const blodId = req.params.blogId;
    const blog = await Blog.findById(blodId).populate("userId");
    res.status(200).json({ response: blog });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// update a product

// Function to delete a media asset by its public ID
async function deleteMedia(publicId, type) {
  try {
    console.log("public id is " + publicId);
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: type,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = req.body;
    const blogFile = req.files;

    // if image and video both are in the document
    if (blogFile?.img && blogFile?.videoFile) {
      // Finding particular blog
      const dbblog = await Blog.findById(blogId);

      // Extracting image url
      const oldImgUrl = dbblog.Img;

      // Extract public ID from the URL
      const ImageMatch = oldImgUrl.split("/");
      const ImagePublicId = ImageMatch[7] + "/" + ImageMatch[8].split(".")[0];
      // console.log(ImagePublicId);

      // deleting old image
      await deleteMedia(ImagePublicId, "image")
        .then((result) => {
          console.log("Media deleted successfully:", result);
        })
        .catch((error) => {
          console.error("Error deleting media:", error);
        });

      // Extracting video url
      const oldVideoUrl = dbblog.Video;

      // Extract public ID from the URL
      const VideoMatch = oldVideoUrl.split("/");
      const VideoPublicId = VideoMatch[7] + "/" + VideoMatch[8].split(".")[0];
      // console.log(VideoPublicId);

      // deleting old video
      await deleteMedia(VideoPublicId, "video")
        .then((result) => {
          console.log("Media deleted successfully:", result);
        })
        .catch((error) => {
          console.error("Error deleting media:", error);
        });

      const imgurl = await imageUpload.imageUpload(blogFile.img);
      console.log("response as secure url for image " + imgurl);
      const videourl = await videoUpload.videoFileUpload(blogFile.videoFile);
      console.log("response as secure url for video " + videourl);
      const response = await Blog.findByIdAndUpdate(blogId, {
        Title: blog.title,
        Content: blog.content,
        Video: videourl,
        Img: imgurl,
      });
      console.log(response);
      res.status(200).json({ resonse: "Blog updated successfully" });
      return;
    }

    // if eiter a video or a image is in the document
    if (blogFile?.img || blogFile?.videoFile) {
      // if only image is in document
      if (blogFile?.img) {
        // Finding particular blog
        const dbblog = await Blog.findById(blogId);

        // Extracting image url
        const oldImgUrl = dbblog.Img;

        // Extract public ID from the URL
        const ImageMatch = oldImgUrl.split("/");
        const ImagePublicId = ImageMatch[7] + "/" + ImageMatch[8].split(".")[0];
        // console.log(ImagePublicId);

        // deleting old image
        await deleteMedia(ImagePublicId, "image")
          .then((result) => {
            console.log("Media deleted successfully:", result);
          })
          .catch((error) => {
            console.error("Error deleting media:", error);
          });

        const imgurl = await imageUpload.imageUpload(blogFile.img);
        console.log("response as secure url for image " + imgurl);

        const response = await Blog.findByIdAndUpdate(
          blogId,
          {
            Title: blog.title,
            Content: blog.content,
            Img: imgurl,
          },
          {
            new: true,
          }
        );
        console.log(response);
        res.status(200).json({ resonse: "Blog updated successfully" });
        return;
      }

      // if only video is in document
      if (blogFile?.videoFile) {
        // Finding particular blog
        const dbblog = await Blog.findById(blogId);

        // Extracting video url
        const oldVideoUrl = dbblog.Video;

        // Extract public ID from the URL
        const VideoMatch = oldVideoUrl.split("/");
        const VideoPublicId = VideoMatch[7] + "/" + VideoMatch[8].split(".")[0];
        // console.log(VideoPublicId);

        // deleting old video
        await deleteMedia(VideoPublicId, "video")
          .then((result) => {
            console.log("Media deleted successfully:", result);
          })
          .catch((error) => {
            console.error("Error deleting media:", error);
          });

        const videourl = await videoUpload.videoFileUpload(blogFile.videoFile);
        console.log("response as secure url for video " + videourl);
        const response = await Blog.findByIdAndUpdate(blogId, {
          Title: blog.title,
          Content: blog.content,
          Video: videourl,
        });
        console.log(response);
        res.status(200).json({ resonse: "Blog updated successfully" });
        return;
      }
      res.status(200).json({ resonse: "Blog created successfully" });
      return;
    }

    res.status(200).json({ res: "Blog updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// delete a blog

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const dbblog = await Blog.findById(blogId);

    // if image and video both are in the document
    if (dbblog?.Img && dbblog?.Video) {
      // Extracting image url
      const oldImgUrl = dbblog.Img;

      // Extract public ID from the URL
      const ImageMatch = oldImgUrl.split("/");
      const ImagePublicId = ImageMatch[7] + "/" + ImageMatch[8].split(".")[0];
      // console.log(ImagePublicId);

      // deleting old image
      await deleteMedia(ImagePublicId, "image")
        .then((result) => {
          console.log("Media deleted successfully:", result);
        })
        .catch((error) => {
          console.error("Error deleting media:", error);
        });

      // Extracting video url
      const oldVideoUrl = dbblog.Video;

      // Extract public ID from the URL
      const VideoMatch = oldVideoUrl.split("/");
      const VideoPublicId = VideoMatch[7] + "/" + VideoMatch[8].split(".")[0];
      // console.log(VideoPublicId);

      // deleting old video
      await deleteMedia(VideoPublicId, "video")
        .then((result) => {
          console.log("Media deleted successfully:", result);
        })
        .catch((error) => {
          console.error("Error deleting media:", error);
        });

      await Blog.findByIdAndDelete(dbblog._id);
      res.status(200).json({ res: "Blog deleted successfully" });
      return;
    }

    // if eiter a video or a image is in the document
    if (dbblog?.Img || dbblog?.Video) {
      // if only image is in document
      if (dbblog?.Img) {
        // Extracting image url
        const oldImgUrl = dbblog.Img;

        // Extract public ID from the URL
        const ImageMatch = oldImgUrl.split("/");
        const ImagePublicId = ImageMatch[7] + "/" + ImageMatch[8].split(".")[0];
        // console.log(ImagePublicId);

        // deleting old image
        await deleteMedia(ImagePublicId, "image")
          .then((result) => {
            console.log("Media deleted successfully:", result);
          })
          .catch((error) => {
            console.error("Error deleting media:", error);
          });
        await Blog.findByIdAndDelete(dbblog._id);
        res.status(200).json({ res: "Blog deleted successfully" });
        return;
      }

      // if only video is in document
      if (dbblog?.Video) {
        // Extracting video url
        const oldVideoUrl = dbblog.Video;

        // Extract public ID from the URL
        const VideoMatch = oldVideoUrl.split("/");
        const VideoPublicId = VideoMatch[7] + "/" + VideoMatch[8].split(".")[0];
        // console.log(VideoPublicId);

        // deleting old video
        await deleteMedia(VideoPublicId, "video")
          .then((result) => {
            console.log("Media deleted successfully:", result);
          })
          .catch((error) => {
            console.error("Error deleting media:", error);
          });

        await Blog.findByIdAndDelete(dbblog._id);
        res.status(200).json({ res: "Blog deleted successfully" });
        return;
      }
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// fatching featured product

const featuredProduct = async (req, res) => {
  try {
    const products = await Product.find({ feature: true });
    res.status(200).json({ response: products });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// product with less than certain price

const lessThanPrice = async (req, res) => {
  try {
    const price = req.params.price;
    const products = await Product.find({ price: { $lt: price } });
    res.status(200).json({ response: products });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// product rating higher then certain value

const ratingGreaterThan = async (req, res) => {
  try {
    const rating = req.params.rating;
    const products = await Product.find({ rating: { $gt: rating } });
    res.status(200).json({ response: products });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = {
  addBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  featuredProduct,
  lessThanPrice,
  ratingGreaterThan,
};
