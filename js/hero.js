/**
 * hero.js — Intro Screen Sequence & Hero Parallax
 * KKN Digital Journal "JEJAK"
 */

'use strict';

/* ── INTRO SCREEN SEQUENCE ────────────────────────────────── */
(function initIntroScreen() {
  const introScreen = document.getElementById('intro-screen');
  if (!introScreen) return;

  // Cek apakah sudah pernah melihat intro di session ini
  // (agar tidak muncul terus saat refresh, bisa dihapus jika mau selalu muncul)
  const hasSeenIntro = sessionStorage.getItem('jejak-intro-seen');

  if (hasSeenIntro) {
    introScreen.classList.add('is-done');
    introScreen.style.display = 'none';
    triggerHeroAnimations();
    return;
  }

  const logo        = introScreen.querySelector('.intro-screen__logo');
  const quote       = introScreen.querySelector('.intro-screen__quote');
  const loaderBar   = introScreen.querySelector('.intro-screen__loader-bar');
  const heroScroll  = document.querySelector('.hero__scroll');

  let timeline = [];

  // Fungsi helper — delay menggunakan Promise
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function runIntro() {
    // Step 1: Logo muncul
    await wait(400);
    if (logo) logo.classList.add('is-visible');

    // Step 2: Quote muncul
    await wait(900);
    if (quote) quote.classList.add('is-visible');

    // Step 3: Loader bar mulai
    await wait(400);
    if (loaderBar) loaderBar.classList.add('is-loading');

    // Step 4: Tunggu loading selesai (2000ms sesuai CSS transition)
    await wait(2200);

    // Step 5: Fade out intro screen
    introScreen.classList.add('is-done');

    // Step 6: Setelah fade out selesai, hapus dari DOM
    await wait(700);
    introScreen.style.display = 'none';

    // Simpan ke session agar tidak muncul lagi
    sessionStorage.setItem('jejak-intro-seen', '1');

    // Trigger hero animations
    triggerHeroAnimations();
  }

  runIntro();
})();


/* ── HERO ANIMATIONS ──────────────────────────────────────── */
function triggerHeroAnimations() {
  const heroEyebrow  = document.querySelector('.hero__eyebrow');
  const heroTitle    = document.querySelector('.hero__title');
  const heroSubtitle = document.querySelector('.hero__subtitle');
  const heroMeta     = document.querySelector('.hero__meta');
  const heroScroll   = document.querySelector('.hero__scroll');
  const heroBgImage  = document.querySelector('.hero__bg-image');

  // Trigger zoom-out on hero image
  if (heroBgImage) {
    requestAnimationFrame(() => {
      heroBgImage.classList.add('is-loaded');
    });
  }

  // Staggered content animations
  function showEl(el, delay = 0) {
    if (!el) return;
    setTimeout(() => el.classList.add('is-visible'), delay);
  }

  showEl(heroEyebrow,  100);
  showEl(heroTitle,    300);
  showEl(heroSubtitle, 500);
  showEl(heroMeta,     700);
  showEl(heroScroll,   900);
}


/* ── HERO PARALLAX ────────────────────────────────────────── */
(function initHeroParallax() {
  const heroBg    = document.querySelector('.hero__bg-parallax');
  const heroTitle = document.querySelector('.hero__title');
  const heroContent = document.querySelector('.hero__content');

  if (!heroBg) return;

  // Cek reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    // Gambar bergerak 40% dari kecepatan scroll (lebih lambat)
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }

    // Konten hero bergerak 65% dari kecepatan scroll
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity   = `${1 - scrollY / (window.innerHeight * 0.7)}`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();


/* ── SCROLL INDICATOR — sembunyikan saat scroll ───────────── */
(function initScrollIndicator() {
  const scrollEl = document.querySelector('.hero__scroll');
  if (!scrollEl) return;

  let hidden = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80 && !hidden) {
      scrollEl.classList.add('is-scrolled');
      hidden = true;
    } else if (window.scrollY <= 80 && hidden) {
      scrollEl.classList.remove('is-scrolled');
      hidden = false;
    }
  }, { passive: true });
})();
