import { useRef, useState } from "react";
import "./CreatePost.css";
import { IoCameraSharp } from "react-icons/io5";
import { MdSend } from "react-icons/md";
import { MdWrongLocation } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const MAX_CHARACTERS = 500;

  // IMAGE SELECT

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    setError("");
    setMessage("");

    setImageFile(file);

    const previewURL = URL.createObjectURL(file);

    setImagePreview(previewURL);
  };

  // REMOVE IMAGE

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // TEXT CHANGE

  const handleTextChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_CHARACTERS) {
      setText(value);
    }
  };

  // CREATE POST

  const handleCreatePost = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Text and image both empty
    if (!text.trim() && !imageFile) {
      setError("Please enter text or select an image");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("text", text.trim());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`${API_URL}/api/posts/create`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create post");
        return;
      }

      // Success
      setMessage("Post created successfully!");

      setText("");

      handleRemoveImage();

      // Refresh feed
      if (onPostCreated) {
        onPostCreated(data.post);
      }
    } catch (err) {
      console.log(err);

      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // GET CURRENT USER

  let user = {};

  try {
    const storedUser = localStorage.getItem("user");

    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (err) {
    console.log("Invalid user data");
  }

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="create-post-card">

      <div className="create-post-header">
        <div className="create-avatar">{userInitial}</div>

        <div>
          <h2>Create a Post</h2>

          <p>Share something with the community</p>
        </div>
      </div>

      {/* 
          FORM
      */}

      <form onSubmit={handleCreatePost}>
  
        <div className="textarea-wrapper">
          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            value={text}
            onChange={handleTextChange}
            rows="4"
            maxLength={MAX_CHARACTERS}
          />

          <div className="character-count">
            {text.length} / {MAX_CHARACTERS}
          </div>
        </div>

        {/* 
            IMAGE PREVIEW
       */}

        {imagePreview && (
          <div className="image-preview-container">
            <img
              src={imagePreview}
              alt="Selected preview"
              className="image-preview"
            />

            <button
              type="button"
              className="remove-image-btn"
              onClick={handleRemoveImage}
            >
              <MdWrongLocation />
            </button>
          </div>
        )}

        {/* 
            FOOTER
        */}

        <div className="create-post-footer">
          <label className="image-upload">
            <span><IoCameraSharp /></span>
            Add Image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <button className="post-button" type="submit" disabled={loading}>
          <MdSend />  {loading ? "Posting..." :  "Post"}
          </button>
        </div>

        {/*
            ERROR
        */}

        {error && <p className="create-error">{error}</p>}

        {/*
            SUCCESS
        */}

        {message && <p className="create-success">{message}</p>}
      </form>
    </div>
  );
}

export default CreatePost;
