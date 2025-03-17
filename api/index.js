import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './src/config/db.js';
import authRoute from "./src/routes/auth.js";
import userRoute from "./src/routes/users.js";
import postRoute from "./src/routes/posts.js";
import categoryRoute from "./src/routes/categories.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname)).replace(/^\/([A-Za-z]:\/)/, '$1');

const imagesPath = path.join(__dirname, "src", "images");
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });  // 🔥 Fix: Create directory properly
}


app.use("/images", express.static(imagesPath));

connectDB();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, imagesPath);  // Save uploaded files in `src/images`
  },
  filename: (req, file, cb) => {
      const uniqueFilename = req.body.name;
      cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    fs.access(req.file.path, fs.constants.F_OK, (err) => {
      if (err) {
          console.error("File was not saved properly:", err);
      } else {
          console.log("File saved successfully:", req.file.path);
      }
    });
    res.status(200).json({ message: "File has been uploaded", file: req.file.filename });
});

const port = 5000;
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(port, () => {
    console.log("Server has started on port:", port);
});
