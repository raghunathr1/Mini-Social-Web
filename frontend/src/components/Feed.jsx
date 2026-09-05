import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import "./Feed.css";
import { SiLibreofficewriter } from "react-icons/si";
import { FcLike } from "react-icons/fc";
import { MdOutlineComment } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { MdWrongLocation } from "react-icons/md";
import { GrLogout } from "react-icons/gr";

const API_URL = import.meta.env.VITE_API_URL;

function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (err) {
    console.log("Invalid user data");
  }

  // FETCH ALL POSTS

  const fetchPosts = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/posts`);

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to fetch posts");
        return;
      }

      setPosts(data.posts || []);
    } catch (err) {
      console.log(err);

      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // CHECK IF CURRENT USER LIKED

  const isPostLiked = (post) => {
    return post.likes?.some(
      (like) => like.userId === user.id || like.userId?._id === user.id,
    );
  };

  // LIKE / UNLIKE

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to like post");
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: data.likes || [],
              }
            : post,
        ),
      );

      setError("");
    } catch (err) {
      console.log(err);

      setError("Unable to connect to server");
    }
  };

  // ADD COMMENT

  const handleComment = async (postId) => {
    const token = localStorage.getItem("token");

    const text = commentText[postId] || "";

    if (!token) {
      navigate("/login");
      return;
    }

    if (!text.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to add comment");
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, data.comment],
              }
            : post,
        ),
      );

      setCommentText((current) => ({
        ...current,
        [postId]: "",
      }));

      setError("");
    } catch (err) {
      console.log(err);

      setError("Unable to connect to server");
    }
  };

  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // FOCUS COMMENT INPUT

  const focusCommentInput = (postId) => {
    document.getElementById(`comment-${postId}`)?.focus();
  };

  // FETCH POSTS ON PAGE LOAD

  useEffect(() => {
    fetchPosts();
  }, []);

  // LOADING

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>

        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="feed-page">
      {/* 
          NAVBAR
      */}

      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">TaskPlanet</div>
        </div>

        <div className="navbar-center">
          <span>Social Feed</span>
        </div>

        <div className="navbar-right">
          <div className="user-profile">
            <div className="navbar-avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="user-info">
              <strong>{user.email || "User"}</strong>

              <span>TaskPlanet Member</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
          <GrLogout />  Logout 
          </button>
        </div>
      </nav>

      {/* 
          MAIN FEED
      */}

      <main className="feed-container">
        <div className="feed-heading">
          <h1>Social Feed</h1>

          <p>Share your thoughts with the community.</p>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            <span>{error}</span>

            <button onClick={() => setError("")}><MdWrongLocation /></button>
          </div>
        )}

        {/* CREATE POST */}

        <CreatePost onPostCreated={fetchPosts} />

        {/* 
            POSTS
        */}

        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-posts">
              <div className="empty-icon"><SiLibreofficewriter /></div>

              <h3>No posts yet</h3>

              <p>Be the first one to share something with the community!</p>
            </div>
          ) : (
            posts.map((post) => (
              <article className="post-card" key={post._id}>
                {/*
                    POST USER
                */}

                <div className="post-user">
                  <div className="avatar">
                    {post.username?.charAt(0).toUpperCase()}
                  </div>

                  <div className="post-user-info">
                    <h3>{post.username}</h3>

                    <span>TaskPlanet User</span>
                  </div>
                </div>

                {/* 
                    POST TEXT
                */}

                {post.text && <p className="post-text">{post.text}</p>}

                {/*
                    POST IMAGE
                */}

                {post.image && (
                  <img
                    className="post-image"
                    src={`${API_URL}${post.image}`}
                    alt="Post"
                  />
                )}

                {/*
                    POST STATS
                */}

                <div className="post-stats">
                  <div className="like-info">
                    <span className="like-count">
                      <FcLike /> {post.likes?.length || 0}{" "}
                      {(post.likes?.length || 0) === 1 ? "Like" : "Likes"}
                    </span>

                    {post.likes?.length > 0 && (
                      <span className="liked-users">
                        {post.likes
                          .slice(0, 2)
                          .map((like) => like.username)
                          .join(", ")}

                        {post.likes.length > 2 && (
                          <> and {post.likes.length - 2} others</>
                        )}
                      </span>
                    )}
                  </div>

                  <span className="comment-count">
                    <MdOutlineComment /> {post.comments?.length || 0}{" "}
                    {(post.comments?.length || 0) === 1
                      ? "Comment"
                      : "Comments"}
                  </span>
                </div>

                {/* 
                    POST ACTIONS
                */}

                <div className="post-actions">
                  <button
                    className={isPostLiked(post) ? "liked-btn" : ""}
                    onClick={() => handleLike(post._id)}
                  >
                    {isPostLiked(post) ? <FcLike /> : <FaRegHeart />} Like
                  </button>

                  <button onClick={() => focusCommentInput(post._id)}>
                    <MdOutlineComment /> Comment
                  </button>
                </div>

                {/* 
                    COMMENT INPUT
                */}

                <div className="comment-box">
                  <input
                    id={`comment-${post._id}`}
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((current) => ({
                        ...current,
                        [post._id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment(post._id);
                      }
                    }}
                  />

                  <button onClick={() => handleComment(post._id)}><MdSend />Post</button>
                </div>

                {/* 
                    COMMENTS
               */}

                {post.comments?.length > 0 && (
                  <div className="comments">
                    {post.comments.map((comment) => (
                      <div className="comment" key={comment._id}>
                        <div className="comment-avatar">
                          {comment.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="comment-content">
                          <strong>{comment.username}</strong>

                          <p>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Feed;
