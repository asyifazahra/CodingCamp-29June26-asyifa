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
  // Focus Timer — stub (implemented in task 4)
  // ─────────────────────────────────────────────

  function initFocusTimer() {
    // TODO: implement in task 4
  }

  // ─────────────────────────────────────────────
  // Task Manager — stub (implemented in tasks 6–9)
  // ─────────────────────────────────────────────

  function initTaskManager() {
    // TODO: implement in tasks 6–9
  }

  // ─────────────────────────────────────────────
  // Quick Links Panel — stub (implemented in tasks 11–13)
  // ─────────────────────────────────────────────

  function initQuickLinksPanel() {
    // TODO: implement in tasks 11–13
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
