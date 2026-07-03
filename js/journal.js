/**
 * journal.js — Mood Filter + Scroll Navigation
 * KKN Digital Journal "JEJAK"
 */

'use strict';

(function initJournal() {
  const filterBtns = document.querySelectorAll('.mood-btn');
  const cards      = document.querySelectorAll('.journal-card:not(.is-upcoming)');
  const track      = document.querySelector('.journal__track');
  const prevBtn    = document.getElementById('journal-prev');
  const nextBtn    = document.getElementById('journal-next');

  /* ── MOOD FILTER ─────────────────────────────────────────── */
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        // Filter kartu
        cards.forEach(card => {
          if (mood === 'all' || card.dataset.mood === mood) {
            card.classList.remove('is-filtered');
          } else {
            card.classList.add('is-filtered');
          }
        });
      });
    });
  }

  /* ── SCROLL NAVIGATION ───────────────────────────────────── */
  if (!track) return;

  const SCROLL_AMOUNT = 320; // px per klik

  function updateNavBtns() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    });
  }

  track.addEventListener('scroll', updateNavBtns, { passive: true });
  updateNavBtns(); // run sekali saat load

  /* ── DRAG TO SCROLL (desktop) ────────────────────────────── */
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = '';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = '';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

})();
