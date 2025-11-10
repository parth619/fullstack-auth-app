// backend/routes/postRoutes.js
import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// GET all posts (newest first)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// CREATE post
router.post("/", async (req, res) => {
  try {
    const { title, body, author, communitySlug } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }
    const post = await Post.create({
      title,
      body,
      author: author || "Anonymous",
      communitySlug: communitySlug || "general",
    });
    res.status(201).json({ post });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// UPVOTE
router.patch("/:id/upvote", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DOWNVOTE (floor at 0)
router.patch("/:id/downvote", async (req, res) => {
  try {
    const p = await Post.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Post not found" });
    p.upvotes = Math.max(0, (p.upvotes || 0) - 1);
    await p.save();
    res.json({ post: p });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ADD COMMENT
router.post("/:id/comments", async (req, res) => {
  try {
    const { author, text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "comment text required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({ author: author || "Anon", text: text.trim() });
    await post.save();
    res.status(201).json({ post, comment: post.comments.at(-1) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
