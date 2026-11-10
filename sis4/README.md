# SIS 4 — Campus Student Dashboard

Student dashboard built with **Vue 3**, **Ant Design Vue**, **Vue Router**, **Axios**, and **Vite**.

## Run locally

Requires Node.js 20.19+ or 22+ and npm.

```bash
cd sis4
npm ci
npm run dev
```

Open the local URL printed by Vite.

```bash
npm run build
npm run preview
```

## Pages

- **Overview** — live assignment totals, completion percentage, course shortcuts, and API bulletin.
- **My courses** — illustrative catalog, search, category filters, and course details modal.
- **Assignments** — REST tasks, search, status filters, and completion toggles persisted in localStorage.
- **My profile** — sample user and contact information fetched from REST API.

## REST API and async states

Axios uses `https://jsonplaceholder.typicode.com` with a 12-second timeout:

- `GET /todos?userId=1` — assignments and dashboard statistics.
- `GET /posts?_limit=3` — bulletin posts.
- `GET /users/1` — sample student profile.

Each API page provides a loading skeleton, successful results, a readable error state, and a retry/refresh action. Requests are cancelled when leaving a page or starting another request. Empty search results are handled separately from network errors.

JSONPlaceholder provides demonstration content. Course names and instructors are illustrative. The sidebar identity is a display label; the Profile page explicitly identifies the API's sample user. Completion toggles are local changes, not server updates; the Overview reflects saved completion changes. No authentication or backend is required.

## Design and implementation

Responsive layout, keyboard focus styles, reduced-motion support, and hash routing for static hosts. Ant Design Vue provides menus, buttons, avatars, progress bars, alerts, skeletons, lists, inputs, filters, modal, cards, tags, checkboxes, and descriptions. No API keys are required.

Previous assignments in `sis1`, `sis2`, and `sis3` are preserved.
