/* ============================================================
   GLOBAL CONNECT — SHARED SCRIPT
   ============================================================ */
(function () {
  'use strict';

  /* ---------- DATA ---------- */
  const JOBS = [
    { title:'Warehouse & Logistics Operator', sector:'Logistics', company:'Confidential — logistics group',
      location:'Luxembourg City', salary:'€2,300 – €2,800 / month', type:'Full-time',
      tags:['Visa sponsorship','Accommodation support'] },
    { title:'Hotel Housekeeping Supervisor', sector:'Hospitality', company:'Confidential — 4★ hotel group',
      location:'Luxembourg City', salary:'€2,400 – €2,900 / month', type:'Full-time',
      tags:['Visa sponsorship','Meals provided'] },
    { title:'Certified Nurse Assistant', sector:'Healthcare', company:'Confidential — care residence',
      location:'Esch-sur-Alzette', salary:'€2,700 – €3,300 / month', type:'Full-time',
      tags:['Visa sponsorship','Language training'] },
    { title:'Construction Site Worker', sector:'Construction', company:'Confidential — construction firm',
      location:'Differdange', salary:'€2,500 – €3,000 / month', type:'Full-time',
      tags:['Visa sponsorship','Housing support'] },
    { title:'Software Developer (Java)', sector:'IT', company:'Confidential — fintech company',
      location:'Luxembourg City', salary:'€4,200 – €5,600 / month', type:'Full-time',
      tags:['Visa sponsorship','Hybrid work'] },
    { title:'Commercial Cleaner', sector:'Facilities', company:'Confidential — facilities services',
      location:'Kirchberg', salary:'€2,200 – €2,500 / month', type:'Full-time',
      tags:['Visa sponsorship','Free transport'] },
    { title:'Commis Chef / Kitchen Assistant', sector:'Hospitality', company:'Confidential — restaurant group',
      location:'Luxembourg City', salary:'€2,300 – €2,700 / month', type:'Full-time',
      tags:['Visa sponsorship','Meals provided'] },
    { title:'Truck Driver (CE Licence)', sector:'Logistics', company:'Confidential — transport company',
      location:'Bettembourg', salary:'€2,600 – €3,100 / month', type:'Full-time',
      tags:['Visa sponsorship','Housing support'] },
    { title:'Home Caregiver', sector:'Healthcare', company:'Confidential — home care provider',
      location:'Esch-sur-Alzette', salary:'€2,500 – €2,900 / month', type:'Full-time',
      tags:['Visa sponsorship','Training provided'] },
    { title:'Horticulture Farm Worker', sector:'Agriculture', company:'Confidential — horticulture estate',
      location:'Mersch', salary:'€2,200 – €2,600 / month', type:'Seasonal / Full-time',
      tags:['Visa sponsorship','Accommodation support'] }
  ];

  /* ---------- HELPERS ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- MOBILE NAV ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  if (navToggle && nav && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- YEAR ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- REVEAL ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      io.observe(el);
    });
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- JOBS (INDEX) ---------- */
  const jobsGrid = $('#jobsGrid');
  if (jobsGrid) {
    const renderJobs = (sector = 'All') => {
      const list = sector === 'All' ? JOBS : JOBS.filter(j => j.sector === sector);
      if (!list.length) {
        jobsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:30px 0;">No roles currently open in this sector. Please check back soon or send a general application.</p>';
        return;
      }
      jobsGrid.innerHTML = list.map(j => `
        <article class="job-card">
          <div class="job-top">
            <span class="job-sector">${j.sector}</span>
            <span class="job-type">${j.type}</span>
          </div>
          <h3>${j.title}</h3>
          <p class="job-company">${j.company}</p>
          <ul class="job-meta">
            <li><svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>${j.location}</li>
            <li><svg class="icon" aria-hidden="true"><use href="#i-euro"/></svg>${j.salary}</li>
          </ul>
          <div class="job-tags">${j.tags.map(t => `<span>${t}</span>`).join('')}</div>
          <button type="button" class="btn btn-ghost job-apply" data-job="${j.title.replace(/"/g, '&quot;')}">
            Apply for this role <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>
          </button>
        </article>
      `).join('');

      jobsGrid.querySelectorAll('.job-apply').forEach(btn => {
        btn.addEventListener('click', () => {
          window.location.href = 'apply.html?role=' + encodeURIComponent(btn.dataset.job);
        });
      });
    };

    renderJobs();

    $$('.filter').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderJobs(btn.dataset.sector);
      });
    });
  }

  /* ---------- APPLY WIZARD (APPLY PAGE) ---------- */
  const form = $('#applicationForm');
  if (!form) return; // stop here if not on apply page

  const stepper = $('#stepper');
  const formSteps = $$('.form-step');
  const stepperItems = $$('.stepper-item');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const submitBtn = $('#submitBtn');
  const successPanel = $('#applySuccess');
  const refNumberEl = $('#refNumber');
  const waFloat = $('#waFloat');

  let currentStep = 1;
  const totalSteps = 3;

  /* populate role select */
  const positionSelect = $('#position');
  if (positionSelect) {
    JOBS.forEach(j => {
      const opt = document.createElement('option');
      opt.value = j.title;
      opt.textContent = `${j.title} — ${j.sector}`;
      positionSelect.appendChild(opt);
    });

    /* preselect from URL ?role= */
    const params = new URLSearchParams(window.location.search);
    const preselectedRole = params.get('role');
    if (preselectedRole) {
      // try exact match
      const found = Array.from(positionSelect.options).some(o => o.value === preselectedRole);
      if (found) positionSelect.value = preselectedRole;
    }
  }

  /* update UI for step */
  const showStep = (step) => {
    currentStep = step;
    formSteps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === step));
    stepperItems.forEach(item => {
      const s = Number(item.dataset.step);
      item.classList.toggle('active', s === step);
      item.classList.toggle('done', s < step);
    });
    stepper.dataset.step = String(step);

    prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    nextBtn.style.display = step < totalSteps ? 'inline-flex' : 'none';
    submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';

    // scroll card into view a bit
    $('.apply-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* validate current step */
  const validateStep = (step) => {
    const stepEl = formSteps.find(s => Number(s.dataset.step) === step);
    if (!stepEl) return true;
    const fields = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  /* next / prev */
  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) showStep(currentStep + 1);
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });

  /* submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    // generate ref
    const ref = 'GC-' + String(Math.floor(100000 + Math.random() * 900000));
    if (refNumberEl) refNumberEl.textContent = ref;

    // hide form, show success
    form.style.display = 'none';
    successPanel.hidden = false;

    // mark all stepper items done
    stepperItems.forEach(item => {
      item.classList.remove('active');
      item.classList.add('done');
    });
    stepper.dataset.step = '3';

    // WhatsApp becomes prominent
    if (waFloat) {
      waFloat.classList.add('prominent');
      // update message to include ref
      const href = `https://wa.me/35220000000?text=${encodeURIComponent(
        'Hello Global Connect, I have just submitted my application (ref ' + ref + ') and would like to follow up.'
      )}`;
      waFloat.href = href;
    }

    successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* file upload feedback */
  $$('.upload input[type=file]').forEach(input => {
    input.addEventListener('change', () => {
      const box = input.closest('.upload');
      const nameEl = box.querySelector('.upload-file');
      if (!input.files.length) {
        nameEl.textContent = '';
        box.classList.remove('has-file');
        return;
      }
      const file = input.files[0];
      const maxMB = 5;
      if (file.size > maxMB * 1024 * 1024) {
        alert(`"${file.name}" is larger than ${maxMB} MB. Please upload a smaller file.`);
        input.value = '';
        nameEl.textContent = '';
        box.classList.remove('has-file');
        return;
      }
      nameEl.textContent = '✓ ' + file.name;
      box.classList.add('has-file');
    });
  });

  /* init */
  showStep(1);
})();