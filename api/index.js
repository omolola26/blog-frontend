const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/post");
const categoryRoute = require("./routes/categories");
const multer = require("multer")
const cors = require("cors")

dotenv.config();
app.use(express.json());
app.use(cors());
mongoose.connect(
  "mongodb+srv://testing12:testing12@cluster0.iplfc.mongodb.net/second?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: false,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));
module.exports = mongoose;

const storage = multer.diskStorage({
  destination:(req, file, cb) =>{
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"), (req,res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/post", postRoute)
app.use("/api/categories", categoryRoute)
app.listen("5000", () => {
  console.log("Backend is running");

});
