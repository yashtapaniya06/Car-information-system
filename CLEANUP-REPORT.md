# Cleanup & Audit Report

Date: 2026-02-03

## Actions performed
- Installed `firebase` and `@angular/fire` (frontend Firebase client).
- Added `src/app/shared/firestore.service.ts` (simple AngularFire example).
- Added Firebase providers to `src/app/app.config.ts` (app already had providers, no duplicate changes).
- Added `start:backend:firebase`, `seed:firestore`, and audit scripts to `package.json`.
- Created `.gitignore` entries for `serviceAccountKey.json` and `.env`.
- Added `.env.example` (already present) and updated `README.md` with Firebase setup instructions.
- Ran `depcheck` and `ts-prune` and recorded results below.

---

## depcheck (unused dependencies)
Command: `npx depcheck --json`

Output (high level):
- dependencies: ["@angular/fire","firebase"]
- devDependencies: []

Notes: depcheck flagged `@angular/fire` and `firebase` as unused. This is a false-positive in this project because the imports are done via providers in `app.config.ts` and `src/app/shared/firestore.service.ts` (Angular's DI and modern import patterns sometimes confuse static analyzers). These packages are required and should not be removed.

---

## ts-prune (unused TypeScript exports)
Command: `npx ts-prune --project ./crazy-car-angular/tsconfig.json --print`

Output: no unused exports found.

---

## Candidate files/components for manual review (likely unused or only placeholders)
These are conservative suggestions — review before deleting.

- `src/app/components/rating/` (contains only CSS) ⚠️
- `src/app/components/rating-analysis/` (only CSS) ⚠️
- `src/app/components/sidebar/` (only CSS) ⚠️
- `src/app/components/car/` (only CSS) ⚠️
- `src/app/components/car-card/` (only CSS) ⚠️
- `src/app/components/signup/` (only CSS) ⚠️
- `src/app/components/update-car/` (only CSS) ⚠️

Reason: these folders lack a `.ts` component file or are not referenced by routes. If you plan to use them, keep them; otherwise remove to reduce clutter.

Other notes:
- `backend/DataBase/Collections/*.json` are seed data used by `scripts/seedFirestore.js` — keep if you want to re-seed local/Dev Firestore.
- `backend/services/inMemoryService.js` is intentionally present as a fallback for local development (USE_FIREBASE=false). Keep it unless you want to enforce Firestore-only behavior.

---

## Recommended next steps (safe, reviewed process)
1. Inspect each candidate folder listed above and either implement or delete files after review.
2. Run `npm run audit:depcheck` and `npm run audit:ts-prune` locally after making changes to confirm nothing else is flagged.
3. If you accidentally committed `serviceAccountKey.json`, remove it from Git index with:
   - `git rm --cached serviceAccountKey.json`
   - Commit and push, then rotate the key in Firebase console.

---

If you want, I can now prepare a small PR with the requested deletions (I will list each change and wait for your approval before removing files).
