<<<<<<< HEAD
# Car-information-system
CrazyCar is a modern Angular-based web application for browsing and managing car data. It features a responsive UI, dynamic search and filtering, and seamless integration with a Node.js backend and Firebase database. Built to demonstrate full-stack development and scalable architecture.
=======
# CrazycarAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Notes about this conversion

- API base URL is configured in `src/environments/environment.ts` as `apiUrl: 'http://localhost:5000'`. Adjust if needed.
- The `AddCar` component is available at `/admin/add-car` and implements the same behavior as the React version: model-exists check on blur, validation, prevention of minus key for price, and POST to `/cardata`.
- Global styles are minimal. To use the original project's styles, copy the contents of the React project's `src/angular-styles/global-styles.css` into `src/styles.css` here.

## Next steps you can ask for
- Convert additional pages/components (Home, Cars, CarInfo, Admin Dashboard etc.) and wire routes automatically.
- I can run `ng serve` to start the dev server and confirm the app builds.
- I can add more services and automated tests.

## Firebase setup and operations 🔧
- Project default: **Option B — Frontend direct Firestore access** (enabled). The frontend uses `FirestoreService` and `AuthService` to access Firestore directly. If you prefer backend-only, switch to Option A as described below.

- To enable Firestore in the backend, set `USE_FIREBASE=true` and set `FIREBASE_SERVICE_ACCOUNT` to the JSON string of your service account key (do NOT commit the key to git).
  - Example (PowerShell):
    - `$env:FIREBASE_SERVICE_ACCOUNT = Get-Content .\serviceAccountKey.json -Raw`
    - `$env:USE_FIREBASE = 'true'`
    - `node backend/server.js`
- Seed Firestore with sample data:
  - `node scripts/seedFirestore.js`
- Local `.env` example available at `.env.example` (default sets `USE_FIREBASE=false`).
- NEVER commit `serviceAccountKey.json`—it's added to `.gitignore`. If you already committed it, remove with:
  - `git rm --cached serviceAccountKey.json` and rotate the key in Firebase console.

### How to switch to Option B (frontend direct Firestore access)
- Frontend direct Firestore access is now enabled (Option B). The app includes client Firebase initialization, `FirestoreService` and a basic `AuthService` + `AuthGuard`.
- **Important:** You must configure Firestore Security Rules and Firebase Authentication in the Firebase Console before enabling client writes. I added an example `firestore.rules` file in the repo as a starting point; adapt it to your needs and deploy using `firebase deploy --only firestore:rules` or the Console.
- To allow admin-only writes consider using custom claims and server-side role assignment; rules below are conservative.

#### Quick steps to enable Auth and rules
1. In Firebase Console → Authentication → enable Email/Password (and/or Anonymous if you want quick sign-in).
2. In Firebase Console → Firestore → Rules, paste the contents of `firestore.rules` and publish.
3. From the app, sign in (header provides an anonymous sign-in button for quick testing) and test write operations.


## Cleanup & audit
- I added audit scripts `npm run audit:depcheck` and `npm run audit:ts-prune` to list unused deps and unused TypeScript exports. Run them and review the report at `CLEANUP-REPORT.md`.

>>>>>>> ac14037 (Final commit before push)
