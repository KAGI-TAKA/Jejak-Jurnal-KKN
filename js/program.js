/**
 * program.js — Status Filter untuk Program Kerja
 * KKN Digital Journal "JEJAK"
 */
'use strict';

(function initProgram() {
  const filterBtns = document.querySelectorAll('.status-btn');
  const cards      = document.querySelectorAll('.program-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.dataset.status;
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
          card.classList.remove('is-filtered');
        } else {
          card.classList.add('is-filtered');
        }
      });
    });
  });
})();
