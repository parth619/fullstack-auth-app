// frontend/src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/* ----------------------- helpers ----------------------- */
const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) return `${count}${label}`;
  }
  return `${seconds}s`;
};

/* ------------------- sample posts data -------------------- */
const SAMPLE_POSTS = [
  {
    _id: "1",
    title: "What tiny habit improved your coding speed?",
    body: "Share one small routine or shortcut that made a noticeable difference. For me, it was using VSCode shortcuts consistently!",
    author: "rhea_dev",
    communitySlug: "Technology",
    upvotes: 12,
    comments: [
      { _id: "c1", author: "alex_coder", text: "Using multiple cursors changed everything for me!" },
      { _id: "c2", author: "sam_web", text: "Learning to use the debugger properly saved me hours" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString()
  },
  {
    _id: "2",
    title: "Daily Discussion • What are you building today?",
    body: "Drop a 1-liner update. Ship small, ship daily. I'm working on a React component library!",
    author: "community_mod",
    communitySlug: "Daily",
    upvotes: 35,
    comments: [
      { _id: "c3", author: "julia_ui", text: "Building a dashboard for my side project" },
      { _id: "c4", author: "mike_fullstack", text: "Working on API authentication" },
      { _id: "c5", author: "tina_dev", text: "Learning Three.js for 3D visuals" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    _id: "3",
    title: "Mentorship: First-year CS student seeking roadmap",
    body: "Want to focus on DSA + 1 project/mo. Looking for accountability partner. Currently learning React and Node.js!",
    author: "parth_student",
    communitySlug: "Mentorship",
    upvotes: 18,
    comments: [
      { _id: "c6", author: "senior_dev", text: "Focus on fundamentals first - DSA is key!" },
      { _id: "c7", author: "mentor_alex", text: "Happy to help with your roadmap planning" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  },
  {
    _id: "4",
    title: "Starting my startup journey - any advice?",
    body: "Quit my job to build a SaaS product. Looking for advice on MVP development and early user acquisition.",
    author: "startup_founder",
    communitySlug: "Startups",
    upvotes: 24,
    comments: [
      { _id: "c8", author: "serial_entrepreneur", text: "Focus on solving one problem really well" },
      { _id: "c9", author: "tech_advisor", text: "Build in public and get early feedback" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString()
  },
  {
    _id: "5",
    title: "How do you maintain work-life balance in tech?",
    body: "Struggling with burnout after 6 years in the industry. What strategies work for you?",
    author: "burnout_prevention",
    communitySlug: "Health",
    upvotes: 42,
    comments: [
      { _id: "c10", author: "work_life_balance", text: "Setting strict boundaries after 6 PM helped me" },
      { _id: "c11", author: "mental_health", text: "Regular exercise and meditation are crucial" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 800).toISOString()
  },
  {
    _id: "6",
    title: "Confession: I still use jQuery in 2025",
    body: "Don't judge me! Some legacy projects just work and clients don't want to pay for rewrites.",
    author: "legacy_dev",
    communitySlug: "Confessions",
    upvotes: 56,
    comments: [
      { _id: "c12", author: "modern_dev", text: "Haha we all have that one legacy project!" },
      { _id: "c13", author: "team_lead", text: "If it works and is maintainable, why change?" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString()
  },
  {
    _id: "7",
    title: "Debate: Remote vs Office work - which is better?",
    body: "After 2 years of remote work, I'm considering going back to office. What are your thoughts?",
    author: "work_mode_debater",
    communitySlug: "Debates",
    upvotes: 31,
    comments: [
      { _id: "c14", author: "remote_advocate", text: "Remote gives me flexibility and saves commute time" },
      { _id: "c15", author: "office_fan", text: "I miss the collaboration and social aspects" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString()
  },
  {
    _id: "8",
    title: "Best resources for learning machine learning?",
    body: "CS graduate looking to transition into ML. Any recommended courses, books, or projects?",
    author: "ml_beginner",
    communitySlug: "Education",
    upvotes: 15,
    comments: [
      { _id: "c16", author: "data_scientist", text: "Start with Andrew Ng's course on Coursera" },
      { _id: "c17", author: "ml_engineer", text: "Kaggle competitions are great for practical experience" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 2000).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 2000).toISOString()
  }
];

const CATEGORIES = [
  "All",
  "Technology",
  "Education",
  "Startups",
  "Health",
  "Mentorship",
  "Daily",
  "Confessions",
  "Debates",
];

const SORTS = [
  { key: "trending", label: "Trending" },
  { key: "new", label: "Newest" },
  { key: "top", label: "Top" },
];

const REACTIONS = [];

/* ------------------- small UI atoms -------------------- */
function PillButton({ active, children, ...props }) {
  return (
    <button
      {...props}
      className="ghost"
      style={{
        borderRadius: 999,
        padding: "6px 10px",
        ...(active
          ? { borderColor: "var(--brand)", boxShadow: "0 0 0 3px #7c5cff22" }
          : null),
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style }) {
  return (
    <div className="card" style={{ borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

/* ------------------- composite parts ------------------- */
function CategoryPills({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
      {CATEGORIES.map((c) => (
        <PillButton key={c} active={active === c} onClick={() => onChange(c)}>
          {c}
        </PillButton>
      ))}
    </div>
  );
}

function Toolbar({ query, setQuery, sort, setSort, onOpenComposer }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, users, tags…"
          className="input"
          style={{ maxWidth: 520 }}
        />
        <button onClick={onOpenComposer} className="pill" type="button">
          + New Post
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {SORTS.map((s) => (
          <PillButton
            key={s.key}
            active={sort === s.key}
            onClick={() => setSort(s.key)}
          >
            {s.label}
          </PillButton>
        ))}
      </div>
    </div>
  );
}

function SpotlightCard({ post }) {
  if (!post) return null;
  return (
    <Link to={`/post/${post._id}`} className="block">
      <Card>
        <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
          Weekly Spotlight
        </div>
        <div style={{ fontWeight: 700 }}>{post.title}</div>
        <div className="muted" style={{ marginTop: 6 }}>
          {post.body}
        </div>
        <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
          by {post.author} • {timeAgo(post.createdAt)} • {post.upvotes} upvotes
        </div>
      </Card>
    </Link>
  );
}

function DailyBanner() {
  return (
    <Link to="/topic/daily" className="block">
      <Card
        style={{
          background:
            "linear-gradient(90deg, rgba(255,184,0,.15), rgba(255,54,102,.15))",
        }}
      >
        <div style={{ fontWeight: 600 }}>Daily Discussion</div>
        <div className="muted">What are you working on today? Share below →</div>
      </Card>
    </Link>
  );
}

/* ------------------- PostCard with inline comments ------------------- */
function PostCard({
  post,
  onVote,
  onReact,
  onOpenComments,
}) {
  return (
    <Card>
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <div style={{ minWidth: 0 }}>
          <Link to={`/post/${post._id}`} className="block">
            <h3 style={{ margin: 0, fontWeight: 700 }}>{post.title}</h3>
          </Link>

          <div
            className="muted"
            style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}
          >
            <span className="badge">{post.communitySlug}</span>
            <span>• by {post.author}</span>
            <span>• {timeAgo(post.createdAt)}</span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            placeItems: "center",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 6,
            width: 54,
          }}
        >
          <button className="ghost" onClick={() => onVote(post._id, 1)}>
            ▲
          </button>
          <div style={{ fontWeight: 700 }}>{post.upvotes}</div>
          <button className="ghost" onClick={() => onVote(post._id, -1)}>
            ▼
          </button>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 10 }}>
        {post.body}
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <button className="ghost" onClick={() => onOpenComments(post._id)}>
          💬 {post.comments?.length || 0} Comments
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {REACTIONS.map((r) => (
            <button key={r} className="ghost" onClick={() => onReact(post._id, r)}>
              {r} {post.reactions?.[r] ?? 0}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* --------------------- main: Home (FULL-WIDTH) ---------------------- */
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("trending");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // inline composer + inline comments state
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "Technology",
  });

  // comments per post
  const [openCommentFor, setOpenCommentFor] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");

  // Fetch posts from MongoDB with fallback to sample data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        } else {
          // If no posts from backend, use sample data
          setPosts(SAMPLE_POSTS);
        }
      } catch (error) {
        console.error("Failed to fetch posts, using sample data:", error);
        // Use sample data if API fails
        setPosts(SAMPLE_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...posts];
    if (category !== "All") list = list.filter((p) => p.communitySlug === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }
    if (sort === "new")
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "top") list.sort((a, b) => b.upvotes - a.upvotes);
    if (sort === "trending")
      list.sort(
        (a, b) => b.upvotes + (b.comments?.length || 0) * 0.5 - (a.upvotes + (a.comments?.length || 0) * 0.5)
      );
    return list;
  }, [posts, category, query, sort]);

  const spotlight = useMemo(
    () => [...posts].sort((a, b) => b.upvotes - a.upvotes)[0],
    [posts]
  );

  // actions
  const handleVote = async (id, delta) => {
    try {
      // Try to update via API first
      if (delta > 0) {
        await api.patch(`/posts/${id}/upvote`);
      } else {
        await api.patch(`/posts/${id}/downvote`);
      }
      // Refresh posts to get updated votes
      const { data } = await api.get("/posts");
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to vote, updating locally:", error);
      // Fallback: update locally
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === id 
            ? { ...post, upvotes: Math.max(0, post.upvotes + delta) }
            : post
        )
      );
    }
  };

  const handleReact = (id, emoji) => {
    console.log("React", id, emoji);
  };

  const handleOpenComments = (postId) => {
    setOpenCommentFor((prev) => (prev === postId ? null : postId));
    setCommentDraft("");
  };

  const handleAddComment = async () => {
    const postId = openCommentFor;
    if (!postId || !commentDraft.trim()) return;
    
    try {
      await api.post(`/posts/${postId}/comments`, {
        author: user?.username || "Anonymous",
        text: commentDraft.trim()
      });
      
      // Refresh posts to get updated comments
      const { data } = await api.get("/posts");
      setPosts(data.posts);
      setCommentDraft("");
      setOpenCommentFor(null);
    } catch (error) {
      console.error("Failed to add comment, adding locally:", error);
      // Fallback: add comment locally
      const newComment = {
        _id: `local_${Date.now()}`,
        author: user?.username || "Anonymous",
        text: commentDraft.trim()
      };
      
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment]
              }
            : post
        )
      );
      setCommentDraft("");
      setOpenCommentFor(null);
    }
  };

  const handleCreatePost = async (e) => {
    e?.preventDefault?.();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await api.post("/posts", {
        title: newPost.title.trim(),
        body: newPost.content.trim(),
        author: user?.username || "Anonymous",
        communitySlug: newPost.category || "Technology"
      });

      // Refresh posts
      const { data } = await api.get("/posts");
      setPosts(data.posts);
      
      setShowComposer(false);
      setNewPost({ title: "", content: "", category: "Technology" });
    } catch (error) {
      console.error("Failed to create post, adding locally:", error);
      // Fallback: add post locally
      const newPostData = {
        _id: `local_${Date.now()}`,
        title: newPost.title.trim(),
        body: newPost.content.trim(),
        author: user?.username || "Anonymous",
        communitySlug: newPost.category || "Technology",
        upvotes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPosts(prevPosts => [newPostData, ...prevPosts]);
      setShowComposer(false);
      setNewPost({ title: "", content: "", category: "Technology" });
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "24px 16px", textAlign: "center" }}>
        Loading posts...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ width: "100%" }}>
        {/* top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Link to="/" style={{ fontSize: 20, fontWeight: 800 }}>
            DevForum
          </Link>
          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/debate" className="ghost">
              Quick Debate
            </Link>
            <Link to="/mentorship" className="ghost">
              Mentorship
            </Link>
          </nav>
        </header>

        <DailyBanner />

        <div style={{ margin: "14px 0" }}>
          <SpotlightCard post={spotlight} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <CategoryPills active={category} onChange={setCategory} />
        </div>

        <Card style={{ marginBottom: 12 }}>
          <Toolbar
            query={query}
            setQuery={setQuery}
            sort={sort}
            setSort={setSort}
            onOpenComposer={() => setShowComposer((v) => !v)}
          />
        </Card>

        {/* Inline "Create Post" composer */}
        {showComposer && (
          <Card style={{ marginBottom: 12 }}>
            <form onSubmit={handleCreatePost} className="grid" style={{ gap: 10 }}>
              <input
                className="input"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
              />
              <textarea
                className="input"
                rows={4}
                placeholder="Write something…"
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  className="input"
                  placeholder="Category (e.g. Technology)"
                  value={newPost.category}
                  onChange={(e) => setNewPost((p) => ({ ...p, category: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="ghost" onClick={() => setShowComposer(false)}>
                  Cancel
                </button>
                <button className="pill" type="submit">
                  Post
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* posts */}
        <div className="grid" style={{ gap: 12 }}>
          {filtered.length === 0 ? (
            <Card>
              <div className="muted" style={{ textAlign: "center" }}>
                No posts found. Try another search or category.
              </div>
            </Card>
          ) : (
            filtered.map((post) => (
              <div key={post._id}>
                <PostCard
                  post={post}
                  onVote={handleVote}
                  onReact={handleReact}
                  onOpenComments={handleOpenComments}
                />

                {openCommentFor === post._id && (
                  <div
                    className="card"
                    style={{
                      marginTop: 8,
                      padding: 12,
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="muted" style={{ marginBottom: 6 }}>
                      Add a comment
                    </div>
                    <input
                      className="input"
                      placeholder="Write a comment…"
                      value={commentDraft}
                      onChange={(e) => setCommentDraft(e.target.value)}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                        marginTop: 8,
                      }}
                    >
                      <button className="ghost" onClick={() => setOpenCommentFor(null)}>
                        Cancel
                      </button>
                      <button className="pill" onClick={handleAddComment}>
                        Post
                      </button>
                    </div>

                    {(post.comments?.length || 0) > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>
                          Recent Comments
                        </div>
                        {post.comments.slice(-3).map((c) => (
                          <div
                            key={c._id}
                            style={{
                              padding: "6px 0",
                              borderBottom: "1px solid var(--border)",
                              fontSize: 14,
                            }}
                          >
                            <b>{c.author}:</b> {c.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          <Link to="/rules" className="muted">
            Community Guidelines
          </Link>
          <Link
            to="/new"
            className="pill"
            onClick={(e) => {
              e.preventDefault();
              setShowComposer(true);
            }}
          >
            Create a Post
          </Link>
        </div>
      </div>
    </div>
  );
}