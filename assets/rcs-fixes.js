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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
