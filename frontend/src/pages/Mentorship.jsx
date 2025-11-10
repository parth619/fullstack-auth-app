// frontend/src/pages/Mentorship.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const uid = () => Math.random().toString(36).slice(2, 9);

/**
 * Mentorship Page
 * - Create your mini profile (mentor or mentee)
 * - Browse mentors (search, filter by skills & availability)
 * - Send request with preferred slot
 * - Endorse & rate mentors
 * - All data persisted to localStorage
 */
export default function Mentorship() {
  const nav = useNavigate();

  /* ---------- persistence ---------- */
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem("df_mentorship")) || {};
    } catch {
      return {};
    }
  };
  const save = (data) =>
    localStorage.setItem("df_mentorship", JSON.stringify(data));

  const seedMentors = [
    {
      id: uid(),
      name: "Rhea N.",
      role: "Mentor",
      title: "SDE @ ProductCo",
      bio: "Frontend performance, interview prep, and portfolio review.",
      skills: ["React", "Vite", "DSA", "Resume"],
      timezone: "IST",
      slots: ["Sat 11:00", "Sat 17:00", "Sun 10:00"],
      rating: 4.8,
      totalRatings: 23,
      endorsements: 12,
    },
    {
      id: uid(),
      name: "Alex K.",
      role: "Mentor",
      title: "ML Engineer",
      bio: "ML projects, reading papers, and Kaggle tactics.",
      skills: ["Python", "Pandas", "XGBoost", "NLP"],
      timezone: "IST",
      slots: ["Fri 19:30", "Sun 15:30"],
      rating: 4.5,
      totalRatings: 15,
      endorsements: 8,
    },
  ];

  const init = load();
  const [mentors, setMentors] = useState(init.mentors || seedMentors);
  const [requests, setRequests] = useState(init.requests || []); // mentorship requests
  const [me, setMe] = useState(
    init.me || {
      id: uid(),
      name: "",
      role: "Mentee", // or 'Mentor'
      title: "",
      bio: "",
      skills: [],
      timezone: "IST",
      slots: [],
    }
  );

  useEffect(() => {
    save({ mentors, requests, me });
  }, [mentors, requests, me]);

  /* ---------- filters & search ---------- */
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("any");
  const [sortKey, setSortKey] = useState("best"); // best | new | rated

  const flatSkills = useMemo(
    () =>
      Array.from(
        new Set(mentors.flatMap((m) => m.skills?.map((s) => s.trim()) || []))
      ).sort(),
    [mentors]
  );

  const filteredMentors = useMemo(() => {
    let list = mentors.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.bio.toLowerCase().includes(q) ||
          (m.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    if (skillFilter) {
      list = list.filter((m) => (m.skills || []).includes(skillFilter));
    }
    if (availabilityFilter !== "any") {
      list = list.filter((m) => m.slots?.length > 0);
    }
    if (sortKey === "best") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortKey === "rated") {
      list.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
    }
    return list;
  }, [mentors, search, skillFilter, availabilityFilter, sortKey]);

  /* ---------- create/update my mini profile ---------- */
  const [skillDraft, setSkillDraft] = useState("");
  const addSkill = () => {
    const s = skillDraft.trim();
    if (!s) return;
    setMe((p) => ({ ...p, skills: Array.from(new Set([...(p.skills || []), s])) }));
    setSkillDraft("");
  };
  const removeSkill = (s) =>
    setMe((p) => ({ ...p, skills: (p.skills || []).filter((x) => x !== s) }));

  const [slotDraft, setSlotDraft] = useState("");
  const addSlot = () => {
    const s = slotDraft.trim();
    if (!s) return;
    setMe((p) => ({ ...p, slots: Array.from(new Set([...(p.slots || []), s])) }));
    setSlotDraft("");
  };
  const removeSlot = (s) =>
    setMe((p) => ({ ...p, slots: (p.slots || []).filter((x) => x !== s) }));

  const publishAsMentor = () => {
    if (!me.name.trim() || !me.title.trim()) {
      alert("Please add your name and title.");
      return;
    }
    const exists = mentors.find((m) => m.id === me.id);
    const entry = {
      id: me.id,
      name: me.name.trim(),
      role: "Mentor",
      title: me.title.trim(),
      bio: me.bio.trim(),
      skills: me.skills || [],
      timezone: me.timezone || "IST",
      slots: me.slots || [],
      rating: exists?.rating || 5.0,
      totalRatings: exists?.totalRatings || 1,
      endorsements: exists?.endorsements || 0,
    };
    setMentors((ms) => {
      const others = ms.filter((m) => m.id !== me.id);
      return [entry, ...others];
    });
    alert("Published as mentor! You now appear in results.");
  };

  /* ---------- requests / endorsements / rating ---------- */
  const [reqModalFor, setReqModalFor] = useState(null); // mentor id
  const [reqMsg, setReqMsg] = useState("");
  const [reqSlot, setReqSlot] = useState("");

  const openRequest = (mentorId) => {
    setReqModalFor(mentorId);
    setReqMsg("");
    setReqSlot("");
  };

  const sendRequest = () => {
    if (!reqModalFor) return;
    const mentor = mentors.find((m) => m.id === reqModalFor);
    if (!mentor) return;
    if (!reqSlot) {
      alert("Please pick a preferred slot.");
      return;
    }
    const r = {
      id: uid(),
      mentorId: mentor.id,
      mentorName: mentor.name,
      menteeId: me.id,
      menteeName: me.name || "Anonymous",
      message: reqMsg.trim(),
      slot: reqSlot,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setRequests((rs) => [r, ...rs]);
    setReqModalFor(null);
    alert("Request sent!");
  };

  const endorse = (id) =>
    setMentors((ms) =>
      ms.map((m) => (m.id === id ? { ...m, endorsements: (m.endorsements || 0) + 1 } : m))
    );

  const rate = (id, val) =>
    setMentors((ms) =>
      ms.map((m) =>
        m.id === id
          ? {
              ...m,
              totalRatings: (m.totalRatings || 0) + 1,
              rating:
                ((m.rating || 0) * (m.totalRatings || 0) + val) /
                ((m.totalRatings || 0) + 1),
            }
          : m
      )
    );

  /* ---------- UI ---------- */
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      {/* Header */}
      <header
        className="card"
        style={{
          padding: 12,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <strong>Mentorship Hub</strong>
          <span className="badge">{filteredMentors.length} mentors</span>
          <span className="badge">{requests.length} requests</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Link className="ghost" to="/">← Back</Link>
          <button className="pill" onClick={() => nav("/debate")}>⚔️ Quick Debate</button>
        </div>
      </header>

      {/* My mini profile */}
      <div className="card" style={{ borderRadius: 16, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge">Your Profile</span>
            <span className="muted">
              Set your role & publish to appear as a mentor.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              className="input"
              placeholder="Your name"
              value={me.name}
              onChange={(e) => setMe((p) => ({ ...p, name: e.target.value }))}
            />
            <select
              className="input"
              value={me.role}
              onChange={(e) => setMe((p) => ({ ...p, role: e.target.value }))}
            >
              <option>Mentee</option>
              <option>Mentor</option>
            </select>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              className="input"
              placeholder="Title (e.g., SDE @ Company)"
              value={me.title}
              onChange={(e) => setMe((p) => ({ ...p, title: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Timezone (e.g., IST)"
              value={me.timezone}
              onChange={(e) => setMe((p) => ({ ...p, timezone: e.target.value }))}
            />
          </div>

          <textarea
            className="input"
            rows={3}
            placeholder="Short bio: areas you need help with or can help others in"
            value={me.bio}
            onChange={(e) => setMe((p) => ({ ...p, bio: e.target.value }))}
          />

          {/* skills editor */}
          <div>
            <div className="muted" style={{ marginBottom: 6, fontSize: 13 }}>
              Skills
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="input"
                placeholder="e.g., React"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <button className="pill" onClick={addSkill}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {(me.skills || []).map((s) => (
                <span key={s} className="badge" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  {s} <button className="ghost" onClick={() => removeSkill(s)} style={{ padding: "2px 6px" }}>✕</button>
                </span>
              ))}
              {(me.skills || []).length === 0 && (
                <span className="muted" style={{ fontSize: 13 }}>No skills yet.</span>
              )}
            </div>
          </div>

          {/* availability editor */}
          <div>
            <div className="muted" style={{ marginBottom: 6, fontSize: 13 }}>
              Availability (free text or “Fri 19:30”)
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="input"
                placeholder="e.g., Sat 11:00"
                value={slotDraft}
                onChange={(e) => setSlotDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSlot()}
              />
              <button className="pill" onClick={addSlot}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {(me.slots || []).map((s) => (
                <span key={s} className="badge" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  {s} <button className="ghost" onClick={() => removeSlot(s)} style={{ padding: "2px 6px" }}>✕</button>
                </span>
              ))}
              {(me.slots || []).length === 0 && (
                <span className="muted" style={{ fontSize: 13 }}>No slots added.</span>
              )}
            </div>
          </div>

          {/* publish */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="ghost" onClick={() => setMe((p) => ({ ...p, role: p.role === "Mentor" ? "Mentee" : "Mentor" }))}>
              Switch to {me.role === "Mentor" ? "Mentee" : "Mentor"}
            </button>
            <button className="pill" onClick={publishAsMentor}>Publish as Mentor</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 12, borderRadius: 16, marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 }}>
          <input
            className="input"
            placeholder="Search mentors by name/skill/bio"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="">All skills</option>
            {flatSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="input" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
            <option value="any">Any availability</option>
            <option value="has">Has open slots</option>
          </select>
          <select className="input" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="best">Best match</option>
            <option value="rated">Most rated</option>
          </select>
        </div>
      </div>

      {/* Mentors list */}
      <div className="grid" style={{ gap: 12 }}>
        {filteredMentors.length === 0 && (
          <div className="card">
            <div className="muted" style={{ textAlign: "center" }}>
              No mentors found. Try removing filters.
            </div>
          </div>
        )}

        {filteredMentors.map((m) => (
          <div key={m.id} className="card" style={{ borderRadius: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong>{m.name}</strong>
                  <span className="badge">{m.title}</span>
                  <span className="badge">⭐ {m.rating?.toFixed(1)} ({m.totalRatings})</span>
                  <span className="badge">🏅 {m.endorsements} endorsements</span>
                  <span className="badge">🕒 {m.timezone}</span>
                </div>
                <div className="muted" style={{ marginTop: 6 }}>{m.bio}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {(m.skills || []).map((s) => (
                    <span key={s} className="badge">{s}</span>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>Open slots</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(m.slots || []).length === 0 && <span className="muted">No slots listed.</span>}
                    {(m.slots || []).map((s) => (
                      <span key={s} className="badge">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 6, alignContent: "start" }}>
                <button className="pill" onClick={() => openRequest(m.id)}>Request Session</button>
                <button className="ghost" onClick={() => endorse(m.id)}>Endorse</button>
                <div className="card" style={{ padding: 8 }}>
                  <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Rate</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[3,4,5].map((r) => (
                      <button key={r} className="ghost" onClick={() => rate(m.id, r)}>{r} ⭐</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Requests Inbox (simple list) */}
      <div className="card" style={{ marginTop: 14, borderRadius: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span className="badge">Your Requests</span>
          <span className="muted">{requests.length} total</span>
        </div>
        <div className="grid" style={{ gap: 8 }}>
          {requests.length === 0 && <div className="muted">No requests yet.</div>}
          {requests.map((r) => (
            <div key={r.id} className="card" style={{ padding: 10, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <strong>{r.menteeName}</strong> → <b>{r.mentorName}</b>{" "}
                  <span className="badge">{r.slot}</span>
                  <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>
                    {r.message || "No message"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span className="badge">{r.status}</span>
                  <button
                    className="ghost"
                    onClick={() =>
                      setRequests((rs) =>
                        rs.map((x) =>
                          x.id === r.id ? { ...x, status: "Accepted" } : x
                        )
                      )
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="ghost"
                    onClick={() =>
                        setRequests((rs) =>
                          rs.map((x) =>
                            x.id === r.id ? { ...x, status: "Declined" } : x
                          )
                        )
                    }
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request modal */}
      {reqModalFor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            display: "grid",
            placeItems: "center",
            zIndex: 60,
            padding: 16,
          }}
        >
          <div className="card" style={{ maxWidth: 520, width: "100%", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Request Session</strong>
              <button className="ghost" onClick={() => setReqModalFor(null)}>✕</button>
            </div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <select
                className="input"
                value={reqSlot}
                onChange={(e) => setReqSlot(e.target.value)}
              >
                <option value="">Pick a slot…</option>
                {(mentors.find((m) => m.id === reqModalFor)?.slots || []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea
                className="input"
                rows={3}
                placeholder="What do you want to cover?"
                value={reqMsg}
                onChange={(e) => setReqMsg(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button className="ghost" onClick={() => setReqModalFor(null)}>Cancel</button>
                <button className="pill" onClick={sendRequest}>Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
