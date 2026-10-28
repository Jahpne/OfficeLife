/* =====================================================================
   OFFICELIFE LOGIC  (pure functions: no DOM, easy to test)
   ===================================================================== */

const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmtMin = m => { const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0"); return `${((h + 11) % 12) + 1}:${mm} ${h >= 12 ? "PM" : "AM"}`; };
const fmt = t => fmtMin(toMin(t));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const wordCount = s => (String(s || "").trim().match(/\S+/g) || []).length;

/* ---------- clock-in ---------- */
const ARR = {
  early: { label: "Early", time: "8:52", min: 532 },
  on:    { label: "On time", time: "9:00", min: 540 },
  late:  { label: "Late", time: "9:14", min: 554 }
};
function clockStatus(arrivalMin, shiftMin = 540) {
  const delta = arrivalMin - shiftMin;
  const status = delta < -5 ? "early" : delta <= 0 ? "on" : "late";
  const pScore = status === "early" ? 100 : status === "on" ? 95 : Math.max(40, 90 - delta * 2);
  return { delta, status, pScore };
}

/* ---------- rules-based reviewer (used whenever AI is offline) ---------- */
function evaluateTask(text, task, opts = {}) {
  const t = String(text || "").toLowerCase();
  const words = wordCount(text);
  const items = task.rubric.map(r => {
    const hits = r.keywords.filter(k => t.includes(k.toLowerCase())).length;
    const s = hits >= 2 ? 5 : hits === 1 ? 4 : 1;
    return { label: r.label, s, hit: hits > 0, fix: r.fix };
  });
  const miss = items.filter(i => !i.hit);
  const short = words < (task.minWords || 30);
  let pct = Math.round(avg(items.map(i => i.s)) * 20);
  if (short) pct = Math.min(pct, 70);
  if (opts.cap) pct = Math.min(pct, opts.cap);
  pct = clamp(pct, 20, 98);
  const verdict = miss.length === 0 && !short ? "well_done" : "fix";
  const notes = miss.map(m => m.fix);
  if (short) notes.push(`Add more detail. Aim for at least ${task.minWords || 30} words (you wrote ${words}).`);
  return { verdict, pct, items, notes, words, method: opts.method || "rules" };
}

function evaluateFollowup(text, step) {
  const t = String(text || "").toLowerCase();
  const words = wordCount(text);
  const hits = step.keywords.filter(k => t.includes(k.toLowerCase())).length;
  let pct = words >= step.minWords ? clamp(45 + hits * 18, 45, 100) : 30;
  if (words >= step.minWords && hits === 0) pct = 45;
  const ok = pct >= 60;
  return { pct, ok, feedback: ok ? step.good : step.weak };
}

/* ---------- scoring ---------- */
// log entry: { in, status, delta, pScore, task, dec, quiz, rep, ex, method, taskTitle, excerpt }
function scoreLog(log) {
  const n = log.length || 1;
  const punct = avg(log.map(l => l.pScore || 0));
  const task = avg(log.map(l => l.task || 0));
  const dec = avg(log.map(l => l.dec || 0));
  const quizScore = avg(log.map(l => (l.quiz ? 100 : 40)));
  const ex = avg(log.map(l => l.ex == null ? 60 : l.ex));
  const crit = avg([quizScore, ex]);
  const rep = avg(log.map(l => l.rep || 0));
  const comm = avg([rep, task]);
  const dims = { punct, task, dec, crit, comm };
  const overall = avg([punct, task, dec, crit, comm]);
  const onTime = log.filter(l => l.status !== "late").length;
  return { n, dims, overall, onTime };
}
const DIM_LABELS = {
  punct: "Punctuality and reliability",
  task: "Task quality",
  dec: "Decision-making",
  crit: "Critical thinking",
  comm: "Communication"
};
function dimEvidence(key, log, sc) {
  const n = log.length;
  switch (key) {
    case "punct": return `Clocked in on time or early on ${sc.onTime} of ${n} days.`;
    case "task": {
      const ai = log.filter(l => l.method === "ai").length;
      return `${n} deliverable${n > 1 ? "s" : ""} reviewed${ai ? " (" + ai + " by AI)" : " by the rule-based reviewer"}.`;
    }
    case "dec": return `Chose the stronger option in ${log.filter(l => l.dec >= 80).length} of ${n} urgent trade-offs.`;
    case "crit": return `Answered ${log.filter(l => l.quiz).length} of ${n} check-ins correctly and explained ${log.filter(l => (l.ex || 0) >= 70).length} of ${n} decisions well.`;
    case "comm": return `Gave clear, constructive replies in ${log.filter(l => l.rep >= 80).length} of ${n} team messages.`;
  }
  return "";
}
function badgesFor(sc, days) {
  const b = [];
  if (sc.onTime === sc.n) b.push(["Always on time", "Never late"]);
  if (sc.dims.dec >= 90) b.push(["Sharp decider", "Strong calls under pressure"]);
  if (sc.dims.crit >= 85) b.push(["Deep thinker", "Explains the why"]);
  if (sc.dims.task >= 88) b.push(["Quality maker", "High-scoring work"]);
  if (sc.dims.comm >= 88) b.push(["Clear communicator", "Constructive and clear"]);
  if (days >= 3) b.push(["Full shift", "Completed 3 workdays"]);
  return b;
}
function readiness(overall) {
  return overall >= 90 ? "Interview-ready" : overall >= 80 ? "Strong candidate" : overall >= 65 ? "Developing" : "Keep practising";
}

/* ---------- certificate encoding (demo verification, no server) ---------- */
const b64e = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64d = s => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));
function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36).padStart(7, "0");
}
function certPayload(user, roleId, days, log, dateISO) {
  const sc = scoreLog(log);
  const d = sc.dims;
  return {
    n: user.name, u: user.uni, r: roleId, d: days, dt: dateISO,
    s: [d.punct, d.task, d.dec, d.crit, d.comm], ot: sc.onTime,
    lg: log.map(l => [l.status === "early" ? "e" : l.status === "on" ? "o" : "l", l.in, l.task || 0, l.dec || 0, l.quiz ? 1 : 0, l.rep || 0, l.ex == null ? 60 : l.ex, l.method === "ai" ? "a" : l.method === "rules-note" ? "n" : "r"])
  };
}
function certCode(p) {
  const a = fnv(JSON.stringify(p) + "|code-a"), b = fnv(JSON.stringify(p) + "|code-b");
  return "OL-" + a.slice(-4).toUpperCase() + "-" + b.slice(-4).toUpperCase();
}
function certToken(p) {
  const body = b64e(JSON.stringify(p));
  return body + "." + fnv(body + "|officelife-demo");
}
function certFromToken(tok) {
  try {
    const [body, sig] = String(tok).split(".");
    if (!body || !sig) return null;
    const ok = fnv(body + "|officelife-demo") === sig;
    const p = JSON.parse(b64d(body));
    if (!p || !Array.isArray(p.s) || p.s.length !== 5) return null;
    return { p, ok };
  } catch (e) { return null; }
}
function payloadScore(p) {
  const dims = { punct: p.s[0], task: p.s[1], dec: p.s[2], crit: p.s[3], comm: p.s[4] };
  return { dims, overall: avg(Object.values(dims)) };
}
function sampleToPayload(c, dateISO) {
  const d = c.s;
  const lg = [];
  for (let i = 0; i < c.days; i++) {
    lg.push([d.punct >= 95 ? "e" : d.punct >= 80 ? "o" : "l", d.punct >= 95 ? "8:55 AM" : d.punct >= 80 ? "9:00 AM" : "9:12 AM", d.task, d.dec, d.crit >= 80 ? 1 : 0, d.comm, d.crit, i % 2 ? "r" : "a"]);
  }
  return { n: c.name, u: c.uni, r: c.role, d: c.days, dt: dateISO, s: [d.punct, d.task, d.dec, d.crit, d.comm], ot: lg.filter(x => x[0] !== "l").length, lg };
}

/* ---------- csv ---------- */
function toCSV(rows) {
  return rows.map(r => r.map(c => { const s = String(c == null ? "" : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(",")).join("\n");
}

/* ---------- university search ---------- */
function searchUnis(q, list) {
  const s = String(q || "").trim().toLowerCase();
  if (!s) return list.slice(0, 8);
  const starts = list.filter(u => u.toLowerCase().startsWith(s));
  const has = list.filter(u => !u.toLowerCase().startsWith(s) && u.toLowerCase().includes(s));
  return starts.concat(has).slice(0, 8);
}
const isValidUni = (v, list) => list.some(u => u.toLowerCase() === String(v || "").trim().toLowerCase());
const canonUni = (v, list) => list.find(u => u.toLowerCase() === String(v || "").trim().toLowerCase()) || "";
const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || "").trim());
