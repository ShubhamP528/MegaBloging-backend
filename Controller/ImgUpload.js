const cloudinary = require("cloudinary").v2;

function isFileTypeSupported(type, supportedType) {
  return supportedType.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) options.quality = quality;
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (file) => {
  try {
    const supportedType = ["jpg", "jpeg", "png"];

    const FileType = file.name.split(".")[1].toLowerCase();

    console.log("FileType: " + FileType);

    // Checking if file type not supported
    if (!isFileTypeSupported(FileType, supportedType)) {
      return res
        .status(400)
        .json({ success: false, message: "File type not supported" });
    }

    // if file type is supported
    const response = await uploadFileToCloudinary(file, "Blogs", 30);
    console.log(response);
    console.log("inside imgUpload " + response.secure_url);
    return response.secure_url;
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
};
