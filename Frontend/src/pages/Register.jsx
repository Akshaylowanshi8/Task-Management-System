import React, { useState } from "react";
import API from "../api/axios";
import "./css/Register.css";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", 
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("User registered ");
      navigate(-1)
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
 <form className="register-form" onSubmit={handleSubmit}>
  <h2>Register User</h2>
  <input
    name="username"
    placeholder="Username"
    onChange={handleChange}
  />
  <input name="email" placeholder="Email" onChange={handleChange} />
  <input
    name="password"
    type="password"
    placeholder="Password"
    onChange={handleChange}
  />
  <select name="role" value={form.role} onChange={handleChange}>
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>

  <div className="task-actions">
    <button
      type="button"
      className="btn back"
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
    <button type="submit">Register</button>
  </div>
</form>

  );
};

export default Register;
