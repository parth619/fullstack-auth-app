// frontend/src/pages/Debate.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/** Small helpers */
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

/**
 * Quick Debate Page
 * - Minimal dependencies (React + react-router-dom only)
 * - Uses your existing utility classes: card / pill / ghost / input / badge / muted
 * - Persists debate state in localStorage (`df_quick_debate`)
 */
export default function Debate() {
  const navigate = useNavigate();

  // ------- state -------
  const [topic, setTopic] = useState("Is AI replacing developers?");
  const [round, setRound] = useState(1);
  const [roundSeconds, setRoundSeconds] = useState(180); // default 3 min/round
  const [timeLeft, setTimeLeft] = useState(180);
  const [running, setRunning] = useState(true);

  const [forDraft, setForDraft] = useState("");
  const [againstDraft, setAgainstDraft] = useState("");
  const [forArgs, setForArgs] = useState([]);       // {id,text,votes}
  const [againstArgs, setAgainstArgs] = useState([]); // {id,text,votes}

  // ------- persistence -------
  useEffect(() => {
    const raw = localStorage.getItem("df_quick_debate");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      setTopic(s.topic ?? topic);
      setRound(s.round ?? 1);
      setRoundSeconds(s.roundSeconds ?? 180);
      setTimeLeft(s.timeLeft ?? 180);
      setRunning(false); // resume paused
      setForArgs(s.forArgs ?? []);
      setAgainstArgs(s.againstArgs ?? []);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const snap = {
      topic,
      round,
      roundSeconds,
      timeLeft,
      forArgs,
      againstArgs,
    };
    localStorage.setItem("df_quick_debate", JSON.stringify(snap));
  }, [topic, round, roundSeconds, timeLeft, forArgs, againstArgs]);

  // ------- timer -------
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft]);

  // ------- derived -------
  const topFor = useMemo(
    () => [...forArgs].sort((a, b) => b.votes - a.votes).slice(0, 3),
    [forArgs]
  );
  const topAgainst = useMemo(
    () => [...againstArgs].sort((a, b) => b.votes - a.votes).slice(0, 3),
    [againstArgs]
  );

  // ------- handlers -------
  const addFor = () => {
    if (!forDraft.trim()) return;
    setForArgs((a) => [...a, { id: uid(), text: forDraft.trim(), votes: 0 }]);
    setForDraft("");
  };
  const addAgainst = () => {
    if (!againstDraft.trim()) return;
    setAgainstArgs((a) => [
      ...a,
      { id: uid(), text: againstDraft.trim(), votes: 0 },
    ]);
    setAgainstDraft("");
  };
  const vote = (side, id, delta) => {
    const set = side === "for" ? setForArgs : setAgainstArgs;
    set((arr) =>
      arr.map((it) =>
        it.id === id ? { ...it, votes: Math.max(-5, it.votes + delta) } : it
      )
    );
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    setTimeLeft(roundSeconds);
    setRunning(true);
  };
  const resetDebate = () => {
    if (!confirm("Reset debate? This clears all points.")) return;
    setRound(1);
    setTimeLeft(roundSeconds);
    setRunning(true);
    setForArgs([]);
    setAgainstArgs([]);
  };

  const copySummary = async () => {
    const lines = [
      `Topic: ${topic}`,
      `Rounds: ${round}`,
      "",
      "Top FOR points:",
      ...topFor.map((p, i) => `${i + 1}. ${p.text} (${p.votes})`),
      "",
      "Top AGAINST points:",
      ...topAgainst.map((p, i) => `${i + 1}. ${p.text} (${p.votes})`),
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Summary copied to clipboard!");
    } catch {
      alert("Could not access clipboard.");
    }
  };

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
          <span style={{ fontSize: 22 }}>⚔️</span>
          <strong>Quick Debate</strong>
          <span className="badge">Round {round}</span>
          <span className="badge">⏱ {fmt(timeLeft)}</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="ghost"
            onClick={() => setRunning((r) => !r)}
            title={running ? "Pause timer" : "Start timer"}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button className="ghost" onClick={nextRound}>Next Round</button>
          <button className="pill" onClick={copySummary}>Copy Summary</button>
          <button className="ghost" onClick={resetDebate}>Reset</button>
          <Link className="pill" to="/">Exit</Link>
        </div>
      </header>

      {/* Topic + Settings */}
      <div
        className="card"
        style={{ padding: 12, borderRadius: 16, marginBottom: 12 }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label className="muted" style={{ fontSize: 13 }}>
              Debate Topic
            </label>
            <input
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label className="muted" style={{ fontSize: 13 }}>
                Seconds per round
              </label>
              <input
                className="input"
                type="number"
                min={30}
                step={30}
                value={roundSeconds}
                onChange={(e) => {
                  const v = Math.max(30, Number(e.target.value) || 180);
                  setRoundSeconds(v);
                  // keep current time proportionate if you want; simple reset:
                  setTimeLeft(v);
                }}
              />
            </div>
            <div style={{ alignSelf: "end" }}>
              <button className="ghost" onClick={() => setTimeLeft(roundSeconds)}>
                Reset Timer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: FOR / AGAINST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* FOR side */}
        <div className="card" style={{ padding: 12, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="badge">FOR</span>
            <span className="muted">Argue in support</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              className="input"
              placeholder="Add a supporting point…"
              value={forDraft}
              onChange={(e) => setForDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFor()}
            />
            <button className="pill" onClick={addFor}>Add</button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {forArgs.length === 0 && (
              <div className="muted" style={{ fontSize: 13 }}>
                No points yet.
              </div>
            )}
            {forArgs.map((a) => (
              <div key={a.id} className="card" style={{ padding: 10, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ maxWidth: "80%" }}>{a.text}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button className="ghost" onClick={() => vote("for", a.id, 1)}>
                      ▲
                    </button>
                    <strong>{a.votes}</strong>
                    <button className="ghost" onClick={() => vote("for", a.id, -1)}>
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AGAINST side */}
        <div className="card" style={{ padding: 12, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="badge">AGAINST</span>
            <span className="muted">Argue against</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              className="input"
              placeholder="Add a counter point…"
              value={againstDraft}
              onChange={(e) => setAgainstDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAgainst()}
            />
            <button className="pill" onClick={addAgainst}>Add</button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {againstArgs.length === 0 && (
              <div className="muted" style={{ fontSize: 13 }}>
                No points yet.
              </div>
            )}
            {againstArgs.map((a) => (
              <div key={a.id} className="card" style={{ padding: 10, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ maxWidth: "80%" }}>{a.text}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button className="ghost" onClick={() => vote("against", a.id, 1)}>
                      ▲
                    </button>
                    <strong>{a.votes}</strong>
                    <button className="ghost" onClick={() => vote("against", a.id, -1)}>
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between" }}>
        <Link className="ghost" to="/">← Back to Home</Link>
        <button className="pill" onClick={copySummary}>Copy Top Points</button>
      </div>
    </div>
  );
}
