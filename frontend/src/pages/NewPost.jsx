import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Math.random().toString(36).slice(2, 9),
      title,
      content,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
      author: "current_user", // Replace with actual user data
      createdAt: new Date().toISOString(),
      votes: 0,
      comments: 0,
      saved: false,
      reactions: { "❤️": 0, "😂": 0, "😮": 0, "🔥": 0 },
      type: "post",
    };

    // Save the new post to localStorage
    const savedPosts = JSON.parse(localStorage.getItem("df_posts")) || [];
    localStorage.setItem("df_posts", JSON.stringify([newPost, ...savedPosts]));

    navigate("/");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="input"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          className="input"
          rows="6"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        >
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Startups">Startups</option>
          <option value="Health">Health</option>
          <option value="Mentorship">Mentorship</option>
          <option value="Daily">Daily</option>
          <option value="Confessions">Confessions</option>
          <option value="Debates">Debates</option>
        </select>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="input"
        />
        <button type="submit" className="pill">
          Submit Post
        </button>
      </form>
    </div>
  );
}