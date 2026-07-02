/**
 * team.js — Expanding Panel Interaction
 * KKN Digital Journal "JEJAK"
 */

'use strict';

(function initTeamPanels() {
  const panels    = document.querySelectorAll('.team-panel');
  const container = document.querySelector('.team__panels');
  if (!panels.length || !container) return;

  const isMobile = () => window.innerWidth < 768;

  /* ── Desktop: keyboard / touch fallback ─────────────────── */
  panels.forEach(panel => {

    // Keyboard: Enter/Space untuk aktifkan panel
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel(panel);
      }
      // Arrow keys untuk navigasi antar panel
      if (e.key === 'ArrowRight') focusNext(panel, 1);
      if (e.key === 'ArrowLeft')  focusNext(panel, -1);
    });

    // Touch device: tap untuk toggle
    panel.addEventListener('click', () => {
      if (isMobile()) return; // mobile pakai CSS saja
      togglePanel(panel);
    });
  });

  function togglePanel(panel) {
    const isActive = panel.classList.contains('is-active');
    // Hapus semua aktif
    panels.forEach(p => p.classList.remove('is-active'));
    // Toggle panel ini
    if (!isActive) panel.classList.add('is-active');
  }

  function focusNext(current, dir) {
    const arr  = [...panels];
    const idx  = arr.indexOf(current);
    const next = arr[idx + dir];
    if (next) next.focus();
  }

  /* ── Mobile: touch tap to highlight ─────────────────────── */
  if ('ontouchstart' in window) {
    panels.forEach(panel => {
      panel.addEventListener('click', () => {
        panels.forEach(p => p.classList.remove('is-active'));
        panel.classList.add('is-active');
      });
    });
  }

  /* ── Accessibility: aria-expanded ───────────────────────── */
  panels.forEach(panel => {
    panel.setAttribute('aria-expanded', 'false');
    panel.addEventListener('mouseenter', () => {
      panel.setAttribute('aria-expanded', 'true');
    });
    panel.addEventListener('mouseleave', () => {
      panel.setAttribute('aria-expanded', 'false');
    });
  });

})();
