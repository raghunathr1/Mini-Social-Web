import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { RiLoginCircleFill } from "react-icons/ri";
import { MdAccountBox } from "react-icons/md";
import { SiWelcometothejungle } from "react-icons/si";
import { FaShareFromSquare } from "react-icons/fa6";
import { FcCameraAddon } from "react-icons/fc";
import { FcLike } from "react-icons/fc";

function LandingPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  return (
    <div className="landing-page">
      {/*
        NAVBAR
    */}

      <nav className="landing-navbar">
        <div className="landing-logo">
          <div className="landing-logo-icon">T</div>

          <span>TaskPlanet</span>
        </div>

        <div className="landing-nav-actions">
          {token ? (
            <button className="nav-login-btn" onClick={() => navigate("/feed")}>
              Go to Feed
            </button>
          ) : (
            <>
              <button
                className="nav-login-btn"
                onClick={() => navigate("/login")}
              >
                <RiLoginCircleFill />Login
              </button>

              <button
                className="nav-signup-btn"
                onClick={() => navigate("/signup")}
              >
               <MdAccountBox /> Create Account
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 
          HERO SECTION
    */}

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-badge"><SiWelcometothejungle /> Welcome to TaskPlanet</div>

          <h1>
            Connect.
            <span> Share.</span>
            <br />
            Engage.
          </h1>

          <p className="hero-description">
            Share your thoughts, post images, connect with the community, and
            discover what others are sharing.
          </p>

          <div className="hero-buttons">
            {token ? (
              <button
                className="hero-primary-btn"
                onClick={() => navigate("/feed")}
              >
                Go to Social Feed →
              </button>
            ) : (
              <>
                <button
                  className="hero-primary-btn"
                  onClick={() => navigate("/signup")}
                >
                 <MdAccountBox /> Create Account →
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={() => navigate("/login")}
                >
                 <RiLoginCircleFill /> Login
                </button>
              </>
            )}
          </div>
        </section>

        {/*         
            FEATURES
        */}

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon"><FaShareFromSquare /></div>

            <h3>Share Your Thoughts</h3>

            <p>Create posts and share your ideas with the community.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FcCameraAddon /></div>

            <h3>Share Images</h3>

            <p>Upload images and make your posts more engaging.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FcLike /></div>

            <h3>Like & Comment</h3>

            <p>Interact with posts through likes and comments.</p>
          </div>
        </section>
      </main>

    </div>
  );
}

export default LandingPage;
