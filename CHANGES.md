# What was fixed (for the OfficeLife team)

**Why the page was black:** the block that starts the app (`actions`, the click handlers, `applyTheme(); route();`)
had been pasted into `js/app-core.js`. That file loads *before* `app-pages.js` and `app-work.js`, so it ran
before the app's pages existed ("openDrawer is not defined") and everything stopped.

**What was done:**
- Moved that block back to the end of `js/app-work.js` (the last file to load).
- Moved the new `sim()` page (1, 3 or 6 day choice) into `js/app-pages.js`, and restored a missing `</section>`.
- Kept your HR Personnel role, the Zainab character, your Google client ID, your Vercel link and your signup changes.
- `api/review.js`: model name typo `mQwen/...` corrected to `Qwen/...` (the leading "m" made it an invalid model).
- Certificate progress now saves days per role (3 days in total unlock the certificate, across sittings).
- Google sign-in now shows Google's own button (the pop-up "One Tap" alone is often blocked).
- Deleted four empty placeholder files (`api/APIs`, `brand/Brands`, `css/CSS`, `js/javascript`).

**Not changed on purpose (waiting for your decision):** the task rubrics and minimum word counts in `js/data.js`.
