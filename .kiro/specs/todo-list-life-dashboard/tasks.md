# Implementation Plan: To-Do List Life Dashboard

## Overview

Implement a self-contained single-page productivity dashboard using vanilla HTML, CSS, and JavaScript — no build tools, no dependencies, no backend. The three-file deliverable (`index.html`, `css/style.css`, `js/app.js`) must work via the `file://` protocol in all modern browsers. Implementation proceeds widget by widget, each wired into the shared IIFE module, with localStorage persistence centralized through a thin storage wrapper.

## Tasks

- [x] 1. Scaffold the project structure and HTML shell
  - Create `index.html` with semantic HTML5 structure containing placeholder sections for all four widgets: `#greeting-widget`, `#focus-timer`, `#task-manager`, `#quick-links-panel`
  - Add the `<link>` tag referencing `css/style.css` and a `<script defer>` tag referencing `js/app.js` using relative paths
  - Create `css/style.css` with reset/base styles and a responsive CSS grid layout that handles viewport widths from 320px to 2560px without horizontal overflow
  - Create `js/app.js` with an IIFE skeleton and a `DOMContentLoaded` listener that will call all `init*` functions
  - Add all required DOM element IDs and classes as defined in the design: `#greeting-message`, `#clock-time`, `#clock-date`, `#timer-display`, `#timer-start`, `#timer-stop`, `#timer-reset`, `#timer-alert`, `#task-input`, `#task-add-btn`, `#task-validation-msg`, `#task-list`, `#ql-label-input`, `#ql-url-input`, `#ql-add-btn`, `#ql-validation-msg`, `#ql-list`
  - Ensure all interactive controls have accessible labels (`aria-label` or visible `<label>`) and `#timer-alert` has `role="alert"`
  - _Requirements: 9.2, 9.3, 9.4_

- [x] 2. Implement the Storage Module
  - [x] 2.1 Implement `storageRead` and `storageWrite` helper functions
    - Write `storageRead(key)` → returns `localStorage.getItem(key)`, returns `null` on `SecurityError` or any thrown exception
    - Write `storageWrite(key, value)` → calls `localStorage.setItem(key, value)`, returns `true` on success, `false` on `QuotaExceededError` or any other exception
    - Place both functions inside the IIFE before any widget code
    - _Requirements: 8.1, 8.2, 8.5_

  - [x] 2.2 Implement `generateId` utility
    - Write `generateId()` using `crypto.randomUUID()` with the fallback: `Date.now().toString(36) + Math.random().toString(36).slice(2)`
    - _Requirements: 3.2, 6.2_

- [x] 3. Implement the Greeting Widget
  - [-] 3.1 Implement `formatTime`, `formatDate`, `getGreeting`, and `updateGreeting`
    - Write `formatTime(date)` → returns zero-padded `HH:MM:SS` string using `getHours()`, `getMinutes()`, `getSeconds()`
    - Write `formatDate(date)` → returns `"Weekday, DD Month YYYY"` using `toLocaleDateString` with options `{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }`
    - Write `getGreeting(hour)` → returns `"Good Morning"` for hours 5–11, `"Good Afternoon"` for 12–17, `"Good Evening"` for 18–20, `"Good Night"` for 21–23 and 0–4
    - Write `updateGreeting()` → creates `new Date()`, calls all three helpers, updates `#greeting-message`, `#clock-time`, and `#clock-date` text content
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 3.2 Implement `initGreetingWidget`
    - Write `initGreetingWidget()` → calls `updateGreeting()` once immediately, then starts a `setInterval` with 1000 ms interval
    - _Requirements: 1.1_


- [~] 4. Implement the Focus Timer
  - [~] 4.1 Implement timer state, display helpers, and `initFocusTimer`
    - Declare `timerState = { remainingSeconds: 1500, intervalId: null }` inside the IIFE
    - Write `formatTimerDisplay(seconds)` → returns zero-padded `MM:SS` string
    - Write `renderTimerDisplay()` → sets `#timer-display` text to `formatTimerDisplay(timerState.remainingSeconds)`
    - Write `initFocusTimer()` → sets `remainingSeconds = 1500`, calls `renderTimerDisplay()`, enables `#timer-start`, disables `#timer-stop`, hides `#timer-alert`
    - _Requirements: 2.1, 2.7, 2.8_

  - [~] 4.2 Implement `startTimer`, `stopTimer`, `resetTimer`, and `tickTimer`
    - Write `startTimer()` → sets `intervalId = setInterval(tickTimer, 1000)`, disables `#timer-start`, enables `#timer-stop`
    - Write `stopTimer()` → clears interval, sets `intervalId = null`, enables `#timer-start`, disables `#timer-stop`
    - Write `tickTimer()` → decrements `remainingSeconds`, calls `renderTimerDisplay()`; if `remainingSeconds === 0` calls `stopTimer()` and shows `#timer-alert`
    - Write `resetTimer()` → calls `stopTimer()`, sets `remainingSeconds = 1500`, hides `#timer-alert`, calls `renderTimerDisplay()`
    - Attach click listeners for `#timer-start` → `startTimer`, `#timer-stop` → `stopTimer`, `#timer-reset` → `resetTimer`
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement the Task Manager — Core Data Layer
  - [~] 6.1 Implement `loadTasks` and `saveTasks`
    - Write `loadTasks()` → calls `storageRead("dashboard_tasks")`, parses JSON, returns the array; returns `[]` on parse error or null result; logs parse errors to console
    - Write `saveTasks(tasks)` → calls `storageWrite("dashboard_tasks", JSON.stringify(tasks))`; on failure (returns false) displays an inline storage-error message in `#task-validation-msg`
    - _Requirements: 3.5, 3.6, 5.4, 5.5, 8.1, 8.2, 8.3_


- [ ] 7. Implement the Task Manager — Rendering and Add
  - [~] 7.1 Implement `renderTaskList` and `addTask`
    - Write `renderTaskList(tasks)` → clears `#task-list`, iterates tasks and creates `<li data-id>` elements with the structure defined in the design: checkbox `.task-toggle`, `<span class="task-description">`, Edit and Delete buttons; applies `completed` CSS class and checked state where appropriate
    - Write `addTask(description)` → trims input; if empty shows validation message in `#task-validation-msg` and returns without adding; otherwise creates a Task object via `generateId()`, appends to tasks array, calls `saveTasks`, calls `renderTaskList`, clears `#task-input`, and focuses `#task-input`
    - Attach click listener on `#task-add-btn` → `addTask(#task-input.value)`
    - Attach `keydown` listener on `#task-input` for `Enter` key → same as clicking Add
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_


- [ ] 8. Implement the Task Manager — Edit, Toggle, and Delete
  - [~] 8.1 Implement `toggleTask`, `enterEditMode`, `saveEdit`, `cancelEdit`, and `deleteTask`
    - Write `toggleTask(id)` → finds task by id, flips `completed`, calls `saveTasks`, calls `renderTaskList`
    - Write `enterEditMode(id)` → if any `.task-item` already has class `editing` silently return; otherwise replace the task `<li>` inner HTML with an edit input (`.task-edit-input`, `maxlength="500"`, pre-filled), Save button, and Cancel button; focus the edit input
    - Write `saveEdit(id, newValue)` → if `newValue.trim()` is empty calls `cancelEdit(id)` and returns; otherwise updates description in array, calls `saveTasks`, calls `renderTaskList`
    - Write `cancelEdit(id)` → calls `renderTaskList` to discard DOM edit state
    - Write `deleteTask(id)` → removes task from array, calls `saveTasks`, calls `renderTaskList`
    - Attach event listeners via delegation on `#task-list` for `.task-toggle` (change → `toggleTask`), `.task-edit-btn` (click → `enterEditMode`), `.task-save-btn` (click → `saveEdit`), `.task-cancel-btn` (click → `cancelEdit`), `.task-delete-btn` (click → `deleteTask`)
    - Attach `keydown` delegation on `#task-list` for Enter on `.task-edit-input` → `saveEdit`, Escape on `.task-edit-input` → `cancelEdit`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4_

- [ ] 9. Implement `initTaskManager` and wire into page load
  - [~] 9.1 Implement `initTaskManager`
    - Write `initTaskManager()` → calls `loadTasks()`, stores in module-scoped `tasks` variable, calls `renderTaskList(tasks)`, attaches all event listeners defined in tasks 7.1 and 8.1
    - Call `initTaskManager()` inside the `DOMContentLoaded` handler in the IIFE
    - _Requirements: 3.6, 5.5, 8.3, 8.4, 8.5_

- [ ] 10. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement the Quick Links Panel — Core Data Layer
  - [~] 11.1 Implement `loadLinks`, `saveLinks`, and `validateLink`
    - Write `loadLinks()` → calls `storageRead("dashboard_quicklinks")`, parses JSON, returns array; returns `[]` on parse error or null; logs errors to console
    - Write `saveLinks(links)` → calls `storageWrite("dashboard_quicklinks", JSON.stringify(links))`; on failure displays inline error in `#ql-validation-msg` and does NOT revert the in-memory array
    - Write `validateLink(label, url, existingLinks)` → checks in order: (1) label non-empty after trim and ≤100 chars, (2) URL non-empty after trim and ≤2048 chars, (3) URL starts with `http://` or `https://`, (4) URL not already present in `existingLinks`, (5) `existingLinks.length < 20`; returns `null` on success or a user-readable error string for the first failing rule
    - _Requirements: 6.1, 6.2, 6.3, 6.7, 7.3, 7.4, 8.1, 8.2_


- [ ] 12. Implement the Quick Links Panel — Rendering and Add/Delete
  - [~] 12.1 Implement `renderLinks` and `addLink`
    - Write `renderLinks(links)` → clears `#ql-list`, iterates links and creates `.ql-item` divs each containing an `<a href="{url}" target="_blank" rel="noopener noreferrer" class="ql-btn">` and a `.ql-delete-btn` button with `data-id`
    - Write `addLink(label, url)` → calls `validateLink`; on error sets `#ql-validation-msg` text and returns; on success creates a QuickLink object via `generateId()`, appends to links array, calls `saveLinks`, calls `renderLinks`, clears `#ql-label-input` and `#ql-url-input`
    - Attach click listener on `#ql-add-btn` → `addLink(#ql-label-input.value, #ql-url-input.value)`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.7_

  - [~] 12.2 Implement `deleteLink` and event delegation
    - Write `deleteLink(id)` → removes link from array, calls `saveLinks`, calls `renderLinks`
    - Attach click event delegation on `#ql-list` for `.ql-delete-btn` → `deleteLink(dataset.id)`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_


- [ ] 13. Implement `initQuickLinksPanel` and wire into page load
  - [~] 13.1 Implement `initQuickLinksPanel`
    - Write `initQuickLinksPanel()` → calls `loadLinks()`, stores in module-scoped `links` variable, calls `renderLinks(links)`, attaches all event listeners defined in tasks 12.1 and 12.2
    - Call `initQuickLinksPanel()` inside the `DOMContentLoaded` handler in the IIFE, after `initTaskManager()`
    - _Requirements: 6.6, 8.3, 8.4, 8.5_

- [ ] 14. Implement page-load error handling and empty-state display
  - [~] 14.1 Handle localStorage unavailability and corrupt data on page load
    - Update `initTaskManager` and `initQuickLinksPanel` to detect when `storageRead` returns `null` (storage unavailable) vs. returns a string that fails JSON.parse (corrupt data)
    - In either failure case render the respective widget with an empty state and display an inline warning banner (a visible DOM element, not `alert()`) on the Dashboard indicating data could not be loaded
    - Verify the Task_Manager empty state (no `<li>` elements) and Quick_Links_Panel empty state (no `.ql-item` elements) render without errors
    - _Requirements: 8.4, 8.5_

- [ ] 15. Apply responsive CSS layout and widget styling
  - [~] 15.1 Style all four widgets and ensure responsive layout
    - Implement the CSS grid layout so all four widgets are visible and non-overflowing at viewport widths 320px through 2560px
    - Style `.task-item.completed .task-description` with `text-decoration: line-through` for completed tasks
    - Style `#timer-alert` as `display: none` by default; add a visible style class toggled by JS to show it
    - Ensure color contrast meets WCAG 2.1 AA for all text/background pairs
    - _Requirements: 9.4, 5.1, 5.2, 2.6_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use **fast-check** (available via CDN or npm); each test runs a minimum of 100 iterations
- Checkpoints ensure incremental validation after each major widget
- The IIFE pattern in `app.js` avoids global scope pollution and is required for `file://` compatibility (no ES module imports)
- `storageWrite` failures should show inline messages but never revert in-memory state — the data remains live for the session
- All event listeners should be attached through event delegation on container elements where practical to survive `renderTaskList`/`renderLinks` re-renders

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2"] },
    { "id": 1, "tasks": ["3.1", "4.1", "6.1", "11.1"] },
    { "id": 2, "tasks": ["3.2", "4.2", "6.2", "11.2", "11.3"] },
    { "id": 3, "tasks": ["3.3", "3.4", "4.3", "4.4", "7.1", "12.1"] },
    { "id": 4, "tasks": ["7.2", "7.3", "8.1", "12.2"] },
    { "id": 5, "tasks": ["8.2", "8.3", "9.1", "12.3"] },
    { "id": 6, "tasks": ["13.1", "14.1"] },
    { "id": 7, "tasks": ["15.1"] }
  ]
}
```
