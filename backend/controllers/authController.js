// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import models from "../models/User.js";

const { User } = models;

function signToken(payload) {
  const secret = process.env.JWT_SECRET || "devsecret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",   // works on localhost between 5173 and 5000
    secure: false,     // set true when serving over https
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",         // IMPORTANT so every route sees the cookie
  });
}

/* ------------------- SIGNUP / REGISTER ------------------- */
export async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body || {};

    if (!password?.trim()) {
      return res.status(400).json({ message: "password is required" });
    }
    if (!email?.trim() && !username?.trim()) {
      return res.status(400).json({ message: "email or username is required" });
    }

    const cleanEmail = email?.trim().toLowerCase();
    const cleanUsername = username?.trim();

    const exists = await User.findOne({
      $or: [
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ...(cleanUsername ? [{ username: cleanUsername }] : []),
      ],
    });
    if (exists) return res.status(409).json({ message: "user already exists" });

    const hash = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      name: name?.trim(),
      username: cleanUsername || (cleanEmail ? cleanEmail.split("@")[0] : undefined),
      email: cleanEmail,
      password: hash,
    });

    const token = signToken({ id: user._id, username: user.username });
    setAuthCookie(res, token);

    res.status(201).json({
      user: { id: user._id, name: user.name, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "signup failed" });
  }
}

/* ------------------- LOGIN ------------------- */
export async function login(req, res) {
  try {
    const { email, username, password } = req.body || {};
    
    // DEBUG LINES:
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Received data:", { email, username, password });
    
    if (!password?.trim()) {
      console.log("ERROR: No password provided");
      return res.status(400).json({ message: "password is required" });
    }
    if (!email?.trim() && !username?.trim()) {
      console.log("ERROR: No email or username provided");
      return res.status(400).json({ message: "email or username is required" });
    }

    const user = await User.findOne(
      email?.trim()
        ? { email: email.trim().toLowerCase() }
        : { username: username.trim() }
    );
    
    console.log("Found user:", user ? { 
      id: user._id, 
      email: user.email, 
      username: user.username,
      hasPassword: !!user.password 
    } : "NO USER FOUND");

    if (!user) {
      console.log("ERROR: User not found");
      return res.status(401).json({ message: "invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password || "");
    console.log("Password match:", ok);
    
    if (!ok) {
      console.log("ERROR: Password doesn't match");
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = signToken({ id: user._id, username: user.username });
    setAuthCookie(res, token);

    console.log("LOGIN SUCCESS for user:", user.username);
    res.json({
      user: { id: user._id, name: user.name, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "login failed" });
  }
}

/* ------------------- LOGOUT ------------------- */
export async function logout(_req, res) {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
}

/* ------------------- ME ------------------- */
export async function me(req, res) {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "unauthorized" });

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "user not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ message: "failed to fetch profile" });
  }
}