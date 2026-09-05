import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Email validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create account");
        return;
      }

      setMessage("Account created successfully!");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log(err);

      setError("Unable to connect to server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Branding */}
        <div className="auth-brand">
          <div className="brand-icon">T</div>

          <h1>TaskPlanet</h1>

          <p>Connect. Share. Engage.</p>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Create your account</h2>

          <p>
            Join TaskPlanet and start sharing with the community.
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSignup}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <small>
              Password must contain at least 6 characters.
            </small>
          </div>

          {/* Error */}
          {error && <div className="auth-error">{error}</div>}

          {/* Success */}
          {message && (
            <div className="auth-success">{message}</div>
          )}

          {/* Submit */}
          <button className="auth-submit" type="submit">
            Create Account
          </button>
        </form>

        {/* Login */}
        <div className="auth-switch">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;