import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:8080"; // your backend URL

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const endpoint = isSignUp ? "/api/signup" : "/api/login";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Authentication failed.");

      // Success — store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);

      alert(isSignUp ? "Account created successfully!" : "Login successful!");

      // Redirect to symptom checker page
      navigate("/symptom-checker");

      // Success — store token/user ID and update auth context
      localStorage.setItem("userId", data.userId);
      login(data); // Update auth context
      
      alert(isSignUp ? "Account created successfully!" : "Login successful!");
      
      // Redirect to homepage
      navigate("/home");

    } catch (err) {
      alert(err.message);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <header className="auth-header">
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      </header>

      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="auth-field">
              <label htmlFor="name">Name</label>
              <input
                placeholder="Enter your name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              placeholder="Enter your email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              placeholder="Enter your password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Login"}
          </button>

          <p className="auth-toggle">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>
      </main>
    </div>
  );
}