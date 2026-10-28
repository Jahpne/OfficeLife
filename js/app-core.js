/* =====================================================================
   OFFICELIFE APP  part A: core, layout, landing, auth
   ===================================================================== */

/* ---------- config (set these when you deploy) ---------- */
const CONFIG = Object.assign({
  apiUrl: "/api/review",       // serverless AI reviewer (Vercel). If unreachable, the rules-based reviewer is used.
  aiEnabled: true,
  googleClientId: "",          // paste a Google OAuth client ID here to enable real Google sign-in
  hackathonUni: "Wale University"
}, window.OFFICELIFE_CONFIG || {});

/* ---------- safe storage (works even where localStorage is blocked) ---------- */
const mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem("ol_" + k); return v ? JSON.parse(v) : (k in mem ? mem[k] : d); } catch (e) { return k in mem ? mem[k] : d; } },
  set(k, v) { mem[k] = v; try { localStorage.setItem("ol_" + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  del(k) { delete mem[k]; try { localStorage.removeItem("ol_" + k); } catch (e) { /* ignore */ } }
};

/* ---------- state ---------- */
const S = {
  user: store.get("user", null),
  certs: store.get("certs", []),
  bookings: store.get("bookings", []),
  shortlist: store.get("shortlist", []),
  posts: store.get("posts", []),
  theme: store.get("theme", ""),
  lite: store.get("lite", false),
  enroll: null,            // { role, days }
  day: 0, log: [], arrival: "on", revised: false,
  form: {}, runId: 0, cur: 540, step: 0, task: null, pending: null, decision: null, quiz: null, fu: null,
  filters: { role: "", uni: "", min: "", q: "" },
  mentorRole: "", next: ""
};
const persist = () => { store.set("user", S.user); store.set("certs", S.certs); store.set("bookings", S.bookings); store.set("shortlist", S.shortlist); store.set("posts", S.posts); };

/* ---------- icons ---------- */
const svg = (d, w = 22, extra = "") => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const I = {
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>', 24),
  x: svg('<path d="M6 6l12 12M18 6L6 18"/>', 22),
  back: svg('<path d="M15 6l-6 6 6 6"/>', 24),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 20),
  upload: svg('<path d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"/>', 20),
  file: svg('<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>', 18),
  theme: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 010 16z" fill="currentColor"/>', 22),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 22),
  sparkle: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', 18),
  alert: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3.5v.01"/>', 22),
  uni: svg('<path d="M3 10l9-5 9 5-9 5z"/><path d="M7 12.5V17c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5"/>', 22),
  brief: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>', 22),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>', 22),
  shield: svg('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>', 22),
  chart: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', 22),
  chat: svg('<path d="M4 5h16v11H9l-5 4z"/>', 22),
  star: svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', 20),
  google: '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>'
};

/* ---------- logo: bridge arch (university to office) with a clock ---------- */
const LOGO = (s = 34) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#0056D2"/><path d="M12 46 C12 22 52 22 52 46" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><path d="M8 46 H56" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><path d="M12 46 V54 M52 46 V54" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><circle cx="32" cy="37.5" r="6.5" fill="#FFB020"/><path d="M32 33.6 V37.5 H35.4" fill="none" stroke="#0B1E4D" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARCH_BG = `<svg class="archbg" viewBox="0 0 400 260" aria-hidden="true"><path d="M30 190 C30 30 370 30 370 190" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M0 190 H400" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M30 190 V250 M370 190 V250" stroke="#fff" stroke-width="22" stroke-linecap="round"/></svg>`;

/* ---------- small helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const app = $("#app");
const role = id => ROLES[id];
const today = () => new Date().toISOString().slice(0, 10);
const prettyDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const initials = n => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
const naira = n => "\u20A6" + Number(n).toLocaleString("en-NG");
const loaded = {};
function loadScript(url) {
  if (loaded[url]) return loaded[url];
  loaded[url] = new Promise((res, rej) => { const s = document.createElement("script"); s.src = url; s.onload = res; s.onerror = () => rej(new Error("load " + url)); document.head.appendChild(s); });
  return loaded[url];
}
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}
function applyTheme() {
  const r = document.documentElement;
  if (S.theme) r.dataset.theme = S.theme; else delete r.dataset.theme;
  document.body.classList.toggle("lite", !!S.lite);
}
const baseUrl = () => { const u = location.href.split("#")[0]; return u.startsWith("blob:") || u.startsWith("file:") || u === "about:srcdoc" ? "https://officelife.app/" : u; };

/* ---------- router ---------- */
function nav(path) {
  const target = "#" + path;
  if (location.hash === target) route(); else location.hash = target;
}
function parseRoute() {
  const h = (location.hash || "#/").slice(1);
  const parts = h.split("/").filter(Boolean);
  return { name: parts[0] || "home", arg: parts.slice(1).join("/") };
}
const PROTECTED = ["dashboard", "clockin", "work", "summary", "profile", "cert"];

function route() {
  S.runId = 0;
  closeSheet();
  const r = parseRoute();
  if (PROTECTED.includes(r.name) && !S.user) { S.next = "/" + r.name; return nav("/signup"); }
  if (["clockin", "work", "summary"].includes(r.name) && !S.enroll) return nav("/dashboard");
  const pages = { home, signup, login, dashboard, explore, sim, clockin, work, summary, cert, verify, employers, universities, premium, profile };
  const fn = pages[r.name] || home;
  const out = fn(r.arg);
  app.innerHTML = out;
  window.scrollTo(0, 0);
  document.title = "OfficeLife";
  const after = { work: startDay, cert: drawQR, verify: drawQR }[r.name];
  if (after) after(r.arg);
}

/* ---------- layout ---------- */
function header(active) {
  const links = [["explore", "Explore"], ["universities", "Universities"], ["employers", "Employers"], ["premium", "Premium"]];
  const right = S.user
    ? `<button class="row" data-act="go" data-to="/dashboard" aria-label="Open your dashboard"><span class="avatar">${esc(initials(S.user.name))}</span></button>`
    : `<button class="btn ghost sm" data-act="go" data-to="/login">Log in</button><button class="btn pri sm" data-act="go" data-to="/signup">Sign up</button>`;
  return `<header class="top"><div class="wrap row">
    <button class="icon burger" data-act="drawer" aria-label="Open menu">${I.menu}</button>
    <button class="brand" data-act="go" data-to="/" aria-label="OfficeLife home">${LOGO(34)}<span>officelife</span></button>
    <nav class="nav" aria-label="Main">${links.map(l => `<button data-act="go" data-to="/${l[0]}" ${active === l[0] ? 'aria-current="page"' : ""}>${l[1]}</button>`).join("")}</nav>
    <span class="sp"></span>${right}
  </div></header>`;
}
function footer() {
  return `<footer class="wrap"><div class="foot"><div class="cols2">
    <div><div class="brand" style="padding:0">${LOGO(30)}<span>officelife</span></div>
      <p style="margin-top:8px;max-width:34ch">Bridging the university to work gap with simulated workdays and verified evidence.</p>
      <p class="xs" style="margin-top:10px">Built for the NextGen AI Hackathon, Track 2.</p></div>
    <div><h4>Students</h4><button data-act="go" data-to="/explore">Explore simulations</button><button data-act="go" data-to="/premium">Premium mentors</button><button data-act="go" data-to="/signup">Sign up</button></div>
    <div><h4>Partners</h4><button data-act="go" data-to="/universities">For universities</button><button data-act="go" data-to="/employers">For employers</button></div>
    <div><h4>Help</h4><button data-act="go" data-to="/#faq">FAQ</button><button data-act="theme">Switch light or dark</button><button data-act="lite">${S.lite ? "Turn off" : "Turn on"} lite mode</button></div>
  </div></div></footer>`;
}
function shell(active, body) { return header(active) + body + footer(); }

/* ---------- reusable pieces ---------- */
function roleCard(k) {
  const r = role(k);
  return `<button class="course" data-act="go" data-to="/sim/${k}"><div class="org ${r.cls}">${r.short}</div>
    <div><div class="o">Tembea Logistics</div><div class="n">${r.title}</div><div class="m">Career simulation &middot; 1 to 3 workdays &middot; Certificate</div></div></button>`;
}
function dayPlanRail() {
  return `<div class="rail">${DAY_PLAN.map(p => `<div class="step"><div class="tm">${p[0]}</div><div class="tx"><b>${p[1]}</b><span class="small muted">${p[2]}</span></div></div>`).join("")}</div>`;
}
function ring(p) { return `<div class="ring" style="--p:${p}"><span>${p}</span></div>`; }

/* ---------- landing ---------- */
function home() {
  return shell("", `<main class="wrap">
    <section class="hero">${ARCH_BG}
      <div>
        <h1>Prove you can do the job before you apply</h1>
        <p>OfficeLife puts you through a simulated workday at a Nigerian company. Clock in, handle real tasks, make tough calls, and earn a verified certificate that employers can check.</p>
        <div class="cta"><button class="btn white" data-act="go" data-to="/signup">Sign up free</button><button class="btn out" style="color:#fff;border-color:#fff" data-act="go" data-to="/explore">See simulations</button></div>
      </div>
      <div class="widget" aria-hidden="true">
        <div class="xs" style="color:#C9D6FF">Monday &middot; Tembea Logistics</div>
        <div class="t">8:52 AM</div>
        <div class="l"><span class="dot"></span>Clocked in &middot; 8 minutes early</div>
        <div class="l"><span class="dot b"></span>9:30 Standup with Chidi</div>
        <div class="l"><span class="dot a"></span>11:30 Decision needed</div>
      </div>
    </section>

    <section class="sect"><h2>The gap is real</h2>
      <p class="lead">Nigeria's graduates have degrees. Employers say many still are not ready for day one.</p>
      <div class="stats">
        <div class="stat"><b>600,000+</b><span>university graduates every year</span></div>
        <div class="stat"><b>70%+</b><span>of employers struggle to find job-ready talent</span></div>
        <div class="stat"><b>9%</b><span>unemployment among people with post-secondary education in Q1 2024, nearly double the national average</span></div>
        <div class="stat"><b>60%+</b><span>of employers name soft skills as the biggest gap</span></div>
      </div>
      <p class="src">Sources: Brunel University London study on Nigerian graduate employability; BusinessDay; TechCabal Insights; a baseline soft-skills study cited on LinkedIn Nigeria. Figures are from these reports and may change.</p>
    </section>

    <section class="sect"><h2>How OfficeLife works</h2>
      <div class="how">
        <div class="card"><div class="ico">${I.clock}</div><b>1. Clock in</b><span class="small muted">Arrive at 9:00. Early, on time or late is recorded.</span></div>
        <div class="card"><div class="ico">${I.chat}</div><b>2. Do the work</b><span class="small muted">Chat with your team, finish real tasks, upload or type your work.</span></div>
        <div class="card"><div class="ico">${I.brief}</div><b>3. Decide under pressure</b><span class="small muted">Two urgent things, one hour. Explain your thinking.</span></div>
        <div class="card"><div class="ico">${I.shield}</div><b>4. Get verified</b><span class="small muted">A certificate with a link and QR code employers can check.</span></div>
      </div>
    </section>

    <section class="sect"><div class="panel">
      <div class="row" style="justify-content:space-between;align-items:baseline;margin-bottom:12px"><h2 style="font-size:20px">Start a simulation</h2><button class="link" data-act="go" data-to="/explore">See all</button></div>
      <div class="grid3">${["pm", "swe", "da"].map(roleCard).join("")}</div>
      <div class="chips" style="margin-top:14px"><span class="small muted" style="align-self:center">Coming soon:</span>${["Marketing Associate", "Customer Support", "Accountant", "UI/UX Designer"].map(x => `<span class="pill">${x}</span>`).join("")}</div>
    </div></section>

    <section class="sect"><h2>What makes it different</h2>
      <p class="lead">Courses teach. Virtual internships let you practise. OfficeLife shows employers how you behave at work.</p>
      <div class="card pad0 tscroll"><table class="tbl">
        <tr><th></th><th>Online courses</th><th>Self-paced virtual internships</th><th>OfficeLife</th></tr>
        ${[
          ["A timed workday with clock-in and urgent decisions", "No", "No", "Yes"],
          ["Feedback on your work", "Some", "Often not graded", "Every task"],
          ["Explain-your-thinking questions", "No", "Rarely", "Yes"],
          ["Employer-checkable certificate with scores", "Badge only", "Badge only", "Link and QR with evidence"],
          ["Built around Nigerian workplaces", "Rarely", "Mostly global employers", "Yes"],
          ["Works with little data, and without AI", "No", "No", "Yes"]
        ].map(r => `<tr><td><b>${r[0]}</b></td><td class="muted">${r[1]}</td><td class="muted">${r[2]}</td><td><b style="color:var(--blue)">${r[3]}</b></td></tr>`).join("")}
      </table></div>
    </section>

    <section class="sect"><h2>One workday, 10 to 15 minutes</h2>${dayPlanRail()}</section>

    <section class="sect"><div class="grid2">
      <div class="card"><div class="ico">${I.uni}</div><h3 style="margin-top:10px">For universities</h3>
        <p class="muted" style="margin:6px 0 12px">See how your students perform on real work scenarios, by department, and find the skills gap before employers do.</p><button class="btn out" data-act="go" data-to="/universities">See the campus dashboard</button></div>
      <div class="card"><div class="ico">${I.brief}</div><h3 style="margin-top:10px">For employers</h3>
        <p class="muted" style="margin:6px 0 12px">Search graduates by proven skills. See their clock-in record, scores and how their work was reviewed.</p><button class="btn out" data-act="go" data-to="/employers">See talent search</button></div>
    </div></section>

    <section class="sect faq" id="faq"><h2>Questions</h2>
      ${FAQ.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("")}
    </section>

    <section class="sect"><div class="promo"><h2 style="color:#fff">Your first day of work can start tonight</h2>
      <p>Pick a role, clock in, and see what you can do.</p><div><button class="btn white" data-act="go" data-to="/signup">Sign up free</button></div></div></section>
  </main>`);
}

/* ---------- university combobox ---------- */
function uniField(id, value, err, key = "uni") {
  return `<div class="field ${err ? "err" : ""}"><label for="${id}">University</label>
    <div class="combo"><input id="${id}" data-f="${key}" data-combo="1" value="${esc(value || "")}" placeholder="Start typing, for example Wale University" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="${id}-list">
    <div class="listbox" id="${id}-list" role="listbox" hidden></div></div>
    <span class="hint">Required. Your university can see how its students are doing, and employers can find graduates by campus.</span>
    ${err ? `<span class="errmsg">${esc(err)}</span>` : ""}</div>`;
}
function renderUniList(id) {
  const input = $("#" + id), list = $("#" + id + "-list");
  if (!input || !list) return;
  const res = searchUnis(input.value, UNIS);
  if (!res.length) { list.innerHTML = `<button type="button" disabled>No match. Choose "Other Nigerian university".</button>`; }
  else list.innerHTML = res.map(u => `<button type="button" role="option" data-act="pickUni" data-id="${id}" data-v="${esc(u)}">${esc(u)}${u === CONFIG.hackathonUni ? '<span class="tag">Hackathon host</span>' : ""}</button>`).join("");
  list.hidden = false; input.setAttribute("aria-expanded", "true");
}
function hideUniList(id) { const l = $("#" + id + "-list"), i = $("#" + id); if (l) l.hidden = true; if (i) i.setAttribute("aria-expanded", "false"); }

/* ---------- sign up / log in ---------- */
function signup() {
  const f = S.form, e = f.errors || {};
  const careers = [["", "Choose one"], ["pm", "Project Manager"], ["swe", "Software Engineer"], ["da", "Data Analyst"], ["unsure", "Not sure yet"]];
  return `${header("")}<main class="center screen" style="padding-top:28px">
    <h1>Create your free account</h1>
    <p class="muted" style="margin-top:6px">Build your proof of work. It takes a minute.</p>
    <div class="card" style="margin-top:18px">
      <button class="google" data-act="google">${I.google}<span>Continue with Google</span></button>
      <div class="or">or use your email</div>
      <div class="field ${e.name ? "err" : ""}"><label for="f-name">Full name (as on your certificate)</label><input id="f-name" data-f="name" value="${esc(f.name || "")}" autocomplete="name" ${f.google ? "readonly" : ""}>${e.name ? `<span class="errmsg">${e.name}</span>` : ""}</div>
      <div class="field ${e.email ? "err" : ""}"><label for="f-email">Email</label><input id="f-email" type="email" data-f="email" value="${esc(f.email || "")}" autocomplete="email" ${f.google ? "readonly" : ""}>${e.email ? `<span class="errmsg">${e.email}</span>` : ""}</div>
      ${f.google ? `<p class="small muted" style="margin-top:10px">${I.check} Signed in with Google. No password needed.</p>` : `<div class="field ${e.pw ? "err" : ""}"><label for="f-pw">Password</label><input id="f-pw" type="password" data-f="pw" value="${esc(f.pw || "")}" autocomplete="new-password"><span class="hint">At least 8 characters.</span>${e.pw ? `<span class="errmsg">${e.pw}</span>` : ""}</div>`}
      ${uniField("f-uni", f.uni, e.uni)}
      <div class="field ${e.level ? "err" : ""}"><label for="f-level">Level</label><select id="f-level" data-f="level"><option value="">Choose one</option>${LEVELS.map(l => `<option ${f.level === l ? "selected" : ""}>${l}</option>`).join("")}</select>${e.level ? `<span class="errmsg">${e.level}</span>` : ""}</div>
      <div class="field"><label for="f-course">Course of study <span class="muted">(optional)</span></label><input id="f-course" data-f="course" value="${esc(f.course || "")}" placeholder="e.g. Computer Science"></div>
      <div class="field"><label for="f-target">Career you want <span class="muted">(optional)</span></label><select id="f-target" data-f="target">${careers.map(c => `<option value="${c[0]}" ${f.target === c[0] ? "selected" : ""}>${c[1]}</option>`).join("")}</select></div>
      <label class="check"><input type="checkbox" id="f-terms" ${f.terms ? "checked" : ""}><span>I agree to the terms and to my results being visible to my university and to employers I choose to share them with.</span></label>
      ${e.terms ? `<span class="errmsg">${e.terms}</span>` : ""}
      <button class="btn pri block" style="margin-top:18px" data-act="doSignup">Create account</button>
      <p class="small muted" style="text-align:center;margin-top:12px">Already have an account? <button class="link" data-act="go" data-to="/login">Log in</button></p>
    </div>
    <p class="xs muted" style="margin-top:12px">Demo build: accounts are saved on this device only. The live version uses secure server accounts.</p>
  </main>${footer()}`;
}
function doSignup() {
  const f = S.form, e = {};
  f.name = (f.name || "").trim();
  if (f.name.length < 3 || !f.name.includes(" ")) e.name = "Enter your first and last name.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!f.google && (f.pw || "").length < 8) e.pw = "Use at least 8 characters.";
  const uni = canonUni(f.uni, UNIS);
  if (!uni) e.uni = "Choose your university from the list. If it is not listed, choose Other.";
  if (!f.level) e.level = "Choose your level.";
  f.terms = $("#f-terms") ? $("#f-terms").checked : f.terms;
  if (!f.terms) e.terms = "Please accept the terms to continue.";
  f.errors = e;
  if (Object.keys(e).length) { route(); const first = $(".field.err input,.field.err select"); if (first) first.focus(); return; }
  S.user = { name: f.name, email: f.email.trim().toLowerCase(), uni, level: f.level, course: f.course || "", target: f.target || "", plan: "free", google: !!f.google, joined: today() };
  persist();
  const accounts = store.get("accounts", {}); accounts[S.user.email] = S.user; store.set("accounts", accounts);
  S.form = {};
  toast("Welcome to OfficeLife, " + S.user.name.split(" ")[0]);
  const go = S.next || "/dashboard"; S.next = "";
  nav(go);
}
function login() {
  const f = S.form, e = f.lerr;
  return `${header("")}<main class="center screen" style="padding-top:28px">
    <h1>Log in</h1>
    <div class="card" style="margin-top:18px">
      <button class="google" data-act="google">${I.google}<span>Continue with Google</span></button>
      <div class="or">or</div>
      <div class="field"><label for="l-email">Email</label><input id="l-email" type="email" data-f="lemail" value="${esc(f.lemail || "")}" autocomplete="email"></div>
      <div class="field"><label for="l-pw">Password</label><input id="l-pw" type="password" data-f="lpw" autocomplete="current-password"></div>
      ${e ? `<p class="errmsg" style="margin-top:10px">${esc(e)}</p>` : ""}
      <button class="btn pri block" style="margin-top:18px" data-act="doLogin">Log in</button>
      <p class="small muted" style="text-align:center;margin-top:12px">New here? <button class="link" data-act="go" data-to="/signup">Create an account</button></p>
    </div>
    <p class="xs muted" style="margin-top:12px">Demo build: only accounts created on this device can log in.</p>
  </main>${footer()}`;
}
function doLogin() {
  const f = S.form, accounts = store.get("accounts", {});
  const u = accounts[(f.lemail || "").trim().toLowerCase()];
  if (!u) { f.lerr = "No account with that email on this device. Sign up first."; return route(); }
  S.user = u; f.lerr = ""; persist(); toast("Welcome back, " + u.name.split(" ")[0]); nav(S.next || "/dashboard"); S.next = "";
}

/* ---------- google sign-in: real when a client ID is set, demo otherwise ---------- */
async function googleSignIn() {
  if (!CONFIG.googleClientId) {
    openSheet(`<div class="hd"><h2>Choose an account</h2><button class="icon" data-act="closeSheet" aria-label="Close">${I.x}</button></div>
      <p class="small muted">Demo mode. Real Google sign-in turns on when a Google client ID is added to the config.</p>
      <div class="choices"><button class="choice" data-act="googleDemo"><b>Demo Student</b><span>demo.student@gmail.com</span></button></div>`);
    return;
  }
  try {
    await loadScript("https://accounts.google.com/gsi/client");
    google.accounts.id.initialize({
      client_id: CONFIG.googleClientId,
      callback: resp => {
        const p = JSON.parse(b64d(resp.credential.split(".")[1]));
        S.form.name = p.name || ""; S.form.email = p.email || ""; S.form.google = true;
        const accounts = store.get("accounts", {}); const known = accounts[(p.email || "").toLowerCase()];
        if (known) { S.user = known; persist(); nav("/dashboard"); } else nav("/signup"), route();
      }
    });
    google.accounts.id.prompt();
  } catch (e) { toast("Could not reach Google. Use email for now."); }
}
