// ============================================
// TEDxSelwynHouseSchool Youth — Motion-Driven JS
// ============================================

// --- Respect reduced motion ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Header scroll effect ---
const header = document.getElementById('header');
let lastScrollY = 0;

if (header && !header.classList.contains('scrolled-always')) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);
    lastScrollY = y;
  }, { passive: true });
}

// --- Mobile menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// --- Scroll-triggered animations with stagger ---
// Supports: .fade-up, .slide-left, .slide-right, .scale-in, .text-reveal, .line-draw
const animatedElements = document.querySelectorAll(
  '.fade-up, .slide-left, .slide-right, .scale-in, .text-reveal, .line-draw'
);

if (animatedElements.length && !prefersReducedMotion) {
  // Assign stagger indices to siblings inside the same parent
  const parentMap = new Map();
  animatedElements.forEach(el => {
    const parent = el.parentElement;
    if (!parentMap.has(parent)) parentMap.set(parent, 0);
    const idx = parentMap.get(parent);
    el.style.setProperty('--stagger', idx);
    parentMap.set(parent, idx + 1);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animatedElements.forEach(el => observer.observe(el));
} else {
  // If reduced motion or no elements, show everything immediately
  animatedElements.forEach(el => el.classList.add('visible'));
}

// --- Hero parallax (multi-layer) ---
const heroLayers = document.querySelectorAll('.hero-bg-layer');

if (heroLayers.length && !prefersReducedMotion) {
  const speeds = [0.3, 0.15, 0.08]; // Layer speeds (back to front)

  const updateParallax = () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;

    if (scrollY < heroHeight * 1.2) {
      heroLayers.forEach((layer, i) => {
        const speed = speeds[i] || 0.1;
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  };

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

// --- Hero title animation: trigger the underline ---
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  // Small delay for dramatic effect
  setTimeout(() => {
    heroTitle.classList.add('visible');
  }, 400);
}

// --- Counter animation for stats ---
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

if (statNumbers.length && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500; // ms
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Magnetic button effect (subtle) ---
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// --- Tilt effect on cards ---
if (!prefersReducedMotion) {
  document.querySelectorAll('.info-card, .speaker-card-full, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
