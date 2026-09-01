/* ============================================================
   RCS Remodeling — static-export fixes (vanilla JS, no jQuery)
   Rebuilds the mobile menu that the WordPress export dropped and
   wires up the hamburger toggle. The gallery + hero are handled
   entirely in CSS (rcs-fixes.css).
   ============================================================ */
(function () {
  function init() {
    // Gallery page: shuffle the grid so the work samples show in a fresh,
    // random order on every visit (marker class added only on the gallery page).
    document.querySelectorAll('.rcs-gallery-shuffle').forEach(function (grid) {
      var items = [].slice.call(grid.children);
      if (items.length < 2) return;
      for (var k = items.length - 1; k > 0; k--) {
        var j = Math.floor(Math.random() * (k + 1));
        var tmp = items[k]; items[k] = items[j]; items[j] = tmp;
      }
      items.forEach(function (el) { grid.appendChild(el); });
    });

    // Gallery page: category filter tabs (All / Remodeling / Debris Removal / …).
    // Hiding non-matching items also scopes the lightbox, which only collects
    // VISIBLE gallery links, so next/prev cycles within the chosen category.
    document.querySelectorAll('.rcs-gallery-filters').forEach(function (bar) {
      var grid = document.querySelector('.rcs-gallery-shuffle');
      if (!grid) return;
      var btns = [].slice.call(bar.querySelectorAll('.rcs-gallery-filter'));
      var items = [].slice.call(grid.querySelectorAll('.et_pb_gallery_item'));
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest('.rcs-gallery-filter');
        if (!btn) return;
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        items.forEach(function (it) {
          var show = (f === 'all' || it.getAttribute('data-cat') === f);
          // Use a class (not inline display) so it beats the grid's
          // ".et_pb_gallery_item { display:block !important }" rule.
          it.classList.toggle('rcs-hide', !show);
        });
      });
    });

    // Hero video: the export ships the same 6 MB clip in two Divi sections —
    // section_0 for >=981px, section_1 below it — and CSS hides whichever one
    // doesn't match the breakpoint. display:none does NOT stop a <video> from
    // downloading, and autoplay overrides preload, so both used to pull the
    // whole file: 12 MB of transfer for 6 MB of visible video. The markup now
    // ships no <source> at all; attach it to the rendered one only, and
    // re-check when a resize flips the breakpoint.
    var heroes = [].slice.call(document.querySelectorAll('video.rcs-hero-video'));
    if (heroes.length) {
      var syncHeroes = function () {
        heroes.forEach(function (v) {
          var section = v.closest('.et_pb_section');
          var shown = !section || getComputedStyle(section).display !== 'none';
          if (!shown) { if (!v.paused) v.pause(); return; }
          if (!v.dataset.rcsLoaded) {
            v.dataset.rcsLoaded = '1';
            v.src = v.getAttribute('data-src');
            v.load();
          }
          var played = v.play();
          // Autoplay can still be refused (Low Power Mode, reduced-motion
          // settings); the section keeps its background image underneath.
          if (played && played.catch) played.catch(function () {});
        });
      };
      syncHeroes();
      var heroResize;
      window.addEventListener('resize', function () {
        clearTimeout(heroResize);
        heroResize = setTimeout(syncHeroes, 200);
      });
    }

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

    // Gallery lightbox with prev/next navigation, counter, keyboard + swipe.
    var galleryLinks = [].slice.call(document.querySelectorAll('.rcs-gallery-grid a[href]'));
    if (galleryLinks.length) {
      var items = [];
      var idx = 0;
      // Build the item list from only the VISIBLE gallery links — a page can have
      // duplicate desktop/mobile grids and only one is shown at a time.
      function lbCollect() {
        var vis = galleryLinks.filter(function (a) { return a.offsetParent !== null || a.getClientRects().length; });
        items = vis.map(function (a) {
          var im = a.querySelector('img');
          return { el: a, src: a.getAttribute('href'), cap: (im && im.getAttribute('alt')) || a.getAttribute('title') || '' };
        });
      }
      var lb = document.createElement('div');
      lb.className = 'rcs-lightbox';
      lb.setAttribute('aria-hidden', 'true');
      lb.innerHTML =
        '<div class="rcs-lb-counter"></div>' +
        '<button type="button" class="rcs-lb-close" aria-label="Close gallery">×</button>' +
        '<button type="button" class="rcs-lb-nav rcs-lb-prev" aria-label="Previous image">‹</button>' +
        '<figure class="rcs-lb-figure"><img class="rcs-lb-img" alt=""><figcaption class="rcs-lb-caption"></figcaption></figure>' +
        '<button type="button" class="rcs-lb-nav rcs-lb-next" aria-label="Next image">›</button>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector('.rcs-lb-img');
      var lbCap = lb.querySelector('.rcs-lb-caption');
      var lbCount = lb.querySelector('.rcs-lb-counter');
      function lbShow(n) {
        idx = (n + items.length) % items.length;
        lbImg.src = items[idx].src;
        lbImg.alt = items[idx].cap;
        lbCap.textContent = items[idx].cap;
        lbCount.textContent = (idx + 1) + ' / ' + items.length;
      }
      function lbOpen(link) {
        lbCollect();
        var start = 0;
        for (var j = 0; j < items.length; j++) { if (items[j].el === link) { start = j; break; } }
        lbShow(start); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
      }
      function lbClose() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
      galleryLinks.forEach(function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); lbOpen(a); });
      });
      lb.querySelector('.rcs-lb-next').addEventListener('click', function (e) { e.stopPropagation(); lbShow(idx + 1); });
      lb.querySelector('.rcs-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); lbShow(idx - 1); });
      lb.querySelector('.rcs-lb-close').addEventListener('click', lbClose);
      lb.addEventListener('click', function (e) {
        if (!e.target.closest('.rcs-lb-img, .rcs-lb-nav, .rcs-lb-close, .rcs-lb-caption')) lbClose();
      });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') lbClose();
        else if (e.key === 'ArrowRight') lbShow(idx + 1);
        else if (e.key === 'ArrowLeft') lbShow(idx - 1);
      });
      var touchX = 0;
      lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) lbShow(idx + (dx < 0 ? 1 : -1));
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
