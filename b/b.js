/* الشدي، الفكرة الثانية */
(function () {
  'use strict';
  var html = document.documentElement;
  html.classList.add('live');
  var reduced = html.classList.contains('rm');
  var hasGsap = typeof window.gsap !== 'undefined';

  var hdr = document.getElementById('hdr');
  function onScroll() { hdr.classList.toggle('is-solid', (window.scrollY || 0) > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // قائمة الجوال
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!html.classList.contains('menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && html.classList.contains('menu-open')) setMenu(false); });

  // فهرس المجالات: صف يفتح بارتفاع متحرك
  document.querySelectorAll('.row__btn').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (!hasGsap || reduced) { panel.hidden = open; return; }
      if (open) {
        gsap.to(panel, { height: 0, opacity: 0, duration: .4, ease: 'power2.inOut', onComplete: function () { panel.hidden = true; panel.style.height = ''; } });
      } else {
        panel.hidden = false;
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .55, ease: 'power3.out', clearProps: 'height' });
        gsap.fromTo(panel.querySelectorAll('li'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4, stagger: .025, ease: 'power2.out', delay: .1 });
      }
      if (hasGsap && window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 600);
    });
  });

  // نموذج واتساب
  var form = document.getElementById('wa-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('wa-name').value.trim();
    var msg = document.getElementById('wa-msg').value.trim();
    if (!name || !msg) { form.reportValidity(); return; }
    var text = 'السلام عليكم، معكم ' + name + '.\nالمجال: ' + document.getElementById('wa-area').value + '\n' + msg;
    window.open(form.getAttribute('action') + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear()).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; });
  });

  if (!hasGsap || reduced) return;
  gsap.registerPlugin(ScrollTrigger);

  // البطل: الشبكة ثم الخط الواحد ثم العنوان
  var p = document.querySelectorAll('.bm__p');
  gsap.timeline({ delay: .2 })
    .to('.bm__grid', { opacity: .35, duration: .8, ease: 'power1.out' })
    .to('.hx', { opacity: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out' }, .15)
    .to([p[0], p[1]], { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, .5)
    .to(p[2], { strokeDashoffset: 0, duration: .45, ease: 'power3.out' }, '-=.15')
    .to('.bm__grid', { opacity: .1, duration: 1.2 }, '-=.3');

  gsap.utils.toArray('[data-rise]').forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: .95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  // خط طريقتنا يرسم مع التمرير
  gsap.to('.tl__line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: .6 } });
  gsap.to('.portal__bgmark', { yPercent: -12, rotate: 4, ease: 'none', scrollTrigger: { trigger: '.portal', start: 'top bottom', end: 'bottom top', scrub: true } });
})();
