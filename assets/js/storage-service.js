/**
 * LYFAds Bengaluru - Enterprise LocalStorage State Service & Security Engine
 * Zero external dependencies. Fully persistent, XSS-sanitized client CRM.
 */

const STORAGE_KEY = 'lyfads_leads_v1';
const ADMIN_AUTH_KEY = 'lyfads_admin_authenticated';

// Initial enterprise seed leads representing Bengaluru tech & D2C clients
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
    this.initStorage();
  }

  // Security layer: Input Sanitizer against Reflected and Stored XSS
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

  // Initialize storage with seed data if absent
  initStorage() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
      }
    } catch (err) {
      console.warn('LocalStorage access warning, using in-memory fallback:', err);
    }
  }

  // Fetch all leads sorted by newest first
  getLeads() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const leads = raw ? JSON.parse(raw) : SEED_LEADS;
      return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.error('Error parsing leads from LocalStorage:', err);
      return SEED_LEADS;
    }
  }

  // Fetch single lead
  getLeadById(id) {
    return this.getLeads().find(l => l.id === id) || null;
  }

  // Save new lead
  saveLead(data) {
    const leads = this.getLeads();
    const newLead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      fullName: StorageService.sanitize(data.fullName || ''),
      email: StorageService.sanitize(data.email || ''),
      phone: StorageService.sanitize(data.phone || ''),
      company: StorageService.sanitize(data.company || 'Direct Client'),
      service: StorageService.sanitize(data.service || 'General Digital Marketing'),
      budget: StorageService.sanitize(data.budget || 'Flexible'),
      timeline: StorageService.sanitize(data.timeline || 'Flexible'),
      message: StorageService.sanitize(data.message || ''),
      status: 'New Lead', // Default status: New Lead, In Progress, Closed
      source: StorageService.sanitize(data.source || 'Website')
    };

    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

    // Dispatch real-time synchronization event across DOM
    window.dispatchEvent(new CustomEvent('lyfads:lead_created', { detail: newLead }));
    return newLead;
  }

  // Update status (New Lead | In Progress | Closed)
  updateLeadStatus(id, newStatus) {
    const leads = this.getLeads();
    const target = leads.find(l => l.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('lyfads:lead_updated', { detail: target }));
      return true;
    }
    return false;
  }

  // Delete lead
  deleteLead(id) {
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('lyfads:lead_deleted', { detail: { id } }));
    return true;
  }

  // Reset to default seed leads
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
    window.dispatchEvent(new CustomEvent('lyfads:storage_reset'));
    return SEED_LEADS;
  }

  // CRM Analytics Metrics
  getAnalytics() {
    const leads = this.getLeads();
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'New Lead').length;
    const inProgress = leads.filter(l => l.status === 'In Progress').length;
    const closed = leads.filter(l => l.status === 'Closed').length;

    // Approximate pipeline value calculation based on budget selections
    const pipelineEstimate = leads.reduce((acc, curr) => {
      if (curr.budget.includes('25L+')) return acc + 2500000;
      if (curr.budget.includes('10L - 25L')) return acc + 1750000;
      if (curr.budget.includes('5L - 10L')) return acc + 750000;
      return acc + 350000;
    }, 0);

    return { total, newLeads, inProgress, closed, pipelineEstimate };
  }

  // Export leads as standard CSV file
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

  // Export leads as JSON snapshot
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
}

// Global instance and class exposed for seamless access across modules
window.StorageService = StorageService;
window.lyfadsStorage = new StorageService();
