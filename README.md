<div align="center">
🛡️ Nawaye Nisa
Pakistan's AI-Powered Survivor Support Platform for Women
Empowering survivors. Preserving evidence. Enabling justice.
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Backend-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![AI Powered](https://img.shields.io/badge/AI-Powered-8A2BE2?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
Live Demo · Report Bug · Request Feature
</div>
---
📖 Table of Contents
Project Overview
Problem Statement
Our Solution
Live Demo
Screenshots
Features
AI Feature
Tech Stack
Architecture
Folder Structure
Installation
Environment Variables
Deployment
Privacy & Security
Challenges Faced
Future Improvements
Testing
Why This Project Matters
Author
License
---
🌍 Project Overview
Nawaye Nisa ("Voice of Women") is a survivor-centered digital platform built to help women in Pakistan document, report, and respond to incidents of harassment, violence, and abuse — safely, privately, and with the support of AI.
Why This App Exists
Every year, thousands of incidents involving harassment, domestic violence, stalking, and cyber-based abuse go unreported in Pakistan. Survivors often face a fragmented, intimidating, and emotionally exhausting process when they try to seek help — one that requires navigating unfamiliar legal language, recalling traumatic details under pressure, and worrying about who will see their information. Nawaye Nisa was built to remove those barriers, one at a time.
What Problem It Solves
The platform gives survivors a single, secure space to:
Document incidents as they happen, with dates, locations, and evidence preserved in order
Understand their legal rights in plain, accessible language
Generate a structured complaint draft without needing legal training
Reach trusted contacts or nearby help instantly during an emergency
Keep a private, tamper-resistant record of everything that happened
Who It Helps
Nawaye Nisa is designed for survivors of domestic violence, workplace harassment, stalking, blackmail, and online abuse across Pakistan — as well as the trusted friends, family members, and legal advocates who support them.
Why Pakistan Needs This Solution
Legal literacy, privacy concerns, and social stigma often keep survivors from coming forward. A locally-relevant platform — one that understands Pakistan's provinces, districts, and legal framework — closes the gap between "wanting help" and "getting help."
Why AI Improves the Process
Recalling and structuring traumatic events is difficult, especially under stress. AI assistance helps survivors organize scattered memories into a clear, chronological account, draft a complaint in appropriate legal language, and do so without ever feeling judged or rushed.
---
⚠️ Problem Statement
Challenge	Description
Domestic Violence	Survivors frequently lack a private, safe way to document repeated incidents over time.
Harassment	Workplace and public harassment often goes unreported due to fear of retaliation or disbelief.
Cybercrime	Online abuse, impersonation, and image-based exploitation are rising and under-addressed.
Stalking	Patterns of stalking are hard to prove without a consistent, timestamped record.
Blackmail	Victims often don't know how to safely preserve threatening messages as evidence.
Loss of Evidence	Screenshots, messages, and photos are frequently lost, deleted, or disorganized.
Delayed Reporting	Survivors often wait too long to report, weakening their case and delaying protection.
Lack of Legal Awareness	Most survivors do not know their rights or the correct reporting procedure.
Emotional Barriers	Fear, shame, and trauma make it difficult to speak about incidents, even to authorities.
Privacy Concerns	Survivors fear their data being exposed to abusers, family, or the public.
Each of these barriers compounds the others — a survivor who fears for her privacy is less likely to report; one who lacks legal knowledge is less likely to preserve the right evidence. Nawaye Nisa was designed to address them together, not in isolation.
---
✅ Our Solution
Problem	How Nawaye Nisa Solves It
Domestic Violence	Chronological incident timeline that builds a verifiable history over time
Harassment	Structured incident reporting with categorization and severity tagging
Cybercrime	Evidence Vault for secure storage of screenshots, messages, and media
Stalking	Timeline view reveals patterns across dates and locations
Blackmail	Evidence upload preserves original files with metadata intact
Loss of Evidence	Centralized, encrypted Evidence Vault backed by Firebase Storage
Delayed Reporting	AI Assistant lowers the effort needed to start a report
Lack of Legal Awareness	Dedicated Legal Rights section in plain, accessible language
Emotional Barriers	Empathetic AI tone that never blames or pressures the survivor
Privacy Concerns	Firebase Authentication, strict Firestore rules, and private-by-default data
---
🚀 Live Demo
🌐 Live Website
https://nawaye-nisa.vercel.app/
📦 GitHub Repository
https://github.com/your-username/nawaye-nisa
---
📸 Screenshots

Splash Screen
![Splash Screen](screenshots/splash.png)
The entry point of the application, featuring the Nawaye Nisa logo and a calm, reassuring visual tone designed to feel safe from the very first second.
Onboarding
![Onboarding](screenshots/onboarding.png)
A short, guided walkthrough introducing survivors to the platform's core capabilities without overwhelming them with information.
Register
![Register](screenshots/register.png)
A secure sign-up flow that collects only the minimum information required, with clear privacy assurances shown at every step.
Login
![Login](screenshots/login.png)
A clean, distraction-free login screen backed by Firebase Authentication for secure session management.
Dashboard
![Dashboard](screenshots/dashboard.png)
The survivor's home base — a summary of recent reports, quick actions, and access to every core feature in one glance.
Incident Reporting
![Incident Reporting](screenshots/incident-reporting.png)
A structured form for documenting what happened, when, and where, designed to be completed even in emotionally difficult moments.
AI Assistant
![AI Assistant](screenshots/ai-assistant.png)
A conversational interface where survivors describe events naturally, and the AI organizes them into a structured, factual account.
Complaint Preview
![Complaint Preview](screenshots/complaint-preview.png)
An auto-generated complaint draft, formatted for legal submission, that the survivor can review and edit before finalizing.
Evidence Vault
![Evidence Vault](screenshots/evidence-vault.png)
A secure, encrypted repository for screenshots, photos, audio, and documents, organized by incident.
Timeline
![Timeline](screenshots/timeline.png)
A chronological visualization of all reported incidents, making patterns of abuse easier to see and prove.
Trusted Contacts
![Trusted Contacts](screenshots/trusted-contacts.png)
A private list of people the survivor can notify instantly in the event of an emergency.
Emergency Mode
![Emergency Mode](screenshots/emergency-mode.png)
A one-tap emergency interface that alerts trusted contacts and surfaces nearby help options immediately.
Profile
![Profile](screenshots/profile.png)
A personal space to manage account details, preferences, and privacy settings.
Legal Rights
![Legal Rights](screenshots/legal-rights.png)
A plain-language guide to relevant laws and protections available to survivors in Pakistan.
Nearby Help
![Nearby Help](screenshots/nearby-help.png)
A location-aware directory of nearby police stations, shelters, and legal aid organizations.
Awareness
![Awareness](screenshots/awareness.png)
Educational content designed to help survivors and their communities recognize the signs of abuse.
Notifications
![Notifications](screenshots/notifications.png)
Real-time alerts for report updates, trusted contact responses, and safety reminders.
Report History
![Report History](screenshots/report-history.png)
A complete archive of past reports, searchable and exportable when needed for legal proceedings.
---
✨ Features
Category	Feature	Description
Authentication	Secure Login	Firebase-backed login with session persistence
	Registration	Minimal-data sign-up with privacy-first defaults
AI	AI Assistant	Conversational incident documentation support
	Complaint Draft Generation	Auto-generates structured, legally-formatted drafts
Documentation	Incident Documentation	Structured, guided incident reporting forms
	Timeline	Chronological view of all incidents
Evidence	Evidence Upload	Secure upload for images, documents, and audio
	Evidence Vault	Encrypted, organized evidence storage
Data	Firestore Storage	Structured, queryable incident and user data
	Firebase Authentication	Identity and session management
Safety	Trusted Contacts	Emergency contact list with instant alerts
	Nearby Help	Location-based directory of help resources
	Emergency Support	One-tap emergency activation
Localization	Province Selector	Pakistan-specific province selection
	District Selector	Granular district-level location data
	Tehsil Selector	Fine-grained tehsil-level location data
	Language Support	Multi-language interface
Account	User Profiles	Personal information and preference management
	Notifications	Real-time in-app alerts
Resources	Safety Resources	Curated safety and awareness content
	Legal Rights	Plain-language legal information
Design	Responsive Design	Fully responsive across devices
	Modern UI	Clean, calming, professional interface
	Accessibility	Designed with accessibility best practices
	Privacy	Privacy-first architecture throughout
---
🤖 AI Feature
The AI Assistant is the emotional and functional core of Nawaye Nisa. It transforms a survivor's raw, often fragmented account of events into a clear, structured, and usable record.
How It Works
The survivor describes an incident in their own words, in a supportive chat interface.
The AI asks gentle, clarifying questions to fill in key details (date, location, people involved).
The AI extracts structured facts from the conversation — no legal knowledge required from the user.
The AI generates a complaint draft and a timeline entry, ready for review.
Input
Free-form natural language describing an incident, along with any uploaded evidence (screenshots, messages, images).
Output
A structured incident summary
A chronological timeline entry
A formatted complaint draft suitable for legal or police submission
Suggested next steps (e.g., nearby help, legal rights relevant to the incident)
Why It's Useful
Survivors rarely think in bullet points while processing trauma. The AI bridges the gap between "what happened to me" and "what a legal document needs to say," without requiring the survivor to have any legal expertise — and without ever making them feel rushed, judged, or disbelieved.
AI System Prompt
```
You are a supportive AI assistant for Nawaye Nisa, a survivor support platform.

Your responsibilities:
- Listen to the survivor's account with empathy and patience.
- Summarize incidents clearly and factually, using the survivor's own words wherever possible.
- Extract key facts: date, time, location, people involved, and nature of the incident.
- Generate a structured complaint draft suitable for legal or police submission.
- Never blame, judge, or question the survivor's account.
- Never minimize the severity of what is described.
- Remain calm, empathetic, and non-judgmental in every response.
- Never fabricate details, dates, or facts not provided by the user.
- If the user describes an immediate danger or life-threatening situation,
  gently but clearly encourage them to contact local emergency services
  or use the app's Emergency Mode.
- Protect the survivor's privacy: never repeat sensitive information
  outside the current conversation, and never encourage sharing details
  in unsafe channels.
- Use clear, plain language — avoid legal jargon unless explaining it.
- Always give the survivor full control over what is included in any
  generated document.
```
---
🛠️ Tech Stack
Layer	Technology
Frontend	React (TypeScript)
Backend	Firebase Cloud Functions
Authentication	Firebase Authentication
Database	Cloud Firestore
Storage	Firebase Storage
Deployment	Vercel
Language	TypeScript
Version Control	Git & GitHub
AI	Large Language Model API
IDE	Visual Studio Code
Design Tool	Figma
---
🏗️ Architecture
```
                        ┌───────────────┐
                        │      User      │
                        └───────┬───────┘
                                │
                        ┌───────▼───────┐
                        │   React App    │
                        └───────┬───────┘
                                │
                  ┌─────────────▼─────────────┐
                  │  Firebase Authentication   │
                  └─────────────┬─────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │      Firestore Database    │
                  └─────────────┬─────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │      Firebase Storage      │
                  └─────────────┬─────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │        AI Assistant        │
                  └─────────────┬─────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │   Complaint Generation      │
                  └─────────────┬─────────────┘
                                │
                  ┌─────────────▼─────────────┐
                  │     Evidence Timeline       │
                  └────────────────────────────┘
```
---
📁 Folder Structure
```
nawaye-nisa/
├── public/
│   └── assets/
├── screenshots/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── incident/
│   │   ├── ai-assistant/
│   │   ├── evidence-vault/
│   │   ├── timeline/
│   │   ├── emergency/
│   │   └── shared/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── IncidentReport.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── EvidenceVault.tsx
│   │   ├── Timeline.tsx
│   │   ├── LegalRights.tsx
│   │   ├── NearbyHelp.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   ├── storage.service.ts
│   │   └── ai.service.ts
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```
---
⚙️ Installation
Follow these steps to run Nawaye Nisa locally:
```bash
# 1. Clone the repository
git clone https://github.com/your-username/nawaye-nisa.git

# 2. Navigate into the project directory
cd nawaye-nisa

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Fill in your Firebase and AI API credentials

# 5. Run the development server
npm run dev
```
The app will be available at `http://localhost:5173` (or the port shown in your terminal).
---
🔐 Environment Variables
Nawaye Nisa requires a `.env` file for local development. Never commit your `.env` file or expose real credentials. Use `.env.example` as a reference template.
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_AI_API_KEY=
```
Add `.env` to your `.gitignore` before your first commit to ensure secrets are never pushed to the repository.
---
☁️ Deployment
Nawaye Nisa is deployed using Vercel, connected directly to this GitHub repository.
Push changes to the `main` branch.
Vercel automatically detects the push via GitHub integration.
A production build is triggered and deployed within minutes.
Environment variables are configured securely in the Vercel dashboard, not in the codebase.
This setup ensures every merged change is reflected live with zero manual deployment steps.
---
🔒 Privacy & Security
Security is not an afterthought in Nawaye Nisa — it is a foundational design principle.
Authentication: All access is gated behind Firebase Authentication; no data is accessible without a verified session.
Firestore Rules: Strict, per-user security rules ensure a survivor's data is only ever readable by that survivor.
Storage Rules: Evidence files are scoped to the uploading user and inaccessible to any other account.
Environment Variables: All API keys and secrets are stored in environment variables, never hardcoded or committed.
Sensitive Data: Personally identifying information is minimized wherever possible.
Evidence Protection: Uploaded evidence is stored with restricted access rules and is never publicly listable.
---
🧗 Challenges Faced
Building Nawaye Nisa came with real engineering hurdles:
Firebase Integration: Structuring Firestore collections to support nested incident and evidence data cleanly.
Authentication: Handling edge cases in session persistence and token refresh across page reloads.
Evidence Storage: Designing a storage schema that keeps large media files organized and access-controlled per user.
Responsive UI: Ensuring the interface remains calm and usable across a wide range of device sizes.
Deployment: Managing environment variable parity between local development and Vercel production.
Git: Coordinating a clean commit history while iterating quickly on UI and logic changes.
Vercel: Resolving build-time environment variable mismatches during initial deployment setup.
AI Prompt Engineering: Iterating on the system prompt to ensure consistent empathy, factual accuracy, and zero victim-blaming language across varied incident descriptions.
---
🔮 Future Improvements
Offline-first support for low-connectivity areas
Integration with official police complaint portals
Voice-to-text incident reporting for accessibility
End-to-end encryption for evidence uploads
Multi-survivor case linking for repeat offenders
Direct integration with legal aid organizations
Push notifications for report status updates
Biometric app lock for added privacy
AI-powered risk assessment scoring
Community-verified nearby help directory
Anonymous reporting mode
Court-ready PDF export for complaints
Multi-device sync with encrypted backups
In-app secure messaging with legal advisors
Expanded regional language support
---
🧪 Testing
Nawaye Nisa has been manually tested across its core workflows:
Authentication: Verified registration, login, logout, and session persistence across multiple accounts.
Reports: Tested incident creation, editing, and timeline ordering across various data combinations.
Uploads: Verified evidence uploads across image, document, and audio formats, including large file handling.
AI: Tested the AI Assistant across varied incident descriptions to confirm empathetic tone and factual accuracy.
Deployment: Verified production builds on Vercel match local development behavior.
---
💜 Why This Project Matters
Every survivor deserves to be believed, protected, and heard — without having to relive their trauma to prove it. Nawaye Nisa exists because technology, when built with care, can lower the barriers that keep survivors silent: the fear of not being believed, the difficulty of navigating unfamiliar legal systems, and the risk of losing the evidence that could protect them.
This project is a reminder that software can do more than solve technical problems — it can restore a small measure of control to someone who has had it taken away. If even one survivor feels safer, more informed, or more empowered because of this platform, it will have done its job.
---
👤 Author
ALISHAH KHAN 
Final Year Project — AI-Powered Application Development
GitHub: @https://github.com/alishahkhan8848-ux
Project Repository: Nawaye Nisa
Live Demo: nawaye-nisa.vercel.app
---
📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
---
<div align="center">
Built with purpose. Designed for safety. Powered by AI.
Nawaye Nisa — Because every voice deserves to be heard.
</div>
