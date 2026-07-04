(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // Storage Module
  // ─────────────────────────────────────────────

  function storageRead(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageWrite(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // Storage Warning Banner
  // ─────────────────────────────────────────────

  /**
   * showStorageWarning() → void
   * Makes the #storage-warning banner visible.
   * Safe to call multiple times; the banner stays visible once shown.
   */
  function showStorageWarning() {
    var banner = document.getElementById('storage-warning');
    if (banner) {
      banner.style.display = '';
    }
  }

  // ─────────────────────────────────────────────
  // ID Generator
  // ─────────────────────────────────────────────

  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // ─────────────────────────────────────────────
  // Greeting Widget
  // ─────────────────────────────────────────────

  function formatTime(date) {
    var hh = String(date.getHours()).padStart(2, '0');
    var mm = String(date.getMinutes()).padStart(2, '0');
    var ss = String(date.getSeconds()).padStart(2, '0');
    return hh + ':' + mm + ':' + ss;
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
      return 'Good Morning';
    } else if (hour >= 12 && hour <= 17) {
      return 'Good Afternoon';
    } else if (hour >= 18 && hour <= 20) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  function updateGreeting() {
    var date = new Date();
    var hour = date.getHours();
    document.getElementById('greeting-message').textContent = getGreeting(hour);
    document.getElementById('clock-time').textContent = formatTime(date);
    document.getElementById('clock-date').textContent = formatDate(date);
  }

  function initGreetingWidget() {
    updateGreeting();
    setInterval(updateGreeting, 1000);
  }

  // ─────────────────────────────────────────────
  // Focus Timer
  // ─────────────────────────────────────────────

  var timerState = {
    remainingSeconds: 1500,
    intervalId: null
  };

  function formatTimerDisplay(seconds) {
    var mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    var ss = String(seconds % 60).padStart(2, '0');
    return mm + ':' + ss;
  }

  function renderTimerDisplay() {
    document.getElementById('timer-display').textContent =
      formatTimerDisplay(timerState.remainingSeconds);
  }

  function startTimer() {
    timerState.intervalId = setInterval(tickTimer, 1000);
    document.getElementById('timer-start').disabled = true;
    document.getElementById('timer-stop').disabled  = false;
  }

  function stopTimer() {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-stop').disabled  = true;
  }

  function tickTimer() {
    timerState.remainingSeconds -= 1;
    renderTimerDisplay();
    if (timerState.remainingSeconds === 0) {
      stopTimer();
      document.getElementById('timer-alert').classList.add('visible');
    }
  }

  function resetTimer() {
    stopTimer();
    timerState.remainingSeconds = 1500;
    document.getElementById('timer-alert').classList.remove('visible');
    renderTimerDisplay();
  }

  function initFocusTimer() {
    timerState.remainingSeconds = 1500;
    renderTimerDisplay();
    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-stop').disabled  = true;
    document.getElementById('timer-alert').classList.remove('visible');

    document.getElementById('timer-start').addEventListener('click', startTimer);
    document.getElementById('timer-stop').addEventListener('click', stopTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);
  }

  // ─────────────────────────────────────────────
  // Task Manager
  // ─────────────────────────────────────────────

  var tasks = [];

  /**
   * loadTasks() → Task[]
   * Reads "dashboard_tasks" from localStorage and parses the JSON array.
   * Returns [] if the key is missing, storageRead returns null, or JSON.parse throws.
   */
  function loadTasks() {
    var raw = storageRead('dashboard_tasks');
    if (raw === null) {
      return [];
    }
    try {
      var parsed = JSON.parse(raw);
      // Guard against stored non-array values (e.g. a plain object or string)
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('dashboard: failed to parse tasks from localStorage', e);
      return [];
    }
  }

  /**
   * saveTasks(tasks) → void
   * Serializes the tasks array to JSON and writes it to localStorage under
   * "dashboard_tasks".  On write failure (quota exceeded, security error, etc.)
   * an inline error message is displayed in #task-validation-msg.
   *
   * @param {Task[]} tasks
   */
  function saveTasks(tasks) {
    var ok = storageWrite('dashboard_tasks', JSON.stringify(tasks));
    if (!ok) {
      var msg = document.getElementById('task-validation-msg');
      if (msg) {
        msg.textContent = 'Error: could not save tasks (storage unavailable or quota exceeded).';
      }
    }
  }

  /**
   * renderTaskList(tasks) → void
   * Clears #task-list and renders one <li> per task.
   *
   * @param {Task[]} tasks
   */
  function renderTaskList(tasks) {
    var list = document.getElementById('task-list');
    if (!list) return;

    // Clear existing items
    list.innerHTML = '';

    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.setAttribute('data-id', task.id);
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-toggle';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark task complete');

      var span = document.createElement('span');
      span.className = 'task-description';
      span.textContent = task.description;

      var editBtn = document.createElement('button');
      editBtn.className = 'task-edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit task');

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      list.appendChild(li);
    });
  }

  /**
   * toggleTask(id) → void
   * Finds task by id, flips its completed flag, saves and re-renders.
   *
   * @param {string} id
   */
  function toggleTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTaskList(tasks);
  }

  /**
   * enterEditMode(id) → void
   * If any task-item already has the "editing" class, silently returns.
   * Otherwise replaces the task <li> inner HTML with an edit input, Save, and Cancel buttons.
   * Focuses the edit input.
   *
   * @param {string} id
   */
  function enterEditMode(id) {
    var list = document.getElementById('task-list');
    if (!list) return;

    // Guard: if any item is already in edit mode, do nothing
    if (list.querySelector('.task-item.editing')) return;

    var li = list.querySelector('.task-item[data-id="' + id + '"]');
    if (!li) return;

    // Find the current description from the tasks array
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;

    li.classList.add('editing');

    var editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.maxLength = 500;
    editInput.value = task.description;
    editInput.setAttribute('aria-label', 'Edit task description');

    var saveBtn = document.createElement('button');
    saveBtn.className = 'task-save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.setAttribute('aria-label', 'Save task');

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'task-cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');

    // Replace inner HTML with edit controls (preserve checkbox)
    li.innerHTML = '';
    li.appendChild(editInput);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);

    editInput.focus();
  }

  /**
   * saveEdit(id, newValue) → void
   * If newValue.trim() is empty, calls cancelEdit and returns.
   * Otherwise updates the task description, saves, and re-renders.
   *
   * @param {string} id
   * @param {string} newValue
   */
  function saveEdit(id, newValue) {
    if (newValue.trim().length === 0) {
      cancelEdit(id);
      return;
    }
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.description = newValue.trim();
    saveTasks(tasks);
    renderTaskList(tasks);
  }

  /**
   * cancelEdit(id) → void
   * Re-renders the task list, discarding any DOM edit state.
   *
   * @param {string} id
   */
  function cancelEdit(id) {
    renderTaskList(tasks);
  }

  /**
   * deleteTask(id) → void
   * Removes the task with the given id from the array, saves, and re-renders.
   *
   * @param {string} id
   */
  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks(tasks);
    renderTaskList(tasks);
  }

  /**
   * addTask(description) → void
   * Trims the input; if empty shows a validation message and returns.
   * Otherwise creates a Task object, appends to tasks array, saves, and re-renders.
   *
   * @param {string} description
   */
  function addTask(description) {
    var trimmed = description.trim();
    var validationMsg = document.getElementById('task-validation-msg');

    if (trimmed.length === 0) {
      if (validationMsg) {
        validationMsg.textContent = 'Task description cannot be empty.';
      }
      return;
    }

    // Clear any previous validation message
    if (validationMsg) {
      validationMsg.textContent = '';
    }

    var newTask = {
      id: generateId(),
      description: trimmed,
      completed: false
    };

    tasks.push(newTask);
    saveTasks(tasks);
    renderTaskList(tasks);

    var taskInput = document.getElementById('task-input');
    if (taskInput) {
      taskInput.value = '';
      taskInput.focus();
    }
  }

  function initTaskManager() {
    // Detect storage unavailability or corrupt data before delegating to loadTasks.
    // storageRead returns null when localStorage is inaccessible (SecurityError, etc.)
    // or when the key is genuinely absent (first run).  We only show the warning
    // when a raw value exists but cannot be parsed — or when the read itself failed.
    var rawTasks = storageRead('dashboard_tasks');
    if (rawTasks === null) {
      // storageRead catches SecurityError and returns null; that means the whole
      // storage subsystem is unavailable — show the banner.
      // NOTE: getItem also returns null for a missing key, which is the normal
      // first-run case.  We can't distinguish them here, but showing the banner
      // only when localStorage.getItem itself throws (caught in storageRead) is the
      // intent.  To tell the two apart we try the raw access directly.
      var storageUnavailable = false;
      try {
        // This will throw a SecurityError if storage is blocked.
        localStorage.getItem('dashboard_tasks');
      } catch (e) {
        storageUnavailable = true;
      }
      if (storageUnavailable) {
        showStorageWarning();
      }
    } else {
      // We have a raw string — check whether it is valid JSON.
      try {
        JSON.parse(rawTasks);
      } catch (e) {
        // Corrupt data — show warning banner.
        showStorageWarning();
      }
    }

    tasks = loadTasks();
    renderTaskList(tasks);

    var addBtn = document.getElementById('task-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var taskInput = document.getElementById('task-input');
        addTask(taskInput ? taskInput.value : '');
      });
    }

    var taskInput = document.getElementById('task-input');
    if (taskInput) {
      taskInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          addTask(taskInput.value);
        }
      });
    }

    // Event delegation on #task-list for task interactions
    var taskList = document.getElementById('task-list');
    if (taskList) {
      // change: toggle checkbox
      taskList.addEventListener('change', function (e) {
        if (e.target.classList.contains('task-toggle')) {
          var li = e.target.closest('.task-item');
          if (li) toggleTask(li.getAttribute('data-id'));
        }
      });

      // click: edit, save, cancel, delete
      taskList.addEventListener('click', function (e) {
        var target = e.target;

        if (target.classList.contains('task-edit-btn')) {
          var li = target.closest('.task-item');
          if (li) enterEditMode(li.getAttribute('data-id'));
          return;
        }

        if (target.classList.contains('task-save-btn')) {
          var li = target.closest('.task-item');
          if (li) {
            var input = li.querySelector('.task-edit-input');
            saveEdit(li.getAttribute('data-id'), input ? input.value : '');
          }
          return;
        }

        if (target.classList.contains('task-cancel-btn')) {
          var li = target.closest('.task-item');
          if (li) cancelEdit(li.getAttribute('data-id'));
          return;
        }

        if (target.classList.contains('task-delete-btn')) {
          var li = target.closest('.task-item');
          if (li) deleteTask(li.getAttribute('data-id'));
          return;
        }
      });

      // keydown: Enter/Escape on edit input
      taskList.addEventListener('keydown', function (e) {
        if (!e.target.classList.contains('task-edit-input')) return;
        var li = e.target.closest('.task-item');
        if (!li) return;
        var id = li.getAttribute('data-id');

        if (e.key === 'Enter') {
          saveEdit(id, e.target.value);
        } else if (e.key === 'Escape') {
          cancelEdit(id);
        }
      });
    }
  }

  // ─────────────────────────────────────────────
  // Quick Links Panel
  // ─────────────────────────────────────────────

  var links = [];

  /**
   * loadLinks() → QuickLink[]
   * Reads "dashboard_quicklinks" from localStorage.
   * Returns [] on parse error, null result, or missing key.
   */
  function loadLinks() {
    var raw = storageRead('dashboard_quicklinks');
    if (raw === null) {
      return [];
    }
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('loadLinks: failed to parse stored quick links', e);
      return [];
    }
  }

  /**
   * saveLinks(links: QuickLink[]) → void
   * Serializes links array to JSON and writes to localStorage.
   * On failure: displays an inline error in #ql-validation-msg.
   * Does NOT revert the in-memory array on failure.
   */
  function saveLinks(links) {
    var success = storageWrite('dashboard_quicklinks', JSON.stringify(links));
    if (!success) {
      var msg = document.getElementById('ql-validation-msg');
      if (msg) {
        msg.textContent = 'Error: could not save links. Storage may be full or unavailable.';
      }
    }
  }

  /**
   * validateLink(label: string, url: string, existingLinks: QuickLink[]) → string | null
   * Checks in order:
   *   1. Label non-empty after trim and ≤100 chars
   *   2. URL non-empty after trim and ≤2048 chars
   *   3. URL starts with "http://" or "https://"
   *   4. URL not already present in existingLinks
   *   5. existingLinks.length < 20
   * Returns null on success, or a user-readable error string for the first failing rule.
   */
  function validateLink(label, url, existingLinks) {
    var trimmedLabel = label.trim();
    var trimmedUrl = url.trim();

    // Rule 1: label non-empty and ≤100 chars
    if (trimmedLabel.length === 0) {
      return 'Label cannot be empty.';
    }
    if (trimmedLabel.length > 100) {
      return 'Label must be 100 characters or fewer.';
    }

    // Rule 2: URL non-empty and ≤2048 chars
    if (trimmedUrl.length === 0) {
      return 'URL cannot be empty.';
    }
    if (trimmedUrl.length > 2048) {
      return 'URL must be 2048 characters or fewer.';
    }

    // Rule 3: URL starts with http:// or https://
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return 'URL must begin with "http://" or "https://".';
    }

    // Rule 4: URL not already present
    var isDuplicate = existingLinks.some(function (link) {
      return link.url === trimmedUrl;
    });
    if (isDuplicate) {
      return 'This URL is already in the panel.';
    }

    // Rule 5: list has fewer than 20 items
    if (existingLinks.length >= 20) {
      return 'Maximum of 20 links reached.';
    }

    return null;
  }

  /**
   * renderLinks(links: QuickLink[]) → void
   * Clears #ql-list and renders one .ql-item div per link.
   * Each item contains an anchor (ql-btn) and a delete button (ql-delete-btn).
   */
  function renderLinks(linksArray) {
    var list = document.getElementById('ql-list');
    if (!list) return;
    list.innerHTML = '';

    linksArray.forEach(function (link) {
      var item = document.createElement('div');
      item.className = 'ql-item';

      var anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'ql-btn';
      anchor.textContent = link.label;

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'ql-delete-btn';
      deleteBtn.setAttribute('data-id', link.id);
      deleteBtn.setAttribute('aria-label', 'Delete link ' + link.label);
      deleteBtn.textContent = '×';

      item.appendChild(anchor);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
  }

  /**
   * deleteLink(id: string) → void
   * Removes the link with the given id from the links array,
   * persists the updated array via saveLinks, and re-renders the panel.
   *
   * @param {string} id
   */
  function deleteLink(id) {
    links = links.filter(function (link) {
      return link.id !== id;
    });
    saveLinks(links);
    renderLinks(links);
  }

  /**
   * addLink(label: string, url: string) → void
   * Validates inputs via validateLink; on error shows message and returns.
   * On success creates a QuickLink object, appends to links array,
   * saves, re-renders, and clears the input fields.
   */
  function addLink(label, url) {
    var validationMsg = document.getElementById('ql-validation-msg');
    var error = validateLink(label, url, links);

    if (error !== null) {
      if (validationMsg) {
        validationMsg.textContent = error;
      }
      return;
    }

    // Clear any previous validation message on success
    if (validationMsg) {
      validationMsg.textContent = '';
    }

    var newLink = {
      id: generateId(),
      label: label.trim(),
      url: url.trim()
    };

    links.push(newLink);
    saveLinks(links);
    renderLinks(links);

    var labelInput = document.getElementById('ql-label-input');
    var urlInput = document.getElementById('ql-url-input');
    if (labelInput) {
      labelInput.value = '';
    }
    if (urlInput) {
      urlInput.value = '';
    }
  }

  function initQuickLinksPanel() {
    // Mirror the same storage-error detection as initTaskManager.
    var rawLinks = storageRead('dashboard_quicklinks');
    if (rawLinks === null) {
      var storageUnavailable = false;
      try {
        localStorage.getItem('dashboard_quicklinks');
      } catch (e) {
        storageUnavailable = true;
      }
      if (storageUnavailable) {
        showStorageWarning();
      }
    } else {
      try {
        JSON.parse(rawLinks);
      } catch (e) {
        showStorageWarning();
      }
    }

    links = loadLinks();
    renderLinks(links);

    var addBtn = document.getElementById('ql-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var labelInput = document.getElementById('ql-label-input');
        var urlInput = document.getElementById('ql-url-input');
        addLink(
          labelInput ? labelInput.value : '',
          urlInput ? urlInput.value : ''
        );
      });
    }

    var qlList = document.getElementById('ql-list');
    if (qlList) {
      qlList.addEventListener('click', function (e) {
        var target = e.target;
        if (target && target.classList.contains('ql-delete-btn')) {
          deleteLink(target.dataset.id);
        }
      });
    }
  }

  // ─────────────────────────────────────────────
  // Bootstrap on DOMContentLoaded
  // ─────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initGreetingWidget();
    initFocusTimer();
    initTaskManager();
    initQuickLinksPanel();
  });

})();
