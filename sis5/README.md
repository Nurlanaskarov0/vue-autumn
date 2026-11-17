# SIS 5 — Taskly

A responsive task manager using **Vue 3**, **Pinia**, **Ant Design Vue**, and reusable **composables**.

## Run

Requires Node.js 20.19+ or 22+ and npm.

```bash
cd sis5
npm ci
npm run dev
```

Open the local URL shown by Vite.

```bash
npm test
npm run build
npm run preview
```

## Features

- Create, edit, and delete tasks, with validation and deletion confirmation.
- Task title, description, project, priority, status, and optional due date.
- Move tasks between To do, In progress, and Completed using the status selector.
- Board and list views, text search, status, project and priority filters, and sorting.
- Total tasks, due-today count, completion statistics, and overdue date indicators.
- Tasks persist in localStorage and survive browser refreshes. Search and view preferences reset on refresh.
- Empty results, invalid data, and unavailable browser storage are handled explicitly.
- First visit includes six editable sample tasks with relative due dates. Removing every task leaves an empty workspace on subsequent visits.
- No backend, login, API keys, or external service required. Data stays in this browser on this device.

## Structure

- `src/stores/tasks.js` — Pinia state, getters, validation, CRUD/status actions, loading and saving.
- `src/composables/useTasks.js` — reusable filtering, sorting, due date formatting, and due-today totals.
- `src/composables/useTaskForm.js` — form state and create/edit flow.
- `src/composables/usePersistence.js` — task persistence lifecycle; filters do not trigger saving.
- `src/components/TaskCard.vue` — task details, status control, editing and deletion.
- `src/components/TaskForm.vue` — Ant Design Vue modal and form.
- `src/App.vue` — workspace, navigation, statistics, filters, and views.

The interface uses Ant Design Vue buttons, input, select, modal, form, alerts, tags, avatars, progress, radio, and popconfirm. Pinia is registered through `createPinia()` and shared with components and composables. `storeToRefs()` keeps bindings to store state reactive.

## Manual checks

1. Create a task; blank titles must show validation feedback.
2. Edit it and change its status; verify counts and board columns update.
3. Search, filter, sort, and switch views; verify empty results can be cleared.
4. Refresh the page; verify task changes remain.
5. Cancel deletion, then confirm deletion; verify only the chosen task is removed.
6. Test a narrow mobile viewport and keyboard navigation.

Automated tests cover store CRUD, identity preservation, invalid input, completion statistics, persistence round-trip, empty saved data, corrupt records, and storage failures.

Earlier SIS projects remain in their own directories.
