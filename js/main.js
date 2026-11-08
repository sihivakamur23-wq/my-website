/* ============================================================
   EXCEL DEFENCE ACADEMY — Interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA_NUMBER = '917207636812';

  /* ---------- 1. Header, progress bar, back-to-top ---------- */
  var header = $('#siteHeader');
  var progressBar = $('#progressBar');
  var toTop = $('#toTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 20);
    if (toTop) toTop.classList.toggle('is-on', y > 620);
    if (progressBar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 2. Mobile drawer ---------- */
  var burger = $('#burger'), drawer = $('#drawer'), scrim = $('#scrim'), drawerClose = $('#drawerClose');
  var lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    scrim.hidden = false;
    window.requestAnimationFrame(function () { scrim.classList.add('is-open'); });
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
  }
  function closeDrawer() {
    scrim.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    window.setTimeout(function () { scrim.hidden = true; }, 400);
    if (lastFocused) lastFocused.focus();
  }
  if (burger) burger.addEventListener('click', function () {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  $$('#drawer a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  // Focus trap while the drawer is open
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !drawer.classList.contains('is-open')) return;
    var items = $$('a[href], button:not([disabled])', drawer).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- 3. Hero background crossfade ---------- */
  var heroLayers = $$('[data-hero]');
  if (heroLayers.length > 1 && !reduceMotion) {
    var hIdx = 0;
    window.setInterval(function () {
      heroLayers[hIdx].classList.remove('is-on');
      hIdx = (hIdx + 1) % heroLayers.length;
      heroLayers[hIdx].classList.add('is-on');
    }, 6000);
  }

  /* ---------- 4. Reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var group = el.parentElement ? $$('.reveal', el.parentElement) : [];
        var i = group.indexOf(el);
        el.style.setProperty('--d', (i > -1 ? Math.min(i, 6) * 70 : 0) + 'ms');
        el.classList.add('is-in');
        revObs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 5. Scroll-spy for the navigation ---------- */
  var navLinks = $$('#navLinks a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 6. FAQ accordion ---------- */
  $$('.faq').forEach(function (faq) {
    var btn = $('.faq__q', faq);
    var panel = $('.faq__a', faq);
    btn.addEventListener('click', function () {
      var isOpen = faq.classList.contains('is-open');
      // close siblings for a tidy single-open accordion
      $$('.faq.is-open').forEach(function (other) {
        if (other === faq) return;
        other.classList.remove('is-open');
        $('.faq__a', other).style.maxHeight = '';
        $('.faq__q', other).setAttribute('aria-expanded', 'false');
      });
      if (isOpen) {
        faq.classList.remove('is-open');
        panel.style.maxHeight = '';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        faq.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 40 + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  window.addEventListener('resize', function () {
    $$('.faq.is-open .faq__a').forEach(function (p) { p.style.maxHeight = p.scrollHeight + 40 + 'px'; });
  });

  /* ---------- 7. Gallery: filters, load more, lightbox ---------- */
  var galGrid = $('#galGrid');
  var galItems = $$('.gal__item');
  var galMore = $('#galMore');
  var VISIBLE_DEFAULT = 8;
  var activeFilter = 'all';

  function applyGallery(limit) {
    var shown = 0;
    var matched = 0;
    galItems.forEach(function (item) {
      var match = activeFilter === 'all' || item.getAttribute('data-cat') === activeFilter;
      if (match) matched++;
      var withinLimit = shown < limit;
      var show = match && withinLimit;
      item.classList.toggle('is-hidden', !show);
      if (show) shown++;
    });
    if (galMore) {
      galMore.parentElement.hidden = shown >= matched;
      galMore.hidden = shown >= matched;
    }
  }

  var galLimit = VISIBLE_DEFAULT;
  applyGallery(galLimit);

  var galFilters = $('#galFilters');
  if (galFilters) {
    $$('button', galFilters).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('button', galFilters).forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeFilter = btn.getAttribute('data-filter');
        galLimit = activeFilter === 'all' ? VISIBLE_DEFAULT : 999;
        applyGallery(galLimit);
      });
    });
  }
  if (galMore) {
    galMore.addEventListener('click', function () {
      galLimit = galItems.length;
      applyGallery(galLimit);
      galMore.parentElement.hidden = true;
    });
  }

  var lightbox = $('#lightbox'), lbStage = $('#lbStage'), lbTitle = $('#lbTitle'), lbSub = $('#lbSub'), lbCount = $('#lbCount');
  var lbIndex = 0, lbOpen = false;

  function visibleItems() {
    return galItems.filter(function (i) { return !i.classList.contains('is-hidden'); });
  }

  function renderLightbox() {
    var items = visibleItems();
    if (!items.length) return;
    lbIndex = (lbIndex + items.length) % items.length;
    var item = items[lbIndex];
    var video = item.getAttribute('data-video');
    var img = item.getAttribute('data-img');
    var title = item.getAttribute('data-title') || '';
    var sub = item.getAttribute('data-sub') || '';

    lbStage.innerHTML = '';
    if (video) {
      var poster = $('img', item) ? $('img', item).src : '';
      var v = document.createElement('video');
      v.controls = true; v.autoplay = true; v.muted = true; v.playsInline = true;
      v.preload = 'metadata';
      if (poster) v.poster = poster;
      v.setAttribute('playsinline', '');
      var src = document.createElement('source');
      src.src = video;
      src.type = item.getAttribute('data-vtype') || 'video/mp4';
      v.appendChild(src);
      v.appendChild(document.createTextNode('Your browser does not support embedded video.'));
      var onVidErr = function () {
        lbStage.innerHTML = '<div style="padding:40px 24px;text-align:center;color:#c3ccb4">' +
          '<p style="margin-bottom:10px">This video could not be loaded right now.</p>' +
          '<a class="btn btn--outline btn--sm" href="' + video + '" target="_blank" rel="noopener">Open video in a new tab</a></div>';
      };
      v.addEventListener('error', onVidErr, { once: true });
      src.addEventListener('error', onVidErr, { once: true });
      lbStage.appendChild(v);
    } else {
      var im = document.createElement('img');
      im.src = img || ($('img', item) ? $('img', item).src : '');
      im.alt = title;
      lbStage.appendChild(im);
    }
    lbTitle.innerHTML = title;
    lbSub.innerHTML = sub;
    lbCount.textContent = (lbIndex + 1) + ' / ' + items.length;
  }

  function openLightbox(item) {
    var items = visibleItems();
    lbIndex = items.indexOf(item);
    if (lbIndex < 0) lbIndex = 0;
    renderLightbox();
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    document.body.classList.add('no-scroll');
    lbOpen = true;
    $('#lbClose').focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    lbStage.innerHTML = '';
    lbOpen = false;
  }

  galItems.forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
    });
  });

  if (lightbox) {
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lbPrev').addEventListener('click', function () { lbIndex--; renderLightbox(); });
    $('#lbNext').addEventListener('click', function () { lbIndex++; renderLightbox(); });
    $('#lbPrev2').addEventListener('click', function () { lbIndex--; renderLightbox(); });
    $('#lbNext2').addEventListener('click', function () { lbIndex++; renderLightbox(); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', function (e) {
      if (!lbOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { lbIndex--; renderLightbox(); }
      if (e.key === 'ArrowRight') { lbIndex++; renderLightbox(); }
    });
  }

  /* ---------- 8. Course buttons -> prefill enquiry form ---------- */
  $$('[data-course], [data-enquiry]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var course = btn.getAttribute('data-course') || btn.getAttribute('data-enquiry');
      var select = $('#f-course');
      if (select && course) {
        var opt = Array.prototype.find.call(select.options, function (o) { return o.value === course; });
        if (opt) select.value = course;
      }
    });
  });

  /* ---------- 9. Admission form validation + submit ---------- */
  var form = $('#admissionForm');
  if (form) {
    var status = $('#formStatus');
    var submitBtn = $('#formSubmit');

    var RULES = {
      'f-name':        { msg: 'Please enter the student\'s full name (at least 3 characters).', test: function (v) { return v.trim().length >= 3; } },
      'f-dob':         { msg: 'Please select the date of birth.', test: function (v) { return !!v; } },
      'f-gender':      { msg: 'Please select a gender option.', test: function (v) { return !!v; } },
      'f-mobile':      { msg: 'Enter a valid 10-digit Indian mobile number.', test: function (v) { return /^[6-9]\d{9}$/.test(v.trim()); } },
      'f-email':       { msg: 'Enter a valid email address.', test: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); } },
      'f-address':     { msg: 'Please enter your current address.', test: function (v) { return v.trim().length >= 6; } },
      'f-qual':        { msg: 'Please select your educational qualification.', test: function (v) { return !!v; } },
      'f-course':      { msg: 'Please select the course you are interested in.', test: function (v) { return !!v; } },
      'f-parent':      { msg: 'Please enter the parent / guardian name.', test: function (v) { return v.trim().length >= 3; } },
      'f-parent-mobile': { msg: 'Enter a valid 10-digit mobile number for the parent / guardian.', test: function (v) { return /^[6-9]\d{9}$/.test(v.trim()); } }
    };

    function setError(id, msg) {
      var field = $('#' + id) ? $('#' + id).closest('.field') : null;
      var errEl = $('[data-err-for="' + id + '"]');
      if (field) field.classList.toggle('is-invalid', !!msg);
      if (errEl) errEl.textContent = msg || '';
    }

    function validateField(id) {
      var el = $('#' + id);
      if (!el) return true;
      var rule = RULES[id];
      if (!rule) return true;
      var ok = rule.test(el.value);
      setError(id, ok ? '' : rule.msg);
      return ok;
    }

    Object.keys(RULES).forEach(function (id) {
      var el = $('#' + id);
      if (!el) return;
      el.addEventListener('blur', function () { validateField(id); });
      el.addEventListener('input', function () {
        if (el.closest('.field').classList.contains('is-invalid')) validateField(id);
      });
    });

    var consent = $('#f-consent');
    if (consent) {
      consent.addEventListener('change', function () {
        setError('f-consent', consent.checked ? '' : '');
      });
    }

    function showStatus(type, html) {
      status.className = 'form__status show form__status--' + type;
      status.innerHTML = html;
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    function waLink(data) {
      var lines = [
        'Admission Enquiry — Excel Defence Academy',
        '',
        'Name: ' + data.student_name,
        'Date of Birth: ' + data.date_of_birth,
        'Gender: ' + data.gender,
        'Mobile: ' + data.mobile,
        'Email: ' + data.email,
        'Qualification: ' + data.qualification,
        'Interested Course: ' + data.course,
        'Parent/Guardian: ' + data.guardian_name + ' (' + data.guardian_mobile + ')',
        'Address: ' + data.address
      ];
      if (data.message) lines.push('Message: ' + data.message);
      return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(RULES).forEach(function (id) {
        if (!validateField(id) && !firstInvalid) firstInvalid = $('#' + id);
      });

      if (consent && !consent.checked) {
        setError('f-consent', 'Please provide your consent so we can contact you.');
        if (!firstInvalid) firstInvalid = consent;
      }

      if (firstInvalid) {
        showStatus('err',
          '<svg aria-hidden="true"><use href="#i-x"/></svg><span>Please correct the highlighted fields above and submit again.</span>');
        firstInvalid.focus();
        return;
      }

      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });

      var endpoint = form.getAttribute('action') || '';
      var configured = form.getAttribute('data-endpoint-configured') === 'true' &&
                       endpoint.indexOf('YOUR_FORM_ID') === -1;

      if (!configured) {
        // No live backend wired up yet — hand the enquiry over through a channel that
        // genuinely reaches the academy, so nothing is ever silently lost.
        showStatus('ok',
          '<svg aria-hidden="true"><use href="#i-check-circle"/></svg><span><strong>Almost done!</strong> Your details have been checked and are ready to send. ' +
          'Because the online form service has not been connected yet, please send the enquiry in one tap below — it reaches the academy instantly with all your details filled in.</span>' +
          '<span style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">' +
          '<a class="btn btn--wa btn--sm" href="' + waLink(data) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg> Send on WhatsApp</a>' +
          '<a class="btn btn--outline btn--sm" href="tel:+917207636812"><svg aria-hidden="true"><use href="#i-phone"/></svg> Call Now</a>' +
          '<a class="btn btn--outline btn--sm" href="mailto:sihivakamur23@gmail.com?subject=' + encodeURIComponent('Admission Enquiry — ' + data.student_name) + '&body=' + encodeURIComponent(waLink(data).replace('https://wa.me/' + WA_NUMBER + '?text=', '').replace(/%0A/g, '\n')) + '"><svg aria-hidden="true"><use href="#i-mail"/></svg> Send Email</a>' +
          '</span></span>');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending&hellip;';

      fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          showStatus('ok',
            '<svg aria-hidden="true"><use href="#i-check-circle"/></svg><span><strong>Thank you, ' + data.student_name.split(' ')[0] + '!</strong> ' +
            'Your admission enquiry has been received. Our team will contact you on ' + data.mobile + ' shortly. For anything urgent, call or WhatsApp +91 72076 36812.</span>');
        })
        .catch(function () {
          showStatus('err',
            '<svg aria-hidden="true"><use href="#i-x"/></svg><span>We could not submit the form just now. Please try again, or reach us directly on ' +
            '<a href="tel:+917207636812" style="color:#ffd9cf">+91 72076 36812</a> or ' +
            '<a href="' + waLink(data) + '" target="_blank" rel="noopener" style="color:#ffd9cf">WhatsApp</a>.</span>');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Enquiry <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
        });
    });
  }

  /* ---------- 10. Smooth in-page anchors (older browsers) ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - (header ? header.offsetHeight + 10 : 80);
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- 11. Footer year ---------- */
  var yearEls = $$('[data-year]');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
