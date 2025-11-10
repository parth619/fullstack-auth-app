// frontend/src/App.jsx

import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Debate from "./pages/Debate.jsx";        // ← existing
import Mentorship from "./pages/Mentorship.jsx"; // ← added

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {/* global theme tokens (dark + light) */}
      <style>{`
        :root {
          --bg: #0f1115; --panel: #171a21; --card: #1f2330; --muted: #9aa4b2;
          --text: #e6e7eb; --brand: #7c5cff; --accent: #ff3666; --border: #2a2f3a;
        }
        [data-theme="light"] {
          --bg: #f5f7fb; --panel: #ffffff; --card: #ffffff; --muted: #637083;
          --text: #0f172a; --brand: #6b5cff; --accent: #ff3a66; --border: #e5e9f2;
        }
        *{box-sizing:border-box}
        body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        a{text-decoration:none;color:inherit}
        .container{max-width:1100px;margin:0 auto;padding:24px}
        .navbar{position:sticky;top:0;z-index:50;backdrop-filter:blur(8px);background:linear-gradient(180deg, var(--bg), transparent);border-bottom:1px solid var(--border)}
        .brand{display:flex;gap:10px;align-items:center;font-weight:800;letter-spacing:.3px}
        .pill{padding:8px 14px;background:var(--brand);border-radius:999px;color:white;border:0;cursor:pointer;font-weight:600}
        .ghost{padding:8px 14px;background:transparent;border-radius:10px;color:var(--text);border:1px solid var(--border);cursor:pointer}
        .card{background:linear-gradient(180deg,var(--card),var(--panel));border:1px solid var(--border);border-radius:16px;padding:18px;box-shadow:0 10px 30px #00000022}
        .input{width:100%;padding:12px 14px;border-radius:12px;background:transparent;color:var(--text);border:1px solid var(--border);outline:none}
        .input:focus{border-color:var(--brand);box-shadow:0 0 0 3px #7c5cff22}
        .grid{display:grid;gap:16px}
        .muted{color:var(--muted)}
        .badge{padding:3px 8px;border-radius:999px;background:transparent;border:1px solid var(--border);color:var(--muted);font-size:12px}
        .post:hover{transform:translateY(-1px);transition:120ms}
        button:disabled{opacity:.6;cursor:not-allowed}
      `}</style>

      <header className="navbar">
        <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
          <Link to="/" className="brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#7c5cff"/><stop offset="1" stopColor="#ff3666"/></linearGradient></defs></svg>
            <span>Discussly</span>
          </Link>

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {/* Quick actions */}
            <button className="ghost" onClick={()=>nav("/debate")}>⚔️ Quick Debate</button>
            <button className="ghost" onClick={()=>nav("/mentorship")}>🎯 Mentorship</button>

            <button className="ghost" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            {!user ? (
              <>
                <button className="ghost" onClick={()=>nav("/login")}>Log in</button>
                <button className="pill" onClick={()=>nav("/signup")}>Sign up</button>
              </>
            ) : (
              <>
                <span className="badge">Hi, {user.name}</span>
                <button className="ghost" onClick={logout}>Log out</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/debate" element={<Debate />} />          {/* public */}
          <Route path="/mentorship" element={<Mentorship />} />  {/* public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </>
  );
}
<style>

  
</style>