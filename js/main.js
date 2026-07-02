/**
 * main.js — Navigation, Scroll Reveal, Global Behavior
 * KKN Digital Journal "JEJAK"
 */

'use strict';

/* ── NAV SCROLL BEHAVIOR ──────────────────────────────────── */
(function initNav() {
  const nav         = document.getElementById('main-nav');
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileMenu  = document.getElementById('nav-mobile-menu');
  const bottomNav   = document.getElementById('bottom-nav');
  const backTopBtn  = document.getElementById('nav-back-top');

  if (!nav) return;

  let lastScrollY   = 0;
  let isMenuOpen    = false;
  const SHOW_AFTER  = window.innerHeight * 0.85; // muncul setelah 85vh

  function updateNav() {
    const currentY = window.scrollY;

    // Tampilkan nav setelah scroll melewati hero
    if (currentY > SHOW_AFTER) {
      nav.classList.add('is-visible');
      if (bottomNav) bottomNav.classList.add('is-visible');
    } else {
      nav.classList.remove('is-visible');
      if (bottomNav) bottomNav.classList.remove('is-visible');
    }

    // Sembunyikan saat scroll cepat ke bawah, tampilkan saat scroll ke atas
    if (currentY > lastScrollY + 10 && currentY > SHOW_AFTER + 200) {
      nav.classList.add('is-hidden');
    } else if (currentY < lastScrollY - 5) {
      nav.classList.remove('is-hidden');
    }

    // Dark mode nav — cek apakah berada di section gelap
    const darkSections = document.querySelectorAll('.section-dark');
    let isOverDark = false;
    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom >= 60) {
        isOverDark = true;
      }
    });
    nav.classList.toggle('is-dark', isOverDark);

    lastScrollY = currentY;
  }

  // Passive scroll listener untuk performa
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run sekali on load

  // ── Hamburger toggle ──
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      hamburger.classList.toggle('is-open', isMenuOpen);
      mobileMenu.classList.toggle('is-open', isMenuOpen);
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isMenuOpen);
    });

    // Tutup menu saat klik link di dalam mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Back to top ──
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Active nav link berdasarkan section yang sedang dilihat ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link[data-section]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle(
              'is-active',
              link.dataset.section === id
            );
          });
          // Update bottom nav juga
          document.querySelectorAll('.bottom-nav__btn[data-section]').forEach(btn => {
            btn.classList.toggle(
              'is-active',
              btn.dataset.section === id
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));
})();


/* ── SCROLL REVEAL ────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Unobserve setelah reveal
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('main-nav')?.offsetHeight || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── READING PROGRESS VINE ────────────────────────────────── */
(function initProgressVine() {
  const fill = document.querySelector('.progress-vine__fill');
  if (!fill) return;

  function updateProgress() {
    const scrolled  = window.scrollY;
    const total     = document.documentElement.scrollHeight - window.innerHeight;
    const percent   = Math.min((scrolled / total) * 100, 100);
    fill.style.height = percent + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
})();
