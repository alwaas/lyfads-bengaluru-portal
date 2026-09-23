/**
 * LYFAds Bengaluru - Global Modal & Toast Alert System
 * Manages Dynamic Service Inquiries, Case Study Inspection, and Toasts.
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Toast Notification Engine
  // ==========================================
  function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = 'success') {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast glass-panel p-4 rounded-xl flex items-center gap-3 border shadow-2xl';

    let iconHtml = '<i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>';
    let borderColor = 'border-emerald-500/40';

    if (type === 'error') {
      iconHtml = '<i class="fa-solid fa-circle-exclamation text-rose-400 text-lg"></i>';
      borderColor = 'border-rose-500/40';
    } else if (type === 'info') {
      iconHtml = '<i class="fa-solid fa-circle-info text-cyan-400 text-lg"></i>';
      borderColor = 'border-cyan-500/40';
    }

    toast.classList.add(borderColor);
    toast.innerHTML = `
      <div class="flex-shrink-0">${iconHtml}</div>
      <div class="flex-grow text-sm text-slate-100 font-medium">${StorageService.sanitize(message)}</div>
      <button class="text-slate-400 hover:text-white ml-2 text-xs transition" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);

    // Trigger enter animation
    setTimeout(() => toast.classList.add('show'), 20);

    const closeBtn = toast.querySelector('button');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 4500);
  }

  // ==========================================
  // 2. Dynamic Service Enquiry Modal
  // ==========================================
  function ensureServiceModal() {
    let modal = document.getElementById('service-enquiry-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'service-enquiry-modal';
    modal.className = 'modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden';
    modal.innerHTML = `
      <div class="modal-container glass-panel w-full max-w-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3.5">
            <div class="h-12 px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow">
              <img src="assets/images/logo.png" alt="LYFAds Logo" class="h-8 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(220,38,38,0.4)]">
            </div>
            <div>
              <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-semibold mb-1">
                <i class="fa-solid fa-bolt text-xs"></i> Express Priority Consultation
              </div>
              <h3 id="modal-service-title" class="text-xl sm:text-2xl font-bold font-heading text-white">Direct Service Enquiry</h3>
              <p id="modal-service-subtitle" class="text-xs text-slate-400 mt-0.5">Connect directly with our Bengaluru strategy directors.</p>
            </div>
          </div>
          <button id="close-service-modal" class="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="service-enquiry-form" class="space-y-4" data-rendered-at="${Date.now()}">
          <!-- Honeypot anti-spam protection -->
          <input type="text" name="hp_modal_field" style="display:none !important;" tabindex="-1" autocomplete="off">
          <input type="hidden" id="modal-selected-service" name="service" value="General Strategy">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
              <input type="text" name="fullName" required placeholder="e.g. Rahul Sharma" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Work Email *</label>
              <input type="email" name="email" required placeholder="rahul@company.com" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
              <input type="tel" name="phone" required placeholder="+91 98450 00000" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Company / Startup Name *</label>
              <input type="text" name="company" required placeholder="e.g. NextWave Labs" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Marketing Budget</label>
              <select name="budget" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition">
                <option value="₹2.5L - ₹5L / month">₹2.5L - ₹5L / month</option>
                <option value="₹5L - ₹10L / month" selected>₹5L - ₹10L / month</option>
                <option value="₹10L - ₹25L / month">₹10L - ₹25L / month</option>
                <option value="₹25L+ / month">₹25L+ / month (Enterprise)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Project Timeline</label>
              <select name="timeline" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition">
                <option value="Immediate (Within 7 days)" selected>Immediate (Within 7 days)</option>
                <option value="1-2 Weeks">1-2 Weeks</option>
                <option value="2-4 Weeks">2-4 Weeks</option>
                <option value="Exploratory">Exploratory / Planning</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Project Goals & Requirements</label>
            <textarea name="message" rows="3" placeholder="Briefly describe your objectives, target audience, and current CAC or ROAS challenges..." class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"></textarea>
          </div>

          <div class="pt-2">
            <button type="submit" class="btn-primary w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg">
              <span>Submit Priority Request</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <p class="text-center text-xs text-slate-500 mt-2 flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-shield-halved text-emerald-400"></i> Strict NDA protected. Fast response SLA < 2 hours.
            </p>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Event binding
    const closeBtn = modal.querySelector('#close-service-modal');
    closeBtn.addEventListener('click', () => closeServiceModal());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeServiceModal();
    });

    // Form submit handler with validation & velocity anti-spam
    const form = modal.querySelector('#service-enquiry-form');
    form.addEventListener('submit', handleServiceFormSubmit);

    return modal;
  }

  function openServiceModal(serviceName, subtitle) {
    const modal = ensureServiceModal();
    const titleEl = modal.querySelector('#modal-service-title');
    const subEl = modal.querySelector('#modal-service-subtitle');
    const inputService = modal.querySelector('#modal-selected-service');
    const form = modal.querySelector('#service-enquiry-form');

    if (serviceName) {
      titleEl.textContent = serviceName;
      inputService.value = serviceName;
    }
    if (subtitle) {
      subEl.textContent = subtitle;
    }

    form.dataset.renderedAt = Date.now().toString();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    const modal = document.getElementById('service-enquiry-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      const form = modal.querySelector('#service-enquiry-form');
      if (form) form.reset();
    }
  }

  function handleServiceFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Security Check 1: Honeypot
    if (form.hp_modal_field && form.hp_modal_field.value.trim() !== '') {
      console.warn('Bot detected via honeypot.');
      showToast('Automated submission flagged.', 'error');
      closeServiceModal();
      return;
    }

    // Security Check 2: Submission Velocity (< 2.0s is suspicious bot script)
    const renderedAt = parseInt(form.dataset.renderedAt || '0', 10);
    const elapsed = Date.now() - renderedAt;
    if (elapsed < 2000) {
      showToast('Submission too fast. Please verify details.', 'error');
      return;
    }

    const formData = new FormData(form);
    const fullName = formData.get('fullName')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const company = formData.get('company')?.toString().trim();

    // Regex checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please provide a valid work email address.', 'error');
      return;
    }

    if (phone.length < 8) {
      showToast('Please provide a valid contact phone number.', 'error');
      return;
    }

    const leadData = {
      fullName,
      email,
      phone,
      company,
      service: formData.get('service')?.toString() || 'General Inquiry',
      budget: formData.get('budget')?.toString() || '₹5L - ₹10L / month',
      timeline: formData.get('timeline')?.toString() || 'Immediate',
      message: formData.get('message')?.toString() || '',
      source: 'Service Modal'
    };

    if (window.lyfadsStorage) {
      window.lyfadsStorage.saveLead(leadData);
      showToast('Inquiry submitted! Our Bengaluru team will connect shortly.', 'success');
      closeServiceModal();
    } else {
      showToast('Lead captured in session.', 'info');
      closeServiceModal();
    }
  }

  // ==========================================
  // 3. Case Study Inspection Modal
  // ==========================================
  function ensureCaseStudyModal() {
    let modal = document.getElementById('case-study-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'case-study-modal';
    modal.className = 'modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md hidden';
    modal.innerHTML = `
      <div class="modal-container glass-panel w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="relative h-64 sm:h-72 w-full overflow-hidden rounded-t-2xl">
          <img id="cs-modal-img" src="" alt="Case Study Cover" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <button id="close-cs-modal" class="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          <div class="absolute top-4 left-4 z-10 h-9 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur border border-white/10 flex items-center justify-center shadow">
            <img src="assets/images/logo.png" alt="LYFAds Logo" class="h-6 w-auto object-contain">
          </div>
          <div class="absolute bottom-6 left-6 right-6">
            <span id="cs-modal-tag" class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">SaaS Growth</span>
            <h3 id="cs-modal-title" class="text-2xl sm:text-3xl font-bold font-heading text-white mt-2 leading-tight">Case Study Title</h3>
            <p id="cs-modal-client" class="text-sm text-slate-300 mt-1 font-medium">Client Name</p>
          </div>
        </div>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- Metrics Grid -->
          <div id="cs-modal-metrics" class="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <!-- Dynamic metric cards injected here -->
          </div>

          <!-- Challenge & Strategy -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <h4 class="text-xs uppercase font-bold tracking-wider text-rose-400 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i> The Challenge
              </h4>
              <p id="cs-modal-challenge" class="text-sm text-slate-300 leading-relaxed"></p>
            </div>
            <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <h4 class="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Strategic Execution
              </h4>
              <p id="cs-modal-solution" class="text-sm text-slate-300 leading-relaxed"></p>
            </div>
          </div>

          <!-- Audited ROI Results -->
          <div class="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
            <h4 class="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-2 flex items-center gap-2">
              <i class="fa-solid fa-trophy"></i> Audited Business Impact
            </h4>
            <p id="cs-modal-results" class="text-sm text-slate-200 leading-relaxed"></p>
          </div>

          <!-- Testimonial Quote -->
          <div class="p-5 rounded-xl bg-slate-900/70 border-l-4 border-indigo-500">
            <p id="cs-modal-testimonial" class="italic text-sm text-slate-300"></p>
            <p id="cs-modal-author" class="text-xs font-semibold text-indigo-400 mt-2"></p>
          </div>

          <!-- Modal Action CTA -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div>
              <p class="text-xs text-slate-400">Want similar exponential results for your brand?</p>
              <p class="text-sm font-semibold text-white">Our Bengaluru team builds custom growth blueprints.</p>
            </div>
            <button id="cs-modal-enquire-btn" class="btn-primary py-2.5 px-6 rounded-xl font-semibold text-sm text-white whitespace-nowrap shadow-lg">
              Book Blueprint Session <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-cs-modal');
    closeBtn.addEventListener('click', () => closeCaseStudyModal());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCaseStudyModal();
    });

    const enquireBtn = modal.querySelector('#cs-modal-enquire-btn');
    enquireBtn.addEventListener('click', () => {
      const clientName = modal.querySelector('#cs-modal-client').textContent;
      closeCaseStudyModal();
      openServiceModal('Custom Growth Blueprint', `Inspired by ${clientName} case study`);
    });

    return modal;
  }

  function openCaseStudyModal(studyId) {
    const modal = ensureCaseStudyModal();
    const study = (window.CASE_STUDIES_DATA || []).find(s => s.id === studyId);
    if (!study) return;

    modal.querySelector('#cs-modal-img').src = study.image;
    modal.querySelector('#cs-modal-tag').textContent = study.tag;
    modal.querySelector('#cs-modal-title').textContent = study.title;
    modal.querySelector('#cs-modal-client').textContent = study.client;
    modal.querySelector('#cs-modal-challenge').textContent = study.challenge;
    modal.querySelector('#cs-modal-solution').textContent = study.solution;
    modal.querySelector('#cs-modal-results').textContent = study.results;
    modal.querySelector('#cs-modal-testimonial').textContent = study.testimonial;
    modal.querySelector('#cs-modal-author').textContent = '— ' + study.author;

    // Metrics cards
    const metricsContainer = modal.querySelector('#cs-modal-metrics');
    metricsContainer.innerHTML = (study.metrics || []).map(m => `
      <div class="text-center p-2 rounded-lg bg-slate-800/40">
        <div class="text-lg sm:text-xl font-black gradient-text font-heading">${m.value}</div>
        <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">${m.label}</div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // 4. Large Transparent Logo Lightbox Popup
  // ==========================================
  let logoHoverTimer = null;

  function ensureLogoLightbox() {
    let modal = document.getElementById('logo-lightbox-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'logo-lightbox-modal';
    modal.className = 'modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-2xl hidden transition-all duration-300';
    modal.innerHTML = `
      <div class="modal-container glass-panel relative w-full max-w-xl p-8 sm:p-12 rounded-3xl border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col items-center text-center bg-slate-950/85">
        <!-- Close button in the corner -->
        <button id="close-logo-lightbox" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-red-950/80 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition shadow-lg" aria-label="Close Logo Popup">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <!-- Ambient Red Backlight -->
        <div class="relative w-full flex items-center justify-center my-6">
          <div class="absolute inset-0 bg-red-600/25 rounded-full blur-3xl pointer-events-none scale-125 animate-glow"></div>
          <img src="assets/images/logo.png" alt="LYFAds Official Brand Mark" class="relative z-10 w-full max-w-sm sm:max-w-md h-auto object-contain filter drop-shadow-[0_0_35px_rgba(220,38,38,0.6)] transform transition duration-500 hover:scale-105 select-none">
        </div>

        <!-- Agency Title & Typography -->
        <div class="space-y-1.5 mt-2">
          <div class="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white flex items-center justify-center gap-2">
            <span>LYF<span class="text-purple-400">Ads</span></span>
            <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Bengaluru HQ</span>
          </div>
          <p class="text-xs text-slate-400 font-medium tracking-wide">
            Official Creative Video Production & Visual Design Emblem
          </p>
          <div class="pt-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
              <i class="fa-solid fa-camera text-red-400 text-xs"></i> Cinema-Grade Ad Films & Algorithmic Scale
            </span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-logo-lightbox');
    closeBtn.addEventListener('click', closeLogoLightbox);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLogoLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeLogoLightbox();
      }
    });

    return modal;
  }

  function openLogoLightbox() {
    const modal = ensureLogoLightbox();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLogoLightbox() {
    const modal = document.getElementById('logo-lightbox-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function initLogoHoverTriggers() {
    ensureLogoLightbox();

    // Select all logo elements across pages
    const targets = document.querySelectorAll('.lyfads-logo-trigger, img[src*="logo.png"], .lyfads-logo-icon-container');
    targets.forEach((el) => {
      el.style.cursor = 'pointer';
      if (!el.getAttribute('title')) {
        el.setAttribute('title', 'Hover or tap to preview LYFAds emblem');
      }

      // Mouse enter (hover)
      el.addEventListener('mouseenter', () => {
        clearTimeout(logoHoverTimer);
        logoHoverTimer = setTimeout(() => {
          openLogoLightbox();
        }, 180); // 180ms hover dwell
      });

      // Mouse leave
      el.addEventListener('mouseleave', () => {
        clearTimeout(logoHoverTimer);
      });

      // Click or touch
      el.addEventListener('click', (e) => {
        if (el.tagName === 'IMG' || el.classList.contains('lyfads-logo-icon-container') || el.classList.contains('lyfads-logo-trigger')) {
          e.preventDefault();
          e.stopPropagation();
          clearTimeout(logoHoverTimer);
          openLogoLightbox();
        }
      });

      el.addEventListener('touchstart', (e) => {
        if (el.tagName === 'IMG' || el.classList.contains('lyfads-logo-icon-container') || el.classList.contains('lyfads-logo-trigger')) {
          e.preventDefault();
          e.stopPropagation();
          clearTimeout(logoHoverTimer);
          openLogoLightbox();
        }
      }, { passive: false });
    });
  }

  // Bind on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoHoverTriggers);
  } else {
    initLogoHoverTriggers();
  }

  // Expose hooks globally
  window.showToast = showToast;
  window.openServiceModal = openServiceModal;
  window.closeServiceModal = closeServiceModal;
  window.openCaseStudyModal = openCaseStudyModal;
  window.closeCaseStudyModal = closeCaseStudyModal;
  window.openLogoLightbox = openLogoLightbox;
  window.closeLogoLightbox = closeLogoLightbox;

})();

