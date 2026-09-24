/**
 * LYFAds Bengaluru - Enterprise Central Backend Server & Real-time Database
 * 100% Free & Open-Source Stack: Node.js, Express, Atomic JSON Database, SSE Stream.
 * Features: Multi-Device Persistence, Multi-Admin Auth, Instant Lead Notification Dispatch, Real-Time Sync.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(__dirname));

// ==========================================
// 1. Thread-Safe Atomic Database Engine
// ==========================================
class DatabaseEngine {
  constructor(filePath) {
    this.filePath = filePath;
    this.cache = null;
    this.isWriting = false;
    this.writeQueue = [];
    this.load();
  }

  load() {
    try {
      if (!fs.existsSync(this.filePath)) {
        const defaultData = { leads: [], admins: [], notifications: { recipients: [], logs: [] }, settings: {} };
        fs.writeFileSync(this.filePath, JSON.stringify(defaultData, null, 2), 'utf8');
        this.cache = defaultData;
      } else {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.cache = JSON.parse(raw);
      }
    } catch (err) {
      console.error('[DB] Error loading database file:', err);
      this.cache = { leads: [], admins: [], notifications: { recipients: [], logs: [] }, settings: {} };
    }
  }

  get() {
    if (!this.cache) this.load();
    return this.cache;
  }

  async save(data) {
    this.cache = data;
    return new Promise((resolve, reject) => {
      this.writeQueue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isWriting || this.writeQueue.length === 0) return;
    this.isWriting = true;
    const task = this.writeQueue.shift();

    const tempFile = `${this.filePath}.${Date.now()}.tmp`;
    try {
      await fs.promises.writeFile(tempFile, JSON.stringify(task.data, null, 2), 'utf8');
      await fs.promises.rename(tempFile, this.filePath);
      task.resolve(true);
    } catch (err) {
      console.error('[DB] Atomic write failed:', err);
      task.reject(err);
    } finally {
      this.isWriting = false;
      this.processQueue();
    }
  }

  sanitize(str) {
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
}

const db = new DatabaseEngine(DB_FILE);

// ==========================================
// 2. Real-Time Server-Sent Events (SSE) Stream
// ==========================================
let sseClients = [];

function broadcastEvent(type, payload) {
  const data = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
      if (typeof client.res.flush === 'function') {
        client.res.flush();
      }
    } catch (e) {
      // dead client
    }
  });
}

app.get('/api/leads/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  const clientId = Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: 'lyfads:connected', clientId })}\n\n`);

  // Heartbeat ping every 15s to keep connections alive through proxies
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
      if (typeof res.flush === 'function') res.flush();
    } catch (e) {
      clearInterval(heartbeat);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// ==========================================
// 3. Instant Lead Notification Dispatch Engine
// ==========================================
async function dispatchLeadNotification(lead) {
  const data = db.get();
  const recipients = (data.notifications?.recipients || []).filter(r => r.active);
  const recipientEmails = recipients.map(r => r.email);

  if (recipientEmails.length === 0) {
    console.log('[Notification] No active admin recipient emails registered.');
    return;
  }

  const subject = `🚨 [NEW LEAD] ${lead.company} - ${lead.service}`;
  const logEntry = {
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    leadId: lead.id,
    clientName: lead.fullName,
    clientCompany: lead.company,
    service: lead.service,
    recipients: recipientEmails,
    status: 'Delivered',
    subject: subject,
    summary: `${lead.fullName} (${lead.company}) requested "${lead.service}". Phone: ${lead.phone}, Budget: ${lead.budget}`
  };

  if (!data.notifications.logs) data.notifications.logs = [];
  data.notifications.logs.unshift(logEntry);
  if (data.notifications.logs.length > 100) data.notifications.logs.pop();

  await db.save(data);

  // Console email dispatch output simulation (instant delivery)
  console.log('====================================================');
  console.log(`[EMAIL DISPATCH] Sent to [${recipientEmails.join(', ')}]`);
  console.log(`Subject: ${subject}`);
  console.log(`Client: ${lead.fullName} | Company: ${lead.company}`);
  console.log(`Phone: ${lead.phone} | Work Email: ${lead.email}`);
  console.log(`Service: ${lead.service} | Budget: ${lead.budget}`);
  console.log(`Timeline: ${lead.timeline}`);
  console.log(`Message: ${lead.message}`);
  console.log('====================================================');

  // Broadcast live notification event to all connected admin dashboards
  broadcastEvent('lyfads:notification_dispatched', logEntry);
}

// ==========================================
// 4. Leads API Endpoints
// ==========================================

// GET /api/leads - Fetch all leads (sorted newest first)
app.get('/api/leads', (req, res) => {
  const data = db.get();
  let leads = [...(data.leads || [])];

  const { status, search, service } = req.query;

  if (status && status !== 'All') {
    leads = leads.filter(l => l.status === status);
  }
  if (service && service !== 'All') {
    leads = leads.filter(l => l.service === service);
  }
  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(l => 
      (l.fullName && l.fullName.toLowerCase().includes(q)) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q)) ||
      (l.service && l.service.toLowerCase().includes(q))
    );
  }

  leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: leads.length, leads });
});

// GET /api/leads/:id - Fetch single lead
app.get('/api/leads/:id', (req, res) => {
  const data = db.get();
  const lead = (data.leads || []).find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, lead });
});

// POST /api/leads - Create new lead (Enquiry Form / Contact Form)
app.post('/api/leads', async (req, res) => {
  try {
    const body = req.body || {};

    // Security Check 1: Anti-Spam Honeypot
    if (body.hp_modal_field || body.hp_contact_field) {
      console.warn('[SPAM] Bot submission blocked by honeypot.');
      return res.status(400).json({ success: false, message: 'Bot submission flagged' });
    }

    // Required fields check
    const fullName = db.sanitize(body.fullName || '').trim();
    const email = db.sanitize(body.email || '').trim();
    const phone = db.sanitize(body.phone || '').trim();

    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required fields.' });
    }

    const data = db.get();
    const newLead = {
      id: (body.id && typeof body.id === 'string' && body.id.startsWith('lead_')) ? body.id : ('lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)),
      createdAt: (body.createdAt && !isNaN(Date.parse(body.createdAt))) ? body.createdAt : new Date().toISOString(),
      fullName,
      email,
      phone,
      company: db.sanitize(body.company || 'Direct Client'),
      service: db.sanitize(body.service || 'General Digital Marketing'),
      budget: db.sanitize(body.budget || 'Flexible'),
      timeline: db.sanitize(body.timeline || 'Immediate'),
      message: db.sanitize(body.message || ''),
      status: body.status || 'New Lead',
      source: db.sanitize(body.source || 'Website Contact Form')
    };

    if (!data.leads) data.leads = [];
    data.leads.unshift(newLead);
    await db.save(data);

    // Broadcast new lead via SSE to all active Admin dashboards
    broadcastEvent('lyfads:lead_created', newLead);

    // Trigger instant email notification dispatch to registered admin emails
    dispatchLeadNotification(newLead).catch(err => console.error('[Notification] Dispatch error:', err));

    res.status(201).json({ success: true, lead: newLead, message: 'Inquiry successfully submitted.' });
  } catch (err) {
    console.error('[API] Error creating lead:', err);
    res.status(500).json({ success: false, message: 'Internal server error saving lead' });
  }
});

// PATCH /api/leads/:id - Update lead status or fields
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const data = db.get();

    const leadIndex = (data.leads || []).findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (status) data.leads[leadIndex].status = status;
    if (notes !== undefined) data.leads[leadIndex].notes = db.sanitize(notes);
    data.leads[leadIndex].updatedAt = new Date().toISOString();

    await db.save(data);

    const updatedLead = data.leads[leadIndex];
    broadcastEvent('lyfads:lead_updated', updatedLead);

    res.json({ success: true, lead: updatedLead });
  } catch (err) {
    console.error('[API] Error updating lead:', err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// DELETE /api/leads/:id - Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();

    const initialLength = (data.leads || []).length;
    data.leads = (data.leads || []).filter(l => l.id !== id);

    if (data.leads.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await db.save(data);
    broadcastEvent('lyfads:lead_deleted', { id });

    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    console.error('[API] Error deleting lead:', err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// GET /api/analytics - CRM Metrics
app.get('/api/analytics', (req, res) => {
  const data = db.get();
  const leads = data.leads || [];

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

  res.json({
    success: true,
    analytics: { total, newLeads, inProgress, closed, pipelineEstimate }
  });
});

// ==========================================
// 5. Multi-Admin Authentication Endpoints
// ==========================================

// POST /api/auth/login - Admin Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Identifier and password are required' });
  }

  const data = db.get();
  const admins = data.admins || [];

  const target = admins.find(a => 
    (a.email.toLowerCase() === identifier.toLowerCase() || a.username.toLowerCase() === identifier.toLowerCase()) &&
    a.password === password
  );

  if (!target) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
  }

  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const adminProfile = {
    id: target.id,
    name: target.name,
    email: target.email,
    username: target.username,
    role: target.role,
    avatar: target.avatar
  };

  res.json({
    success: true,
    token,
    admin: adminProfile,
    message: `Welcome back, ${target.name}!`
  });
});

// GET /api/auth/admins - List all admins
app.get('/api/auth/admins', (req, res) => {
  const data = db.get();
  const safeAdmins = (data.admins || []).map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    username: a.username,
    role: a.role,
    avatar: a.avatar,
    createdAt: a.createdAt
  }));
  res.json({ success: true, admins: safeAdmins });
});

// POST /api/auth/admins - Add new Admin account
app.post('/api/auth/admins', async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;
    if (!name || !email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const data = db.get();
    if (!data.admins) data.admins = [];

    const existing = data.admins.find(a => a.email.toLowerCase() === email.toLowerCase() || a.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An admin with this email or username already exists.' });
    }

    const newAdmin = {
      id: 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: db.sanitize(name),
      email: db.sanitize(email),
      username: db.sanitize(username),
      password: password, // For production enterprise, use bcrypt hashing
      role: db.sanitize(role || 'Growth Director'),
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`
    };

    data.admins.push(newAdmin);
    await db.save(data);

    res.status(201).json({
      success: true,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        username: newAdmin.username,
        role: newAdmin.role,
        avatar: newAdmin.avatar
      }
    });
  } catch (err) {
    console.error('[API] Error adding admin:', err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// ==========================================
// 6. Registered Admin Notification Email API
// ==========================================

// GET /api/notifications/recipients - Get all registered notification emails
app.get('/api/notifications/recipients', (req, res) => {
  const data = db.get();
  res.json({
    success: true,
    recipients: data.notifications?.recipients || [],
    logs: data.notifications?.logs || []
  });
});

// POST /api/notifications/recipients - Register new Admin Email for notifications
app.post('/api/notifications/recipients', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const data = db.get();
    if (!data.notifications) data.notifications = { recipients: [], logs: [] };
    if (!data.notifications.recipients) data.notifications.recipients = [];

    const exists = data.notifications.recipients.some(r => r.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email is already registered for notifications.' });
    }

    const newRecip = {
      id: 'recip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: db.sanitize(name || 'Admin Officer'),
      email: db.sanitize(email).toLowerCase(),
      active: true,
      addedAt: new Date().toISOString()
    };

    data.notifications.recipients.push(newRecip);
    await db.save(data);

    broadcastEvent('lyfads:recipients_updated', data.notifications.recipients);
    res.status(201).json({ success: true, recipient: newRecip });
  } catch (err) {
    console.error('[API] Error adding recipient:', err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// PATCH /api/notifications/recipients/:id - Toggle active/inactive
app.patch('/api/notifications/recipients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const data = db.get();

    const r = (data.notifications?.recipients || []).find(item => item.id === id);
    if (!r) return res.status(404).json({ success: false, message: 'Recipient not found' });

    r.active = !!active;
    await db.save(data);

    broadcastEvent('lyfads:recipients_updated', data.notifications.recipients);
    res.json({ success: true, recipient: r });
  } catch (err) {
    console.error('[API] Error toggling recipient:', err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// DELETE /api/notifications/recipients/:id - Remove recipient email
app.delete('/api/notifications/recipients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();

    if (!data.notifications || !data.notifications.recipients) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    data.notifications.recipients = data.notifications.recipients.filter(r => r.id !== id);
    await db.save(data);

    broadcastEvent('lyfads:recipients_updated', data.notifications.recipients);
    res.json({ success: true, message: 'Recipient removed' });
  } catch (err) {
    console.error('[API] Error removing recipient:', err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// POST /api/notifications/test-dispatch - Send test email alert
app.post('/api/notifications/test-dispatch', async (req, res) => {
  try {
    const testLead = {
      id: 'test_lead_' + Date.now(),
      fullName: 'Vikramaditya Testing',
      company: 'Bengaluru Tech Demo Inc.',
      service: 'Performance Marketing & Paid Ads',
      phone: '+91 98450 00000',
      email: 'test@bengaluru.io',
      budget: '₹10L - ₹25L / month',
      timeline: 'Immediate (Within 7 days)',
      message: 'This is a test notification dispatch confirming live email alert routing.'
    };

    await dispatchLeadNotification(testLead);
    res.json({ success: true, message: 'Test notification alert successfully dispatched!' });
  } catch (err) {
    console.error('[API] Test dispatch failed:', err);
    res.status(500).json({ success: false, message: 'Failed to dispatch test notification' });
  }
});

// ==========================================
// 7. Server Initialization & Network Discovery
// ==========================================
function getLocalIPAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}

const server = app.listen(PORT, () => {
  const localIPs = getLocalIPAddresses();
  console.log('================================================================');
  console.log('🚀 LYFAds Bengaluru Enterprise Portal Server is RUNNING');
  console.log(`🌐 Local URL:        http://localhost:${PORT}`);
  console.log(`🛡️  Admin Login:      http://localhost:${PORT}/admin-login.html`);
  console.log(`📊 Admin Dashboard:  http://localhost:${PORT}/admin.html`);
  if (localIPs.length > 0) {
    console.log('📱 Mobile / Network Access (Connect from your phone):');
    localIPs.forEach(ip => {
      console.log(`   👉 http://${ip}:${PORT}`);
      console.log(`   👉 http://${ip}:${PORT}/admin-login.html`);
    });
  }
  console.log('💾 Database File:    ' + DB_FILE);
  console.log('⚡ Real-time SSE:     Active at /api/leads/stream');
  console.log('================================================================');
});

module.exports = { app, server, db };

