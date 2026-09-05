const express = require("express");
const multer = require("multer");

const {
  createPost,
  getAllPosts,
  likePost,
  addComment,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

// Create post
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  createPost
);

// Get all posts
router.get("/", getAllPosts);

// Like / Unlike post
router.post("/:id/like", authMiddleware, likePost);

// Add comment
router.post("/:id/comment", authMiddleware, addComment);

module.exports = router;