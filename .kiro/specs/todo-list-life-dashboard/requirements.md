# Requirements Document

## Introduction

The To-Do List Life Dashboard is a client-side web application that serves as a personal productivity hub. It combines a live greeting with current date/time, a Pomodoro-style focus timer, a persistent to-do list, and a customizable quick-links panel — all in a single HTML page. All data is stored in the browser's Local Storage so the application works without any backend server. The app must work in modern browsers (Chrome, Firefox, Edge, Safari) and can be served as a standalone web page or packaged as a browser extension.

The project structure is:
- `index.html` — single HTML entry point
- `css/style.css` — single stylesheet
- `js/app.js` — single JavaScript file

---

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-of-day greeting message.
- **Focus_Timer**: The UI component that implements a 25-minute countdown timer with Start, Stop, and Reset controls.
- **Task_Manager**: The UI component responsible for adding, editing, completing, and deleting tasks.
- **Task**: A single to-do item consisting of a text description and a completion state.
- **Quick_Links_Panel**: The UI component that displays and manages user-defined website shortcut buttons.
- **Quick_Link**: A single shortcut entry consisting of a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used to persist all user data client-side.
- **Modern_Browser**: Chrome (latest), Firefox (latest), Edge (latest), and Safari (latest) as of the time of development.
- **Pomodoro**: A time-management technique that uses a 25-minute focused work session.

---

## Requirements

### Requirement 1: Live Greeting and Date/Time Display

**User Story:** As a user, I want to see the current time, date, and a personalized greeting when I open the Dashboard, so that I have an at-a-glance awareness of the current moment.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM:SS format based on the local device timezone, updating every second.
2. THE Greeting_Widget SHALL display the current full date (e.g., "Monday, 30 June 2025") based on the local device timezone, below the time.
3. WHILE the current local hour is between 05:00 and 11:59, THE Greeting_Widget SHALL display the message "Good Morning".
4. WHILE the current local hour is between 12:00 and 17:59, THE Greeting_Widget SHALL display the message "Good Afternoon".
5. WHILE the current local hour is between 18:00 and 20:59, THE Greeting_Widget SHALL display the message "Good Evening".
6. WHILE the current local hour is between 21:00 and 04:59 (spanning midnight, inclusive of 00:00), THE Greeting_Widget SHALL display the message "Good Night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with Start, Stop, and Reset controls, so that I can manage focused work sessions without leaving the Dashboard.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise with a countdown value of 25 minutes and 00 seconds (25:00) on page load.
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down one second at a time using the browser's `setInterval` mechanism.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed MM:SS value every second.
4. WHEN the user activates the Stop control while the timer is running, THE Focus_Timer SHALL pause the countdown and retain the current remaining time without resetting.
5. WHEN the user activates the Reset control, THE Focus_Timer SHALL clear any active interval, stop the countdown, and restore the displayed value to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL automatically clear the interval, stop the countdown, and display a visible alert element within the Dashboard notifying the user the session has ended.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Start control and enable the Stop control to prevent duplicate timers, ensuring at least one control (Stop) remains enabled.
8. WHILE the Focus_Timer is paused or reset, THE Focus_Timer SHALL enable the Start control and disable the Stop control, ensuring at least one control (Start) remains enabled as a failsafe so that both controls are never simultaneously disabled.

---

### Requirement 3: To-Do List — Add and Display Tasks

**User Story:** As a user, I want to add tasks to a list and see them displayed on the Dashboard, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a text input field (maximum 500 characters) and an "Add" control for creating new tasks.
2. WHEN the user submits a non-empty task description via the Add control or the Enter key, THE Task_Manager SHALL append the new Task to the task list with an incomplete state and clear the input field.
3. IF the user submits an empty or whitespace-only task description, THEN THE Task_Manager SHALL reject the input, retain the current input field value, and display an inline validation message indicating the description cannot be empty, without adding a Task.
4. THE Task_Manager SHALL display each Task in the list with its description, a completion toggle control, an edit control, and a delete control.
5. WHEN a Task is added, THE Task_Manager SHALL persist all tasks to Local_Storage so that tasks survive a page reload.
6. WHEN the Dashboard page loads, THE Task_Manager SHALL restore all previously persisted tasks from Local_Storage and render them in the task list before any user interaction.

---

### Requirement 4: To-Do List — Edit Tasks

**User Story:** As a user, I want to edit an existing task's description, so that I can correct mistakes or update task details.

#### Acceptance Criteria

1. WHEN the user activates the edit control for a Task, THE Task_Manager SHALL replace the Task's displayed description with an editable text field (maximum 500 characters) pre-filled with the current description.
2. WHEN the user confirms the edit (via an explicit save control or the Enter key) with a non-empty, non-whitespace-only value, THE Task_Manager SHALL update the Task's description to the trimmed new value (maximum 500 characters) and return to display mode; the system SHALL NOT auto-save during editing and SHALL wait for explicit user confirmation before persisting changes.
3. IF the user confirms an edit with an empty or whitespace-only value, THEN THE Task_Manager SHALL retain the original description and return to display mode without modifying the Task.
4. WHEN the user cancels an edit (via an explicit cancel control or the Escape key), THE Task_Manager SHALL discard the changes and return to display mode.
5. WHEN the user confirms a valid edit, THE Task_Manager SHALL persist the updated task description to Local_Storage before returning to display mode.
6. WHILE a Task is in edit mode, THE Task_Manager SHALL prevent any other Task from entering edit mode simultaneously.

---

### Requirement 5: To-Do List — Complete and Delete Tasks

**User Story:** As a user, I want to mark tasks as done and delete tasks I no longer need, so that I can maintain an accurate and clean task list.

#### Acceptance Criteria

1. WHEN the user activates the completion toggle for an incomplete Task, THE Task_Manager SHALL mark the Task as complete and apply a visible strikethrough style to the Task's description text.
2. WHEN the user activates the completion toggle for a complete Task, THE Task_Manager SHALL mark the Task as incomplete and remove the strikethrough style from the Task's description text.
3. WHEN the user activates the delete control for a Task, THE Task_Manager SHALL immediately remove that Task from the list and from Local_Storage permanently.
4. WHEN the user toggles the completion state of a Task, THE Task_Manager SHALL persist the updated task list (including the new completion state) to Local_Storage before the next user interaction.
5. WHEN the Dashboard page loads, THE Task_Manager SHALL restore all tasks from Local_Storage, including their individual completion states, and render them in the task list.

---

### Requirement 6: Quick Links — Add and Display

**User Story:** As a user, I want to add shortcut buttons for my favourite websites, so that I can open them with a single click from the Dashboard.

#### Acceptance Criteria

1. THE Quick_Links_Panel SHALL provide a label input field (maximum 100 characters), a URL input field (maximum 2048 characters), and an "Add Link" control.
2. WHEN the user submits a non-empty label (≤100 chars) and a valid, non-duplicate URL (beginning with "http://" or "https://", ≤2048 chars) via the Add Link control, THE Quick_Links_Panel SHALL add a new Quick_Link button displaying the label and clear both input fields.
3. IF the user submits a missing or blank label, a missing or blank URL, a URL that does not begin with "http://" or "https://", a label exceeding 100 characters, a URL exceeding 2048 characters, or a URL already present in the panel, THEN THE Quick_Links_Panel SHALL reject the input, retain the current field values, and display an inline validation message identifying the specific error without adding a Quick_Link.
4. WHEN the user clicks a Quick_Link button, THE Quick_Links_Panel SHALL open the associated URL in a new browser tab.
5. WHEN a Quick_Link is added, THE Quick_Links_Panel SHALL persist the updated Quick_Links list to Local_Storage before the next user interaction.
6. WHEN the Dashboard page loads, THE Quick_Links_Panel SHALL restore all Quick_Links from Local_Storage and render them as buttons before any user interaction.
7. IF the Quick_Links_Panel already contains 20 Quick_Links, THEN THE Quick_Links_Panel SHALL reject any attempt to add another link and display an inline message indicating the maximum limit has been reached.

---

### Requirement 7: Quick Links — Delete

**User Story:** As a user, I want to remove a quick link I no longer need, so that the panel stays relevant and uncluttered.

#### Acceptance Criteria

1. THE Quick_Links_Panel SHALL display a visible, per-item delete control alongside each Quick_Link button.
2. WHEN the user activates the delete control for a Quick_Link, THE Quick_Links_Panel SHALL immediately remove that Quick_Link from the panel permanently without requiring confirmation.
3. WHEN a Quick_Link is removed, THE Quick_Links_Panel SHALL persist the updated Quick_Links list to Local_Storage before the next user interaction.
4. IF Local_Storage is unavailable when persisting the deletion, THEN THE Quick_Links_Panel SHALL display an inline error message and retain the Quick_Link in the panel.
5. WHEN all Quick_Links have been deleted, THE Quick_Links_Panel SHALL render an empty state with no Quick_Link buttons visible; delete controls SHALL remain visible on the last remaining Quick_Link before it is deleted.

---

### Requirement 8: Data Persistence and Page Load Restoration

**User Story:** As a user, I want all my data to be available when I return to the Dashboard, so that I do not have to re-enter tasks and links after closing the browser.

#### Acceptance Criteria

1. THE Dashboard SHALL store all Task and Quick_Link data exclusively in Local_Storage using the browser's `localStorage` API, with no backend server calls.
2. WHEN any Task or Quick_Link is created, updated, or deleted, THE Dashboard SHALL write the updated data to Local_Storage before the next user interaction.
3. WHEN the Dashboard page loads, THE Dashboard SHALL read all persisted data from Local_Storage and render the Task_Manager and Quick_Links_Panel with the stored state before any user interaction.
4. IF Local_Storage contains no previously saved data, THEN THE Dashboard SHALL render the Task_Manager with an empty task list and the Quick_Links_Panel with no links.
5. IF Local_Storage is unavailable or throws an error during a read on page load, THEN THE Dashboard SHALL render the Task_Manager with an empty task list and the Quick_Links_Panel with no links, and display an inline warning message indicating that data could not be loaded.

---

### Requirement 9: Cross-Browser Compatibility and Project Structure

**User Story:** As a developer and user, I want the Dashboard to work correctly in all modern browsers and to be packaged in a clean folder structure, so that it is easy to deploy and maintain.

#### Acceptance Criteria

1. THE Dashboard SHALL load and execute without any console errors or unhandled exceptions in the current stable releases of Chrome, Firefox, Edge, and Safari.
2. THE Dashboard SHALL be deliverable as a single directory containing exactly: `index.html`, `css/style.css`, and `js/app.js` with no additional CSS or JavaScript files.
3. THE Dashboard SHALL load all assets using relative paths so that it operates correctly when opened via the `file://` protocol without a web server, and all features (greeting, timer, tasks, quick links) function as specified.
4. THE Dashboard SHALL render all UI components without horizontal overflow, clipped content, or broken layout at viewport widths between 320px and 2560px.
