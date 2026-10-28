/* =====================================================================
   OFFICELIFE APP  part B: student, partner and premium pages
   ===================================================================== */

const PRICING = { plus: 2500, campusPerStudent: 1000, sponsored: 100000 }; // pilot pricing, to be validated

/* ---------- dashboard ---------- */
function dashboard() {
  const u = S.user, first = u.name.split(" ")[0];
  const certs = S.certs;
  const avgScore = certs.length ? avg(certs.map(c => c.overall)) : 0;
  const onTimeRate = certs.length ? Math.round(certs.reduce((a, c) => a + c.onTime, 0) / certs.reduce((a, c) => a + c.n, 0) * 100) : 0;
  const latest = certs[certs.length - 1];
  const badges = latest ? badgesFor(latest.sc, latest.n) : [];
  return shell("", `<main class="wrap">
    <div class="hello"><h1>Hi ${esc(first)}</h1>
      <div class="chips" style="margin-top:8px"><span class="chip blue">${I.uni}&nbsp;${esc(u.uni)}</span><span class="chip">${esc(u.level)}</span><span class="chip ${u.plan === "plus" ? "ok" : ""}">${u.plan === "plus" ? "Premium" : "Free plan"}</span></div></div>

    <section class="sect" style="margin-top:18px"><div class="stats">
      <div class="stat"><b>${certs.length}</b><span>simulations completed</span></div>
      <div class="stat"><b>${certs.length ? avgScore + "%" : "-"}</b><span>average score</span></div>
      <div class="stat"><b>${certs.length ? onTimeRate + "%" : "-"}</b><span>on-time check-ins</span></div>
      <div class="stat"><b>${badges.length}</b><span>badges from your latest run</span></div>
    </div></section>

    <section class="sect"><h2>${certs.length ? "Start another simulation" : "Start your first workday"}</h2>
      <p class="lead">Pick a role. Each workday takes 10 to 15 minutes.</p>
      <div class="grid3">${["pm", "swe", "da"].map(roleCard).join("")}</div></section>

    ${certs.length ? `<section class="sect"><h2>Your certificates</h2><div class="grid2" style="margin-top:12px">
      ${certs.slice().reverse().map((c, i) => `<div class="card"><div class="row"><div class="org ${role(c.role).cls}">${role(c.role).short}</div><div><b>${role(c.role).title}</b><div class="small muted">${c.n}-day simulation &middot; ${prettyDate(c.date)}</div></div></div>
        <div class="row" style="margin-top:12px;justify-content:space-between"><span class="chip ok">${c.overall}% &middot; ${readiness(c.overall)}</span><button class="btn out sm" data-act="go" data-to="/cert/${c.code}">View</button></div></div>`).join("")}
    </div></section>` : ""}

    ${badges.length ? `<section class="sect"><h2>Badges</h2><div class="grid3" style="margin-top:12px">${badges.map(b => `<div class="badge"><div class="bi">${I.star}</div><div><b>${b[0]}</b><div class="small muted">${b[1]}</div></div></div>`).join("")}</div></section>` : ""}

    ${S.bookings.length ? `<section class="sect"><h2>Your mentor sessions</h2><div class="card" style="margin-top:12px">${S.bookings.map(b => `<div class="logrow"><div class="lr"><b>${esc(b.mentor)}</b><span class="chip ok">Booked</span></div><div class="lr muted"><span>${esc(b.title)}</span><span>${esc(b.slot)}</span></div></div>`).join("")}</div></section>` : ""}

    ${u.plan !== "plus" ? `<section class="sect"><div class="promo"><h2 style="color:#fff">Practise with real mentors</h2><p>Premium adds live mock sessions with experienced professionals, human review of your final project, and a Verified+ badge on your certificate.</p><div><button class="btn white" data-act="go" data-to="/premium">See Premium</button></div></div></section>` : ""}
  </main>`);
}

/* ---------- explore ---------- */
function explore() {
  const q = (S.form.exq || "").toLowerCase();
  const list = Object.keys(ROLES).filter(k => !q || ROLES[k].title.toLowerCase().includes(q) || ROLES[k].skills.join(" ").toLowerCase().includes(q));
  return shell("explore", `<main class="wrap">
    <div class="hello"><h1>Explore simulations</h1><p class="muted" style="margin-top:6px">Choose a role and experience a real workday at Tembea Logistics.</p></div>
    <div class="field" style="max-width:420px"><label class="sr" for="exq">Search</label><input id="exq" data-f="exq" data-live="explore" value="${esc(S.form.exq || "")}" placeholder="Search roles or skills"></div>
    <section class="sect"><div class="grid3" id="exlist">${list.map(roleCard).join("") || '<p class="muted">No roles match your search.</p>'}</div></section>
    <section class="sect"><h2>More careers coming soon</h2><div class="chips" style="margin-top:12px">${["Marketing Associate", "Customer Support", "Accountant", "UI/UX Designer", "Sales Executive", "HR Assistant"].map(x => `<span class="pill">${x}</span>`).join("")}</div></section>
  </main>`);
}

/* ---------- simulation page ---------- */
function sim(id) {
  const r = role(id) || role("pm"); id = r.id;
  const days = S.form.simDays || 1;
  const lens = [[1, "1 day", "About 12 minutes"], [2, "2 days", "About 25 minutes in total"], [3, "3 days", "About 40 minutes in total"]];
  return shell("explore", `<main>
    <section class="wash"><div class="wrap">
      <div class="crumbs"><button data-act="go" data-to="/">Home</button>&rsaquo;<button data-act="go" data-to="/explore">Simulations</button>&rsaquo;<span>${r.title}</span></div>
      <h1>${r.title} Simulation</h1>
      <p class="muted" style="margin-top:8px;max-width:60ch">${r.blurb}</p>
      <p class="small" style="margin-top:12px">Part of <b>OfficeLife Career Simulations</b></p>
      <div class="row" style="margin-top:10px;flex-wrap:wrap"><div class="org ${r.cls}" style="width:28px;height:28px;font-size:11px">TL</div><span class="small">Manager: <b>${PEOPLE[r.manager].name}</b> (simulated)</span><span class="chip blue">New</span></div>
    </div></section>
    <div class="wrap">
      <div class="facts">
        <div class="fact"><b>${days} ${days > 1 ? "workdays" : "workday"}</b><span>Experience a real day at the office</span></div>
        <div class="fact"><b>Beginner level</b><span>No prior experience required</span></div>
        <div class="fact"><b>10 to 15 minutes a day</b><span>Learn at your own pace</span></div>
        <div class="fact"><b>Verified certificate</b><span>Link, QR code and scores</span></div>
      </div>
      <section class="sect"><div class="card" style="max-width:640px">
        <h2 style="font-size:20px">Set up your simulation</h2>
        <p class="small muted" style="margin:4px 0 14px">Choose how long you want to work.</p>
        <div class="choices" role="radiogroup" aria-label="Simulation length">${lens.map(l => `<button class="opt" role="radio" aria-checked="${days === l[0]}" data-act="setDays" data-n="${l[0]}" data-id="${id}"><span class="radio"></span><div><b>${l[1]}</b><span>${l[2]}</span></div></button>`).join("")}</div>
        <button class="btn pri block" style="margin-top:18px" data-act="enroll" data-id="${id}" data-n="${days}">${S.user ? "Enroll for free" : "Sign up to enroll"}</button>
        <p class="xs muted" style="margin-top:8px;text-align:center">Starts now &middot; Your arrival time is logged against a 9:00 AM shift</p>
      </div></section>
      <section class="sect"><h2>What you'll learn</h2><ul class="checks" style="margin-top:12px">${r.learn.map(x => `<li>${I.check}<span>${x}</span></li>`).join("")}</ul></section>
      <section class="sect"><h2>Skills you'll gain</h2><div class="chips" style="margin-top:12px">${r.skills.map(x => `<span class="chip">${x}</span>`).join("")}</div></section>
      <section class="sect"><h2>Your ${days > 1 ? days + " days" : "day"} at Tembea</h2><div class="grid3" style="margin-top:12px">${r.days.slice(0, days).map((d, i) => `<div class="card"><span class="chip blue">Day ${i + 1}</span><h3 style="margin-top:8px">${esc(d.theme)}</h3></div>`).join("")}</div></section>
      <section class="sect"><h2>How each day runs</h2>${dayPlanRail()}</section>
      <section class="sect"><h2>Jobs this prepares you for</h2><p class="muted" style="margin-top:6px">${r.jobs}</p></section>
      <section class="sect"><h2>Details to know</h2><div class="card kv" style="margin-top:12px">
        <div><span class="k">Assessments</span><span class="v">Reviewed on every task</span></div>
        <div><span class="k">Check-ins</span><span class="v">Clock in and out logged</span></div>
        <div><span class="k">Certificate</span><span class="v">Verified link and QR</span></div>
        <div><span class="k">Language</span><span class="v">English</span></div></div></section>
    </div></main>`);
}

/* ---------- premium ---------- */
function premium() {
  const free = ["All 1, 2 and 3-day simulations", "Reviewed feedback on every task", "Verified certificate with link and QR", "Badges and your skills profile"];
  const plus = ["Everything in Free", "2 live mock sessions a month with a professional mentor", "Human review of your final project", "Verified+ badge on your certificate", "Interview practice and CV feedback"];
  const li = a => a.map(x => `<li>${I.check}<span>${x}</span></li>`).join("");
  const ms = MENTORS.filter(m => !S.mentorRole || m.role === S.mentorRole);
  return shell("premium", `<main class="wrap">
    <div class="hello"><h1>Learn from people who do the job</h1><p class="muted" style="margin-top:6px;max-width:60ch">The simulation is free. Premium adds real professionals: live practice, human review, and a stronger certificate.</p></div>
    <section class="sect" style="margin-top:12px"><div class="grid2">
      <div class="plan"><h3>Free</h3><div class="price">${naira(0)}<small> forever</small></div><ul>${li(free)}</ul><button class="btn out block" data-act="go" data-to="${S.user ? "/explore" : "/signup"}">${S.user ? "Browse simulations" : "Sign up free"}</button></div>
      <div class="plan hot"><span class="chip blue" style="width:fit-content">Most popular</span><h3>Premium</h3><div class="price">${naira(PRICING.plus)}<small> / month</small></div><ul>${li(plus)}</ul>
        <button class="btn pri block" data-act="buyPlus">${S.user && S.user.plan === "plus" ? "You are on Premium" : "Start Premium"}</button></div>
    </div><p class="src">Pilot pricing, subject to change. Payments use Paystack in the live version; here the payment step is a demo.</p></section>

    <section class="sect"><h2>Book a mentor</h2><p class="lead">Sample mentor profiles. In the live version these are vetted professionals from partner companies.</p>
      <div class="chips" style="margin-bottom:12px">${[["", "All"], ["pm", "Project Manager"], ["swe", "Software"], ["da", "Data"]].map(r => `<button class="pill" aria-pressed="${S.mentorRole === r[0]}" data-act="mentorFilter" data-r="${r[0]}" style="${S.mentorRole === r[0] ? "border-color:var(--blue);color:var(--blue)" : ""}">${r[1]}</button>`).join("")}</div>
      <div class="grid3">${ms.map(m => `<div class="card"><div class="row"><div class="av" style="background:${m.color}">${m.ini}</div><div><b>${m.name}</b><div class="small muted">${m.title}</div></div></div>
        <p class="small muted" style="margin:10px 0">Next slots: ${m.slots.join(", ")}</p><button class="btn out block" data-act="bookOpen" data-id="${m.id}">Book a session</button></div>`).join("")}</div></section>

    <section class="sect"><h2>For universities and employers</h2><div class="grid2" style="margin-top:12px">
      <div class="card"><div class="ico">${I.uni}</div><h3 style="margin-top:10px">Campus license</h3><p class="muted" style="margin:6px 0">Every student gets Premium, and your career office gets a live cohort dashboard.</p><b>From ${naira(PRICING.campusPerStudent)} per student per year</b><div style="margin-top:12px"><button class="btn out" data-act="go" data-to="/universities">See the dashboard</button></div></div>
      <div class="card"><div class="ico">${I.brief}</div><h3 style="margin-top:10px">Sponsored simulations</h3><p class="muted" style="margin:6px 0">Turn your real entry-level tasks into a simulation and meet candidates who already did them.</p><b>From ${naira(PRICING.sponsored)} per simulation</b><div style="margin-top:12px"><button class="btn out" data-act="go" data-to="/employers">See talent search</button></div></div>
    </div></section>
  </main>`);
}
function openBooking(id) {
  const m = MENTORS.find(x => x.id === id);
  if (!S.user) { S.next = "/premium"; toast("Sign up to book a mentor"); return nav("/signup"); }
  S.form.slot = ""; S.form.mentor = id;
  openSheet(`<div class="hd"><h2>Book ${esc(m.name)}</h2><button class="icon" data-act="closeSheet" aria-label="Close">${I.x}</button></div>
    <p class="small muted">${esc(m.title)} &middot; 45-minute live session</p>
    <div class="choices" role="radiogroup">${m.slots.map(s => `<button class="opt" role="radio" aria-checked="false" data-act="pickSlot" data-s="${esc(s)}"><span class="radio"></span><div><b>${esc(s)}</b></div></button>`).join("")}</div>
    <p class="small" style="margin-top:14px">${S.user.plan === "plus" ? "Included in your Premium plan." : "Premium is " + naira(PRICING.plus) + " a month and includes 2 sessions."}</p>
    <button class="btn pri block" style="margin-top:14px" data-act="confirmBooking">${S.user.plan === "plus" ? "Confirm booking" : "Pay with Paystack (demo) and book"}</button>`);
}
function confirmBooking() {
  const m = MENTORS.find(x => x.id === S.form.mentor);
  if (!S.form.slot) return toast("Choose a time slot first");
  S.user.plan = "plus";
  S.bookings.push({ mentor: m.name, title: m.title, slot: S.form.slot });
  persist(); closeSheet(); toast("Session booked. A calendar invite would be sent."); nav("/dashboard");
}

/* ---------- employers ---------- */
function allCands() {
  const sample = SAMPLE_CANDS.map(c => ({ ...c, sample: true, overall: avg(Object.values(c.s)) }));
  const mine = S.certs.map(c => ({ name: S.user ? S.user.name + " (you)" : "You", uni: S.user ? S.user.uni : "", role: c.role, days: c.n, s: c.sc.dims, overall: c.overall, mine: true, token: c.token }));
  return mine.concat(sample);
}
function filterCands() {
  const f = S.filters;
  return allCands().filter(c => (!f.role || c.role === f.role) && (!f.uni || c.uni === f.uni) && (!f.min || c.overall >= +f.min) && (!f.q || c.name.toLowerCase().includes(f.q.toLowerCase())))
    .sort((a, b) => b.overall - a.overall);
}
function candCards() {
  const list = filterCands();
  if (!list.length) return `<div class="card"><p class="muted">No candidates match these filters. Try lowering the minimum score.</p></div>`;
  return list.map(c => `<div class="card cand"><div class="top1">${ring(c.overall)}<div style="min-width:0"><b>${esc(c.name)}</b><div class="small muted">${esc(c.uni)}</div></div></div>
    <div class="chips"><span class="chip blue">${role(c.role).title}</span><span class="chip">${c.days}-day</span><span class="chip ok">${readiness(c.overall)}</span><span class="chip ${c.s.punct >= 90 ? "ok" : "warn"}">Punctuality ${c.s.punct}%</span></div>
    <div class="row" style="flex-wrap:wrap"><button class="btn out sm" data-act="viewCand" data-n="${esc(c.name)}">View evidence</button>
    <button class="btn sm ${S.shortlist.includes(c.name) ? "pri" : "out"}" data-act="shortlist" data-n="${esc(c.name)}">${S.shortlist.includes(c.name) ? "Shortlisted" : "Shortlist"}</button>
    <button class="btn ghost sm" data-act="invite" data-n="${esc(c.name)}">Invite</button></div></div>`).join("");
}
function employers() {
  const f = S.filters;
  const unis = Array.from(new Set(allCands().map(c => c.uni))).sort();
  return shell("employers", `<main class="wrap">
    <section class="hero" style="margin-top:16px">${ARCH_BG}<div><h1>Hire on proof, not just paper</h1><p>See how candidates behave in a real workday: punctuality, task quality, decisions under pressure and how they explain their thinking. Every score links to evidence.</p>
      <div class="cta"><button class="btn white" data-act="scrollTo" data-id="talent">Search talent</button><button class="btn out" style="color:#fff;border-color:#fff" data-act="scrollTo" data-id="post">Post a simulation</button></div></div>
      <div class="widget" aria-hidden="true"><div class="xs" style="color:#C9D6FF">What you see on every candidate</div><div class="l"><span class="dot"></span>Clock-in record</div><div class="l"><span class="dot b"></span>Task scores and review method</div><div class="l"><span class="dot a"></span>Decisions and explanations</div><div class="l"><span class="dot"></span>Verification link and QR</div></div></section>

    <section class="sect" id="talent"><h2>Talent search</h2><div class="sample" style="margin:10px 0 14px">Sample data. Candidates below are fictional, except any certificate you earn yourself.</div>
      <div class="filters">
        <select data-f="role" data-flt="1" aria-label="Role"><option value="">All roles</option>${Object.keys(ROLES).map(k => `<option value="${k}" ${f.role === k ? "selected" : ""}>${ROLES[k].title}</option>`).join("")}</select>
        <select data-f="uni" data-flt="1" aria-label="University"><option value="">All universities</option>${unis.map(u => `<option ${f.uni === u ? "selected" : ""}>${esc(u)}</option>`).join("")}</select>
        <select data-f="min" data-flt="1" aria-label="Minimum score"><option value="">Any score</option>${[70, 80, 90].map(n => `<option value="${n}" ${String(f.min) === String(n) ? "selected" : ""}>${n}%+ overall</option>`).join("")}</select>
        <input data-f="q" data-flt="1" value="${esc(f.q)}" placeholder="Search by name" aria-label="Search by name">
      </div>
      <div class="grid2" id="cands" style="margin-top:14px">${candCards()}</div></section>

    <section class="sect" id="post"><h2>Post a sponsored simulation</h2><p class="lead">Turn a real entry-level task from your company into a simulation. Candidates complete it, and you meet the ones who did it well.</p>
      <div class="card" style="max-width:640px">
        <div class="field"><label for="p-co">Company</label><input id="p-co" data-f="pco" value="${esc(S.form.pco || "")}"></div>
        <div class="field"><label for="p-role">Role</label><input id="p-role" data-f="prole" value="${esc(S.form.prole || "")}" placeholder="e.g. Customer Support Associate"></div>
        <div class="field"><label for="p-task">A real task a new hire would do</label><textarea id="p-task" data-f="ptask" placeholder="Describe one real task in 2 or 3 lines">${esc(S.form.ptask || "")}</textarea></div>
        <button class="btn pri block" style="margin-top:16px" data-act="postSim">Request this simulation</button>
        <p class="xs muted" style="margin-top:8px">From ${naira(PRICING.sponsored)} per simulation (pilot pricing).</p>
        ${S.posts.length ? `<div style="margin-top:14px">${S.posts.map(p => `<div class="logrow"><div class="lr"><b>${esc(p.role)} at ${esc(p.co)}</b><span class="chip ok">Requested</span></div></div>`).join("")}</div>` : ""}
      </div></section>
  </main>`);
}
function viewCand(name) {
  const c = allCands().find(x => x.name === name);
  if (!c) return;
  const tok = c.token || certToken(sampleToPayload(c, "2026-10-20"));
  nav("/verify/" + tok);
}
function inviteCand(name) {
  openSheet(`<div class="hd"><h2>Invite ${esc(name)}</h2><button class="icon" data-act="closeSheet" aria-label="Close">${I.x}</button></div>
    <div class="field"><label for="inv">Message</label><textarea id="inv">Hi ${esc(name.split(" ")[0])}, we reviewed your OfficeLife simulation and were impressed. We would like to invite you for a short interview.</textarea></div>
    <button class="btn pri block" style="margin-top:14px" data-act="sendInvite">Send invite (demo)</button>`);
}

/* ---------- universities ---------- */
const COHORT = { enrolled: 248, started: 211, completed: 152, avg: 84, minutes: 36, weekly: [12, 28, 41, 53, 67, 74] };
const DEPTS = [["Computer Science", 88], ["Business Administration", 84], ["Accounting", 81], ["Mass Communication", 79], ["Engineering", 86], ["Economics", 83]];
function universities() {
  const uni = S.user && S.user.uni && !S.user.uni.startsWith("Not a student") ? S.user.uni : CONFIG.hackathonUni;
  const dimAvg = {}; Object.keys(DIM_LABELS).forEach(k => dimAvg[k] = avg(SAMPLE_CANDS.map(c => c.s[k])));
  const lowest = Object.keys(dimAvg).sort((a, b) => dimAvg[a] - dimAvg[b])[0];
  const completion = Math.round(COHORT.completed / COHORT.enrolled * 100);
  const max = Math.max(...COHORT.weekly);
  return shell("universities", `<main class="wrap">
    <section class="hero" style="margin-top:16px">${ARCH_BG}<div><h1>See job-readiness before graduation day</h1><p>OfficeLife gives your career office a live view of how students handle real work scenarios, by department, so you can fix the gap while there is still time.</p>
      <div class="cta"><button class="btn white" data-act="scrollTo" data-id="cohort">See the dashboard</button><button class="btn out" style="color:#fff;border-color:#fff" data-act="go" data-to="/premium">Campus license</button></div></div>
      <div class="widget" aria-hidden="true"><div class="xs" style="color:#C9D6FF">${esc(uni)}</div><div class="t">${completion}%</div><div class="l"><span class="dot"></span>of enrolled students completed a simulation</div></div></section>

    <section class="sect" id="cohort"><h2>Cohort dashboard: ${esc(uni)}</h2><div class="sample" style="margin:10px 0 14px">Sample data to show the layout. Real numbers appear once students at your campus sign up.</div>
      <div class="stats"><div class="stat"><b>${COHORT.enrolled}</b><span>students enrolled</span></div><div class="stat"><b>${completion}%</b><span>completed a simulation</span></div><div class="stat"><b>${COHORT.avg}%</b><span>average overall score</span></div><div class="stat"><b>${COHORT.minutes} min</b><span>average time on task</span></div></div>
      <div class="grid2" style="margin-top:14px">
        <div class="card"><h3>Average score by skill</h3>${Object.keys(DIM_LABELS).map(k => `<div class="hbar"><span class="nm">${DIM_LABELS[k].split(" and ")[0]}</span><div class="bar ${k === lowest ? "" : "g"}"><i style="width:${dimAvg[k]}%"></i></div><span class="val">${dimAvg[k]}</span></div>`).join("")}
          <p class="small muted" style="margin-top:10px">Lowest skill: <b>${DIM_LABELS[lowest].split(" and ")[0]}</b>. A workshop here would help most.</p></div>
        <div class="card"><h3>Average score by department</h3>${DEPTS.map(d => `<div class="hbar"><span class="nm">${d[0]}</span><div class="bar g"><i style="width:${d[1]}%"></i></div><span class="val">${d[1]}</span></div>`).join("")}</div>
      </div>
      <div class="card" style="margin-top:14px"><h3>Students starting a simulation, last 6 weeks</h3><div class="cols" style="margin-bottom:26px">${COHORT.weekly.map((v, i) => `<div style="height:${Math.round(v / max * 100)}%"><span>W${i + 1}</span></div>`).join("")}</div></div>
      <div class="card pad0 tscroll" style="margin-top:14px"><div style="padding:16px 16px 0"><h3>Top students (sample)</h3></div><table class="tbl"><tr><th>Student</th><th>Role</th><th>Overall</th><th>Punctuality</th></tr>
        ${SAMPLE_CANDS.slice().sort((a, b) => avg(Object.values(b.s)) - avg(Object.values(a.s))).slice(0, 5).map(c => `<tr><td>${esc(c.name)}</td><td>${role(c.role).title}</td><td><b>${avg(Object.values(c.s))}%</b></td><td>${c.s.punct}%</td></tr>`).join("")}</table></div>
      <div style="margin-top:14px"><button class="btn out" data-act="csv">Download cohort report (CSV)</button></div></section>

    <section class="sect"><div class="grid3">
      <div class="card"><div class="ico">${I.chart}</div><h3 style="margin-top:10px">Find the skills gap</h3><p class="small muted">See which skills students lack before employers tell you.</p></div>
      <div class="card"><div class="ico">${I.brief}</div><h3 style="margin-top:10px">Link to employers</h3><p class="small muted">Verified results help your graduates get noticed for internships and jobs.</p></div>
      <div class="card"><div class="ico">${I.shield}</div><h3 style="margin-top:10px">Accreditation evidence</h3><p class="small muted">Show real employability outcomes in your reports.</p></div></div>
      <p style="margin-top:16px"><b>Campus license from ${naira(PRICING.campusPerStudent)} per student per year</b> <span class="muted">(pilot pricing)</span></p></section>
  </main>`);
}
function downloadCSV() {
  const rows = [["Name", "University", "Role", "Days", "Punctuality", "Task quality", "Decision-making", "Critical thinking", "Communication", "Overall"]]
    .concat(SAMPLE_CANDS.map(c => [c.name, c.uni, role(c.role).title, c.days, c.s.punct, c.s.task, c.s.dec, c.s.crit, c.s.comm, avg(Object.values(c.s))]));
  const blob = new Blob([toCSV(rows)], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "officelife-cohort-sample.csv"; document.body.appendChild(a); a.click(); a.remove();
  toast("Sample report downloaded");
}

/* ---------- profile ---------- */
function profile() {
  const u = S.user, f = S.form;
  if (f.pname === undefined) { f.pname = u.name; f.puni = u.uni; f.plevel = u.level; f.pcourse = u.course; f.ptarget = u.target; }
  const careers = [["", "Choose one"], ["pm", "Project Manager"], ["swe", "Software Engineer"], ["da", "Data Analyst"], ["unsure", "Not sure yet"]];
  return shell("", `<main class="narrow"><div class="hello"><h1>Your profile</h1></div>
    <div class="card">
      <div class="field"><label for="pf-name">Full name</label><input id="pf-name" data-f="pname" value="${esc(f.pname)}"></div>
      ${uniField("pf-uni", f.puni, f.perr, "puni")}
      <div class="field"><label for="pf-level">Level</label><select id="pf-level" data-f="plevel">${LEVELS.map(l => `<option ${f.plevel === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="field"><label for="pf-course">Course of study</label><input id="pf-course" data-f="pcourse" value="${esc(f.pcourse || "")}"></div>
      <div class="field"><label for="pf-target">Career you want</label><select id="pf-target" data-f="ptarget">${careers.map(c => `<option value="${c[0]}" ${f.ptarget === c[0] ? "selected" : ""}>${c[1]}</option>`).join("")}</select></div>
      <button class="btn pri block" style="margin-top:18px" data-act="saveProfile">Save changes</button>
    </div>
    <div class="card" style="margin-top:14px"><h3>Settings</h3>
      <div class="row" style="margin-top:10px;flex-wrap:wrap"><button class="btn out sm" data-act="theme">Switch light or dark</button><button class="btn out sm" data-act="lite">${S.lite ? "Turn off" : "Turn on"} lite mode</button><button class="btn out sm" data-act="signout">Sign out</button></div>
      <p class="xs muted" style="margin-top:10px">Lite mode removes animations to save battery and data.</p></div>
  </main>`);
}
function saveProfile() {
  const f = S.form, uni = canonUni(f.puni, UNIS);
  if (!uni) { f.perr = "Choose your university from the list."; return route(); }
  if ((f.pname || "").trim().length < 3) { toast("Enter your full name"); return; }
  Object.assign(S.user, { name: f.pname.trim(), uni, level: f.plevel, course: f.pcourse || "", target: f.ptarget || "" });
  const accounts = store.get("accounts", {}); accounts[S.user.email] = S.user; store.set("accounts", accounts);
  persist(); f.perr = ""; S.form = {}; toast("Profile saved"); nav("/dashboard");
}
