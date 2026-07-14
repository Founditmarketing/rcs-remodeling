/* ============================================================
   RCS Remodeling — static-export fixes (vanilla JS, no jQuery)
   Rebuilds the mobile menu that the WordPress export dropped and
   wires up the hamburger toggle. The gallery + hero are handled
   entirely in CSS (rcs-fixes.css).
   ============================================================ */
(function () {
  function init() {
    document.querySelectorAll('.et_pb_menu__wrap').forEach(function (wrap) {
      var source = wrap.querySelector('ul.et-menu');
      var mobileNav = wrap.querySelector('.et_mobile_nav_menu .mobile_nav');
      if (!source || !mobileNav) return;

      // Build the mobile menu from the desktop menu if it isn't there yet.
      if (!mobileNav.querySelector('.et_mobile_menu')) {
        var ul = document.createElement('ul');
        ul.className = 'et_mobile_menu';
        ul.innerHTML = source.innerHTML;
        mobileNav.appendChild(ul);
      }

      var bar = mobileNav.querySelector('.mobile_menu_bar');
      if (bar && !bar.dataset.rcsBound) {
        bar.dataset.rcsBound = '1';
        bar.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var opening = mobileNav.classList.contains('closed');
          mobileNav.classList.toggle('opened', opening);
          mobileNav.classList.toggle('closed', !opening);
        });
      }
    });

    // Close any open mobile menu when tapping elsewhere.
    document.addEventListener('click', function (e) {
      document.querySelectorAll('.mobile_nav.opened').forEach(function (nav) {
        if (!nav.contains(e.target)) {
          nav.classList.remove('opened');
          nav.classList.add('closed');
        }
      });
    });

    // Reviews: truncate to ~50 words with a "Read more" / "Read less" toggle.
    var WORD_LIMIT = 50;
    document.querySelectorAll('.rcs-review-text').forEach(function (el) {
      if (el.dataset.rcsTrunc) return;
      var full = el.textContent.trim();
      var words = full.split(/\s+/);
      if (words.length <= WORD_LIMIT) return;
      el.dataset.rcsTrunc = '1';
      var short = words.slice(0, WORD_LIMIT).join(' ') + '…';
      var expanded = false;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rcs-review-more';
      function render() {
        el.textContent = expanded ? full : short;
        btn.textContent = expanded ? 'Read less' : 'Read more';
        el.parentNode.insertBefore(btn, el.nextSibling);
      }
      btn.addEventListener('click', function () { expanded = !expanded; render(); });
      render();
    });

    // "Why Choose Us" single-frame image carousel (prev/next arrows).
    document.querySelectorAll('[data-rcs-carousel]').forEach(function (car) {
      if (car.dataset.rcsInit) return;
      car.dataset.rcsInit = '1';
      var track = car.querySelector('.rcs-carousel-track');
      var slides = car.querySelectorAll('.rcs-carousel-slide');
      var prev = car.querySelector('.rcs-carousel-prev');
      var next = car.querySelector('.rcs-carousel-next');
      if (!track || slides.length < 2) {
        if (prev) prev.style.display = 'none';
        if (next) next.style.display = 'none';
        return;
      }
      var i = 0;
      function go(n) {
        i = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-i * 100) + '%)';
      }
      if (prev) prev.addEventListener('click', function () { go(i - 1); });
      if (next) next.addEventListener('click', function () { go(i + 1); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
