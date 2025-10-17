import React, { useState } from "react";
import "./AuthPage.css"; // Reuse existing styles

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const endpoint = isSignUp ? "/api/signup" : "/api/login";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Auth response:", data);
        // Redirect or store token here
      })
      .catch(err => console.error("Auth error:", err));
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      </header>

      <main className="chat-main" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
                <div className="auth-field">
                <label htmlFor="name">Name</label>
                <input
                    placeholder="Enter your Name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input"
                    required
                />
                </div>
            )}

            <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                placeholder="Enter your Email"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                required
                />
            </div>

            <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                placeholder="Enter your Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                required
                />
            </div>

            <button type="submit" className="auth-button">
                {isSignUp ? "Create Account" : "Login"}
            </button>

            <p className="auth-toggle">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <span onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Login" : "Sign Up"}
                </span>
            </p>
        </form>
      </main>
    </div>
  );
}