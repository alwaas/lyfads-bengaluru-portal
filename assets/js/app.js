/**
 * LYFAds Bengaluru - Global Application UI & Interactions
 * Manages responsive navigation, counter animations, active link state.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close when clicking nav links
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Dynamic Header Scroll Blur & Shadow
  const navbar = document.getElementById('main-nav');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('shadow-xl', 'bg-slate-950/95');
        navbar.classList.remove('bg-slate-950/75');
      } else {
        navbar.classList.remove('shadow-xl', 'bg-slate-950/95');
        navbar.classList.add('bg-slate-950/75');
      }
    });
  }

  // 3. Highlight Active Page Link in Navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[data-page]').forEach((link) => {
    const pageTarget = link.getAttribute('data-page');
    if (pageTarget === currentPath || (currentPath === '' && pageTarget === 'index.html')) {
      link.classList.add('text-indigo-400', 'font-semibold');
      link.classList.remove('text-slate-300');
    }
  });

  // 4. Live Intersection Observer for Animated Counter Statistics
  const counters = document.querySelectorAll('.kpi-counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const targetNumber = parseFloat(target.getAttribute('data-target') || '0');
            const prefix = target.getAttribute('data-prefix') || '';
            const suffix = target.getAttribute('data-suffix') || '';
            const isDecimal = target.getAttribute('data-decimal') === 'true';
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // EaseOutQuad
              const easeProgress = 1 - (1 - progress) * (1 - progress);
              const currentVal = easeProgress * targetNumber;

              if (isDecimal) {
                target.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
              } else {
                target.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                target.textContent = `${prefix}${isDecimal ? targetNumber.toFixed(1) : targetNumber}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.25 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  }

  // 5. Global Scroll-to-Top Button
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollToTopBtn.classList.add('opacity-100');
      } else {
        scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollToTopBtn.classList.remove('opacity-100');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
