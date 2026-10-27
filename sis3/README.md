# Harbor Board — Vue 3 API-based multipage app (SIS 3)

A neighbourhood noticeboard built with **Vue 3, Vue Router 4, Axios and Vite**.
All data comes from public mock services:

| Service | Used for |
| --- | --- |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com) | posts, comments, users, todos (CRUD) |
| [DummyJSON](https://dummyjson.com) | authentication (`POST /auth/login`) |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

Demo login: **emilys / emilyspass** (pre-filled on the sign-in page).

## Requirements checklist

| Requirement | Where |
| --- | --- |
| At least 4 pages | Home, Posts, Post detail, Post form (new/edit), People, Person detail, My tasks, Sign in, 404 — `src/views/` |
| Navigation bar + header on every page | `AppHeader.vue`, `AppNav.vue`, mounted in `App.vue` |
| Navigate between pages | `<RouterLink>` throughout, prev/next links, back links |
| Authorization | `stores/auth.js` + `router.beforeEach` guard. `meta.requiresAuth` routes (`/posts/new`, `/posts/:id/edit`, `/todos`) redirect to `/login?redirect=…`; `guestOnly` blocks `/login` when signed in. Token is added to axios requests by an interceptor |
| 404 page | catch-all route `/:pathMatch(.*)*` → `NotFoundView.vue` |
| Loading + error states | `LoadingState.vue`, `ErrorState.vue` (with Try again), route-change progress bar, failed lazy-chunk handling via `router.onError`, toasts for failed writes |
| Dynamic routing | `/posts/:id`, `/posts/:id/edit`, `/users/:id` (digits-only params, passed as props, views react to param changes) |
| Lazy loading of routes | every route uses `component: () => import(...)`; `npm run build` produces one chunk per view |
| CRUD with axios | **Posts**: `GET /posts`, `GET /posts/:id`, `POST`, `PUT`, `DELETE` (`stores/posts.js`). **Tasks**: `GET`, `POST`, `PATCH`, `DELETE /todos` (`stores/todos.js`) |

## Note about the mock API

JSONPlaceholder accepts writes but does not save them. The app sends every
create/update/delete with axios, and when the server answers successfully it
mirrors the change in a small in-memory store, so the UI behaves like a real
app until the page is reloaded. Items created in the session get ids above the
API's range and are marked "new this session"; edits and deletes of those stay
local because the API would reject unknown ids.

## Deploying

This is a history-mode SPA, so the host must serve `index.html` for unknown
paths (Netlify: add `/* /index.html 200` to `public/_redirects`; Vercel does this
automatically for Vite).

## Structure

```
src/
  api/http.js        axios instances, token interceptor, error messages
  stores/            auth, posts, users, todos, toast (reactive state, no extra libs)
  router/index.js    lazy routes, guards, 404
  components/        header, nav, loading/error states, post row, toasts
  views/             one file per page
  assets/main.css    all styling
```
