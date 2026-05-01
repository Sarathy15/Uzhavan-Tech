## Copilot instructions — Uzhavan Tech (concise)

Purpose: help contributors quickly edit and extend this React + Vite + TypeScript SPA that provides farmer-facing AI tools (disease detection, weather, chatbot, analytics).

Core entry points
- Mount: `index.tsx` -> `App.tsx` (routes/pages are simple switches inside `App`).
- UI: `components/` (e.g., `DiseaseDetector.tsx`, `Chatbot.tsx`, `HomeScreen.tsx`).
- Side-effects & wrappers: `services/` (notable files: `geminiService.ts`, `imagekitService.ts`, `firebase.ts`, `authService.ts`). Keep network/auth logic here.

Run & build
- Install: `npm install`
- Dev server: `npm run dev` (Vite)
- Build: `npm run build`; Preview: `npm run preview`
- Env: create a `.env` with keys used by `services/*` (see list below). Do NOT commit secrets.

Key environment variables (observed)
- GEMINI_API_KEY / API_KEY — used by `services/geminiService.ts` (@google/genai)
- IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT — used by `services/imagekitService.ts`
- FIREBASE_* (FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, etc.) — used by `services/firebase.ts`

Important data flows & patterns (concrete)
- Auth lifecycle: `App.tsx` subscribes to Firebase via `onAuthStateChanged` (from `services/authService.ts`) and passes `user` to pages.
- Diagnosis flow: `components/DiseaseDetector.tsx` -> `imagekitService.uploadImage(file)` -> `geminiService.analyzeCropImage(file, language)` (base64 image) -> `firebase.saveDiagnosis(userId, imageUrl, diagnosisResult)`.
- Chat flow: `components/Chatbot.tsx` uses `getChatbotResponse(history, message)`; the chat is created in `services/geminiService.ts` with a `systemInstruction` (Uzhavan Bot persona).

API & schema stability
- `analyzeCropImage` returns a JSON schema containing: `disease_name`, `confidence` (0.0–1.0), `treatment_plan: {title, steps[]}`, `preventive_measures: {title, steps[]}`. If you change prompts/schemas, update all callers and persisted shape in Firestore.

Project conventions
- TypeScript-first: add proper types to `types.ts` and import them; avoid `any`.
- Keep network logic in `services/` — UI components should call typed service functions.
- Environment checks: services throw early if required config is missing; preserve these checks when refactoring.
- I18n: language context lives in `contexts/LanguageContext.tsx` and UI uses `useTranslation` hook.

Files to inspect when changing behavior
- `index.tsx`, `App.tsx`, `types.ts`
- `services/geminiService.ts`, `services/imagekitService.ts`, `services/firebase.ts`, `services/authService.ts`
- `components/DiseaseDetector.tsx`, `components/Chatbot.tsx`, `components/HomeScreen.tsx`

Quick examples
- Add a new API wrapper: create `services/myService.ts`, export typed functions, and import from components. Mirror error handling and env checks used by existing services.
- Persist diagnosis: call `saveDiagnosis(userId, imageUrl, diagnosisResult)`; Firestore path used is `users/{userId}/diagnoses`.

What NOT to do
- Do not commit API keys or Firebase credentials.
- Do not change the AI response schema without updating all consumers (UI + Firestore).

If something is unclear: point to the component or service you want to change and I will extract the exact call chain, types, and files to update.
## Copilot instructions — Uzhavan Tech

Short goal for AI contributors
- Help edit and extend a small React + Vite + TypeScript single-page app that provides farmer-facing AI tools (crop disease detection, weather risk, chatbot, analytics).

Project overview (what to know first)
- Project root entry: `index.tsx` -> mounts `App` (`App.tsx`). Routes/pages are implemented as component switches in `App.tsx`.
- UI components live under `components/` (examples: `DiseaseDetector.tsx`, `Chatbot.tsx`, `HomeScreen.tsx`). Follow the existing functional-React + TypeScript patterns.
- Side-effect / 3rd-party wrappers live under `services/` (key files: `services/geminiService.ts`, `services/imagekitService.ts`, `services/firebase.ts`, `services/authService.ts`). Keep all network/auth logic here.

Key integrations & expectations
- Firebase: `services/firebase.ts` uses modular Firebase v9+ (initializeApp, getAuth, getFirestore). The file contains placeholder config values; do not commit real secrets — use environment variables or CI secrets instead.
- Google GenAI (Gemini): `services/geminiService.ts` uses `@google/genai`. The code expects an API key available as `process.env.API_KEY`. Note: `vite.config.ts` maps `GEMINI_API_KEY` to `process.env.API_KEY` via `define`. Use an `.env` file or CI env var named `GEMINI_API_KEY`.
- Image uploads: `services/imagekitService.ts` expects an ImageKit public key and endpoint. Uploads are currently unsigned client-side; prefer adding a signed backend endpoint if you change this behavior.
- Auth: `services/authService.ts` exposes `onAuthStateChanged`, sign-in, sign-up, and signOut wrappers used by `App.tsx` and `AuthScreen.tsx`.

Data flow patterns to preserve
- Auth lifecycle: app subscribes to Firebase auth in `App.tsx` using `onAuthStateChanged` from `services/authService.ts`. Most pages/components assume `App` passes a `user` object.
- Image diagnosis flow (typical): UI component (e.g., `DiseaseDetector.tsx`) uploads image via `imagekitService.uploadImage` -> sends the `File` to `geminiService.analyzeCropImage` (which encodes file as base64) -> receives JSON following the schema in `geminiService.analyzeCropImage` -> persisted via `services/firebase.saveDiagnosis`.
- Keep the `analyzeCropImage` response schema stable: it currently expects JSON with `disease_name`, `confidence`, `treatment_plan` (with `title` + `steps`), and `preventive_measures` (with `title` + `steps`). When changing prompts, maintain this shape or update callers accordingly.

Project-specific conventions
- Project is TypeScript-first; add types to `types.ts` and import them rather than using `any`.
- Services folder holds network/api and side-effects. Do not put fetch logic directly inside UI components unless trivial.
- Errors: many service functions throw on missing config (e.g., missing API key in `geminiService.ts` and missing ImageKit key). Tests and edits should preserve these checks.
- Aliases: Vite `tsconfig` maps `@/*` to project root. Use `@/components/...` or `@/services/...` where helpful.

Build & run (developer workflows)
- Local dev: `npm run dev` (Vite). Server runs on port 3000 by default (see `vite.config.ts`, host set to `0.0.0.0`).
- Build: `npm run build` (Vite build). Preview: `npm run preview`.
- Env vars: create a `.env` file at repo root with `GEMINI_API_KEY=...` (Vite maps that into the bundle via `vite.config.ts`). Do NOT place Firebase credentials in the repo; prefer environment injection or a secure secret store.

Editing prompts & AI behavior (practical guidance)
- When editing `services/geminiService.ts` prompts, keep the response schema and `responseMimeType: 'application/json'` or update the schema consumer. Example of required fields: `disease_name`, `confidence`, `treatment_plan.steps` (array of strings).
- For chat behavior, the project creates a chat instance with a `systemInstruction` in `getChatbotResponse`. Keep the bot persona consistent with "Uzhavan Bot" and farmer-focused, easy language.

Files to review when changing behavior
- UI/entry: `index.tsx`, `App.tsx`
- Auth & persistence: `services/authService.ts`, `services/firebase.ts`
- AI & prompts: `services/geminiService.ts`
- File uploads: `services/imagekitService.ts`
- Types: `types.ts`
- Example UI: `components/DiseaseDetector.tsx`, `components/Chatbot.tsx`, `components/HomeScreen.tsx`

Quick examples (explicit cross-file references)
- If you need to add a new API wrapper, place it in `services/` and export typed functions. Follow `services/geminiService.ts` and `services/imagekitService.ts` as templates.
- To persist diagnosis results, call `saveDiagnosis(userId, imageUrl, diagnosisResult)` from `services/firebase.ts` — the Firestore path used is `users/{userId}/diagnoses`.

What NOT to do
- Do not hard-code API keys or firebase credentials in `services/firebase.ts` or commit them to repo.
- Do not change the AI response schema without updating all consumers (UI and Firestore persistence).

If something is unclear or missing
- Ask for a pointer to the specific component you plan to change (e.g., `components/DiseaseDetector.tsx`) and I will extract the exact call chain and types for you.

— end
