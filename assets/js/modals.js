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
  // 4. Large Holographic Logo Lightbox with Particle Canvas & Studio HUD
  // ==========================================
  let logoHoverTimer = null;
  let modalAnimId = null;
  let modalParticles = [];
  let modalMouse = { x: null, y: null, radius: 110 };

  function ensureLogoLightbox() {
    let modal = document.getElementById('logo-lightbox-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'logo-lightbox-modal';
    modal.className = 'modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl hidden transition-all duration-300';
    modal.innerHTML = `
      <div id="logo-lightbox-card" class="modal-container holo-border cyber-grid relative w-full max-w-2xl p-6 sm:p-10 rounded-3xl bg-slate-950/95 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col items-center text-center">
        
        <!-- Interactive Particle Canvas inside the Popup -->
        <canvas id="modal-particle-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>

        <!-- Viewfinder Corner Brackets HUD -->
        <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none z-10"></div>
        <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400/50 pointer-events-none z-10"></div>
        <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-purple-500/50 pointer-events-none z-10"></div>
        <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-purple-500/50 pointer-events-none z-10"></div>

        <!-- Top Studio Viewfinder Header HUD Bar -->
        <div class="relative z-10 w-full flex items-center justify-between pb-3.5 mb-2 border-b border-white/10 text-xs font-mono">
          <div class="flex items-center gap-2 text-emerald-400 font-semibold tracking-wider">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-[11px] uppercase tracking-widest font-bold">[ ● REC ] 4K PRORES RAW</span>
          </div>
          <div class="hidden sm:flex items-center gap-2.5 text-slate-400 text-[10px] uppercase tracking-wider">
            <span>ISO 800</span>
            <span>•</span>
            <span>f/1.8 APERTURE</span>
            <span>•</span>
            <span class="text-cyan-400 font-bold">BENGALURU STUDIO</span>
          </div>
          <!-- Close button in the corner -->
          <button id="close-logo-lightbox" class="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-red-950/80 text-slate-300 hover:text-red-400 border border-white/15 hover:border-red-500/50 flex items-center justify-center transition shadow-lg" aria-label="Close Logo Popup">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Ambient Studio Soft Spotlight (Clean, No Muddy Blur) -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-purple-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <!-- Central High-Contrast Logo Pedestal with 3D Tilt Optics -->
        <div id="lightbox-logo-stage" class="relative z-10 my-4 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-2xl transition duration-200">
          <img id="lightbox-logo-img" src="assets/images/logo.png" alt="LYFAds Official Brand Mark" class="relative z-10 w-full max-w-[280px] sm:max-w-md h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] select-none pointer-events-none">
        </div>

        <!-- Agency Title & Typography -->
        <div class="relative z-10 space-y-1.5 mt-1">
          <div class="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white flex items-center justify-center gap-2">
            <span>LYF<span class="text-purple-400">Ads</span></span>
            <span class="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Bengaluru HQ</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 font-medium tracking-wide max-w-md mx-auto">
            Official Creative Video Production Studio & 10x Full-Funnel Growth Agency
          </p>

          <!-- Badges / Specs -->
          <div class="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-300">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-purple-300">
              <i class="fa-solid fa-clapperboard text-xs mr-1 text-purple-400"></i> Cinema-Grade Ad Films
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-cyan-300">
              <i class="fa-solid fa-chart-line text-xs mr-1 text-cyan-400"></i> 10x Performance Media
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-emerald-300">
              <i class="fa-solid fa-robot text-xs mr-1 text-emerald-400"></i> AI Automation Bots
            </span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a href="assets/images/logo.png" download="LYFAds_Official_Logo.png" class="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow">
              <i class="fa-solid fa-download text-xs text-purple-400"></i>
              <span>Download Master Logo</span>
            </a>
            <button onclick="closeLogoLightbox(); openServiceModal('Creative Video Production', 'Consultation with our Bengaluru Studio Directors');" class="btn-primary px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
              <span>Book Studio Consultation</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
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

  function startModalParticleEngine() {
    const canvas = document.getElementById('modal-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const card = document.getElementById('logo-lightbox-card');
    if (!card) return;

    let width = canvas.width = card.offsetWidth;
    let height = canvas.height = card.offsetHeight;

    class ModalParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = (Math.random() - 0.5) * 0.85;
        this.radius = Math.random() * 2 + 1.2;
        const colors = [
          'rgba(6, 182, 212,',   // Cyan
          'rgba(139, 92, 246,',  // Violet
          'rgba(56, 189, 248,',  // Electric blue
          'rgba(255, 255, 255,'  // Starlight
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Gravitational mouse physics
        if (modalMouse.x !== null && modalMouse.y !== null) {
          const dx = modalMouse.x - this.x;
          const dy = modalMouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < modalMouse.radius) {
            const force = (modalMouse.radius - dist) / modalMouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.6;
            this.y += Math.sin(angle) * force * 1.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + this.alpha + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    modalParticles = [];
    const count = width < 500 ? 25 : 45;
    for (let i = 0; i < count; i++) {
      modalParticles.push(new ModalParticle());
    }

    function connectNodes() {
      const maxDist = 95;
      for (let a = 0; a < modalParticles.length; a++) {
        for (let b = a + 1; b < modalParticles.length; b++) {
          const dx = modalParticles[a].x - modalParticles[b].x;
          const dy = modalParticles[a].y - modalParticles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(modalParticles[a].x, modalParticles[a].y);
            ctx.lineTo(modalParticles[b].x, modalParticles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < modalParticles.length; i++) {
        modalParticles[i].update();
        modalParticles[i].draw();
      }
      connectNodes();
      modalAnimId = requestAnimationFrame(animate);
    }

    if (modalAnimId) cancelAnimationFrame(modalAnimId);
    animate();

    card.onmousemove = (e) => {
      const rect = card.getBoundingClientRect();
      modalMouse.x = e.clientX - rect.left;
      modalMouse.y = e.clientY - rect.top;

      // 3D Gyroscopic tilt on central logo stage
      const stage = document.getElementById('lightbox-logo-stage');
      if (stage) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (modalMouse.x - centerX) / centerX;
        const deltaY = (modalMouse.y - centerY) / centerY;
        stage.style.transform = `perspective(800px) rotateX(${(-deltaY * 7).toFixed(2)}deg) rotateY(${(deltaX * 7).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    };

    card.onmouseleave = () => {
      modalMouse.x = null;
      modalMouse.y = null;
      const stage = document.getElementById('lightbox-logo-stage');
      if (stage) {
        stage.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    };
  }

  function openLogoLightbox() {
    const modal = ensureLogoLightbox();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Start particle engine after layout render
    setTimeout(startModalParticleEngine, 50);
  }

  function closeLogoLightbox() {
    const modal = document.getElementById('logo-lightbox-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (modalAnimId) {
        cancelAnimationFrame(modalAnimId);
        modalAnimId = null;
      }
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

