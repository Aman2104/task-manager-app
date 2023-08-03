import React, { useState } from "react";
import "../styles/Registration.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        props.storeTokenInCookie(token);
        props.verify();
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please try again later.");
      }
    } catch (error) {
      console.log(error);
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit">Login</button>
          <div style={{ textAlign: "center" }}>
            <Link to="/register">Not Registered?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
