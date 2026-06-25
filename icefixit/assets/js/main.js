/* ICE FIXIT — shared site behavior */
document.addEventListener('DOMContentLoaded', function () {

  /* Services dropdown — click/tap toggle (hover still works on desktop via CSS,
     this adds real support for touch devices and keyboard/click users so the
     trigger never has to double as a navigation link). */
  document.querySelectorAll('.has-dropdown').forEach(function (wrap) {
    var trigger = wrap.querySelector('.dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = wrap.classList.contains('is-open');
      document.querySelectorAll('.has-dropdown.is-open').forEach(function (openWrap) {
        if (openWrap !== wrap) {
          openWrap.classList.remove('is-open');
          var t = openWrap.querySelector('.dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      wrap.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (wrap) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('is-open');
        var t = wrap.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.is-open').forEach(function (wrap) {
        wrap.classList.remove('is-open');
        var t = wrap.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* Scroll-reveal for cards — guarded by html.js-ready (set inline in <head>,
     so there's no flash of hidden content). Safety timeout below guarantees
     everything becomes visible even if something here fails. */
  var revealTargets = document.querySelectorAll('.pillar-card, .service-card, .contact-card, .step');
  if ('IntersectionObserver' in window && revealTargets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
  // Safety net: whatever happens above, nothing stays invisible past 2s.
  setTimeout(function () {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }, 2000);

  /* Cursor-tracking glow on cards */
  document.querySelectorAll('.pillar-card, .service-card, .contact-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* Mobile nav drawer */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  var drawerClose = document.querySelector('.drawer-close');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (drawerClose && drawer) {
    drawerClose.addEventListener('click', function () {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      // close siblings within the same faq list for a cleaner accordion feel
      var list = item.parentElement;
      if (list) {
        list.querySelectorAll('.faq-item[data-open="true"]').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.setAttribute('data-open', 'false');
            openItem.querySelector('.faq-a').style.maxHeight = null;
            openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.setAttribute('data-open', String(!isOpen));
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* Front-end-only form handling.
     NOTE FOR DEPLOYMENT: these forms have no backend yet.
     Wire `data-endpoint` to a real handler (Formspree, Netlify Forms,
     a serverless function, etc.) before going live — right now this
     just shows a confirmation message and does not send anything. */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.parentElement.querySelector('.form-success');
      if (success) {
        success.style.display = 'block';
        success.textContent = "Thanks — this is a front-end preview, so nothing was actually sent yet. Connect a form handler (Formspree/Netlify Forms/etc.) before launch.";
      }
      form.reset();
    });
  });

  /* Highlight current nav link based on path, as a fallback to aria-current set in markup */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-drawer nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.endsWith(path) && path !== '') {
      a.setAttribute('aria-current', 'page');
    }
  });
});
