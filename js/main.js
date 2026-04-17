/* ================================================
   RADWA NABIH ALI – PORTFOLIO
   Main JavaScript: Section Loader, Animations,
   Scroll Effects, Typed Text, Counter
   ================================================ */

/* ---------- Section Loader ---------- */
const sections = [
  { id: 'navbar-placeholder',     src: '/public/sections/navbar.html'     },
  { id: 'hero-placeholder',       src: '/public/sections/hero.html'       },
  { id: 'about-placeholder',      src: '/public/sections/about.html'      },
  { id: 'experience-placeholder', src: '/public/sections/experience.html' },
  { id: 'skills-placeholder',     src: '/public/sections/skills.html'     },
  { id: 'contact-placeholder',    src: '/public/sections/contact.html'    },
];

async function loadSection({ id, src }) {
  const placeholder = document.getElementById(id);
  if (!placeholder) return;
  try {
    const res  = await fetch(src);
    const html = await res.text();
    placeholder.innerHTML = html;
  } catch {
    console.warn(`Could not load section: ${src}`);
  }
}

async function initApp() {
  await Promise.all(sections.map(loadSection));

  initNavbar();
  initSmoothScroll();
  initScrollSpy();
  initScrollAnimations();
  initCounters();
  initTyped();
  initContactForm();
}

document.addEventListener('DOMContentLoaded', initApp);


/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  nav.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const bsCollapse = document.getElementById('navbarContent');
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(bsCollapse).hide();
      }
    });
  });
}


/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ---------- Active Nav Scroll Spy ---------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('#mainNav .nav-link[href^="#"]');
  const targets  = Array.from(navLinks)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  function updateActive() {
    const scrollY = window.scrollY + 100;
    let current = '';

    targets.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = '#' + section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}


/* ---------- Intersection Observer Scroll Animations ---------- */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right'
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  animatedEls.forEach(el => observer.observe(el));
}


/* ---------- Counter Animations ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start  = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}


/* ---------- Typed Text Effect ---------- */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = [
    'Administrative Officer',
    'HR Admin officer',
    'Office Manager',
    'Customer Service & Complaints Handling',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const word = words[wordIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, isDeleting ? 60 : 100);
  }

  type();
}


/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn     = form.querySelector('.btn-submit');
    const success = document.getElementById('formSuccess');

    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message';
      if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 4000);
      }
    }, 1200);
  });
}
