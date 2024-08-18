if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./Routes/Blog");
const user = require("./Routes/user");
const corn = require("./Routes/corn");
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

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://bookmanagement528.netlify.app/",
      "https://book-management-frontend-wheat.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://js.stripe.com",
        "blob:",
      ],
      connectSrc: ["'self'", "https://api.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

database();
cloudinary.cloudinaryConnect();

app.use("/api/v1", user);
app.use("/api/v1", routes);
app.use("/api/v1", corn);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});
