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
  const mobileClose = document.getElementById('nav-mobile-close');
  const bottomNav   = document.getElementById('bottom-nav');
  const backTopBtn  = document.getElementById('back-to-top');

  if (!nav) return;

  let lastScrollY  = 0;
  let isMenuOpen   = false;
  const SHOW_BTN   = window.innerHeight * 0.5; // back-to-top muncul setelah 50vh
  // Navbar solid setelah melewati 80% hero (bukan 40px)
  const NAV_SOLID_AFTER = () => {
    const hero = document.getElementById('hero') || document.querySelector('.hero');
    return hero ? hero.offsetHeight * 0.7 : window.innerHeight * 0.7;
  };

  /* Sections gelap — nav berubah mode gelap saat melewatinya */
  const DARK_SECTION_SELECTORS = [
    '.team',
    '.reflection',
    '.farewell'
  ];

  function getDarkSections() {
    return document.querySelectorAll(DARK_SECTION_SELECTORS.join(', '));
  }

  function updateNav() {
    const currentY = window.scrollY;
    const solidThreshold = NAV_SOLID_AFTER();

    /* ── 1. Transparan vs Solid ─────────────────────────── */
    if (currentY > solidThreshold) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
      nav.classList.remove('is-dark'); // Reset dark juga saat kembali ke hero
    }

    /* ── 2. Hide on fast scroll down, show on scroll up ─── */
    if (currentY > lastScrollY + 8 && currentY > 200) {
      nav.classList.add('is-hidden');
    } else if (currentY < lastScrollY - 4) {
      nav.classList.remove('is-hidden');
    }

    /* ── 3. Dark mode — hanya aktif kalau sudah scrolled ── */
    if (nav.classList.contains('is-scrolled')) {
      let isOverDark = false;
      getDarkSections().forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 56 && rect.bottom >= 0) {
          isOverDark = true;
        }
      });
      nav.classList.toggle('is-dark', isOverDark);
    }

    /* ── 4. Bottom nav (mobile) ──────────────────────────── */
    if (bottomNav) {
      bottomNav.classList.toggle('is-visible', currentY > SHOW_BTN);
    }

    /* ── 5. Floating back-to-top button ─────────────────── */
    if (backTopBtn) {
      backTopBtn.classList.toggle('is-visible', currentY > SHOW_BTN);
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run sekali on load

  /* ── Hamburger toggle ────────────────────────────────── */
  function openMenu() {
    isMenuOpen = true;
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => isMenuOpen ? closeMenu() : openMenu());
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  /* Tutup saat klik link di mobile menu */
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    /* Tutup saat klik di luar (background) */
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  /* Tutup dengan Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });

  /* ── Floating Back to Top ────────────────────────────── */
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active nav link berdasarkan section yang dilihat ─── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link[data-section]');
  const bottomBtns = document.querySelectorAll('.bottom-nav__btn[data-section]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });
          bottomBtns.forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-56px 0px 0px 0px' }
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
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ── SMOOTH ANCHOR SCROLL (offset for sticky nav) ─────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('main-nav')?.offsetHeight || 56;
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
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const percent  = Math.min((scrolled / total) * 100, 100);
    fill.style.height = percent + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();


/* ── SECTION TRANSITION GRADIENTS ────────────────────────── */
/* Otomatis tambahkan kelas 'has-dark-prev' atau 'has-dark-next'
   pada section untuk trigger CSS gradient overlay */
(function initSectionTransitions() {
  const allSections = Array.from(document.querySelectorAll('section[id]'));
  const darkClasses = ['team', 'reflection', 'farewell'];

  allSections.forEach((section, i) => {
    const classes = [...section.classList];
    const isDark  = classes.some(c => darkClasses.includes(c));
    const prev    = allSections[i - 1];
    const next    = allSections[i + 1];

    if (prev) {
      const prevClasses = [...prev.classList];
      const prevIsDark  = prevClasses.some(c => darkClasses.includes(c));
      if (isDark !== prevIsDark) {
        section.classList.add(isDark ? 'transition-from-light' : 'transition-from-dark');
      }
    }
    if (next) {
      const nextClasses = [...next.classList];
      const nextIsDark  = nextClasses.some(c => darkClasses.includes(c));
      if (isDark !== nextIsDark) {
        section.classList.add(isDark ? 'transition-to-light' : 'transition-to-dark');
      }
    }
  });
})();
