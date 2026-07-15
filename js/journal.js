/**
 * journal.js — Jurnal Harian: Scroll, Mood Filter, Week Picker, Share, Touch Swipe
 * KKN Digital Journal "JEJAK"
 */
'use strict';

/* ── HORIZONTAL DRAG TO SCROLL ────────────────────────────── */
(function initJournalScroll() {
  const track = document.querySelector('.journal__track');
  if (!track) return;

  let isDown   = false;
  let startX   = 0;
  let scrollLeft = 0;

  /* Mouse drag */
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX   = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  /* Touch swipe (mobile) */
  let touchStartX = 0;
  let touchScrollLeft = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX    = e.touches[0].pageX;
    touchScrollLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].pageX;
    track.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });
})();


/* ── MOOD FILTER ──────────────────────────────────────────── */
(function initMoodFilter() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const cards    = document.querySelectorAll('.journal-card');
  if (!moodBtns.length) return;

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      moodBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach(card => {
        if (mood === 'all' || card.dataset.mood === mood) {
          card.classList.remove('is-filtered');
        } else {
          card.classList.add('is-filtered');
        }
      });
    });
  });
})();


/* ── WEEK PICKER ──────────────────────────────────────────── */
(function initWeekPicker() {
  const picker   = document.querySelector('.journal__week-picker');
  const track    = document.querySelector('.journal__track');
  const weekBtns = document.querySelectorAll('.week-btn');
  if (!picker || !track || !weekBtns.length) return;

  weekBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const weekNum = parseInt(btn.dataset.week, 10);
      const targetDay = (weekNum - 1) * 7 + 1; // Hari pertama minggu ini

      /* Cari kartu dengan data-day terdekat */
      const cards = track.querySelectorAll('.journal-card');
      let targetCard = null;
      let minDiff = Infinity;

      cards.forEach(card => {
        const day = parseInt(card.dataset.day || '0', 10);
        const diff = Math.abs(day - targetDay);
        if (diff < minDiff) {
          minDiff = diff;
          targetCard = card;
        }
      });

      if (targetCard) {
        /* Scroll agar kartu target muncul di kiri track */
        const trackRect  = track.getBoundingClientRect();
        const cardRect   = targetCard.getBoundingClientRect();
        const scrollDiff = cardRect.left - trackRect.left;
        track.scrollBy({ left: scrollDiff - 24, behavior: 'smooth' });
      }

      /* Update active state */
      weekBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  /* Auto-update active week saat scroll */
  track.addEventListener('scroll', () => {
    const trackRect = track.getBoundingClientRect();

    let currentDay = 1;
    track.querySelectorAll('.journal-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.left <= trackRect.left + 80) {
        currentDay = parseInt(card.dataset.day || '1', 10);
      }
    });

    const currentWeek = Math.ceil(currentDay / 7);
    weekBtns.forEach(btn => {
      btn.classList.toggle('is-active', parseInt(btn.dataset.week, 10) === currentWeek);
    });
  }, { passive: true });
})();


/* ── SHARE BUTTONS ────────────────────────────────────────── */
(function initShareButtons() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.journal-card');
      if (!card) return;

      const day     = card.dataset.day || '?';
      const title   = card.querySelector('.journal-card__title')?.textContent?.trim() || 'Jurnal Harian';
      const excerpt = card.querySelector('.journal-card__excerpt')?.textContent?.trim() || '';
      const pageUrl = window.location.href.split('#')[0];
      const shareText = `Hari ${day} — ${title}\n\n${excerpt}\n\nBaca selengkapnya: ${pageUrl}`;

      const type = btn.dataset.share;

      if (type === 'copy') {
        navigator.clipboard?.writeText(shareText).then(() => {
          const icon = btn.querySelector('svg');
          btn.style.color = 'var(--accent-sage)';
          setTimeout(() => { btn.style.color = ''; }, 1500);
        });
      } else if (type === 'whatsapp') {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (type === 'native') {
        if (navigator.share) {
          navigator.share({
            title: `Hari ${day} — ${title}`,
            text: excerpt,
            url: pageUrl
          });
        } else {
          navigator.clipboard?.writeText(pageUrl);
        }
      }
    });
  });
})();
