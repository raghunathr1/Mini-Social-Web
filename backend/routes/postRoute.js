const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createPost,
  getAllPosts,
  likePost,
  addComment,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

// Create Post
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  createPost
);

// Get All Posts
router.get("/", getAllPosts);

// Like / Unlike
router.post(
  "/:id/like",
  authMiddleware,
  likePost
);

// Add Comment
router.post(
  "/:id/comment",
  authMiddleware,
  addComment
);

module.exports = router;