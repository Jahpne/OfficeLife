# OfficeLife

Simulated workdays at a Nigerian company. Students clock in, do real tasks, make decisions under pressure
and earn a certificate that employers can verify.

## Files

```
index.html          the page shell (loads the files below)
css/style.css       all styling, light and dark
js/config.js        settings: Google client ID, AI on or off
js/data.js          universities, roles, scenarios, mentors, sample data
js/logic.js         scoring, rules-based reviewer, certificate verification
js/app-core.js      layout, landing page, sign up and log in
js/app-pages.js     dashboard, simulations, premium, employers, universities, profile
js/app-work.js      workday engine, certificate, events
api/review.js       optional AI reviewer (hides your token, falls back to built-in rules)
brand/              logos (SVG and PNG) and the CEO signature used on certificates
package.json        tells Vercel to treat api/review.js as a module
```

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
