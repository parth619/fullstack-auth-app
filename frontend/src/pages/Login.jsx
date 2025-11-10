// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ login: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const { state } = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // ALWAYS use email for login since most users don't have usernames
      const loginData = { 
        email: form.login, 
        password: form.password 
      };
      
      console.log("Sending login data:", loginData);
      
      await login(loginData);
      nav(state?.from?.pathname || "/");
    } catch (e) {
      console.error("Login error:", e);
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="grid" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <p className="muted" style={{ marginTop: -8 }}>Log in with your email</p>
        <form onSubmit={submit} className="grid">
          <label>Email</label>
          <input 
            className="input" 
            type="email" 
            required
            placeholder="Enter your email"
            value={form.login} 
            onChange={e => setForm({...form, login: e.target.value})}
          />
          <label>Password</label>
          <input 
            className="input" 
            type="password" 
            required
            placeholder="Enter your password"
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})}
          />
          {err && (
            <div className="badge" style={{borderColor:"#5b1f2a", background:"#2a0e14", color:"#ff99a8"}}>
              {err}
            </div>
          )}
          <button className="pill" type="submit">Log in</button>
        </form>
        <p className="muted" style={{marginTop:12}}>
          New here? <Link className="link" to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}