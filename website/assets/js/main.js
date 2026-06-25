/* ICE FIXIT LLC — Main JavaScript */

(function () {
  'use strict';

  /* -----------------------------------------------
     Navigation: scroll-aware background + active state
  ----------------------------------------------- */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 72) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active link
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('active');
    }
  });

  /* -----------------------------------------------
     Mobile Menu
  ----------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuClose  = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (menuClose) menuClose.focus();
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.focus();
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose)  menuClose.addEventListener('click',  closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    mobileMenu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* -----------------------------------------------
     Intersection Observer: fade-up animations
  ----------------------------------------------- */
  var fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* -----------------------------------------------
     Sticky Mobile CTA
  ----------------------------------------------- */
  var stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    var ctaThreshold = window.innerHeight * 0.55;
    window.addEventListener('scroll', function () {
      if (window.scrollY > ctaThreshold) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* -----------------------------------------------
     Contact Form — graceful submit with Formspree
     Replace ACTION_URL with your Formspree endpoint.
  ----------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      var formData = new FormData(contactForm);

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Swap ACTION_URL for your actual Formspree/Netlify/etc. endpoint
      var ACTION_URL = contactForm.getAttribute('action') || '#';

      if (ACTION_URL === '#') {
        // Demo mode: simulate success
        setTimeout(function () {
          showFormSuccess(submitBtn, originalText, contactForm);
        }, 1100);
        return;
      }

      fetch(ACTION_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (r.ok) {
            showFormSuccess(submitBtn, originalText, contactForm);
          } else {
            showFormError(submitBtn, originalText);
          }
        })
        .catch(function () {
          showFormError(submitBtn, originalText);
        });
    });
  }

  function showFormSuccess(btn, originalText, form) {
    btn.textContent = '✓ Message Sent — We\'ll be in touch soon!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    btn.style.color = '#fff';
    setTimeout(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 4000);
  }

  function showFormError(btn, originalText) {
    btn.textContent = 'Something went wrong — please try again';
    btn.style.background = 'rgba(239,68,68,.15)';
    btn.style.color = '#fca5a5';
    setTimeout(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
    }, 3500);
  }

  /* -----------------------------------------------
     Smooth scroll for anchor links
  ----------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
