if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

const routes = require("./Routes/Blog");
const user = require("./Routes/user");
const database = require("./Config/database");
const cloudinary = require("./Config/cloudinary");

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

database();
cloudinary.cloudinaryConnect();

app.use("/api/v1", user);
app.use("api/v1", routes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});
