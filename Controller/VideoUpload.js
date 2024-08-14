const cloudinary = require("cloudinary").v2;

function isFileTypeSupported(type, supportedType) {
  return supportedType.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) options.quality = quality;
  options.resource_type = "auto"; // used in video upload
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.videoFileUpload = async (file) => {
  try {
    // validation
    const supportedType = ["mp4", "mov", "3gp"];
    const supportedMaxSizeMB = 100; // Maximum file size allowed in megabytes
    const fileType = file.name.split(".")[1].toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024); // Converting file size to megabytes

    console.log("File type is => ", fileType);
    console.log("File size is => ", fileSizeMB);

    if (!isFileTypeSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "File type is not supported",
      });
    }

    if (fileSizeMB > supportedMaxSizeMB) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the maximum allowed limit",
      });
    }

    // file type and size supported
    const response = await uploadFileToCloudinary(file, "Blogs");
    console.log(response);
    console.log("inside imgUpload " + response.secure_url);
    return response.secure_url;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
