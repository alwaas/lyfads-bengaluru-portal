/**
 * Automated Verification & Self-Correction Test Suite
 * LYFAds Bengaluru Portal
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

console.log('=== 1. FILE INTEGRITY CHECKS ===');
const requiredFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'admin-login.html',
  'admin.html',
  'server.js',
  'data/database.json',
  'progress.md',
  'docs/SRS.md',
  'docs/ARCHITECTURE.md',
  'assets/css/styles.css',
  'assets/js/storage-service.js',
  'assets/js/services-data.js',
  'assets/js/case-studies-data.js',
  'assets/js/illusions.js',
  'assets/js/modals.js',
  'assets/js/app.js'
];

requiredFiles.forEach((file) => {
  const filePath = path.join(ROOT, file);
  const exists = fs.existsSync(filePath);
  if (exists) {
    const stat = fs.statSync(filePath);
    assert(stat.size > 50, `File exists and non-empty: ${file} (${stat.size} bytes)`);
  } else {
    assert(false, `File exists: ${file}`);
  }
});

console.log('\n=== 2. HTML ASSET & LINK REFERENCE VALIDATION ===');
const htmlFiles = ['index.html', 'about.html', 'contact.html'];
htmlFiles.forEach((htmlFile) => {
  const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
  
  // Verify local scripts
  const scriptRegex = /<script\s+src="([^"]+)"/g;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http')) {
      const scriptPath = path.join(ROOT, src);
      assert(fs.existsSync(scriptPath), `[${htmlFile}] Script reference exists: ${src}`);
    }
  }

  // Verify local stylesheets
  const cssRegex = /<link\s+[^>]*href="([^"]+)"/g;
  while ((match = cssRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.endsWith('.css') && !href.startsWith('http')) {
      const cssPath = path.join(ROOT, href);
      assert(fs.existsSync(cssPath), `[${htmlFile}] CSS reference exists: ${href}`);
    }
  }

  // Verify inter-page navigation links
  assert(content.includes('index.html'), `[${htmlFile}] Contains navigation link to index.html`);
  assert(content.includes('about.html'), `[${htmlFile}] Contains navigation link to about.html`);
  assert(content.includes('contact.html'), `[${htmlFile}] Contains navigation link to contact.html`);
});

console.log('\n=== 3. 20 SERVICES DATASET INTEGRITY ===');
const servicesCode = fs.readFileSync(path.join(ROOT, 'assets/js/services-data.js'), 'utf-8');
const vm = require('vm');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(servicesCode, sandbox);

const services = sandbox.SERVICES_DATA || sandbox.window.SERVICES_DATA;
assert(Array.isArray(services), 'SERVICES_DATA is an array');
assert(services.length === 20, `SERVICES_DATA contains exactly 20 services (Found: ${services?.length})`);

const requiredServiceFields = ['id', 'title', 'category', 'icon', 'shortDesc', 'fullDesc', 'kpi', 'deliverables', 'badge'];
let allServicesValid = true;
services.forEach((s, idx) => {
  requiredServiceFields.forEach((field) => {
    if (!s[field]) {
      console.error(`Service #${idx} (${s.id || 'unknown'}) missing field: ${field}`);
      allServicesValid = false;
    }
  });
});
assert(allServicesValid, 'All 20 services contain complete required schema fields');

console.log('\n=== 4. CASE STUDIES DATASET INTEGRITY ===');
const csCode = fs.readFileSync(path.join(ROOT, 'assets/js/case-studies-data.js'), 'utf-8');
const csSandbox = { window: {} };
vm.createContext(csSandbox);
vm.runInContext(csCode, csSandbox);

const caseStudies = csSandbox.CASE_STUDIES_DATA || csSandbox.window.CASE_STUDIES_DATA;
assert(Array.isArray(caseStudies) && caseStudies.length >= 4, `CASE_STUDIES_DATA has sufficient portfolio entries (Found: ${caseStudies?.length})`);
let allCsValid = true;
caseStudies.forEach((cs, idx) => {
  ['id', 'title', 'client', 'category', 'image', 'summary', 'metrics', 'challenge', 'solution', 'results'].forEach((field) => {
    if (!cs[field]) {
      console.error(`Case study #${idx} missing field: ${field}`);
      allCsValid = false;
    }
  });
});
assert(allCsValid, 'All case studies contain complete required schema fields');

console.log('\n=== 5. SECURITY & XSS SANITIZATION TESTS ===');
const storageCode = fs.readFileSync(path.join(ROOT, 'assets/js/storage-service.js'), 'utf-8');

// Mock localStorage and window in sandbox
let store = {};
const storageSandbox = {
  window: { dispatchEvent: () => {} },
  localStorage: {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v.toString(); },
    removeItem: (k) => { delete store[k]; }
  },
  console: console,
  CustomEvent: function(name, opts) { return { name, opts }; }
};
vm.createContext(storageSandbox);
vm.runInContext(storageCode, storageSandbox);

const StorageServiceClass = storageSandbox.window.StorageService;
const sanitize = StorageServiceClass.sanitize;

const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert(1)>',
  '"><svg onload=alert(1)>',
  "';alert(String.fromCharCode(88,83,83))//\'",
  '<iframe src="javascript:alert(1)"></iframe>'
];

let xssPassed = true;
xssPayloads.forEach((payload) => {
  const sanitized = sanitize(payload);
  if (sanitized.includes('<script>') || sanitized.includes('<img') || sanitized.includes('<iframe') || sanitized.includes('onload=') || sanitized.includes('onerror=')) {
    console.error(`XSS Vulnerability detected with payload: ${payload} -> ${sanitized}`);
    xssPassed = false;
  }
});
assert(xssPassed, 'XSS Sanitizer successfully neutralizes dangerous tags and event handlers');

console.log('\n=== 6. CRM STORAGE CRUD SIMULATION ===');
const storageInstance = storageSandbox.window.lyfadsStorage;
assert(storageInstance != null, 'StorageService instance initialized');

const initialLeads = storageInstance.getLeads();
assert(initialLeads.length >= 5, `Initial seed leads populated (Count: ${initialLeads.length})`);

// Test saving a new lead
const testLead = storageInstance.saveLead({
  fullName: 'Test Founder <script>evil()</script>',
  email: 'test@bengaluru.io',
  phone: '+91 99999 88888',
  company: 'Bengaluru AI Lab',
  service: 'AI Automation & Workflow Bots',
  budget: '₹10L - ₹25L / month',
  timeline: 'Immediate',
  message: 'Scaling our enterprise pipeline.',
  source: 'Automated Test'
});

assert(testLead && testLead.id, `New lead generated with ID: ${testLead?.id}`);
assert(!testLead.fullName.includes('<script>'), `Lead name XSS neutralized: ${testLead.fullName}`);

// Test updating status
const updated = storageInstance.updateLeadStatus(testLead.id, 'In Progress');
assert(updated === true, 'Lead status updated to In Progress');

const fetchedLead = storageInstance.getLeadById(testLead.id);
assert(fetchedLead.status === 'In Progress', 'Fetched lead reflects updated status');

// Test analytics
const analytics = storageInstance.getAnalytics();
assert(analytics.total >= 6, `Analytics total count updated (${analytics.total})`);
assert(analytics.pipelineEstimate > 0, `Analytics pipeline estimate calculated (₹${analytics.pipelineEstimate})`);

// Test deleting lead
const deleted = storageInstance.deleteLead(testLead.id);
assert(deleted === true, 'Test lead successfully deleted');
assert(storageInstance.getLeadById(testLead.id) === null, 'Deleted lead no longer in storage');

console.log('\n=== 7. CENTRAL DATABASE & NOTIFICATION DISPATCH ENGINE ===');
const dbRaw = fs.readFileSync(path.join(ROOT, 'data/database.json'), 'utf8');
const dbData = JSON.parse(dbRaw);
assert(Array.isArray(dbData.leads) && dbData.leads.length >= 5, `Central DB contains persistent leads (${dbData.leads?.length})`);
assert(Array.isArray(dbData.admins) && dbData.admins.length >= 3, `Central DB contains multi-admin credentials (${dbData.admins?.length})`);
assert(Array.isArray(dbData.notifications?.recipients) && dbData.notifications.recipients.length >= 2, `Central DB contains registered notification email recipients (${dbData.notifications?.recipients?.length})`);
assert(dbData.notifications.recipients.some(r => r.email === 'leads@lyfads.com'), 'LYFAds leads desk email registered for instant alerts');
assert(dbData.notifications.recipients.some(r => r.email === 'director@lyfads.com'), 'LYFAds studio director email registered for instant alerts');

console.log('\n=========================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('=========================================');

if (failed > 0) {
  process.exit(1);
}
