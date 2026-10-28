/* =====================================================================
   OFFICELIFE APP  part C: workday engine, certificate, events
   ===================================================================== */

/* ---------- sheets (modals) and drawer ---------- */
function openSheet(html) {
  closeSheet();
  const m = document.createElement("div"); m.className = "scrim"; m.id = "sheet";
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(m);
}
function closeSheet() { const m = $("#sheet"); if (m) m.remove(); }
const modal = openSheet, closeModal = closeSheet;
function openDrawer() {
  const links = [["", "Home"], ["explore", "Explore"], ["universities", "Universities"], ["employers", "Employers"], ["premium", "Premium"]];
  const d = document.createElement("div"); d.className = "drawer"; d.id = "drawer";
  d.innerHTML = `<div class="dpanel"><div class="row"><span class="brand" style="padding:0">${LOGO(30)}<span>officelife</span></span><span class="sp"></span><button class="icon" data-act="closeDrawer" aria-label="Close menu">${I.x}</button></div>
    <div style="margin-top:12px">${links.map(l => `<button class="item" data-act="drawerGo" data-to="/${l[0]}">${l[1]}</button>`).join("")}
    ${S.user ? `<button class="item" data-act="drawerGo" data-to="/dashboard">My dashboard</button><button class="item" data-act="drawerGo" data-to="/profile">Profile</button>` : `<button class="item" data-act="drawerGo" data-to="/login">Log in</button><button class="item" data-act="drawerGo" data-to="/signup">Sign up</button>`}
    <button class="item" data-act="theme">Switch light or dark</button></div></div><div style="flex:1" data-act="closeDrawer"></div>`;
  document.body.appendChild(d);
}
const closeDrawer = () => { const d = $("#drawer"); if (d) d.remove(); };

/* ---------- clock in ---------- */
function clockin() {
  const r = role(S.enroll.role), a = ARR[S.arrival], d = S.day, L = S.log[d];
  let result = "";
  if (L) {
    const txt = L.status === "early" ? `You clocked in ${-L.delta} minutes early` : L.status === "on" ? "You clocked in on time" : `You are ${L.delta} minutes late`;
    const sub = L.status === "late" ? `${PEOPLE[r.manager].name} has been notified. This is logged on your certificate.` : "Great start. This is logged on your certificate.";
    result = `<div class="status ${L.status === "late" ? "warn" : "ok"}">${L.status === "late" ? I.alert : I.check}<div><b>${txt}</b><span>${sub}</span></div></div>
    <button class="btn pri block" style="margin-top:16px" data-act="enterWork">Enter the office</button>`;
  }
  return `${header("")}<main class="center screen">
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="chip blue">Day ${d + 1} of ${S.enroll.days}</span><span class="small muted">${r.title}</span></div>
    <div class="card shiftcard">
      <div class="row" style="justify-content:center;gap:10px"><div class="org ${r.cls}" style="width:32px;height:32px;font-size:12px">TL</div><b>Tembea Logistics</b></div>
      <p class="small muted" style="margin-top:8px">Your shift starts at <b>9:00 AM</b></p>
      <div class="bigtime" aria-live="polite">${a.time}<span>AM</span></div>
      <p class="small muted">${L ? "Clocked in" : "Your arrival time"}</p>
      ${L ? "" : `<div class="seg" role="group" aria-label="Demo: pretend arrival time">${["early", "on", "late"].map(k => `<button aria-pressed="${S.arrival === k}" data-act="setArrival" data-k="${k}">${ARR[k].label}<br><span class="xs" style="font-weight:400">${ARR[k].time} AM</span></button>`).join("")}</div>
      <p class="xs muted" style="margin-top:8px">Demo control: pick a pretend arrival time. The live version logs your real arrival with a server timestamp.</p>
      <button class="btn pri block" style="margin-top:16px" data-act="clockIn">Clock in</button>`}
      ${result}
    </div></main>${footer()}`;
}
function doClockIn() {
  const a = ARR[S.arrival], c = clockStatus(a.min);
  S.log[S.day] = { in: a.time + " AM", status: c.status, delta: c.delta, pScore: c.pScore, task: 0, dec: 0, quiz: false, rep: 0, ex: null, method: "rules", taskTitle: "", excerpt: "" };
}

/* ---------- workday screen ---------- */
function work() {
  const r = role(S.enroll.role);
  return `<div class="wtop"><div class="wrap">
    <div class="row"><button class="icon" data-act="leaveWork" aria-label="Leave workday">${I.back}</button>
      <div class="wtitle">${r.title}<small>Day ${S.day + 1} of ${S.enroll.days} &middot; ${esc(r.days[S.day].theme)}</small></div>
      <span class="sp"></span><span class="clockpill" id="clk">9:00 AM</span></div>
    <div class="track"><span>9 AM</span><div class="bar"><i id="prog"></i></div><span>5 PM</span></div></div></div>
    <main class="wrap" style="max-width:760px"><div class="chan"># tembea-product &middot; Today</div><div class="feed" id="feed" aria-live="polite"></div></main>`;
}
function setClock(t) {
  const target = typeof t === "number" ? t : toMin(t), from = S.cur; S.cur = target;
  const clk = $("#clk"), prog = $("#prog"); if (!clk) return;
  const paint = m => { clk.textContent = fmtMin(m); prog.style.width = clamp((m - 540) / 480 * 100, 0, 100) + "%"; };
  if (S.lite || matchMedia("(prefers-reduced-motion: reduce)").matches || from === target) { paint(target); return; }
  const t0 = performance.now();
  (function tick(now) { const p = Math.min(1, (now - t0) / 700); paint(Math.round(from + (target - from) * p)); if (p < 1) requestAnimationFrame(tick); })(t0);
}
const feed = () => $("#feed");
function put(html, cls = "") {
  const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html;
  const f = feed(); if (!f) return d;
  f.appendChild(d); d.scrollIntoView({ behavior: S.lite ? "auto" : "smooth", block: "end" }); return d;
}
function msgHTML(key, text, time) {
  const p = PEOPLE[key];
  return `<div class="av" style="background:${p.color}" aria-hidden="true">${p.ini}</div><div class="mb"><div class="mh"><b>${p.name}</b><span class="r">${p.role}</span><time>${time}</time></div><div class="txt">${text}</div></div>`;
}
const say = (key, text, time) => put(msgHTML(key, text, time), "msg");
const me = text => put(`<div class="mb"><div class="mh"><b>You</b><time>${fmtMin(S.cur)}</time></div><div class="txt">${esc(text)}</div></div>`, "msg me");
const typing = key => put(`<div class="av" style="background:${PEOPLE[key].color}">${PEOPLE[key].ini}</div><div class="typing" aria-label="${PEOPLE[key].name} is typing"><i></i><i></i><i></i></div>`, "msg");
const after = (id, ms, fn) => setTimeout(() => { if (id === S.runId) fn(); }, ms);
const mgrKey = () => role(S.enroll.role).manager;

function startDay() {
  S.runId = Date.now(); S.step = 0; S.cur = 540; S.task = null; S.pending = null; S.fu = null;
  const L = S.log[S.day], id = S.runId;
  if (!L) return nav("/clockin");
  setClock("09:00");
  put(`You clocked in at ${L.in} &middot; ${ARR[L.status].label}`, "sys");
  after(id, 700, () => advance(id));
}
function advance(id) {
  if (id !== S.runId) return;
  const steps = role(S.enroll.role).days[S.day].steps, st = steps[S.step];
  if (!st) return finishDay(id);
  S.step++;
  if (st.type === "msg") {
    setClock(st.t); const ty = typing(st.from);
    after(id, 1000, () => { ty.remove(); say(st.from, st.text, fmt(st.t)); after(id, 700, () => advance(id)); });
  } else if (st.type === "reply") {
    setClock(st.t); const ty = typing(st.from);
    after(id, 1000, () => {
      ty.remove(); say(st.from, st.text, fmt(st.t));
      const q = put(st.options.map((o, i) => `<button data-act="reply" data-i="${i}">${esc(o.label)}</button>`).join(""), "quick");
      S.pending = { st, q, id };
    });
  } else if (st.type === "task") {
    setClock(st.t);
    const el = put(`<span class="chip blue">New task &middot; due ${st.due}</span><h3>${st.title}</h3><p>${st.brief}</p><div class="tbody" id="tbody"></div>`, "task");
    S.task = { st, el, attempt: 0, id, last: null, failedOnce: false };
    showPicker();
  } else if (st.type === "followup") {
    setClock(st.t); const ty = typing(st.from);
    after(id, 1000, () => {
      ty.remove(); say(st.from, st.q, fmt(st.t));
      const el = put(`<div class="row"><input id="fu-in" placeholder="Type your answer" aria-label="Your answer"><button class="btn pri" data-act="fuSend">Send</button></div>`, "fu");
      S.fu = { st, el, id };
    });
  } else if (st.type === "decision") {
    setClock(st.t);
    put(`<span class="chip warn">Decision needed</span>&nbsp;<span class="small">${esc(st.q)}</span>`, "sys");
    openDecision(st, id);
  } else if (st.type === "break") {
    put("Lunch break &middot; 1:00 to 2:00 PM", "sys"); setClock("14:00");
    after(id, 900, () => advance(id));
  } else if (st.type === "quiz") {
    setClock(st.t); openQuiz(st, id);
  }
}
function finishDay(id) {
  setClock("16:45");
  const last = S.day >= S.enroll.days - 1, ty = typing(mgrKey());
  after(id, 1000, () => {
    ty.remove();
    say(mgrKey(), last ? "That is a wrap on the simulation. Well done, thank you for the hard work." : "Good work today. Finish up and I will see you tomorrow at 9.", fmtMin(S.cur));
    after(id, 600, () => {
      setClock("17:00");
      put(`<div class="card"><b>It is 5:00 PM</b><p class="small muted" style="margin:4px 0 12px">Clock out to save today's report.</p><button class="btn pri block" data-act="clockOut">Clock out</button></div>`, "clockout");
    });
  });
}

/* ---------- task submission ---------- */
function body() { return $("#tbody"); }
function showPicker() {
  const b = body(); if (!b) return;
  b.innerHTML = `<div class="upl"><button class="btn pri" data-act="pick">${I.upload} Upload a file</button><button class="btn out" data-act="typeToggle">Type your answer</button></div>
    <div class="upl" style="margin-top:8px"><button class="link" data-act="sample">Use a sample file (demo)</button></div>
    <p class="xs muted" style="margin-top:8px">PDF, Word, text, PNG or JPG</p>`;
}
function showEditor(prefill) {
  const b = body(); if (!b) return;
  b.innerHTML = `<label class="sr" for="ans">Your answer</label><textarea class="ta" id="ans" placeholder="Type your answer here">${esc(prefill || "")}</textarea>
    <div class="upl"><button class="btn pri" data-act="submitText">Submit for review</button><button class="link" data-act="cancelEditor">Back</button></div>`;
  const a = $("#ans"); if (a) a.focus({ preventScroll: true });
}
function showReviewing(name) {
  const b = body(); if (!b) return;
  b.innerHTML = `<div class="file">${I.file}<span>${esc(name)}</span></div><div class="review"><div class="spin"></div>Reviewing your work...</div>`;
  S.task.el.scrollIntoView({ behavior: S.lite ? "auto" : "smooth", block: "end" });
}
function showNote(sub) {
  const b = body(); if (!b) return;
  S.task.pendingSub = sub;
  b.innerHTML = `<div class="file">${I.file}<span>${esc(sub.name)}</span></div>
    <p class="small" style="margin-top:12px">We cannot read inside this file right now. Add 2 or 3 lines describing what it shows and what you did, and we will review your note.</p>
    <textarea class="ta" id="note" placeholder="Describe your work"></textarea>
    <div class="upl"><button class="btn pri" data-act="submitNote">Submit note</button><button class="link" data-act="cancelEditor">Back</button></div>`;
}
async function aiReview(st, sub) {
  if (!CONFIG.aiEnabled || S.aiFails >= 1) return null;
  if ((sub.image || "").length > 4000000) return null;
  const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 18000);
  try {
    const r = await fetch(CONFIG.apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
      body: JSON.stringify({ task: st.title + ": " + st.brief, rubric: st.rubric.map(x => ({ label: x.label, keywords: x.keywords })), text: sub.text || "", imageDataUrl: sub.image || "", fileName: sub.name }) });
    if (!r.ok) throw new Error("bad status");
    const j = await r.json();
    if (j.source !== "ai") return null;
    return j;
  } catch (e) { S.aiFails = (S.aiFails || 0) + 1; return null; } finally { clearTimeout(to); }
}
async function submitTask(sub) {
  const T = S.task; if (!T) return; const id = T.id;
  T.attempt++; T.last = sub;
  showReviewing(sub.name);
  const readable = (sub.text || "").trim().length >= 15;
  let res = null;
  if (readable || sub.image) {
    const ai = await aiReview(T.st, sub);
    if (id !== S.runId) return;
    if (ai) res = { verdict: ai.verdict, pct: clamp(Number(ai.score) || 60, 20, 98), notes: ai.notes && ai.notes.length ? ai.notes : ["Review the rubric points and strengthen the weakest one."], items: readable ? evaluateTask(sub.text, T.st).items : [], method: "ai" };
  }
  if (!res) {
    if (readable) res = evaluateTask(sub.text, T.st, { cap: sub.noted ? 88 : 0, method: sub.noted ? "rules-note" : "rules" });
    else { showNote(sub); T.attempt--; return; }
  }
  await new Promise(r => setTimeout(r, S.lite ? 200 : 1100));
  if (id !== S.runId) return;
  showResult(res, sub);
}
function methodLabel(m) { return m === "ai" ? "Reviewed by the AI reviewer" : m === "rules-note" ? "Reviewed by the rule-based reviewer from your written note" : "Reviewed by the rule-based reviewer (AI is offline)"; }
function showResult(res, sub) {
  const T = S.task, b = body(); if (!T || !b) return;
  const forced = res.verdict === "fix" && T.attempt >= 3;
  const chips = (res.items || []).map(i => `<span class="chip ${i.s >= 4 ? "ok" : "warn"}">${esc(i.label)} ${i.s}/5</span>`).join("");
  const file = `<div class="file">${I.file}<span>${esc(sub.name)}</span></div>`;
  if (res.verdict === "fix" && !forced) {
    T.failedOnce = true;
    b.innerHTML = `${file}<div class="fb warn"><h4>${I.sparkle} Fix this</h4><p>Close, but not ready to send. Please fix:</p><ul>${res.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
      <div class="upl" style="margin-top:6px"><button class="btn pri sm" data-act="editAgain">Edit and resubmit</button><button class="btn out sm" data-act="pick">${I.upload} Upload new version</button><button class="link" data-act="sample">Use a sample file</button></div>
      <p class="how">${methodLabel(res.method)}</p></div>`;
    T.el.scrollIntoView({ behavior: S.lite ? "auto" : "smooth", block: "end" });
    return;
  }
  const L = S.log[S.day];
  L.task = forced ? Math.min(res.pct, 70) : res.pct; L.method = res.method; L.taskTitle = T.st.title; L.excerpt = String(sub.text || "").trim().slice(0, 220);
  if (T.failedOnce && !forced) S.revised = true;
  b.innerHTML = `${file}<div class="fb ${forced ? "warn" : "ok"}"><h4>${forced ? I.sparkle + " Good effort, let's move on" : I.check + " Well done"}</h4>
    <p>${forced ? "Some points are still missing, but we will keep going. Read the notes and aim higher next time." : T.failedOnce ? "Much better. You acted on the feedback, and that is what great employees do." : "Clear, realistic and easy to act on. A manager could use this today."} Score: <b>${L.task}%</b></p>
    ${forced ? `<ul style="margin-top:6px">${res.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
    ${chips ? `<div class="chips">${chips}</div>` : ""}<p class="how">${methodLabel(res.method)}</p></div>`;
  const id = T.id; S.task = null;
  after(id, 1300, () => advance(id));
}
async function readPdf(file) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let out = "";
  for (let i = 1; i <= Math.min(doc.numPages, 6); i++) { const pg = await doc.getPage(i), tc = await pg.getTextContent(); out += tc.items.map(x => x.str).join(" ") + "\n"; }
  return out;
}
async function readDocx(file) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
  const r = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return r.value || "";
}
const readDataUrl = file => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file); });
async function handleFile(file) {
  if (!S.task) return;
  showReviewing(file.name);
  const ext = file.name.split(".").pop().toLowerCase(); let text = "", image = "";
  try {
    if (["txt", "md", "csv"].includes(ext)) text = await file.text();
    else if (ext === "pdf") text = await readPdf(file);
    else if (ext === "docx") text = await readDocx(file);
    else if (["png", "jpg", "jpeg", "webp"].includes(ext)) image = await readDataUrl(file);
  } catch (e) { /* fall through to note */ }
  submitTask({ name: file.name, text, image });
}

/* ---------- decisions, quiz, follow-up ---------- */
function openDecision(st, id) {
  S.decision = { st, id, left: 60, iv: null };
  modal(`<div class="hd"><span class="chip warn">Decision needed</span><span class="timer" id="dtimer" aria-live="off">1:00</span></div>
    <h2>${esc(st.q)}</h2><p class="muted small">You cannot do both. Choose what you start with, and decide before the clock runs out.</p>
    <div class="choices">${["a", "b"].map(k => `<button class="choice" data-act="decide" data-k="${k}"><b>${st[k].title}</b><span>${st[k].detail}</span></button>`).join("")}</div>`);
  S.decision.iv = setInterval(() => {
    const D = S.decision; if (!D || id !== S.runId) { clearInterval(D && D.iv); return; }
    D.left--; const t = $("#dtimer"); if (t) t.textContent = D.left >= 60 ? "1:00" : "0:" + String(Math.max(D.left, 0)).padStart(2, "0");
    if (D.left <= 0) decide(null);
  }, 1000);
}
function decide(k) {
  const D = S.decision; if (!D) return; S.decision = null; clearInterval(D.iv); closeModal();
  const L = S.log[S.day], mgr = mgrKey(), ty0 = null;
  if (k === null) {
    L.dec = 30; me("I ran out of time.");
    const ty = typing(mgr);
    after(D.id, 1000, () => { ty.remove(); say(mgr, "Time ran out, so I had to decide for you. In real work, hesitation has a cost. Next time, pick the option you can defend.", fmtMin(S.cur)); after(D.id, 800, () => advance(D.id)); });
    return;
  }
  const o = D.st[k]; L.dec = o.score;
  me(`I'll start with: ${o.title}.`);
  const ty = typing(mgr);
  after(D.id, 1000, () => { ty.remove(); say(mgr, o.fb, fmtMin(S.cur)); after(D.id, 800, () => advance(D.id)); });
}
function openQuiz(st, id) {
  S.quiz = { st, id, done: false };
  modal(`<div class="hd"><span class="chip blue">Afternoon check-in</span><span class="small muted">${fmt(st.t)}</span></div><h2>${esc(st.q)}</h2>
    <div class="choices" id="qopts">${st.options.map((o, i) => `<button class="choice" data-act="answer" data-i="${i}"><b>${esc(o)}</b></button>`).join("")}</div><div id="qfb"></div>`);
}

/* ---------- day summary ---------- */
function dayScore(L) { return avg([L.pScore, L.task, L.dec, L.quiz ? 100 : 40, L.rep, L.ex == null ? 60 : L.ex]); }
function summary() {
  const r = role(S.enroll.role), L = S.log[S.day] || {}, last = S.day >= S.enroll.days - 1, o = dayScore(L), m = PEOPLE[r.manager];
  const note = o >= 85 ? "Strong day. Your decisions were sound and your work was clear." : o >= 65 ? "Solid day with room to grow. Review the feedback and be sharper tomorrow." : "Tough day, and that is how people learn. Read the feedback closely.";
  return `${header("")}<main class="center screen">
    <span class="chip ok">${I.check} Day ${S.day + 1} complete</span>
    <h1 style="margin:10px 0 4px">Good work today</h1><p class="muted">${esc(r.days[S.day].theme)}</p>
    <div class="card" style="margin-top:18px"><div class="kv">
      <div><span class="k">Clocked in</span><span class="v">${L.in} <span class="chip ${L.status === "late" ? "warn" : "ok"}" style="margin-left:6px">${ARR[L.status].label}</span></span></div>
      <div><span class="k">Clocked out</span><span class="v">5:00 PM</span></div>
      <div><span class="k">Task</span><span class="v">${L.task}%</span></div>
      <div><span class="k">Explained thinking</span><span class="v">${(L.ex || 0) >= 60 ? "Clear" : "Needs more reasoning"}</span></div>
      <div><span class="k">Urgent decision</span><span class="v">${L.dec >= 80 ? "Strong call" : "Could be better"}</span></div>
      <div><span class="k">Afternoon check-in</span><span class="v">${L.quiz ? "Correct" : "Missed"}</span></div>
      <div><span class="k">Teamwork reply</span><span class="v">${L.rep >= 80 ? "Clear and constructive" : "Needs work"}</span></div>
    </div></div>
    <div class="msg" style="margin-top:18px"><div class="av" style="background:${m.color}">${m.ini}</div><div class="mb"><div class="mh"><b>${m.name}</b><span class="r">${m.role}</span></div><div class="txt">${note}</div></div></div>
    <button class="btn pri block" style="margin-top:22px" data-act="${last ? "toCert" : "nextDay"}">${last ? "Get your certificate" : "Start Day " + (S.day + 2)}</button>
    ${last ? "" : `<p class="xs muted" style="text-align:center;margin-top:8px">Day ${S.day + 2} opens tomorrow at 9:00 AM. Tap to jump ahead in this preview.</p>`}
  </main>${footer()}`;
}

/* ---------- certificate ---------- */
function makeCert() {
  const log = S.log.slice(0, S.enroll.days);
  const p = certPayload(S.user, S.enroll.role, S.enroll.days, log, today());
  const sc = scoreLog(log);
  const c = { code: certCode(p), token: certToken(p), role: S.enroll.role, n: S.enroll.days, date: today(), overall: sc.overall, onTime: sc.onTime, sc,
    evidence: log.map((l, i) => ({ day: i + 1, title: l.taskTitle, excerpt: l.excerpt, method: l.method, score: l.task })) };
  S.certs = S.certs.filter(x => x.code !== c.code); S.certs.push(c); persist(); return c;
}
function pseudoLog(p) {
  return p.lg.map(x => ({ status: x[0] === "e" ? "early" : x[0] === "o" ? "on" : "late", in: x[1], task: x[2], dec: x[3], quiz: !!x[4], rep: x[5], ex: x[6], method: x[7] === "a" ? "ai" : x[7] === "n" ? "rules-note" : "rules" }));
}
const METHOD_TXT = { ai: "AI review", rules: "Rule-based review", "rules-note": "Note-based review" };
function certificateHTML(p, code, link, mine, evidence) {
  const r = role(p.r) || role("pm"), m = PEOPLE[r.manager], ps = payloadScore(p), pl = pseudoLog(p);
  const onTime = pl.filter(l => l.status !== "late").length;
  const sc = { n: pl.length, dims: ps.dims, overall: ps.overall, onTime };
  const badges = badgesFor(sc, p.d);
  const y = new Date(p.dt + "T12:00:00");
  const li = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(r.title + " Career Simulation")}&organizationName=OfficeLife&issueYear=${y.getFullYear()}&issueMonth=${y.getMonth() + 1}&certId=${encodeURIComponent(code)}&certUrl=${encodeURIComponent(link)}`;
  S.liUrl = li; S.shareLink = link; S.shareText = `I completed a ${p.d}-day ${r.title} work simulation on OfficeLife (${ps.overall}% overall). Verify it here: ${link}`;
  return `<div class="paper" id="certpaper">
      <div class="brand">${LOGO(30)}<span>officelife</span></div>
      <div class="kicker">Career Simulation Certificate</div>
      <div class="name">${esc(p.n)}</div>
      <div class="kicker">${esc(p.u)}</div>
      <div class="kicker" style="margin-top:12px">has completed a ${p.d}-day work simulation as</div>
      <div class="role">${r.title}</div>
      <div class="kicker">at Tembea Logistics (simulated workplace)</div>
      <div class="pstats"><div><b>${p.d}</b><span>${p.d > 1 ? "workdays" : "workday"}</span></div><div><b>${onTime}/${pl.length}</b><span>on-time check-ins</span></div><div><b>${ps.overall}%</b><span>overall score</span></div></div>
      <div style="margin-bottom:10px"><span class="chip blue" style="background:#E5F0FF;color:#0056D2">${readiness(ps.overall)}</span></div>
      <div class="signrow"><div class="signer"><img class="sigimg" src="brand/signature-augustine-david.png" alt="Signature of Augustine David"><span class="sigline"></span><b>Augustine David</b><small>CEO, OfficeLife</small></div><div class="seal">VERIFIED<br>BY<br>OFFICELIFE</div></div>
      <div class="persona">Simulation manager: ${m.name}, ${m.role} (simulated character)</div>
      <div class="qrbox"><div id="qr" data-link="${esc(link)}" aria-label="QR code to verify this certificate"></div><div class="code">Issued ${prettyDate(p.dt)}<br>Certificate ID: <b>${code}</b><br>Scan or open the link to verify</div></div>
    </div>
    ${mine ? `<div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn pri" style="flex:1" data-act="linkedin">Add to LinkedIn</button><button class="btn out" style="flex:1" data-act="printCert">Download PDF</button><button class="btn out" style="flex:1" data-act="whatsapp">Share</button><button class="btn out" style="flex:1" data-act="copyLink">Copy link</button></div>` : ""}

    <section class="sect"><h2>What this certificate proves</h2><div class="card" style="margin-top:12px">
      ${Object.keys(DIM_LABELS).map(k => `<div class="skill"><div class="sh"><span>${DIM_LABELS[k]}</span><span>${ps.dims[k]}%</span></div><div class="bar"><i style="width:${ps.dims[k]}%"></i></div><p>${esc(dimEvidence(k, pl, sc))}</p></div>`).join("")}</div></section>
    ${badges.length ? `<section class="sect"><h2>Badges earned</h2><div class="grid3" style="margin-top:12px">${badges.map(b => `<div class="badge"><div class="bi">${I.star}</div><div><b>${b[0]}</b><div class="small muted">${b[1]}</div></div></div>`).join("")}</div></section>` : ""}
    <section class="sect"><h2>Work log</h2><div class="card" style="margin-top:12px">
      ${pl.map((l, i) => `<div class="logrow"><div class="lr"><b>Day ${i + 1}: ${esc(r.days[i] ? r.days[i].theme : "")}</b><span class="chip ${l.status === "late" ? "warn" : "ok"}">${ARR[l.status].label}</span></div>
        <div class="lr muted"><span>Clock in ${esc(l.in)} &middot; Clock out 5:00 PM</span><span>Task ${l.task}% &middot; Decision ${l.dec}% &middot; Check-in ${l.quiz ? "correct" : "missed"}</span></div>
        <div class="lr muted"><span>${METHOD_TXT[l.method]}</span><span>Explained thinking ${l.ex}%</span></div></div>`).join("")}</div></section>
    ${evidence && evidence.length ? `<section class="sect"><h2>Work samples</h2><p class="lead" style="margin-bottom:8px">Only you see these. You can choose to share them with employers.</p>${evidence.filter(e => e.excerpt).map(e => `<div class="card" style="margin-bottom:10px"><b>Day ${e.day}: ${esc(e.title)}</b> <span class="chip ok" style="margin-left:6px">${e.score}%</span><p class="small muted" style="margin-top:6px">${esc(e.excerpt)}${e.excerpt.length >= 220 ? "..." : ""}</p></div>`).join("")}</section>` : ""}
    <section class="sect"><div class="card"><h3>How this is verified</h3><p class="small muted" style="margin-top:6px">Each task is marked <b>AI review</b>, <b>Rule-based review</b> or <b>Note-based review</b>, so employers know how it was checked. This demo link carries the results and a tamper-check code. In the live version, results are stored and signed on OfficeLife's servers, and employers can request full work samples with the student's consent.</p></div></section>`;
}
function cert(arg) {
  const c = S.certs.find(x => x.code === arg) || S.certs[S.certs.length - 1];
  if (!c) return shell("", `<main class="center"><h1>No certificate yet</h1><p class="muted" style="margin:8px 0 16px">Finish a simulation to earn one.</p><button class="btn pri" data-act="go" data-to="/explore">Explore simulations</button></main>`);
  const cf = certFromToken(c.token);
  const link = baseUrl() + "#/verify/" + c.token;
  return shell("", `<main class="narrow" style="padding-top:20px">
    <span class="chip ok">${I.check} Simulation complete</span>
    <h1 style="margin:10px 0 4px">Congratulations, ${esc(S.user.name.split(" ")[0])}</h1><p class="muted" style="margin-bottom:20px">Your certificate is ready to share with employers.</p>
    ${certificateHTML(cf.p, c.code, link, true, c.evidence)}
    <button class="btn out block" style="margin-top:24px" data-act="go" data-to="/dashboard">Back to dashboard</button></main>`);
}
function verify(arg) {
  const r = certFromToken(arg);
  if (!r) return shell("", `<main class="narrow" style="padding-top:20px"><div class="verify bad">${I.alert}<div><b>We could not read this certificate</b><span>The link may be incomplete. Ask the student to share it again.</span></div></div></main>`);
  const link = baseUrl() + "#/verify/" + arg, code = certCode(r.p);
  return shell("", `<main class="narrow" style="padding-top:20px">
    <h1>Certificate check</h1>
    <div class="verify ${r.ok ? "ok" : "bad"}">${r.ok ? I.shield : I.alert}<div><b>${r.ok ? "Verified: this record matches its tamper-check code" : "Not verified: the data in this link was changed"}</b><span>${r.ok ? "Issued by OfficeLife. Scores below are the student's recorded results." : "Do not trust this record."}</span></div></div>
    <div style="margin-top:20px">${certificateHTML(r.p, code, link, false, null)}</div>
    <button class="btn out block" style="margin-top:24px" data-act="go" data-to="/employers">Back to talent search</button></main>`);
}
async function drawQR() {
  const el = $("#qr"); if (!el) return;
  try {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js");
    const q = qrcode(0, "L"); q.addData(el.dataset.link); q.make();
    el.innerHTML = q.createSvgTag(3, 0);
  } catch (e) { el.textContent = ""; }
}

/* ---------- actions ---------- */
const actions = {
  go: a => { const to = a.dataset.to; if (to === "/#faq") { nav("/"); setTimeout(() => { const f = $("#faq"); if (f) f.scrollIntoView({ behavior: "smooth" }); }, 60); } else nav(to); },
  drawer: openDrawer, closeDrawer,
  drawerGo: a => { closeDrawer(); nav(a.dataset.to); },
  closeSheet,
  theme: () => {
    const dark = S.theme ? S.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    S.theme = dark ? "light" : "dark"; store.set("theme", S.theme); applyTheme(); closeDrawer();
  },
  lite: () => { S.lite = !S.lite; store.set("lite", S.lite); applyTheme(); route(); },
  google: googleSignIn,
  googleDemo: () => { closeSheet(); S.form.name = "Demo Student"; S.form.email = "demo.student@gmail.com"; S.form.google = true; if (parseRoute().name === "login") nav("/signup"); else route(); },
  doSignup, doLogin,
  pickUni: a => { const inp = $("#" + a.dataset.id); inp.value = a.dataset.v; S.form[inp.dataset.f] = a.dataset.v; hideUniList(a.dataset.id); },
  setDays: a => { S.form.simDays = +a.dataset.n; const y = scrollY; route(); scrollTo(0, y); },
  enroll: a => {
    S.form.simDays = +a.dataset.n;
    if (!S.user) { S.next = "/sim/" + a.dataset.id; return nav("/signup"); }
    S.enroll = { role: a.dataset.id, days: +a.dataset.n }; S.day = 0; S.log = []; S.revised = false; S.aiFails = 0; nav("/clockin");
  },
  setArrival: a => { S.arrival = a.dataset.k; route(); },
  clockIn: () => { doClockIn(); route(); },
  enterWork: () => nav("/work"),
  leaveWork: () => { S.runId = 0; nav("/dashboard"); },
  pick: () => $("#file").click(),
  sample: () => { const T = S.task; if (!T) return; submitTask({ name: T.st.sampleName, text: T.attempt === 0 ? T.st.sampleBad : T.st.sampleGood }); },
  typeToggle: () => showEditor(""),
  cancelEditor: showPicker,
  editAgain: () => showEditor(S.task && S.task.last ? S.task.last.text : ""),
  submitText: () => { const v = ($("#ans") || {}).value || ""; if (wordCount(v) < 5) return toast("Write a little more first"); submitTask({ name: "Typed answer", text: v }); },
  submitNote: () => { const v = ($("#note") || {}).value || ""; const T = S.task; if (wordCount(v) < 5) return toast("Add a few words describing your work"); submitTask({ name: T.pendingSub.name, text: v, image: T.pendingSub.image, noted: true }); },
  reply: a => {
    const P = S.pending; if (!P) return; S.pending = null;
    const o = P.st.options[+a.dataset.i]; P.q.remove(); S.log[S.day].rep = o.score; me(o.label);
    const ty = typing(P.st.from);
    after(P.id, 900, () => { ty.remove(); say(P.st.from, o.resp, fmtMin(S.cur)); after(P.id, 700, () => advance(P.id)); });
  },
  fuSend: () => {
    const F = S.fu; if (!F) return; const v = ($("#fu-in") || {}).value || "";
    if (wordCount(v) < 3) return toast("Write at least a short sentence");
    S.fu = null; F.el.remove(); me(v);
    const r = evaluateFollowup(v, F.st); S.log[S.day].ex = r.pct;
    const ty = typing(F.st.from);
    after(F.id, 1000, () => { ty.remove(); say(F.st.from, r.feedback, fmtMin(S.cur)); after(F.id, 800, () => advance(F.id)); });
  },
  decide: a => decide(a.dataset.k),
  answer: a => {
    const Q = S.quiz; if (!Q || Q.done) return; Q.done = true;
    const i = +a.dataset.i, ok = i === Q.st.correct; S.log[S.day].quiz = ok;
    $$("#qopts .choice").forEach((b, k) => { if (k === Q.st.correct) b.classList.add("right"); else if (k === i) b.classList.add("wrong"); });
    $("#qfb").innerHTML = `<p class="why"><b>${ok ? "Correct." : "Not quite."}</b> ${Q.st.why}</p><button class="btn pri block" style="margin-top:14px" data-act="quizNext">Continue</button>`;
  },
  quizNext: () => { const Q = S.quiz; closeModal(); put("Back to work", "sys"); after(Q.id, 600, () => advance(Q.id)); },
  clockOut: () => { S.log[S.day].out = "5:00 PM"; nav("/summary"); },
  nextDay: () => { S.day++; nav("/clockin"); },
  toCert: () => { const c = makeCert(); nav("/cert/" + c.code); },
  mentorFilter: a => { S.mentorRole = a.dataset.r; route(); },
  bookOpen: a => openBooking(a.dataset.id),
  pickSlot: a => { S.form.slot = a.dataset.s; $$("[data-act=pickSlot]").forEach(b => b.setAttribute("aria-checked", String(b === a))); },
  confirmBooking,
  buyPlus: () => {
    if (!S.user) { S.next = "/premium"; return nav("/signup"); }
    if (S.user.plan === "plus") return toast("You are already on Premium");
    openSheet(`<div class="hd"><h2>Start Premium</h2><button class="icon" data-act="closeSheet" aria-label="Close">${I.x}</button></div><p class="muted">${naira(PRICING.plus)} per month. Cancel any time.</p>
      <p class="small muted" style="margin-top:8px">Demo payment. The live version uses Paystack.</p><button class="btn pri block" style="margin-top:14px" data-act="payPlus">Pay ${naira(PRICING.plus)} (demo)</button>`);
  },
  payPlus: () => { S.user.plan = "plus"; persist(); closeSheet(); toast("Welcome to Premium"); route(); },
  viewCand: a => viewCand(a.dataset.n),
  shortlist: a => { const n = a.dataset.n, i = S.shortlist.indexOf(n); if (i >= 0) S.shortlist.splice(i, 1); else S.shortlist.push(n); persist(); $("#cands").innerHTML = candCards(); },
  invite: a => inviteCand(a.dataset.n),
  sendInvite: () => { closeSheet(); toast("Invite sent (demo)"); },
  postSim: () => {
    const f = S.form; if (!(f.pco || "").trim() || !(f.prole || "").trim() || wordCount(f.ptask) < 5) return toast("Fill in all three fields");
    S.posts.push({ co: f.pco.trim(), role: f.prole.trim() }); persist(); f.pco = f.prole = f.ptask = ""; toast("Request received. We will contact you."); const y = scrollY; route(); scrollTo(0, y);
  },
  csv: downloadCSV,
  scrollTo: a => { const e = $("#" + a.dataset.id); if (e) e.scrollIntoView({ behavior: "smooth" }); },
  saveProfile,
  signout: () => { S.user = null; persist(); store.del("user"); toast("Signed out"); nav("/"); },
  linkedin: () => window.open(S.liUrl, "_blank", "noopener"),
  printCert: () => window.print(),
  whatsapp: () => window.open("https://wa.me/?text=" + encodeURIComponent(S.shareText), "_blank", "noopener"),
  copyLink: async () => { try { await navigator.clipboard.writeText(S.shareLink); toast("Link copied"); } catch (e) { prompt("Copy this link", S.shareLink); } }
};

document.addEventListener("click", e => {
  const a = e.target.closest("[data-act]");
  if (!e.target.closest(".combo")) $$("[data-combo]").forEach(i => hideUniList(i.id));
  if (!a) return;
  const f = actions[a.dataset.act]; if (f) f(a);
});
document.addEventListener("input", e => {
  const t = e.target, k = t.dataset && t.dataset.f; if (!k) return;
  S.form[k] = t.value;
  if (t.dataset.combo) renderUniList(t.id);
  if (t.dataset.live === "explore") { const q = t.value.toLowerCase(); const list = Object.keys(ROLES).filter(x => !q || ROLES[x].title.toLowerCase().includes(q) || ROLES[x].skills.join(" ").toLowerCase().includes(q)); $("#exlist").innerHTML = list.map(roleCard).join("") || '<p class="muted">No roles match your search.</p>'; }
  if (t.dataset.flt) { S.filters[k] = t.value; $("#cands").innerHTML = candCards(); }
});
document.addEventListener("change", e => {
  const t = e.target, k = t.dataset && t.dataset.f; if (!k) return;
  S.form[k] = t.value;
  if (t.dataset.flt) { S.filters[k] = t.value; $("#cands").innerHTML = candCards(); }
});
document.addEventListener("focusin", e => { if (e.target.dataset && e.target.dataset.combo) renderUniList(e.target.id); });
document.addEventListener("keydown", e => {
  const t = e.target;
  if (t.dataset && t.dataset.combo) {
    if (e.key === "Escape") hideUniList(t.id);
    if (e.key === "Enter") { e.preventDefault(); const first = $("#" + t.id + "-list button[data-v]"); if (first) { t.value = first.dataset.v; S.form[t.dataset.f] = t.value; hideUniList(t.id); } }
  }
  if (t.id === "fu-in" && e.key === "Enter") actions.fuSend();
});
$("#file").addEventListener("change", e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; });
window.addEventListener("hashchange", route);

applyTheme();
route();
