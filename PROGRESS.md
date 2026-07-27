# Nawaye Nisa — Progress Notes

## Setup required before this runs
1. Create a Firebase project (console.firebase.google.com) with:
   - Authentication → Sign-in method → Email/Password → enabled
   - Firestore Database → created
   - Storage → created
2. Copy `.env.example` to `.env` and fill in the six `VITE_FIREBASE_*` values from
   Project Settings → General → Your apps → SDK setup and configuration.
3. In the Firebase Console, paste `firestore.rules` into Firestore → Rules, and
   `storage.rules` into Storage → Rules, then publish both.
4. `npm install`, then `npm run dev`.

The app throws a clear startup error instead of silently running broken if
`.env` isn't filled in.

## Verification done after every change in this pass
- `npx tsc --noEmit` — clean, no errors.
- Every changed/new file fetched through the Vite dev server (would 500 on a
  syntax error) — all return 200.
- Full-text scan for `console.log`, `TODO`, `FIXME`, `setTimeout`-as-fake-async,
  and hardcoded sample data — cleaned up everywhere touched in this pass.

No headless browser is available in this sandbox to click through the running
app pixel-by-pixel, so please do a manual click-through once your `.env` is
filled in — that's the one verification step I can't do for you here.

## Status against your priority list

**Firebase Authentication — done.** Real registration (email/password account +
Firestore profile), real phone+password login, real password-reset email, real
sign-out, session persistence via `onAuthStateChanged`.

**Firestore CRUD — done for the core entities.**
- `users/{uid}` — create at registration, read/update.
- `evidence/{id}` — create on upload, real-time read (list), delete.
- `reports/{id}` — create on incident submit or "Save Draft" (both are real
  writes now, not fake buttons).

**Firebase Storage uploads — done.** Real gallery/camera/PDF/audio/video file
picker, image compression before upload, real progress bar tied to
`uploadBytesResumable`, real error states (offline, too large, wrong file
type), delete from the vault.

**Pakistan Location selector — done.** Already had full province → district →
tehsil data; fixed a crash bug (undefined variable at module scope) and wired
it into both Register and the incident form (previously the incident form's
location picker, `CascadeSelect`, rendered but wasn't connected to anything —
removed it as dead code and reused the working `PakistanLocationSelect`).

**Incident reporting — done.** Every field across all 5 steps is now real
state: category, location, date/time, risk level, relationship, witness
info, emergency contact, description (with a real live character counter).
"Save Draft" and "Submit & Analyze" both write to Firestore for real, and the
case reference ID is generated from the real Firestore document ID instead of
being a hardcoded string. Review step no longer falls back to fake sample
values ("Workplace Harassment", "Lahore, Punjab") when a field is empty — it
honestly shows "Not selected."

**Gallery/camera integration — done**, as part of the evidence upload feature
above (real `<input type="file">` pickers, `capture="environment"` for direct
camera capture, real Storage upload).

**Form validation — done** on Register, Login, and the incident form (required
fields, phone/CNIC/email format, 18+ check, password strength, character
limits).

## Explicitly NOT done (call these out in your submission, don't claim them)
- **Voice recording** (record/pause/resume/playback): the UI is present but
  disabled with a "coming soon" label rather than faked, both in the incident
  form and nowhere else in the app. Real implementation needs
  `MediaRecorder` + Storage upload — a self-contained follow-up.
- **GPS/device location capture**: not wired. `LocationScreen.tsx` still
  advances through its steps on a timer rather than requesting real device
  coordinates.
- **AI-generated complaint text** (`AIResultScreen.tsx`, `ComplaintPreviewScreen.tsx`):
  still shows a fixed sample complaint about "Fatima Khan." Generating this for
  real needs an actual AI API call and is a distinct piece of work from what
  was asked for in this pass.
- **Trusted Contacts CRUD** (`TrustedContactsScreen.tsx`): still a hardcoded
  contact list with no add/edit/delete wired to Firestore.
- **Nearby Help map**: still a static placeholder, no real Maps integration.
- **Report History / Dashboard stats**: Dashboard header now shows your real
  name; the "Account Statistics" numbers elsewhere are still not computed from
  real Firestore counts.
- Face ID / biometric sign-in: disabled, not faked.

I did not touch any of the above rather than half-wire them, since a partially
wired feature (e.g., a save button that writes to the wrong place, or a GPS
flow that silently falls back to nothing) is worse for a submission review
than an honestly-labeled "not yet built."

