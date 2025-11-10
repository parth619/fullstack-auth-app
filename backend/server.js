// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js"; // ← NEW

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// DB
connectDB();

// ------------ Auth ------------
app.use("/api/auth", authRoutes);

// ------------ Communities / Debates / Mentors (demo in-memory stays as-is) ------------
let communities = [
  { id: "c1", name: "Web Development", slug: "webdev", members: 1203 },
  { id: "c2", name: "Data Science", slug: "datascience", members: 998 },
  { id: "c3", name: "Competitive Programming", slug: "cp", members: 741 },
  { id: "c4", name: "Career & Mentorship", slug: "mentorship", members: 530 }
];

let debates = [
  {
    id: "d1",
    topic: "Should front-end devs learn TypeScript first?",
    pro: 5,
    con: 3,
    comments: [],
    createdAt: new Date()
  }
];

let mentors = [
  { id: "m1", name: "Aisha Khan", expertise: "Web Dev", rating: 4.8, reviews: [] },
  { id: "m2", name: "Rohit Sharma", expertise: "Data Science", rating: 4.6, reviews: [] },
  { id: "m3", name: "Neha Patel", expertise: "System Design", rating: 4.9, reviews: [] },
];

// ------------ Communities (demo) ------------
app.get("/api/communities", (req, res) => res.json({ communities }));

// ------------ Posts (MongoDB) ------------
app.use("/api/posts", postRoutes); // ← NEW: uses MongoDB

// ------------ Debates (demo) ------------
app.get("/api/debates", (req, res) => res.json({ debates }));

app.post("/api/debates", (req, res) => {
  const { topic } = req.body || {};
  if (!topic || !topic.trim()) return res.status(400).json({ message: "Topic required" });
  const debate = { id: `d${Date.now()}`, topic: topic.trim(), pro: 0, con: 0, comments: [], createdAt: new Date() };
  debates.unshift(debate);
  res.status(201).json({ debate });
});

app.patch("/api/debates/:id/vote", (req, res) => {
  const debate = debates.find(d => d.id === req.params.id);
  if (!debate) return res.status(404).json({ message: "Debate not found" });
  const side = (req.query.side || "").toLowerCase();
  if (side === "pro") debate.pro++;
  else if (side === "con") debate.con++;
  else return res.status(400).json({ message: "side must be 'pro' or 'con'" });
  res.json({ debate });
});

app.post("/api/debates/:id/comments", (req, res) => {
  const debate = debates.find(d => d.id === req.params.id);
  if (!debate) return res.status(404).json({ message: "Debate not found" });
  const { author, text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ message: "Comment text required" });
  const comment = { id: `dc${Date.now()}`, author: author || "Anon", text: text.trim(), createdAt: new Date() };
  debate.comments.push(comment);
  res.status(201).json({ debate, comment });
});
// Add this to your server.js file
import Post from "./models/Post.js";

// Seed sample posts route
app.post("/api/seed-posts", async (req, res) => {
  try {
    // Clear existing posts
    await Post.deleteMany({});
    
    const samplePosts = [
      {
        title: "What tiny habit improved your coding speed?",
        body: "Share one small routine or shortcut that made a noticeable difference. For me, it was using VSCode shortcuts consistently!",
        author: "rhea_dev",
        communitySlug: "Technology",
        upvotes: 12,
        comments: [
          { author: "alex_coder", text: "Using multiple cursors changed everything for me!" },
          { author: "sam_web", text: "Learning to use the debugger properly saved me hours" }
        ]
      },
      {
        title: "Daily Discussion • What are you building today?",
        body: "Drop a 1-liner update. Ship small, ship daily. I'm working on a React component library!",
        author: "community_mod",
        communitySlug: "Daily",
        upvotes: 35,
        comments: [
          { author: "julia_ui", text: "Building a dashboard for my side project" },
          { author: "mike_fullstack", text: "Working on API authentication" },
          { author: "tina_dev", text: "Learning Three.js for 3D visuals" }
        ]
      },
      {
        title: "Poll: Which JS build tool feels simplest in 2025?",
        body: "Pick one you recommend to beginners. I'm leaning towards Vite for its speed and simplicity.",
        author: "alex_tech",
        communitySlug: "Technology",
        upvotes: 9,
        comments: [
          { author: "dev_enthusiast", text: "Vite is definitely the way to go now" },
          { author: "react_fan", text: "Next.js App Router is amazing for full-stack" }
        ]
      },
      {
        title: "Mentorship: First-year CS student seeking roadmap",
        body: "Want to focus on DSA + 1 project/mo. Looking for accountability partner. Currently learning React and Node.js!",
        author: "parth_student",
        communitySlug: "Mentorship",
        upvotes: 18,
        comments: [
          { author: "senior_dev", text: "Focus on fundamentals first - DSA is key!" },
          { author: "mentor_alex", text: "Happy to help with your roadmap planning" }
        ]
      },
      {
        title: "Starting my startup journey - any advice?",
        body: "Quit my job to build a SaaS product. Looking for advice on MVP development and early user acquisition.",
        author: "startup_founder",
        communitySlug: "Startups",
        upvotes: 24,
        comments: [
          { author: "serial_entrepreneur", text: "Focus on solving one problem really well" },
          { author: "tech_advisor", text: "Build in public and get early feedback" }
        ]
      },
      {
        title: "How do you maintain work-life balance in tech?",
        body: "Struggling with burnout after 6 years in the industry. What strategies work for you?",
        author: "burnout_prevention",
        communitySlug: "Health",
        upvotes: 42,
        comments: [
          { author: "work_life_balance", text: "Setting strict boundaries after 6 PM helped me" },
          { author: "mental_health", text: "Regular exercise and meditation are crucial" }
        ]
      },
      {
        title: "Confession: I still use jQuery in 2025",
        body: "Don't judge me! Some legacy projects just work and clients don't want to pay for rewrites.",
        author: "legacy_dev",
        communitySlug: "Confessions",
        upvotes: 56,
        comments: [
          { author: "modern_dev", text: "Haha we all have that one legacy project!" },
          { author: "team_lead", text: "If it works and is maintainable, why change?" }
        ]
      },
      {
        title: "Debate: Remote vs Office work - which is better?",
        body: "After 2 years of remote work, I'm considering going back to office. What are your thoughts?",
        author: "work_mode_debater",
        communitySlug: "Debates",
        upvotes: 31,
        comments: [
          { author: "remote_advocate", text: "Remote gives me flexibility and saves commute time" },
          { author: "office_fan", text: "I miss the collaboration and social aspects" }
        ]
      },
      {
        title: "Best resources for learning machine learning?",
        body: "CS graduate looking to transition into ML. Any recommended courses, books, or projects?",
        author: "ml_beginner",
        communitySlug: "Education",
        upvotes: 15,
        comments: [
          { author: "data_scientist", text: "Start with Andrew Ng's course on Coursera" },
          { author: "ml_engineer", text: "Kaggle competitions are great for practical experience" }
        ]
      }
    ];

    // Add createdAt dates (stagger them)
    const now = new Date();
    samplePosts.forEach((post, index) => {
      post.createdAt = new Date(now - (index * 2 * 60 * 60 * 1000)); // 2 hours apart
      post.updatedAt = new Date(now - (index * 2 * 60 * 60 * 1000));
    });

    const createdPosts = await Post.insertMany(samplePosts);
    
    res.json({ 
      message: `Added ${createdPosts.length} sample posts`,
      posts: createdPosts 
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------ Mentorship (demo) ------------
app.get("/api/mentors", (req, res) => res.json({ mentors }));
app.post("/api/mentors/:id/request", (req, res) => {
  const mentor = mentors.find(m => m.id === req.params.id);
  if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  res.json({ ok: true, message: `Request sent to ${mentor.name}` });
});
app.post("/api/mentors/:id/reviews", (req, res) => {
  const mentor = mentors.find(m => m.id === req.params.id);
  if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  const { author, rating, text } = req.body || {};
  mentor.reviews.push({ id: `r${Date.now()}`, author: author || "Anon", rating: Number(rating) || 5, text: text || "" });
  res.status(201).json({ mentor });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Fix the debug route in server.js - use the correct import
app.get("/api/debug-users", async (req, res) => {
  try {
    // Import the User model correctly
    const { User } = await import("./models/User.js");
    const users = await User.find({});
    res.json({ 
      totalUsers: users.length,
      users: users.map(u => ({ 
        id: u._id, 
        email: u.email, 
        username: u.username,
        name: u.name,
        password: u.password ? "***HASHED***" : "MISSING"
      }))
    });
  } catch (error) {
    console.error("Debug users error:", error);
    res.json({ error: error.message });
  }
});
