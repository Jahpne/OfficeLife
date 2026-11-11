// api/review.js  (Vercel serverless function)
// Your token lives in an environment variable called HF_TOKEN. Never write it in this file.
const MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.2-11B-Vision-Instruct"; // change in Vercel settings if it ever disappears
const ENDPOINT = "https://router.huggingface.co/v1/chat/completions";

// ---------- scripted fallback (works with no AI) ----------
function fallbackReview({ rubric = [], text = "", fileName = "", reason = "" }) {
  const lower = (text || "").toLowerCase();
  // rubric items look like { label: "Risks", keywords: ["risk", "owner"] }
  const missing = rubric.filter(r => r.keywords && !r.keywords.some(k => lower.includes(k.toLowerCase())));
  const hasText = lower.length > 0;
  if (hasText && missing.length) {
    return {
      source: "fallback",
      reason,
      verdict: "fix",
      score: 60,
      notes: missing.map(m => `Add something about: ${m.label}`)
    };
  }
  return {
    source: "fallback",
    reason,
    verdict: "well_done",
    score: 85,
    notes: [`Received ${fileName || "your file"}. Clear and ready to share.`]
  };
}

// ---------- ask the model ----------
async function askModel({ task, rubric, text, imageDataUrl }) {
  const rubricLine = rubric.map(r => r.label).join(", ");
  const instruction =
    `You are a workplace reviewer. Task given to the student: "${task}". ` +
    `Judge their submission on: ${rubricLine}. ` +
    `Reply with ONLY valid JSON, no extra words: ` +
    `{"verdict":"well_done" or "fix","score":0-100,"notes":["short note","short note"]}. ` +
    `Use "fix" if something important is missing. Keep each note under 15 words.`;

  const content = [{ type: "text", text: instruction }];
  if (text) content.push({ type: "text", text: `Submission text:\n${text.slice(0, 6000)}` });
  if (imageDataUrl) content.push({ type: "image_url", image_url: { url: imageDataUrl } });

  const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.HF_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    // Force the Novita provider using the colon syntax
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct:novita", 
    messages: [{ role: "user", content }],
    max_tokens: 300,
    temperature: 0.2
  })
});
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`Model error ${res.status}: ${body.slice(0, 200)}`); }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const json = JSON.parse(raw.replace(/```json|```/g, "").trim());

  // validate so a weak model cannot break the app
  if (!["well_done", "fix"].includes(json.verdict)) throw new Error("Bad verdict");
  const score = Math.max(0, Math.min(100, Number(json.score)));
  if (Number.isNaN(score)) throw new Error("Bad score");
  const notes = Array.isArray(json.notes) ? json.notes.slice(0, 4).map(String) : [];
  return { source: "ai", verdict: json.verdict, score, notes };
}

// ---------- handler ----------
async function selfTest(res) {
  const out = { tokenSet: !!process.env.HF_TOKEN, model: MODEL };
  if (!out.tokenSet) { out.result = "No HF_TOKEN found. Add it in Vercel, Settings, Environment Variables, then Redeploy."; return res.status(200).json(out); }
  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content: "Reply with the single word: ok" }], max_tokens: 5 })
    });
    out.status = r.status;
    const body = await r.text();
    out.result = r.ok ? "AI is working" : body.slice(0, 300);
  } catch (e) { out.result = "Could not reach Hugging Face: " + String(e.message || e).slice(0, 200); }
  return res.status(200).json(out);
}

export default async function handler(req, res) {
  if (req.method === "GET" && req.query && req.query.test) return selfTest(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST. Add ?test=1 to the address to run a health check." });

  const body = req.body || {};
  const { task = "", rubric = [], text = "", imageDataUrl = "", fileName = "" } = body;

  // protect your small free credit
  if ((imageDataUrl || "").length > 4_000_000) {
    return res.status(200).json({ ...fallbackReview({ rubric, text, fileName }), note: "File too large for AI review" });
  }

  try {
    if (!process.env.HF_TOKEN) throw new Error("No token set");
    const result = await Promise.race([
      askModel({ task, rubric, text, imageDataUrl }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 25000))
    ]);
    return res.status(200).json(result);
  } catch (err) {
    // any failure (credit used up, model down, bad JSON) -> scripted feedback
    return res.status(200).json(fallbackReview({ rubric, text, fileName, reason: String(err.message || err).slice(0, 200) }));
  }
}
