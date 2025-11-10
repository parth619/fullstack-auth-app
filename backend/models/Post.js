// backend/models/Post.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, default: "Anon" },
    text: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body:  { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    communitySlug: { type: String, default: "general" },
    upvotes: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
