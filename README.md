


# 🎓 OfficeLife : Bridging the University-to-Work Gap
Simulated workdays at a Nigerian company. Students clock in, do real tasks, make decisions under pressure
and earn a certificate that employers can verify.


"Don't just graduate. Get experience before your first job."

Track 2: University-to-Work Gap | NextGen AI Hackathon

https://img.shields.io/badge/Deployed%20on-Vercel-success?style=for-the-badge&logo=vercel
https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black

---

📖 Table of Contents

1. The Problem
2. Our Solution
3. Who Are the Intended Users?
4. How It Works (The User Journey)
5. Key Features & How They Solve the Problem
6. The Role of AI
7. What Happens Without AI?
8. Tech Stack & Tools Used
9. Handling Risks: Accuracy, Bias, and Privacy
10. Installation & Setup Instructions
11. The Future of OfficeLife

---

🚨 The Problem

Every year, over 600,000 students graduate from Nigerian universities. However, 70% of employers say they struggle to find job-ready talent, and over 60% cite soft skills as the biggest gap.

Why? Because a degree proves what you studied—it doesn't prove how you handle a deadline, a difficult message, or an urgent decision. Students are caught in a loop: "We need experience to get a job, but we need a job to get experience."

Degrees are not the problem. Proof of readiness is.

---

💡 Our Solution

OfficeLife is a web-based career simulation platform that bridges the gap between university and employment. We turn a degree into proof of work.

Students step into a simulated, 10-to-15-minute workday at a fictional Nigerian logistics company (Tembea Logistics). They clock in, chat with simulated managers, complete real tasks, make tough decisions under time pressure, and earn a verified certificate that employers can actually trust.

---

👥 Who Are the Intended Users?

User Group How OfficeLife Helps Them
🎓 Students & Graduates Practice a real workday for free, get instant feedback, and earn a certificate with evidence to put on their CV.
🏢 Employers Stop guessing from CVs. Search for candidates by proven skills, see their clock-in records, and view verified work samples.
🏫 Universities See job-readiness scores by department, spot skills gaps early, and download cohort reports to improve accreditation.

---

🚀 How It Works (The User Journey)

1. Sign Up & Choose a Role: Students pick a career path (Project Manager, Software Engineer, Data Analyst, or HR Personnel).
2. Clock In: The app simulates a 9:00 AM shift. The system records if the student is early, on time, or late.
3. Work, Chat, Decide: The student enters a simulated team chat. They receive tasks (e.g., writing a project plan, fixing a bug) and must complete them before the deadline.
4. Explain Your Thinking: A manager asks follow-up questions about the student's own work to ensure they actually understand it.
5. Urgent Decisions: A timed pop-up forces the student to make a tough choice (e.g., "The client is angry, but the CEO needs a report in 10 minutes. What do you do?").
6. Earn a Certificate: Once the student completes the required workdays (e.g., 3 simulated days), they receive a digital certificate with their scores, a unique verification link, and a QR code.

---

✨ Key Features & How They Solve the Problem

· ⏱️ A Real Workday Experience: Unlike online courses that just teach theory, OfficeLife tests behavior under pressure. We score Punctuality, Task Quality, Decision-Making, Critical Thinking, and Communication.
· 🧠 "Explain-Your-Thinking" Prompts: To prevent students from just copying and pasting AI answers, managers ask follow-up questions (e.g., "Why did you set the milestone dates the way you did?").
· 🛡️ Verified Certificates: Every certificate has a QR code and a tamper-check link. Employers can scan it to see exactly how the student performed, including the exact method used to grade their work.
· 📱 Made for Nigerian Phones: The app is a single, lightweight page (~173KB). It loads on slow networks, requires no app download, and features a "Lite Mode" to turn off animations and save data/battery.
· 🏢 Employer & University Dashboards: Provides mockups of how real institutions can use the data to hire better or improve their curriculum.

---

🤖 The Role of AI

AI is used in OfficeLife as an Automated Reviewer and Evaluator.

When a student submits their work (either by typing or uploading a PDF/Docx file), AI reads the submission and grades it against a specific, real-world rubric. It provides instant, personalized feedback (e.g., "Your project plan is missing a clear mitigation strategy for the bank API timeout risk").

Specifically, AI performs:

1. Text extraction and comprehension from uploaded files.
2. Rubric-based grading (scoring the work out of 100).
3. Generating constructive feedback so the student knows exactly how to improve.

---

🛠️ What Happens Without AI? (The Offline Fallback)

We know that in Nigeria, internet connections can drop, and API limits can be reached. OfficeLife is designed never to break.

If the AI is offline, slow, or fails to process a file, our built-in Rule-Based Reviewer takes over. We have hardcoded specific keywords and logic for every single rubric point. If the student's text includes the necessary concepts, they get the points. This ensures the app remains 100% functional and provides feedback in seconds, even with zero internet.

---

💻 Tech Stack & Tools Used

We built OfficeLife to be incredibly lightweight, accessible, and fast.

· Frontend: Vanilla HTML5, CSS3 (Custom Properties for Dark/Light mode), and Vanilla JavaScript (ES6).
· Architecture: Single Page Application (SPA) using a custom hash-based router. No heavy frameworks (like React) were used, keeping the bundle size tiny.
· Backend/Serverless: Vercel Serverless Functions (Node.js) to securely handle API requests.
· AI Integration: Hugging Face Inference API (utilizing Vision-Language Models like Llama-3.2 or Qwen to process both text and image uploads).
· Security & Verification: Custom cryptographic hashing (FNV-1a) for generating tamper-proof certificate tokens.
· Assets: Custom SVG graphics, PDF.js (for reading uploaded PDFs in the browser), and QRCode.js.

---

🛡️ Handling Risks: Accuracy, Bias, and Privacy

We take the integrity of our platform seriously. Here is how we address common risks:

Risk Our Mitigation Strategy
Students cheating with AI AI can write a plan, but it can't explain why the student made specific choices. We use timed decisions and follow-up reasoning prompts.
AI grading can be wrong AI is never the only judge. If the AI fails, the Rule-Based reviewer checks every point. Premium users also get a Human Mentor review.
Employer Trust Every score is transparent. The certificate explicitly states if the task was graded by "AI Review" or "Rule-based Review."
Privacy & Data In this prototype, accounts and data are stored locally on the user's device (localStorage). For production, we will use secure cloud databases (like Supabase) with strict data privacy controls. Students choose who they share their work with.

---

🚀 Installation & Setup Instructions

For Judges & Viewers (Quick Test)

You do not need to install anything to test the prototype. Simply visit the live link:
👉 office-life-simulation-chi.vercel.app

Note: The app is fully functional offline. The AI reviewer will activate if the API keys are configured.


## Deploy (free)

1. Put these files in a GitHub repo (keep the `api` folder).
2. On vercel.com choose **Add New, then Project**, pick the repo and press **Deploy**.
3. The app already works with no AI. To switch the AI reviewer on, open the project in Vercel,
   go to **Settings, then Environment Variables**, add `HF_TOKEN` with your Hugging Face token
   (permission: "Make calls to Inference Providers"), then **Redeploy**.
4. Optional: add `HF_MODEL` to change the model. Default is `Qwen/Qwen3-VL-8B-Instruct`.

Never paste the token into any file.

## Real Google sign-in (optional)

1. In Google Cloud Console create an OAuth client ID (type: Web) and add your site URL as an authorised origin.
2. In `js/config.js`, set `googleClientId: "YOUR_ID.apps.googleusercontent.com"`.

Until then the Google button runs in demo mode.

## What is real and what is demo

Real in this build: clock-in logic, all scenarios, the rules-based reviewer, PDF and Word text reading,
certificate with QR code and tamper-check link, print to PDF, LinkedIn add link, CSV report.

Demo in this build: accounts live on the user's device, Paystack payment, mentor booking, employer and
university dashboards use sample data. Production needs a database (for example Supabase) for accounts,
signed certificates and real dashboards.

For Developers (Running Locally)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/officelife.git
   cd officelife
   ```
2. Run the frontend:
   Because the app uses vanilla JS and no build tools, you can simply open index.html in your browser, or use a local server:
   ```bash
   npx serve .
   ```
3. Setup the AI Reviewer (Optional):
   The app uses a Vercel serverless function for AI.
   · Create a free account on Hugging Face and generate an Access Token (with Inference permissions).
   · In Vercel, set the Environment Variable HF_TOKEN to your token.
   · (Optional) Set HF_MODEL to your preferred model (e.g., meta-llama/Llama-3.2-11B-Vision-Instruct).
4. Environment Configuration:
   Edit js/config.js to set your Google Client ID (for real Google Sign-in) or toggle the aiEnabled flag.

---

🔮 What Happens After the Hackathon?

OfficeLife has a clear roadmap to scale:

· Next 3 Months: Real database integration (Supabase) for persistent accounts, switch AI reviewer to production, pilot with 2-3 university campuses.
· 6 to 12 Months: Build the Mentor Marketplace, launch Employer-Sponsored simulations, and add WhatsApp reminders.
· Later: Introduce week-long and month-long simulation modes, expand to more careers, and launch in other African countries.

---

Built with ❤️ for the NextGen AI Hackathon by Augustine David.
