const Post = require("../models/Post");
const User = require("../models/User");

// Create Post
const createPost = async (req, res) => {
  try {
    const text = req.body.text;

    // Uploaded image ka path
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    // Text aur image dono empty nahi hone chahiye
    if (!text || !text.trim()) {
      if (!req.file) {
        return res.status(400).json({
          message: "Please provide text or image",
        });
      }
    }

    // Logged-in user middleware se milega
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const post = new Post({
      userId: user._id,
      username: user.email,
      text: text ? text.trim() : "",
      image: image,
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Like / Unlike Post
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (like) =>
        like.userId.toString() === user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (like) =>
          like.userId.toString() !== user._id.toString()
      );
    } else {
      // Like
      post.likes.push({
        userId: user._id,
        username: user.email,
      });
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked
        ? "Post unliked"
        : "Post liked",
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Add comment to post
const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    post.comments.push({
      userId: user._id,
      username: user.email,
      text: text.trim(),
    });

    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      commentsCount: post.comments.length,
      comment:
        post.comments[post.comments.length - 1],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment,
};