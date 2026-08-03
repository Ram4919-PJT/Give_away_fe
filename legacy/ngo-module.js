/* ==========================================================================
   NGO Module — Modern Charity Portal (Give Away)
   ========================================================================== */

const NGO_LOCKED_TABS = [
  'ngo-request-donations', 'ngo-request-funds', 'ngo-inventory',
  'ngo-beneficiaries', 'ngo-reports'
];

const NGO_NAV_ITEMS = [
  { id: 'ngo-dashboard', label: 'Dashboard', icon: 'layout-dashboard', locked: false },
  { id: 'ngo-verify', label: 'Complete Verification', icon: 'shield-check', locked: false, hideWhenVerified: true },
  { id: 'ngo-programs', label: 'Browse Programs', icon: 'layers', locked: false },
  { id: 'ngo-request-donations', label: 'Request Donations', icon: 'package', locked: true },
  { id: 'ngo-request-funds', label: 'Request Financial Assistance', icon: 'banknote', locked: true },
  { id: 'ngo-inventory', label: 'Inventory', icon: 'warehouse', locked: true },
  { id: 'ngo-beneficiaries', label: 'Beneficiaries', icon: 'users', locked: true },
  { id: 'ngo-my-requests', label: 'My Requests', icon: 'clipboard-list', locked: false },
  { id: 'ngo-reports', label: 'Reports', icon: 'bar-chart-3', locked: true },
  { id: 'ngo-notifications', label: 'Notifications', icon: 'bell', locked: false },
  { id: 'ngo-profile', label: 'Profile', icon: 'building-2', locked: false },
  { id: 'ngo-settings', label: 'Settings', icon: 'settings', locked: false }
];

const NGO_PROGRAMS = [
  { id: 'p1', name: 'Medical Support', icon: '🏥', desc: 'Hospital equipment, medicines, and emergency medical aid for underserved communities.', eligibility: 'Registered hospitals, clinics, and medical NGOs', categories: ['Medical', 'Health'] },
  { id: 'p2', name: 'Educational Support', icon: '📚', desc: 'School supplies, scholarships, and infrastructure for children in need.', eligibility: 'Schools, education NGOs, and learning centers', categories: ['Education', 'Children'] },
  { id: 'p3', name: 'Food Assistance', icon: '🍲', desc: 'Community kitchens, ration kits, and nutrition programs.', eligibility: 'Food banks, community kitchens, relief NGOs', categories: ['Food', 'Nutrition'] },
  { id: 'p4', name: 'Disaster Relief', icon: '🌊', desc: 'Emergency response for floods, earthquakes, and natural disasters.', eligibility: 'Disaster response NGOs with field presence', categories: ['Disaster', 'Emergency'] },
  { id: 'p5', name: 'Livelihood Support', icon: '💼', desc: 'Skill training, micro-enterprise, and employment assistance.', eligibility: 'Livelihood and vocational training NGOs', categories: ['Livelihood', 'Skills'] },
  { id: 'p6', name: 'Women Empowerment', icon: '👩', desc: 'Programs supporting women\'s health, safety, and economic independence.', eligibility: 'Women-focused NGOs and self-help groups', categories: ['Women', 'Empowerment'] },
  { id: 'p7', name: 'Child Welfare', icon: '👧', desc: 'Orphan care, child protection, and developmental support programs.', eligibility: 'Child welfare organizations with valid registration', categories: ['Children', 'Welfare'] },
  { id: 'p8', name: 'Senior Citizen Welfare', icon: '👴', desc: 'Elder care, pension support, and healthcare for senior citizens.', eligibility: 'Elder care NGOs and senior citizen associations', categories: ['Elderly', 'Care'] }
];

const NGO_VERIFY_REQUIRED = [
  'NGO Registration Certificate', 'PAN Card', 'Bank Account Details',
  'Cancelled Cheque / Passbook', 'Authorized Representative Government ID',
  'Organization Address Proof'
];
const NGO_VERIFY_OPTIONAL = [
  'GST Certificate', '80G Certificate', '12A Certificate',
  'FCRA Certificate (if applicable)', 'NGO Logo'
];

const ngoModuleMeta = {
  uploadedDocs: {},
  requestForm: { type: 'items', category: '', purpose: '', quantity: '', priority: 'Normal', beneficiary: '', notes: '' },
  regEmailVerified: false,
  regMobileVerified: false,
  inventoryFilter: 'all',
  inventorySearch: ''
};

function initNgoModuleData() {
  if (!appState.ngoRequests) {
    appState.ngoRequests = [
      {
        id: 'NGO-REQ-001', ngoEmail: 'ngo@ashakiran.org', type: 'Items',
        category: 'Shelter/Clothing', purpose: 'Winter blankets for shelter housing',
        quantity: 20, priority: 'High', beneficiary: '200 homeless individuals',
        status: 'Under Review', appliedDate: '2026-07-08',
        timeline: buildNgoTimeline('Under Review', '2026-07-08'),
        rejectionReason: null, assignedDonations: []
      },
      {
        id: 'NGO-REQ-002', ngoEmail: 'ngo@ashakiran.org', type: 'Financial',
        category: 'Program Funding', purpose: 'Elderly lunch program expansion',
        quantity: null, amount: 1500, priority: 'Normal',
        beneficiary: '150 senior citizens', status: 'Approved', appliedDate: '2026-07-05',
        timeline: buildNgoTimeline('Approved', '2026-07-05'),
        rejectionReason: null, assignedDonations: ['$1,500 allocated']
      }
    ];
  }
  if (!appState.ngoNotifications) {
    appState.ngoNotifications = [
      { id: 'nn-1', title: 'Request Under Review', message: 'NGO-REQ-001 is being reviewed by AJA admin.', time: '2 hours ago', group: 'today', read: false, icon: 'clock' },
      { id: 'nn-2', title: 'Request Approved', message: 'NGO-REQ-002 financial assistance has been approved.', time: 'Yesterday', group: 'yesterday', read: true, icon: 'circle-check' },
      { id: 'nn-3', title: 'Complete Verification', message: 'Submit your documents to unlock all platform features.', time: '3 days ago', group: 'earlier', read: true, icon: 'shield' },
      { id: 'nn-4', title: 'Program Update', message: 'New Disaster Relief program is now available.', time: '4 days ago', group: 'earlier', read: true, icon: 'layers' }
    ];
  }
  if (!appState.ngoBeneficiaries) {
    appState.ngoBeneficiaries = [
      { id: 'b1', name: 'Ravi Kumar', type: 'Emergency Relief', status: 'Active', resources: 'Rent support $400', completion: 'In Progress' },
      { id: 'b2', name: 'Sunita Deshmukh', type: 'Food Assistance', status: 'Active', resources: 'Monthly ration kit', completion: 'Ongoing' },
      { id: 'b3', name: 'Family Shelter Unit A', type: 'Shelter', status: 'Completed', resources: '20 Winter Blankets', completion: '100%' }
    ];
  }
}

function ngoIcon(name, size) {
  const s = size || 18;
  return `<i data-lucide="${name}" style="width:${s}px;height:${s}px"></i>`;
}

function refreshNgoIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showNgoToast(msg, type) {
  const root = document.getElementById('donor-toast-root');
  if (!root) { alert(msg); return; }
  const el = document.createElement('div');
  el.className = `ngo-toast ngo-toast--${type || 'info'}`;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; }, 2800);
  setTimeout(() => el.remove(), 3200);
}

function getNgoVerificationStatus() {
  if (!appState.currentUser) return 'registered';
  const v = appState.currentUser.verified;
  if (v === true) return 'verified';
  if (v === 'pending') return 'pending';
  if (v === 'rejected') return 'rejected';
  if (v === 'suspended') return 'suspended';
  return 'registered';
}

function isNgoVerified() {
  return getNgoVerificationStatus() === 'verified';
}

function getNgoStatusBadge() {
  const s = getNgoVerificationStatus();
  const map = {
    registered: ['🟡', 'Registered NGO', 'registered'],
    pending: ['🟠', 'Verification Pending', 'pending'],
    verified: ['🟢', 'Verified NGO', 'verified'],
    suspended: ['🔴', 'Suspended', 'suspended'],
    rejected: ['⚫', 'Rejected', 'rejected']
  };
  const [emoji, label, cls] = map[s] || map.registered;
  return `<span class="ngo-status-badge ngo-status-badge--${cls}">${emoji} ${label}</span>`;
}

function buildNgoTimeline(status, date) {
  const steps = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Processing', 'Completed'];
  const idx = { Draft: 0, Submitted: 1, 'Under Review': 2, Approved: 3, Processing: 4, Completed: 5, Rejected: 2 }[status] ?? 1;
  return steps.map((step, i) => ({
    step, done: i < idx, active: i === idx && status !== 'Completed', date: i <= idx ? date : ''
  }));
}

function getNgoRequests() {
  if (!appState.currentUser) return [];
  const key = (appState.currentUser.email || '').toLowerCase();
  const name = appState.currentUser.name || '';
  return (appState.ngoRequests || []).filter(r =>
    (r.ngoEmail || '').toLowerCase() === key || name.includes(r.ngoEmail?.split('@')[0] || '___')
  );
}

function getNgoStats() {
  const reqs = getNgoRequests();
  return {
    donationRequests: reqs.length,
    approved: reqs.filter(r => ['Approved', 'Processing', 'Completed'].includes(r.status)).length,
    beneficiaries: isNgoVerified() ? (appState.ngoBeneficiaries || []).length : 0,
    pendingVerification: getNgoVerificationStatus() === 'pending' ? 1 : getNgoVerificationStatus() === 'registered' ? 1 : 0
  };
}

function ngoTrySwitchTab(tabId) {
  if (NGO_LOCKED_TABS.includes(tabId) && !isNgoVerified()) {
    showNgoToast('Complete NGO verification to access this feature.', 'error');
    return false;
  }
  switchTab(tabId);
  return true;
}

/* --- Registration --- */
function sendNgoRegOtp(type) {
  showNgoToast(`OTP sent to your ${type}. Use any 6-digit code for demo.`, 'info');
}

function verifyNgoRegOtp(type) {
  const inputId = type === 'email' ? 'ngo-email-otp' : 'ngo-mobile-otp';
  const val = document.getElementById(inputId)?.value.trim();
  if (!/^\d{6}$/.test(val)) { showNgoToast('Enter a valid 6-digit OTP.', 'error'); return; }
  if (type === 'email') {
    ngoModuleMeta.regEmailVerified = true;
    document.getElementById('ngo-email-otp-block')?.classList.add('verified');
    const el = document.getElementById('ngo-email-otp-status');
    if (el) { el.textContent = 'Verified ✓'; el.classList.add('is-verified'); }
  } else {
    ngoModuleMeta.regMobileVerified = true;
    document.getElementById('ngo-mobile-otp-block')?.classList.add('verified');
    const el = document.getElementById('ngo-mobile-otp-status');
    if (el) { el.textContent = 'Verified ✓'; el.classList.add('is-verified'); }
  }
  showNgoToast(`${type === 'email' ? 'Email' : 'Mobile'} verified!`, 'success');
}

function handleNgoRegistration(event) {
  if (event) event.preventDefault();
  const orgName = document.getElementById('ngo-org-name')?.value.trim();
  const email = document.getElementById('ngo-email')?.value.trim();
  const mobile = document.getElementById('ngo-mobile')?.value.trim();
  const repName = document.getElementById('ngo-rep-name')?.value.trim();
  const password = document.getElementById('ngo-password')?.value;
  const confirmPassword = document.getElementById('ngo-confirm-password')?.value;
  const orgType = document.getElementById('ngo-org-type')?.value;
  const city = document.getElementById('ngo-city')?.value.trim();
  const state = document.getElementById('ngo-state')?.value.trim();
  const address = document.getElementById('ngo-address')?.value.trim();
  const years = document.getElementById('ngo-years')?.value;
  const terms = document.getElementById('ngo-terms')?.checked;

  if (!orgName || !email || !mobile || !repName || !password || !orgType || !city || !state || !address) {
    showNgoToast('Please fill all required fields.', 'error'); return;
  }
  if (password.length < 8) { showNgoToast('Password must be at least 8 characters.', 'error'); return; }
  if (password !== confirmPassword) { showNgoToast('Passwords do not match.', 'error'); return; }
  if (!ngoModuleMeta.regEmailVerified || !ngoModuleMeta.regMobileVerified) {
    showNgoToast('Verify email and mobile OTP.', 'error'); return;
  }
  if (!terms) { showNgoToast('Accept Terms & Conditions.', 'error'); return; }

  appState.currentUser = {
    name: orgName, email, mobile, role: 'ngo',
    repName, orgType, city, state, address,
    yearsOperation: years || '',
    verified: false, status: 'Registered NGO',
    memberSince: new Date().toISOString().split('T')[0]
  };
  ngoModuleMeta.regEmailVerified = false;
  ngoModuleMeta.regMobileVerified = false;
  appState.selectedRegistrationRole = null;
  appState.currentTab = 'ngo-dashboard';
  showNgoToast('NGO account created! Complete verification to unlock all features.', 'success');
  showView('dashboard');
}

/* --- Sidebar --- */
function renderNgoSidebar(container) {
  const verified = isNgoVerified();
  const unread = (appState.ngoNotifications || []).filter(n => !n.read).length;

  let html = NGO_NAV_ITEMS.filter(item => {
    if (item.hideWhenVerified && verified) return false;
    return true;
  }).map(item => {
    const isLocked = item.locked && !verified;
    const badge = item.id === 'ngo-notifications' && unread > 0
      ? `<span style="margin-left:auto;background:#EF4444;color:#fff;font-size:0.65rem;padding:0.1rem 0.4rem;border-radius:999px">${unread}</span>` : '';
    const lock = isLocked ? `<span class="sidebar-lock-icon">${ngoIcon('lock', 14)}</span>` : '';
    const onclick = isLocked
      ? `showNgoToast('Complete verification to unlock this feature.','error'); return false;`
      : `switchTab('${item.id}'); return false;`;
    return `<li class="sidebar-item ${appState.currentTab === item.id ? 'active' : ''} ${isLocked ? 'locked' : ''}">
      <a href="#" onclick="${onclick}">
        <span class="sidebar-icon">${ngoIcon(item.icon)}</span>
        ${item.label}${lock}${badge}
      </a>
    </li>`;
  }).join('');

  html += `<li class="sidebar-item ngo-sidebar-logout">
    <a href="#" onclick="handleLogout(); return false;">
      <span class="sidebar-icon">${ngoIcon('log-out')}</span> Logout
    </a>
  </li>`;
  container.innerHTML = html;
  refreshNgoIcons();
}

function wireNgoDashboardChrome() {
  document.querySelector('.dashboard-layout')?.classList.add('dashboard-layout--ngo');
  const btn = document.getElementById('dashboard-notify-btn');
  if (btn && appState.currentUser?.role === 'ngo') {
    btn.onclick = () => switchTab('ngo-notifications');
  }
}

function renderNgoTabContent(container, tab) {
  wireNgoDashboardChrome();
  if (NGO_LOCKED_TABS.includes(tab) && !isNgoVerified()) {
    container.innerHTML = renderNgoLockedView(tab);
    refreshNgoIcons();
    return;
  }
  const views = {
    'ngo-dashboard': renderNgoDashboardHome,
    'ngo-verify': renderNgoVerifyPage,
    'ngo-programs': renderNgoPrograms,
    'ngo-program-detail': renderNgoProgramDetail,
    'ngo-request-donations': renderNgoRequestDonations,
    'ngo-request-funds': renderNgoRequestFunds,
    'ngo-inventory': renderNgoInventory,
    'ngo-beneficiaries': renderNgoBeneficiaries,
    'ngo-my-requests': renderNgoMyRequests,
    'ngo-request': renderNgoRequestDonations,
    'ngo-history': renderNgoMyRequests,
    'ngo-reports': renderNgoReports,
    'ngo-notifications': renderNgoNotifications,
    'ngo-profile': renderNgoProfile,
    'ngo-settings': renderNgoSettings
  };
  (views[tab] || renderNgoDashboardHome)(container);
  refreshNgoIcons();
}

function renderNgoLockedView(tab) {
  const labels = {
    'ngo-request-donations': 'Request Donations',
    'ngo-request-funds': 'Request Financial Assistance',
    'ngo-inventory': 'Inventory',
    'ngo-beneficiaries': 'Beneficiaries',
    'ngo-reports': 'Reports'
  };
  return `<div class="ngo-page ngo-module">
    <div class="ngo-locked-overlay">
      <div class="lock-icon">${ngoIcon('lock', 48)}</div>
      <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:0.5rem">${labels[tab] || 'Feature'} Locked</h2>
      <p style="color:#6B7280;margin-bottom:1.5rem">Complete NGO verification to access this feature.</p>
      <button type="button" class="login-submit" onclick="switchTab('ngo-verify')">Complete Verification</button>
    </div>
  </div>`;
}

/* --- Dashboard --- */
function renderNgoDashboardHome(container) {
  const user = appState.currentUser;
  const stats = getNgoStats();
  const verified = isNgoVerified();
  const status = getNgoVerificationStatus();
  const notifs = (appState.ngoNotifications || []).slice(0, 3);

  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-hero-banner">
        <div>
          <div class="ngo-welcome-row">
            <h1>Together We Build Stronger Communities.</h1>
            ${getNgoStatusBadge()}
          </div>
          <p>Welcome, <strong>${user.name}</strong>. ${verified
            ? 'Your organization is verified and ready to receive support from AJA Abayahastham.'
            : 'Complete your NGO verification to start receiving support from AJA Abayahastham.'}</p>
        </div>
        <div class="ngo-hero-illus">🏛</div>
      </div>

      ${!verified && status !== 'pending' ? `
        <div class="ngo-verify-cta">
          <div>
            <h3>Complete NGO Verification</h3>
            <p>Verify your organization to request donations, receive financial assistance, and manage beneficiaries.</p>
            <ul>
              <li>Verified NGO Badge</li><li>Trusted Organization Status</li>
              <li>Access to Donation Requests</li><li>Financial Assistance</li>
              <li>Inventory Management</li><li>Beneficiary Management</li>
              <li>Reporting Dashboard</li>
            </ul>
          </div>
          <button type="button" class="btn-verify-cta" onclick="switchTab('ngo-verify')">Complete Verification</button>
        </div>
      ` : status === 'pending' ? `
        <div class="ngo-verify-status-card ngo-verify-status-card--pending">
          ${ngoIcon('clock', 24)}
          <div><strong>Verification Pending Review</strong><p style="font-size:0.875rem;margin-top:0.25rem">Our team is reviewing your documents. This usually takes 2–3 business days.</p></div>
        </div>
      ` : ''}

      <div class="ngo-stats-grid">
        <article class="ngo-stat-card">
          <div class="ngo-stat-icon ngo-stat-icon--blue">${ngoIcon('clipboard-list', 20)}</div>
          <p class="ngo-stat-label">Donation Requests</p>
          <p class="ngo-stat-value">${stats.donationRequests}</p>
        </article>
        <article class="ngo-stat-card">
          <div class="ngo-stat-icon ngo-stat-icon--green">${ngoIcon('circle-check', 20)}</div>
          <p class="ngo-stat-label">Approved Requests</p>
          <p class="ngo-stat-value">${stats.approved}</p>
        </article>
        <article class="ngo-stat-card">
          <div class="ngo-stat-icon ngo-stat-icon--purple">${ngoIcon('users', 20)}</div>
          <p class="ngo-stat-label">Beneficiaries Served</p>
          <p class="ngo-stat-value">${verified ? stats.beneficiaries : '—'}</p>
        </article>
        <article class="ngo-stat-card">
          <div class="ngo-stat-icon ngo-stat-icon--orange">${ngoIcon('shield', 20)}</div>
          <p class="ngo-stat-label">Pending Verification</p>
          <p class="ngo-stat-value">${stats.pendingVerification}</p>
        </article>
      </div>

      <div class="ngo-section">
        <div class="ngo-section-head"><h2 class="ngo-section-title">Quick Actions</h2></div>
        <div class="ngo-quick-actions">
          <button type="button" class="ngo-quick-btn" onclick="switchTab('ngo-programs')">
            <span class="ngo-quick-btn-icon">${ngoIcon('layers', 22)}</span> Browse Programs
          </button>
          <button type="button" class="ngo-quick-btn" ${verified ? '' : 'disabled'} onclick="ngoTrySwitchTab('ngo-request-donations')">
            <span class="ngo-quick-btn-icon">${ngoIcon('package', 22)}</span> Request Donations
          </button>
          <button type="button" class="ngo-quick-btn" ${verified ? '' : 'disabled'} onclick="ngoTrySwitchTab('ngo-request-funds')">
            <span class="ngo-quick-btn-icon">${ngoIcon('banknote', 22)}</span> Request Funds
          </button>
          <button type="button" class="ngo-quick-btn" onclick="switchTab('ngo-verify')" ${verified ? 'disabled' : ''}>
            <span class="ngo-quick-btn-icon">${ngoIcon('shield-check', 22)}</span> Verify NGO
          </button>
        </div>
      </div>

      <div class="ngo-section">
        <div class="ngo-section-head">
          <h2 class="ngo-section-title">Recent Notifications</h2>
          <button type="button" class="ngo-section-link" onclick="switchTab('ngo-notifications')">View all</button>
        </div>
        <div class="ngo-notif-item" style="cursor:default">
          ${notifs.map(n => `<div class="ngo-notif-item ${n.read ? '' : 'unread'}" style="margin-bottom:0.5rem">
            <div class="ngo-notif-icon">${ngoIcon(n.icon || 'bell', 18)}</div>
            <div><strong style="font-size:0.875rem">${n.title}</strong><p style="font-size:0.8125rem;color:#6B7280">${n.message}</p></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* --- Verification --- */
function renderNgoVerifyPage(container) {
  const status = getNgoVerificationStatus();
  if (status === 'verified') {
    container.innerHTML = `<div class="ngo-page ngo-module"><div class="ngo-verify-status-card ngo-verify-status-card--verified">
      ${ngoIcon('badge-check', 28)}<div><strong>Verified NGO Partner</strong><p style="font-size:0.875rem;margin-top:0.25rem">All features are unlocked. Thank you for partnering with AJA Abayahastham.</p></div>
    </div></div>`;
    return;
  }
  if (status === 'pending') {
    container.innerHTML = `<div class="ngo-page ngo-module"><div class="ngo-verify-status-card ngo-verify-status-card--pending">
      ${ngoIcon('clock', 28)}<div><strong>Pending Review</strong><p style="font-size:0.875rem;margin-top:0.25rem">Documents submitted. Admin will review shortly.</p></div>
    </div></div>`;
    return;
  }
  if (status === 'rejected') {
    container.innerHTML = `<div class="ngo-page ngo-module">
      <div class="ngo-verify-status-card ngo-verify-status-card--rejected">
        ${ngoIcon('x-circle', 28)}<div><strong>Verification Rejected</strong>
        <p style="font-size:0.875rem;margin-top:0.25rem">${appState.currentUser.rejectionReason || 'Please re-upload clear documents.'}</p></div>
      </div>
      <button type="button" class="login-submit" onclick="appState.currentUser.verified=false;switchTab('ngo-verify')">Resubmit Documents</button>
    </div>`;
    return;
  }

  const reqDocs = NGO_VERIFY_REQUIRED.map(d => renderNgoDocUpload(d, true)).join('');
  const optDocs = NGO_VERIFY_OPTIONAL.map(d => renderNgoDocUpload(d, false)).join('');

  container.innerHTML = `
    <div class="ngo-page ngo-module ngo-verify-page">
      <button type="button" class="ngo-back-btn" onclick="switchTab('ngo-dashboard')">${ngoIcon('arrow-left', 16)} Back</button>
      <div class="ngo-page-header"><h1>Complete NGO Verification</h1><p>Upload official documents to verify your organization. All uploads are secure and reviewed by admin.</p></div>
      <div class="ngo-form-card" style="max-width:100%">
        <div class="ngo-doc-section"><h3>Required Documents</h3><div class="ngo-doc-grid">${reqDocs}</div></div>
        <div class="ngo-doc-section"><h3>Optional Documents</h3><div class="ngo-doc-grid">${optDocs}</div></div>
        <div class="form-group" style="margin-top:1rem"><label>Mission Statement</label><textarea id="ngo-verify-mission" rows="3" placeholder="Brief mission statement of your organization"></textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Website (Optional)</label><input type="url" id="ngo-verify-website" placeholder="https://yourngo.org"></div>
          <div class="form-group"><label>Social Media (Optional)</label><input type="text" id="ngo-verify-social" placeholder="@yourngo"></div>
        </div>
        <div class="ngo-form-actions">
          <button type="button" class="btn-ghost" onclick="saveNgoVerificationDraft()">Save as Draft</button>
          <button type="button" class="login-submit" onclick="submitNgoVerification()">Submit Verification</button>
        </div>
      </div>
    </div>`;
  refreshNgoIcons();
}

function renderNgoDocUpload(name, required) {
  const id = name.replace(/\s/g, '-').replace(/[()]/g, '');
  const uploaded = ngoModuleMeta.uploadedDocs[name];
  return `<label class="ngo-doc-upload ${required ? 'required' : ''} ${uploaded ? 'uploaded' : ''}" id="ngo-doc-${id}">
    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onchange="ngoDocUploaded('${name.replace(/'/g, "\\'")}', this)">
    <div class="ngo-doc-icon">${ngoIcon(uploaded ? 'check-circle' : 'upload', 20)}</div>
    <div class="ngo-doc-info"><strong>${name}${required ? ' *' : ''}</strong><span>${uploaded ? 'Uploaded ✓' : 'Drag & drop or click to upload'}</span>
    ${uploaded ? '<div class="ngo-doc-progress"><div class="ngo-doc-progress-bar" style="width:100%"></div></div>' : ''}</div>
  </label>`;
}

function ngoDocUploaded(name, input) {
  if (!input.files.length) return;
  ngoModuleMeta.uploadedDocs[name] = true;
  showNgoToast(`${name} uploaded.`, 'success');
  renderDashboardLayout();
}

function saveNgoVerificationDraft() {
  showNgoToast('Verification draft saved. You can continue later.', 'info');
}

function submitNgoVerification() {
  const missing = NGO_VERIFY_REQUIRED.filter(d => !ngoModuleMeta.uploadedDocs[d]);
  if (missing.length) {
    showNgoToast(`Required: ${missing.join(', ')}`, 'error');
    return;
  }
  const user = appState.currentUser;
  appState.verifications.unshift({
    id: 'v-ngo-' + Date.now(),
    name: user.name,
    email: user.email,
    type: 'NGO',
    doc: 'ngo_verification_bundle.pdf',
    status: 'Pending',
    submitted: new Date().toISOString().split('T')[0]
  });
  user.verified = 'pending';
  ngoModuleMeta.uploadedDocs = {};
  showNgoToast('Verification submitted! Admin will review your documents.', 'success');
  switchTab('ngo-dashboard');
}

function syncNgoVerificationOnApprove(verification) {
  if (verification.type !== 'NGO') return;
  const email = verification.email;
  if (appState.currentUser && (appState.currentUser.email === email || appState.currentUser.name === verification.name)) {
    if (verification.status === 'Verified') {
      appState.currentUser.verified = true;
      appState.currentUser.status = 'Verified NGO';
    } else if (verification.status === 'Rejected') {
      appState.currentUser.verified = 'rejected';
      appState.currentUser.rejectionReason = 'Documents could not be verified. Please resubmit.';
    } else {
      appState.currentUser.verified = 'pending';
    }
  }
}

/* --- Programs --- */
function renderNgoPrograms(container) {
  const verified = isNgoVerified();
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>Browse Programs</h1><p>Explore support programs available from AJA Abayahastham for verified NGO partners.</p></div>
      <div class="ngo-program-grid">
        ${NGO_PROGRAMS.map(p => `
          <article class="ngo-program-card">
            <div class="ngo-program-icon">${p.icon}</div>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="ngo-program-tags">${p.categories.map(c => `<span class="ngo-program-tag">${c}</span>`).join('')}</div>
            <p style="font-size:0.75rem;color:#9CA3AF;margin-bottom:0.75rem"><strong>Eligibility:</strong> ${p.eligibility}</p>
            <button type="button" class="btn-secondary-blue" style="width:100%" onclick="viewNgoProgram('${p.id}')">View Details</button>
            ${!verified ? `<p class="ngo-verify-required">${ngoIcon('lock', 12)} Verification Required to Apply</p>` : ''}
          </article>
        `).join('')}
      </div>
    </div>`;
  refreshNgoIcons();
}

function viewNgoProgram(id) {
  ngoModuleMeta.selectedProgramId = id;
  appState.currentTab = 'ngo-program-detail';
  renderDashboardLayout();
}

function renderNgoProgramDetail(container) {
  const p = NGO_PROGRAMS.find(x => x.id === ngoModuleMeta.selectedProgramId);
  if (!p) { switchTab('ngo-programs'); return; }
  const verified = isNgoVerified();
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <button type="button" class="ngo-back-btn" onclick="switchTab('ngo-programs')">${ngoIcon('arrow-left', 16)} Back</button>
      <div class="ngo-form-card" style="max-width:100%">
        <div style="font-size:3rem;margin-bottom:1rem">${p.icon}</div>
        <h2 style="font-size:1.35rem;font-weight:800;margin-bottom:0.5rem">${p.name}</h2>
        <p style="color:#6B7280;line-height:1.6;margin-bottom:1rem">${p.desc}</p>
        <p style="font-size:0.875rem;margin-bottom:0.5rem"><strong>Eligibility:</strong> ${p.eligibility}</p>
        <div class="ngo-program-tags" style="margin-bottom:1.5rem">${p.categories.map(c => `<span class="ngo-program-tag">${c}</span>`).join('')}</div>
        ${verified
          ? `<button type="button" class="login-submit" onclick="switchTab('ngo-request-funds')">Apply for This Program</button>`
          : `<button type="button" class="btn-outline" disabled>Verification Required</button>
             <p class="ngo-verify-required" style="margin-top:0.75rem">${ngoIcon('lock', 12)} Complete verification to apply</p>`}
      </div>
    </div>`;
  refreshNgoIcons();
}

/* --- Request Donations --- */
function renderNgoRequestDonations(container) {
  const cats = ['Clothes', 'Books', 'Furniture', 'Electronics', 'Medical Equipment', 'Food Supplies', 'Educational Materials', 'Others'];
  const f = ngoModuleMeta.requestForm;
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>Request Donations</h1><p>Request items from AJA Abayahastam warehouse for your beneficiaries.</p></div>
      <div class="ngo-form-card" style="max-width:100%">
        <h2>Choose Category</h2>
        <div class="ngo-category-grid">
          ${cats.map(c => `<button type="button" class="ngo-category-opt ${f.category === c ? 'selected' : ''}" onclick="ngoSelectCategory('${c}')">${c}</button>`).join('')}
        </div>
        <div class="form-group"><label>Purpose *</label><input type="text" id="ngo-req-purpose" value="${f.purpose}" placeholder="Purpose of request"></div>
        <div class="form-row">
          <div class="form-group"><label>Required Quantity *</label><input type="number" id="ngo-req-qty" value="${f.quantity}" placeholder="e.g. 50" min="1"></div>
          <div class="form-group"><label>Priority</label>
            <select id="ngo-req-priority"><option ${f.priority === 'Normal' ? 'selected' : ''}>Normal</option><option ${f.priority === 'High' ? 'selected' : ''}>High</option><option ${f.priority === 'Urgent' ? 'selected' : ''}>Urgent</option></select>
          </div>
        </div>
        <div class="form-group"><label>Beneficiary Details *</label><textarea id="ngo-req-beneficiary" rows="2" placeholder="Who will receive these items?">${f.beneficiary}</textarea></div>
        <div class="form-group"><label>Supporting Notes</label><textarea id="ngo-req-notes" rows="2" placeholder="Additional context">${f.notes}</textarea></div>
        <div class="ngo-form-actions">
          <button type="button" class="btn-ghost" onclick="saveNgoRequestDraft('items')">Save Draft</button>
          <button type="button" class="login-submit" onclick="submitNgoDonationRequest()">Submit Request</button>
        </div>
      </div>
    </div>`;
}

function ngoSelectCategory(cat) {
  ngoModuleMeta.requestForm.category = cat;
  renderDashboardLayout();
}

function submitNgoDonationRequest() {
  const f = ngoModuleMeta.requestForm;
  f.purpose = document.getElementById('ngo-req-purpose')?.value.trim();
  f.quantity = document.getElementById('ngo-req-qty')?.value;
  f.priority = document.getElementById('ngo-req-priority')?.value;
  f.beneficiary = document.getElementById('ngo-req-beneficiary')?.value.trim();
  f.notes = document.getElementById('ngo-req-notes')?.value.trim();
  if (!f.category || !f.purpose || !f.quantity || !f.beneficiary) {
    showNgoToast('Fill category, purpose, quantity, and beneficiary details.', 'error'); return;
  }
  const user = appState.currentUser;
  const id = 'NGO-REQ-' + String((appState.ngoRequests.length + 1)).padStart(3, '0');
  const today = new Date().toISOString().split('T')[0];
  appState.ngoRequests.unshift({
    id, ngoEmail: user.email, type: 'Items', category: f.category,
    purpose: f.purpose, quantity: parseInt(f.quantity, 10), priority: f.priority,
    beneficiary: f.beneficiary, notes: f.notes, status: 'Submitted', appliedDate: today,
    timeline: buildNgoTimeline('Submitted', today), rejectionReason: null, assignedDonations: []
  });
  appState.requests.unshift({
    id: 'req-' + (appState.requests.length + 1),
    requester: user.name + ' (NGO)', type: 'Items Assistance',
    details: `Needs ${f.quantity}x ${f.category} for: ${f.purpose}. Beneficiaries: ${f.beneficiary}`,
    status: 'Pending'
  });
  ngoModuleMeta.requestForm = { type: 'items', category: '', purpose: '', quantity: '', priority: 'Normal', beneficiary: '', notes: '' };
  showNgoToast('Donation request submitted!', 'success');
  switchTab('ngo-my-requests');
}

function saveNgoRequestDraft(type) {
  showNgoToast('Request saved as draft.', 'info');
}

/* --- Request Funds --- */
function renderNgoRequestFunds(container) {
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>Request Financial Assistance</h1><p>Apply for program funding from AJA Abayahastham.</p></div>
      <div class="ngo-form-card" style="max-width:100%">
        <div class="form-group"><label>Requested Amount (USD) *</label><input type="number" id="ngo-req-amount" placeholder="e.g. 5000" min="1"></div>
        <div class="form-group"><label>Program / Purpose *</label><input type="text" id="ngo-fund-purpose" placeholder="e.g. Elderly lunch program"></div>
        <div class="form-group"><label>Project Proposal & Utilization Plan *</label><textarea id="ngo-req-proposal" rows="4" placeholder="Detail budget allocation and expected impact"></textarea></div>
        <div class="form-group"><label>Beneficiary Details</label><textarea id="ngo-fund-beneficiary" rows="2" placeholder="Target beneficiaries"></textarea></div>
        <div class="ngo-form-actions">
          <button type="button" class="login-submit" onclick="submitNgoFundRequest()">Submit Funds Request</button>
        </div>
      </div>
    </div>`;
}

function submitNgoFundRequest() {
  const amount = document.getElementById('ngo-req-amount')?.value;
  const purpose = document.getElementById('ngo-fund-purpose')?.value.trim();
  const proposal = document.getElementById('ngo-req-proposal')?.value.trim();
  const beneficiary = document.getElementById('ngo-fund-beneficiary')?.value.trim();
  if (!amount || !purpose || !proposal) {
    showNgoToast('Fill amount, purpose, and proposal.', 'error'); return;
  }
  const user = appState.currentUser;
  const id = 'NGO-REQ-' + String((appState.ngoRequests.length + 1)).padStart(3, '0');
  const today = new Date().toISOString().split('T')[0];
  appState.ngoRequests.unshift({
    id, ngoEmail: user.email, type: 'Financial', category: 'Program Funding',
    purpose, amount: parseFloat(amount), beneficiary: beneficiary || '',
    notes: proposal, status: 'Submitted', appliedDate: today,
    timeline: buildNgoTimeline('Submitted', today), rejectionReason: null, assignedDonations: []
  });
  if (typeof submitNgoRequest === 'function') {
    document.getElementById('ngo-req-amount').value = amount;
    document.getElementById('ngo-req-proposal').value = proposal;
  }
  appState.requests.unshift({
    id: 'req-' + (appState.requests.length + 1),
    requester: user.name + ' (NGO)', type: 'Financial Assistance',
    details: `Requesting $${amount} for ${purpose}. Proposal: ${proposal}`,
    status: 'Pending'
  });
  showNgoToast('Financial assistance request submitted!', 'success');
  switchTab('ngo-my-requests');
}

/* --- Inventory --- */
function renderNgoInventory(container) {
  const items = (appState.inventory || []).map((item, i) => ({
    ...item,
    status: ['Available', 'Reserved', 'Distributed', 'Pending Allocation'][i % 4],
    receivedDate: '2026-07-0' + ((i % 5) + 1),
    emoji: ['🧥', '💊', '♿', '🥫'][i % 4]
  }));
  const filter = ngoModuleMeta.inventoryFilter;
  const search = ngoModuleMeta.inventorySearch.toLowerCase();
  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search);
    const matchFilter = filter === 'all' || item.status.toLowerCase().includes(filter.toLowerCase());
    return matchSearch && matchFilter;
  });

  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>Inventory</h1><p>Manage items received, reserved, and distributed to beneficiaries.</p></div>
      <div class="ngo-ngo-filters" style="display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap">
        <input type="search" placeholder="Search items…" value="${ngoModuleMeta.inventorySearch}" oninput="ngoFilterInventory(this.value)" style="flex:1;min-width:180px;padding:0.65rem 1rem;border:1px solid #E5E7EB;border-radius:12px">
        ${['all', 'Available', 'Reserved', 'Distributed', 'Pending'].map(s => `
          <button type="button" class="receiver-filter-chip ${filter === s ? 'active' : ''}" onclick="ngoFilterInventoryStatus('${s}')">${s === 'all' ? 'All' : s}</button>
        `).join('')}
      </div>
      <div class="ngo-inventory-grid">
        ${filtered.length ? filtered.map(item => `
          <article class="ngo-inventory-card">
            <div class="ngo-inventory-thumb">${item.emoji}</div>
            <h3 style="font-size:0.9375rem;font-weight:700">${item.name}</h3>
            <p style="font-size:0.75rem;color:#9CA3AF;margin:0.25rem 0">${item.category}</p>
            <p style="font-size:1rem;font-weight:800">${item.qty} ${item.unit}</p>
            <span class="ngo-status-pill ngo-status-pill--${item.status === 'Available' ? 'approved' : item.status === 'Distributed' ? 'completed' : 'review'}">${item.status}</span>
            <p style="font-size:0.7rem;color:#9CA3AF;margin-top:0.5rem">Received: ${item.receivedDate}</p>
          </article>
        `).join('') : `<div class="ngo-empty" style="grid-column:1/-1"><div class="ngo-empty-icon">📦</div><h3>No inventory items</h3></div>`}
      </div>
    </div>`;
}

function ngoFilterInventory(val) { ngoModuleMeta.inventorySearch = val; renderDashboardLayout(); }
function ngoFilterInventoryStatus(s) { ngoModuleMeta.inventoryFilter = s; renderDashboardLayout(); }

/* --- Beneficiaries --- */
function renderNgoBeneficiaries(container) {
  const list = appState.ngoBeneficiaries || [];
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>Beneficiaries</h1><p>Track individuals and families receiving assistance through your NGO.</p></div>
      ${list.length ? list.map(b => `
        <article class="ngo-beneficiary-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <h3 style="font-weight:700;font-size:0.9375rem">${b.name}</h3>
              <p style="font-size:0.8125rem;color:#6B7280">${b.type}</p>
            </div>
            <span class="ngo-status-pill ngo-status-pill--${b.status === 'Completed' ? 'completed' : 'approved'}">${b.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-top:0.75rem;font-size:0.8125rem;color:#6B7280">
            <p><strong>Resources:</strong> ${b.resources}</p>
            <p><strong>Completion:</strong> ${b.completion}</p>
          </div>
        </article>
      `).join('') : `<div class="ngo-empty"><div class="ngo-empty-icon">👥</div><h3>No beneficiaries yet</h3><p>Beneficiaries appear once donations are allocated.</p></div>`}
    </div>`;
}

/* --- My Requests --- */
function renderNgoMyRequests(container) {
  const reqs = getNgoRequests();
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>My Requests</h1><p>Track all donation and financial assistance requests.</p></div>
      ${reqs.length ? reqs.map(r => `
        <article class="ngo-request-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem">
            <div>
              <p style="font-size:0.75rem;font-weight:700;color:#9CA3AF">${r.id}</p>
              <h3 style="font-weight:700">${r.type} — ${r.category || r.purpose}</h3>
              <p style="font-size:0.8125rem;color:#6B7280">${r.appliedDate} · ${r.priority || 'Normal'} priority</p>
            </div>
            <span class="ngo-status-pill ngo-status-pill--${r.status === 'Approved' ? 'approved' : r.status === 'Rejected' ? 'rejected' : r.status === 'Under Review' ? 'review' : 'submitted'}">${r.status}</span>
          </div>
          ${r.amount ? `<p style="font-size:1.125rem;font-weight:800;margin:0.5rem 0">$${Number(r.amount).toLocaleString()}</p>` : r.quantity ? `<p style="margin:0.5rem 0">Qty: ${r.quantity}</p>` : ''}
          <div class="ngo-timeline"><div class="ngo-timeline-track">
            ${(r.timeline || []).map(t => `<div class="ngo-timeline-step ${t.done ? 'done' : ''} ${t.active ? 'active' : ''}"><div class="ngo-timeline-dot"></div><span>${t.step}</span></div>`).join('')}
          </div></div>
          ${r.rejectionReason ? `<p style="color:#991B1B;font-size:0.8125rem;margin-top:0.75rem;background:#FEF2F2;padding:0.75rem;border-radius:8px"><strong>Rejected:</strong> ${r.rejectionReason}</p>` : ''}
          ${r.assignedDonations?.length ? `<p style="font-size:0.8125rem;color:#16A34A;margin-top:0.5rem">Assigned: ${r.assignedDonations.join(', ')}</p>` : ''}
        </article>
      `).join('') : `<div class="ngo-empty"><div class="ngo-empty-icon">📋</div><h3>No requests yet</h3>
        <button type="button" class="login-submit" onclick="ngoTrySwitchTab('ngo-request-donations')">Request Donations</button></div>`}
    </div>`;
}

/* --- Reports --- */
function renderNgoReports(container) {
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header">
        <h1>Reports</h1>
        <p>Donation, beneficiary, and distribution analytics for your organization.</p>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
          <button type="button" class="btn-outline btn-sm" onclick="showNgoToast('PDF export started.','info')">Export PDF</button>
          <button type="button" class="btn-outline btn-sm" onclick="showNgoToast('Excel export started.','info')">Export Excel</button>
        </div>
      </div>
      <div class="ngo-stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1.5rem">
        <div class="ngo-stat-card"><p class="ngo-stat-label">Total Donations Received</p><p class="ngo-stat-value">$4,200</p></div>
        <div class="ngo-stat-card"><p class="ngo-stat-label">Items Distributed</p><p class="ngo-stat-value">340</p></div>
        <div class="ngo-stat-card"><p class="ngo-stat-label">Beneficiaries Served</p><p class="ngo-stat-value">128</p></div>
      </div>
      <div class="ngo-reports-grid">
        <div class="ngo-chart-placeholder">${ngoIcon('bar-chart-3', 32)}<p style="margin-top:0.5rem">Donation Reports</p></div>
        <div class="ngo-chart-placeholder">${ngoIcon('users', 32)}<p style="margin-top:0.5rem">Beneficiary Reports</p></div>
        <div class="ngo-chart-placeholder">${ngoIcon('truck', 32)}<p style="margin-top:0.5rem">Distribution Reports</p></div>
        <div class="ngo-chart-placeholder">${ngoIcon('trending-up', 32)}<p style="margin-top:0.5rem">Monthly Statistics</p></div>
      </div>
    </div>`;
  refreshNgoIcons();
}

/* --- Notifications --- */
function renderNgoNotifications(container) {
  const groups = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' };
  const notifs = appState.ngoNotifications || [];
  let html = '<div class="ngo-page ngo-module"><div class="ngo-page-header"><h1>Notifications</h1></div>';
  if (!notifs.length) {
    html += '<div class="ngo-empty"><div class="ngo-empty-icon">🔔</div><h3>No notifications</h3></div>';
  } else {
    Object.keys(groups).forEach(key => {
      const items = notifs.filter(n => n.group === key);
      if (!items.length) return;
      html += `<div class="ngo-notif-group"><p class="ngo-notif-group-title">${groups[key]}</p>`;
      items.forEach(n => {
        html += `<div class="ngo-notif-item ${n.read ? '' : 'unread'}" onclick="markNgoNotificationRead('${n.id}')">
          <div class="ngo-notif-icon">${ngoIcon(n.icon || 'bell', 20)}</div>
          <div><strong style="font-size:0.875rem">${n.title}</strong><p style="font-size:0.8125rem;color:#6B7280">${n.message}</p>
          <p style="font-size:0.7rem;color:#9CA3AF;margin-top:0.25rem">${n.time}</p></div>
        </div>`;
      });
      html += '</div>';
    });
  }
  html += '</div>';
  container.innerHTML = html;
  refreshNgoIcons();
}

function markNgoNotificationRead(id) {
  const n = (appState.ngoNotifications || []).find(x => x.id === id);
  if (n) n.read = true;
  renderDashboardLayout();
}

/* --- Profile --- */
function renderNgoProfile(container) {
  const u = appState.currentUser;
  const stats = getNgoStats();
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-profile-hero">
        <div class="ngo-profile-logo">🏛</div>
        <div>
          <h1 style="font-size:1.35rem;font-weight:800">${u.name}</h1>
          <p style="color:#6B7280;font-size:0.875rem;margin:0.35rem 0">${u.email} · ${u.mobile}</p>
          ${getNgoStatusBadge()}
          <p style="font-size:0.8125rem;color:#6B7280;margin-top:0.5rem">Rep: ${u.repName || '—'} · ${u.orgType || 'NGO'} · ${u.city}, ${u.state}</p>
        </div>
      </div>
      <div class="ngo-stats-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="ngo-stat-card"><p class="ngo-stat-label">Requests</p><p class="ngo-stat-value">${stats.donationRequests}</p></div>
        <div class="ngo-stat-card"><p class="ngo-stat-label">Approved</p><p class="ngo-stat-value">${stats.approved}</p></div>
        <div class="ngo-stat-card"><p class="ngo-stat-label">Beneficiaries</p><p class="ngo-stat-value">${isNgoVerified() ? stats.beneficiaries : '—'}</p></div>
      </div>
      <div class="ngo-form-card">
        <h2>Edit Profile</h2>
        <div class="form-group"><label>Organization Name</label><input type="text" id="ngo-profile-name" value="${u.name}"></div>
        <div class="form-group"><label>Representative</label><input type="text" id="ngo-profile-rep" value="${u.repName || ''}"></div>
        <div class="form-row">
          <div class="form-group"><label>City</label><input type="text" id="ngo-profile-city" value="${u.city || ''}"></div>
          <div class="form-group"><label>State</label><input type="text" id="ngo-profile-state" value="${u.state || ''}"></div>
        </div>
        <div class="form-group"><label>Mission</label><textarea id="ngo-profile-mission" rows="3" placeholder="Organization mission">${u.mission || ''}</textarea></div>
        <button type="button" class="login-submit" onclick="saveNgoProfile()">Save Changes</button>
      </div>
    </div>`;
}

function saveNgoProfile() {
  const u = appState.currentUser;
  u.name = document.getElementById('ngo-profile-name')?.value.trim() || u.name;
  u.repName = document.getElementById('ngo-profile-rep')?.value.trim() || u.repName;
  u.city = document.getElementById('ngo-profile-city')?.value.trim() || u.city;
  u.state = document.getElementById('ngo-profile-state')?.value.trim() || u.state;
  u.mission = document.getElementById('ngo-profile-mission')?.value.trim() || u.mission;
  updateGlobalHeader();
  showNgoToast('Profile updated.', 'success');
}

/* --- Settings --- */
function renderNgoSettings(container) {
  container.innerHTML = `
    <div class="ngo-page ngo-module">
      <div class="ngo-page-header"><h1>Settings</h1></div>
      <div class="receiver-settings-card" style="background:#FFF;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;margin-bottom:1rem">
        <h3 style="font-weight:700;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid #F3F4F6">Notifications</h3>
        <div class="receiver-toggle-row" style="display:flex;justify-content:space-between;padding:0.65rem 0"><span>Verification updates</span><input type="checkbox" checked></div>
        <div class="receiver-toggle-row" style="display:flex;justify-content:space-between;padding:0.65rem 0"><span>Request approvals</span><input type="checkbox" checked></div>
        <div class="receiver-toggle-row" style="display:flex;justify-content:space-between;padding:0.65rem 0"><span>Donation assignments</span><input type="checkbox" checked></div>
      </div>
      <button type="button" class="btn-outline" onclick="showNgoToast('Password reset link sent.','info')">Change Password</button>
    </div>`;
}

document.addEventListener('DOMContentLoaded', initNgoModuleData);
