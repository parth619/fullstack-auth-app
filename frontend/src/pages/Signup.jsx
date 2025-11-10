/* Set a Reddit-like red + black theme via CSS variables */
if (typeof window !== "undefined" && window.document && window.document.documentElement) {
  const root = window.document.documentElement;
  root.style.setProperty("--accent", "#ff4500"); // reddit orange/red
  root.style.setProperty("--bg", "#0b0b0b"); // near black background
  root.style.setProperty("--card", "#121212"); // dark card background
  root.style.setProperty("--text", "#ffffff"); // main text
  root.style.setProperty("--muted", "#bdbdbd"); // muted text
  root.style.setProperty("--border", "#2a2a2a"); // borders/dividers
  root.style.setProperty("--danger", "#ff99a8"); // error badge tint (keeps your existing badge color)
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,.55)", // modal overlay like Reddit
        padding: 16,
        zIndex: 50
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 24,
          borderRadius: 16,
          position: "relative"
        }}
      >
        <button
          aria-label="Close"
          onClick={() => nav(-1)}
          className="ghost"
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            width: 36,
            height: 36,
            borderRadius: 12,
            display: "grid",
            placeItems: "center"
          }}
        >
          ×
        </button>

        <h2 style={{ margin: "4px 0 6px", textAlign: "center" }}>Sign Up</h2>
        <p className="muted" style={{ textAlign: "center", margin: 0 }}>
          Join conversations that matter.
        </p>

        

        <Divider />

        {/* Minimal form (important bits only) */}
        <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
          <label>Name</label>
          <input
            className="input"
            placeholder="Your display name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Password</span>
            <button
              type="button"
              className="link"
              onClick={() => setShowPwd((s) => !s)}
              style={{ background: "transparent", border: 0, cursor: "pointer" }}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </label>
          <input
            className="input"
            type={showPwd ? "text" : "password"}
            placeholder="At least 6 characters"
            minLength={6}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {err && (
            <div
              className="badge"
              style={{
                borderColor: "#5b1f2a",
                background: "#2a0e14",
                color: "#ff99a8"
              }}
            >
              {err}
            </div>
          )}

          <button className="pill" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
          By continuing, you agree to our Terms and acknowledge the Privacy Policy.
        </p>

        <p className="muted" style={{ marginTop: 8, textAlign: "center" }}>
          Already a member?{" "}
          <Link className="link" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 10,
        margin: "16px 0"
      }}
    >
      <span style={{ height: 1, background: "var(--border)" }} />
      <span className="muted" style={{ fontSize: 12 }}>
        OR
      </span>
      <span style={{ height: 1, background: "var(--border)" }} />
    </div>
  );
}
