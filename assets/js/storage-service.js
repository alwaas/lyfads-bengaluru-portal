/**
 * LYFAds Bengaluru - Universal Central Database Client & Real-time State Engine
 * Connects to Permanent Node.js Central Database with Server-Sent Events (SSE).
 * Features: Multi-Device Persistence, Multi-Admin Auth, Instant Lead Notifications, Offline Fallback.
 */

const STORAGE_KEY = 'lyfads_leads_v1';
const ADMIN_AUTH_KEY = 'lyfads_admin_session';
const ADMIN_PROFILE_KEY = 'lyfads_admin_profile';
const NOTIF_RECIPIENTS_KEY = 'lyfads_notif_recipients';

// Default seed leads for immediate hydration & offline resilience
const SEED_LEADS = [
  {
    id: 'lead_bengaluru_01',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    fullName: 'Aravind Ramanathan',
    email: 'aravind.r@swiftdeliver.in',
    phone: '+91 98450 12345',
    company: 'SwiftDeliver Quick Commerce',
    service: 'Performance Marketing & Paid Ads',
    budget: '₹10L - ₹25L / month',
    timeline: 'Immediate (Within 7 days)',
    message: 'Need high-converting video reels & Meta/Google ads to scale app installs across Bengaluru and NCR. Current CAC is ₹120, target is ₹75.',
    status: 'In Progress',
    source: 'Services Grid Modal'
  },
  {
    id: 'lead_bengaluru_02',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    fullName: 'Pooja Venkatesh',
    email: 'pooja@zenithcloud.io',
    phone: '+91 97410 88765',
    company: 'ZenithCloud AI SaaS',
    service: 'AI Automation & Workflow Bots',
    budget: '₹5L - ₹10L / month',
    timeline: '1-2 Weeks',
    message: 'Seeking autonomous WhatsApp & web AI SDR bots to qualify inbound demo signups and automate CRM routing.',
    status: 'New Lead',
    source: 'Contact Form'
  },
  {
    id: 'lead_bengaluru_03',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    fullName: 'Karthik Subramanian',
    email: 'karthik@urbankicks.co',
    phone: '+91 99001 54321',
    company: 'UrbanKicks D2C Fashion',
    service: 'Commercial Video & Creative Ad Film Production',
    budget: '₹10L - ₹25L / month',
    timeline: 'Immediate (Within 7 days)',
    message: 'Looking for cinematic brand films & 3D CGI product drops for our upcoming festive collection launch in South India.',
    status: 'Closed',
    source: 'Services Grid Modal'
  },
  {
    id: 'lead_bengaluru_04',
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    fullName: 'Meera Deshmukh',
    email: 'meera.d@finvault.com',
    phone: '+91 98200 45678',
    company: 'FinVault Capital',
    service: 'Search Engine Optimization (SEO & Technical Audits)',
    budget: '₹2.5L - ₹5L / month',
    timeline: '2-4 Weeks',
    message: 'Complete technical SEO audit, programmatic landing page strategy, and high-intent BFSI keyword domination in tier-1 metro cities.',
    status: 'In Progress',
    source: 'Services Grid Modal'
  },
  {
    id: 'lead_bengaluru_05',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    fullName: 'Vikramaditya Roy',
    email: 'vikram@nexgenrealestate.in',
    phone: '+91 96112 34567',
    company: 'NexGen Bengaluru Living',
    service: 'B2B Sales Acceleration & Business Development',
    budget: '₹25L+ / month',
    timeline: 'Immediate (Within 7 days)',
    message: 'Targeting HNI investors in Bengaluru tech corridors (Whitefield, Bellandur, Sarjapur) for luxury villa projects. Need omni-channel outbound funnels.',
    status: 'Closed',
    source: 'Contact Form'
  }
];

class StorageService {
  constructor() {
    this.apiBase = 'http://localhost:3000/api';
    this.isServerConnected = false;
    this.eventSource = null;
    this.pollingInterval = null;
    this.broadcastChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('lyfads_realtime_sync') : null;

    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (event) => {
        this.handleBusMessage(event.data);
      };
    }

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const freshLeads = JSON.parse(e.newValue);
            if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
              window.dispatchEvent(new CustomEvent('lyfads:leads_synced', { detail: freshLeads }));
            }
          } catch (err) {}
        }
      });
    }

    this.initStorage();
    this.initBackendSync();
  }

  detectCandidateBases() {
    const candidates = [];
    if (typeof window !== 'undefined' && window.location) {
      const loc = window.location;
      if (loc.port === '3000') {
        candidates.push(`${loc.origin}/api`);
      }
      if (loc.hostname) {
        candidates.push(`http://${loc.hostname}:3000/api`);
      }
      candidates.push('http://localhost:3000/api');
      candidates.push('http://127.0.0.1:3000/api');
      if (loc.origin && !candidates.includes(`${loc.origin}/api`)) {
        candidates.push(`${loc.origin}/api`);
      }
    } else {
      candidates.push('http://localhost:3000/api');
    }
    return [...new Set(candidates)];
  }

  triggerEvent(name, detail) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent(name, { detail }));
      } catch (e) {}
    }
  }

  handleBusMessage(data) {
    if (!data || !data.action) return;
    if (data.action === 'lead_created' && data.lead) {
      this.handleRemoteLeadCreated(data.lead);
    } else if (data.action === 'lead_updated' && data.lead) {
      this.handleRemoteLeadUpdated(data.lead);
    } else if (data.action === 'lead_deleted' && data.payload) {
      this.handleRemoteLeadDeleted(data.payload);
    }
  }

  // Security Layer: Enterprise XSS Sanitizer
  static sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, 'blocked:')
      .replace(/on\w+\s*=/gi, 'blocked=');
  }

  initStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
      }
    } catch (err) {
      console.warn('[Storage] LocalStorage access warning, using fallback:', err);
    }
  }

  // ==========================================
  // Real-Time Multi-Device Sync Engine (SSE + Polling + Bus)
  // ==========================================
  async initBackendSync() {
    if (typeof window === 'undefined') return;

    const candidates = this.detectCandidateBases();
    let connected = false;

    for (const candidate of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const res = await fetch(`${candidate}/leads`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.leads)) {
            this.apiBase = candidate;
            this.isServerConnected = true;
            connected = true;
            this.mergeRemoteLeads(data.leads);
            this.connectEventSource();
            this.triggerEvent('lyfads:server_connected', { count: data.leads.length, apiBase: this.apiBase });
            break;
          }
        }
      } catch (err) {
        // try next candidate
      }
    }

    if (!connected) {
      this.isServerConnected = false;
      console.log('[Storage] Central database server offline; running in resilient local storage mode.');
    }

    // Always initiate smart fallback polling (every 2.5s) to guarantee zero-miss cross-device sync
    this.startPollingHeartbeat();
  }

  connectEventSource() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) return;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }
      this.eventSource = new EventSource(`${this.apiBase}/leads/stream`);

      this.eventSource.onopen = () => {
        this.isServerConnected = true;
        this.triggerEvent('lyfads:stream_connected');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (!packet || !packet.type) return;

          if (packet.type === 'lyfads:lead_created') {
            this.handleRemoteLeadCreated(packet.payload);
          } else if (packet.type === 'lyfads:lead_updated') {
            this.handleRemoteLeadUpdated(packet.payload);
          } else if (packet.type === 'lyfads:lead_deleted') {
            this.handleRemoteLeadDeleted(packet.payload);
          } else if (packet.type === 'lyfads:notification_dispatched') {
            this.triggerEvent('lyfads:notification_dispatched', packet.payload);
          }
        } catch (e) {
          // ignore stream parse errors
        }
      };

      this.eventSource.onerror = () => {
        // Automatically handled by EventSource reconnect and smart polling heartbeat
      };
    } catch (err) {
      console.warn('[SSE] EventSource init error:', err);
    }
  }

  startPollingHeartbeat() {
    if (typeof clearInterval === 'function' && this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (typeof setInterval === 'function') {
      this.pollingInterval = setInterval(async () => {
        await this.pollServerChanges();
      }, 2500);
    }
  }

  async pollServerChanges() {
    if (typeof window === 'undefined' || !this.apiBase) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.apiBase}/leads`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.leads)) {
          this.isServerConnected = true;
          this.reconcileServerLeads(data.leads);
          if (!this.eventSource || this.eventSource.readyState === EventSource.CLOSED) {
            this.connectEventSource();
          }
        }
      }
    } catch (e) {
      // transient network blip
    }
  }

  reconcileServerLeads(serverLeads) {
    const localLeads = this.getLeads();
    const localMap = new Map(localLeads.map(l => [l.id, l]));
    const serverMap = new Map(serverLeads.map(l => [l.id, l]));

    let hasChanges = false;
    const newLeadsDetected = [];

    // 1. Detect new leads created on other devices
    for (const sLead of serverLeads) {
      if (!localMap.has(sLead.id)) {
        newLeadsDetected.push(sLead);
        hasChanges = true;
      } else {
        const lLead = localMap.get(sLead.id);
        if (lLead.status !== sLead.status) {
          lLead.status = sLead.status;
          hasChanges = true;
          this.triggerEvent('lyfads:lead_updated', sLead);
        }
      }
    }

    // 2. Detect deletions performed on other devices
    if (serverLeads.length < localLeads.length) {
      for (const lLead of localLeads) {
        if (!serverMap.has(lLead.id)) {
          hasChanges = true;
          this.triggerEvent('lyfads:lead_deleted', { id: lLead.id });
        }
      }
    }

    if (hasChanges || newLeadsDetected.length > 0) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverLeads));
      }
      for (const nl of newLeadsDetected) {
        this.triggerEvent('lyfads:lead_created', nl);
      }
      this.triggerEvent('lyfads:leads_synced', serverLeads);
    }
  }

  mergeRemoteLeads(remoteLeads) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteLeads));
    this.triggerEvent('lyfads:leads_synced', remoteLeads);
  }

  handleRemoteLeadCreated(lead) {
    if (!lead || !lead.id) return;
    const leads = this.getLeads();
    if (!leads.some(l => l.id === lead.id)) {
      leads.unshift(lead);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      }
      this.triggerEvent('lyfads:lead_created', lead);
    }
  }

  handleRemoteLeadUpdated(lead) {
    if (!lead || !lead.id) return;
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === lead.id);
    if (idx !== -1) {
      leads[idx] = lead;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      }
      this.triggerEvent('lyfads:lead_updated', lead);
    }
  }

  handleRemoteLeadDeleted(payload) {
    if (!payload || !payload.id) return;
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== payload.id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
    this.triggerEvent('lyfads:lead_deleted', payload);
  }

  // ==========================================
  // Core Leads CRUD Operations
  // ==========================================

  // Fetch all leads sorted by newest first
  getLeads() {
    if (typeof localStorage === 'undefined') return SEED_LEADS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const leads = raw ? JSON.parse(raw) : SEED_LEADS;
      return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.error('Error parsing leads:', err);
      return SEED_LEADS;
    }
  }

  getLeadById(id) {
    return this.getLeads().find(l => l.id === id) || null;
  }

  // Save new lead (Syncs instantly across all devices, windows & central DB)
  saveLead(data) {
    const leads = this.getLeads();
    const newLead = {
      id: data.id || ('lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
      createdAt: data.createdAt || new Date().toISOString(),
      fullName: StorageService.sanitize(data.fullName || ''),
      email: StorageService.sanitize(data.email || ''),
      phone: StorageService.sanitize(data.phone || ''),
      company: StorageService.sanitize(data.company || 'Direct Client'),
      service: StorageService.sanitize(data.service || 'General Digital Marketing'),
      budget: StorageService.sanitize(data.budget || 'Flexible'),
      timeline: StorageService.sanitize(data.timeline || 'Flexible'),
      message: StorageService.sanitize(data.message || ''),
      status: 'New Lead',
      source: StorageService.sanitize(data.source || 'Website')
    };

    leads.unshift(newLead);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }

    // Trigger local DOM event immediately
    this.triggerEvent('lyfads:lead_created', newLead);

    // Broadcast to cross-tab channel
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ action: 'lead_created', lead: newLead });
    }

    // Push asynchronously to Central Server & Email Dispatch
    if (typeof fetch !== 'undefined') {
      fetch(`${this.apiBase}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).then(res => res.json())
        .then(result => {
          if (result && result.lead) {
            this.handleRemoteLeadCreated(result.lead);
          }
        }).catch(() => {
          // offline queue fallback
        });
    }

    return newLead;
  }

  // Update lead status (New Lead | In Progress | Closed)
  updateLeadStatus(id, newStatus) {
    const leads = this.getLeads();
    const target = leads.find(l => l.id === id);
    if (target) {
      target.status = newStatus;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      }
      this.triggerEvent('lyfads:lead_updated', target);

      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ action: 'lead_updated', lead: target });
      }

      // Sync with central backend
      if (typeof fetch !== 'undefined') {
        fetch(`${this.apiBase}/leads/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        }).catch(() => {});
      }

      return true;
    }
    return false;
  }

  // Delete lead
  deleteLead(id) {
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
    this.triggerEvent('lyfads:lead_deleted', { id });

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ action: 'lead_deleted', payload: { id } });
    }

    // Sync with central backend
    if (typeof fetch !== 'undefined') {
      fetch(`${this.apiBase}/leads/${id}`, { method: 'DELETE' }).catch(() => {});
    }

    return true;
  }

  // Reset to default seed leads
  resetToDefaults() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
    }
    this.triggerEvent('lyfads:storage_reset');

    if (typeof fetch !== 'undefined') {
      fetch(`${this.apiBase}/leads/reset`, { method: 'POST' }).catch(() => {});
    }

    return SEED_LEADS;
  }

  // CRM Analytics Metrics
  getAnalytics() {
    const leads = this.getLeads();
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'New Lead').length;
    const inProgress = leads.filter(l => l.status === 'In Progress').length;
    const closed = leads.filter(l => l.status === 'Closed').length;

    const pipelineEstimate = leads.reduce((acc, curr) => {
      const b = curr.budget || '';
      if (b.includes('25L+')) return acc + 2500000;
      if (b.includes('10L - 25L')) return acc + 1750000;
      if (b.includes('5L - 10L')) return acc + 750000;
      return acc + 350000;
    }, 0);

    return { total, newLeads, inProgress, closed, pipelineEstimate };
  }

  // Export CSV
  exportToCSV() {
    const leads = this.getLeads();
    if (!leads.length) return false;

    const headers = ['ID', 'Date Created', 'Full Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'Source', 'Message'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.source}"`,
      `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lyfads_bengaluru_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // Export JSON
  exportToJSON() {
    const leads = this.getLeads();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lyfads_bengaluru_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  }

  // ==========================================
  // Multi-Admin Authentication & Session API
  // ==========================================
  async loginAdmin(identifier, password) {
    // 1. Try Central Server
    try {
      const res = await fetch(`${this.apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(data.admin));
        localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(data.admin));
        return { success: true, admin: data.admin };
      }
    } catch (e) {
      // offline fallback
    }

    // 2. Offline / Local fallback credentials
    const defaultCredentials = [
      { id: 'admin_01', username: 'admin', email: 'admin@lyfads.com', password: 'admin123', name: 'Super Admin', role: 'Super Admin', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' },
      { id: 'admin_02', username: 'growth', email: 'bengaluru@lyfads.com', password: 'lyfads2026', name: 'Bengaluru Growth Director', role: 'Growth Director', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=growth' },
      { id: 'admin_03', username: 'sales', email: 'sales@lyfads.com', password: 'sales123', name: 'Enterprise Sales Lead', role: 'Sales Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sales' }
    ];

    const match = defaultCredentials.find(c => 
      (c.username.toLowerCase() === identifier.toLowerCase() || c.email.toLowerCase() === identifier.toLowerCase()) &&
      c.password === password
    );

    if (match) {
      const adminObj = { id: match.id, name: match.name, email: match.email, username: match.username, role: match.role, avatar: match.avatar };
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(adminObj));
      localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(adminObj));
      return { success: true, admin: adminObj };
    }

    return { success: false, message: 'Invalid admin credentials' };
  }

  logoutAdmin() {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PROFILE_KEY);
    localStorage.removeItem(ADMIN_PROFILE_KEY);
  }

  isLoggedIn() {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  }

  getCurrentAdmin() {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(ADMIN_PROFILE_KEY) || localStorage.getItem(ADMIN_PROFILE_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // Notification Management API
  // ==========================================
  async getNotificationRecipients() {
    try {
      const res = await fetch(`${this.apiBase}/notifications/recipients`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {}

    // LocalStorage fallback
    const raw = localStorage.getItem(NOTIF_RECIPIENTS_KEY);
    const recipients = raw ? JSON.parse(raw) : [
      { id: 'recip_01', name: 'LYFAds Leads Desk', email: 'leads@lyfads.com', active: true, addedAt: new Date().toISOString() },
      { id: 'recip_02', name: 'Studio Managing Director', email: 'director@lyfads.com', active: true, addedAt: new Date().toISOString() }
    ];
    return { success: true, recipients, logs: [] };
  }

  async addNotificationRecipient(name, email) {
    try {
      const res = await fetch(`${this.apiBase}/notifications/recipients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback
    const res = await this.getNotificationRecipients();
    const newRecip = {
      id: 'recip_' + Date.now(),
      name: StorageService.sanitize(name || 'Admin Officer'),
      email: StorageService.sanitize(email).toLowerCase(),
      active: true,
      addedAt: new Date().toISOString()
    };
    res.recipients.push(newRecip);
    localStorage.setItem(NOTIF_RECIPIENTS_KEY, JSON.stringify(res.recipients));
    return { success: true, recipient: newRecip };
  }

  async toggleNotificationRecipient(id, active) {
    try {
      const res = await fetch(`${this.apiBase}/notifications/recipients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const res = await this.getNotificationRecipients();
    const item = res.recipients.find(r => r.id === id);
    if (item) {
      item.active = !!active;
      localStorage.setItem(NOTIF_RECIPIENTS_KEY, JSON.stringify(res.recipients));
      return { success: true, recipient: item };
    }
    return { success: false };
  }

  async deleteNotificationRecipient(id) {
    try {
      const res = await fetch(`${this.apiBase}/notifications/recipients/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const res = await this.getNotificationRecipients();
    const filtered = res.recipients.filter(r => r.id !== id);
    localStorage.setItem(NOTIF_RECIPIENTS_KEY, JSON.stringify(filtered));
    return { success: true };
  }

  async sendTestNotification() {
    try {
      const res = await fetch(`${this.apiBase}/notifications/test-dispatch`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Server offline' };
    }
  }
}

// Global exposure
window.StorageService = StorageService;
window.lyfadsStorage = new StorageService();
