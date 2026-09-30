/* الشدي للمحاماة: العلامة ترسم نفسها خطا واحدا على شبكتها، ثم يظهر الاسم */
(function () {
  'use strict';
  var html = document.documentElement;
  html.classList.add('live');   // السكربت يعمل: لا حاجة لإظهار كل شيء بمؤقت الأمان
  var reduced = html.classList.contains('rm');
  var seen = html.classList.contains('seen');
  var hasGsap = typeof window.gsap !== 'undefined';

  // ---------------------------------------------------------------- الترويسة والتقدم
  var hdr = document.getElementById('hdr');
  var bar = document.querySelector('.hdr__progress');
  function onScroll() {
    var y = window.scrollY || 0;
    hdr.classList.toggle('is-solid', y > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------- قائمة الجوال
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

  // ---------------------------------------------------------------- المجالات
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.at'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (on) {
        p.hidden = false;
        if (hasGsap && !reduced) {
          gsap.fromTo(p.querySelectorAll('.ap__head, .ap__d'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5, stagger: .06, ease: 'power3.out' });
          gsap.fromTo(p.querySelectorAll('.ap__list li'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .45, stagger: .025, ease: 'power2.out', delay: .08 });
        }
      } else {
        p.hidden = true;
      }
    });
    if (focus) tab.focus();
    if (window.matchMedia('(max-width: 860px)').matches) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t, false); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      // الاتجاه من اليمين: السهم الأيسر للتالي
      if (k === 'ArrowDown' || k === 'ArrowLeft') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowRight') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  // ---------------------------------------------------------------- نموذج واتساب
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('wa-name').value.trim();
      var area = document.getElementById('wa-area').value;
      var msg = document.getElementById('wa-msg').value.trim();
      if (!name || !msg) { form.reportValidity(); return; }
      var text = 'السلام عليكم، معكم ' + name + '.\nالمجال: ' + area + '\n' + msg;
      window.open(form.getAttribute('action') + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear()).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; });
  });

  // ---------------------------------------------------------------- الحركة
  function done() {
    html.classList.add('ready');
    try { sessionStorage.setItem('shiddi-intro', '1'); } catch (e) {}
  }
  if (!hasGsap || reduced) { done(); return; }
  gsap.registerPlugin(ScrollTrigger);

  var draw = document.querySelectorAll('.hm__p');
  var hx = document.querySelectorAll('.hx');
  var grid = document.querySelector('.hm__grid');
  var sheen = document.querySelector('.hm__sheen');
  var sheenGrad = document.getElementById('hs');

  if (seen) {
    // الزيارة الثانية في الجلسة: بلا مقدمة طويلة
    gsap.set(draw, { strokeDasharray: 'none', strokeDashoffset: 0 });
    done();
  } else {
    var tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: done, delay: .25 });
    tl.to(grid, { opacity: .5, duration: .9, ease: 'power1.out' })
      // الإطار والقاعدة معا من نهايتيهما الحرتين (العلامة متناظرة بنصف دورة)، ثم العارضة
      .to([draw[0], draw[1]], { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut' }, '-=.45')
      .to(draw[2], { strokeDashoffset: 0, duration: .5, ease: 'power3.out' }, '-=.18')
      .to(grid, { opacity: .12, duration: 1.2, ease: 'power1.inOut' }, '-=.4')
      .set(sheen, { opacity: 1 }, '<')
      .fromTo(sheenGrad, { attr: { x1: -14, x2: -8 } }, { attr: { x1: 14, x2: 20 }, duration: 1.4, ease: 'power1.inOut' }, '<')
      .set(sheen, { opacity: 0 })
      .to('.brand', { opacity: 1, duration: .6 }, '-=1.1')
      .to(hx, { opacity: 1, y: 0, duration: .9, stagger: .09, ease: 'power3.out' }, '-=1.5');
  }

  // الظهور مع التمرير
  gsap.utils.toArray('[data-rise]').forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('[data-stagger]').forEach(function (el) {
    gsap.to(el.children, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  // علامة البوابة: ترسم نفسها عند الوصول
  var pm = document.querySelector('.portal__mark');
  if (pm) gsap.fromTo(pm, { opacity: 0, rotate: -8, scale: .92 }, { opacity: .9, rotate: 0, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: pm, start: 'top 85%', once: true } });
  // خطوط البطل تتحرك قليلا مع التمرير
  gsap.to('.hero__lines', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
})();
