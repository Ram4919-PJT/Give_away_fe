/* ==========================================================================
   Receiver Module — Modern Charity Portal (Give Away)
   ========================================================================== */

const RECEIVER_NAV_ITEMS = [
  { id: 'receiver-dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'receiver-apply', label: 'Apply for Financial Assistance', icon: 'file-heart' },
  { id: 'receiver-browse-ngos', label: 'Browse NGOs', icon: 'building-2' },
  { id: 'receiver-applications', label: 'My Applications', icon: 'clipboard-list' },
  { id: 'receiver-notifications', label: 'Notifications', icon: 'bell' },
  { id: 'receiver-profile', label: 'Profile', icon: 'user' },
  { id: 'receiver-settings', label: 'Settings', icon: 'settings' }
];

const ASSISTANCE_TYPES = {
  'Medical Assistance': {
    desc: 'Hospital bills, medicines, and treatment costs',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Doctor Prescription', 'Medical Diagnosis Report', 'Hospital Estimate', 'Hospital Bills', 'Admission Letter (if applicable)']
    }
  },
  'Educational Assistance': {
    desc: 'School fees, books, and educational expenses',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Student ID Card', 'Bonafide Certificate', 'Admission Letter', 'Fee Structure', 'Fee Receipt']
    }
  },
  'Emergency Relief': {
    desc: 'Sudden crises — rent, food, disaster recovery',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Supporting Certificate', 'Local Authority Letter', 'Supporting Photos (Optional)']
    }
  },
  'Women & Child Welfare': {
    desc: 'Support for women and children in need',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Supporting Certificate', 'Medical Report (if applicable)']
    }
  },
  'Senior Citizen Assistance': {
    desc: 'Elderly care, medical, and livelihood support',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Age Proof', 'Medical Report (if required)']
    }
  },
  'Disability Support': {
    desc: 'Aid for persons with disabilities',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Government Disability Certificate', 'Medical Report']
    }
  },
  'Other Financial Assistance': {
    desc: 'Other verified financial hardship needs',
    docs: {
      common: ['Aadhaar Card', 'Passport Size Photo', 'Income Certificate'],
      specific: ['Supporting Certificate', 'Supporting Documents']
    }
  }
};

const APPLICATION_TIMELINE_STEPS = [
  'Draft', 'Submitted', 'Under NGO Review', 'Under Admin Review',
  'Approved', 'Funds Released', 'Completed'
];

const receiverModuleMeta = {
  applyStep: 1,
  applyForm: {
    assistanceType: '',
    purpose: '',
    amount: '',
    description: '',
    preferredNgo: '',
    expectedDate: '',
    notes: ''
  },
  uploadedDocs: {},
  ngoFilter: '',
  ngoCategory: 'all',
  ngoLocation: 'all',
  selectedNgoId: null,
  selectedApplicationId: null,
  regEmailVerified: false,
  regMobileVerified: false
};

function initReceiverModuleData() {
  if (typeof initDonorModuleData === 'function') initDonorModuleData();

  if (!appState.receiverApplications) {
    appState.receiverApplications = [
      {
        id: 'APP-2026-001',
        receiverEmail: 'receiver@outlook.com',
        receiverName: 'Ravi Kumar',
        assistanceType: 'Emergency Relief',
        purpose: 'Emergency house rent support',
        amount: 400,
        description: 'Lost job due to medical emergency. Need $400 for one month rent to avoid eviction.',
        preferredNgo: 'Asha Kiran Foundation',
        expectedDate: '2026-07-15',
        notes: 'Family of 4, two school-going children.',
        status: 'Under Admin Review',
        appliedDate: '2026-07-07',
        documents: { 'Aadhaar Card': true, 'Income Certificate': true, 'Supporting Certificate': true },
        timeline: buildTimeline('Under Admin Review', '2026-07-07'),
        rejectionReason: null
      },
      {
        id: 'APP-2026-002',
        receiverEmail: 'receiver@outlook.com',
        receiverName: 'Ravi Kumar',
        assistanceType: 'Medical Assistance',
        purpose: 'Monthly family ration kit',
        amount: 350,
        description: 'Need monthly ration support for family of 5.',
        preferredNgo: 'Helpage India',
        expectedDate: '2026-06-20',
        notes: '',
        status: 'Completed',
        appliedDate: '2026-06-01',
        documents: { 'Aadhaar Card': true, 'Income Certificate': true },
        timeline: buildTimeline('Completed', '2026-06-01'),
        rejectionReason: null
      }
    ];
  }

  if (!appState.receiverNotifications) {
    appState.receiverNotifications = [
      { id: 'rn-1', title: 'Application Under Review', message: 'APP-2026-001 is now under admin review.', time: '2 hours ago', group: 'today', read: false, icon: 'clock' },
      { id: 'rn-2', title: 'Documents Received', message: 'Your uploaded documents for APP-2026-001 have been received.', time: '5 hours ago', group: 'today', read: false, icon: 'file-check' },
      { id: 'rn-3', title: 'Application Completed', message: 'APP-2026-002 funds have been released successfully.', time: 'Yesterday', group: 'yesterday', read: true, icon: 'circle-check' },
      { id: 'rn-4', title: 'Welcome to Give Away', message: 'We\'re here to support you. Browse NGOs or apply for assistance anytime.', time: '3 days ago', group: 'earlier', read: true, icon: 'heart-handshake' },
      { id: 'rn-5', title: 'New NGO Program', message: 'Asha Kiran Foundation launched a new medical assistance program.', time: '4 days ago', group: 'earlier', read: true, icon: 'building-2' }
    ];
  }
}

function receiverIcon(name, size) {
  const s = size || 18;
  return `<i data-lucide="${name}" style="width:${s}px;height:${s}px"></i>`;
}

function refreshReceiverIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showReceiverToast(message, type) {
  const root = document.getElementById('donor-toast-root') || document.getElementById('app-toast-root');
  if (!root) { alert(message); return; }
  const el = document.createElement('div');
  el.className = `receiver-toast receiver-toast--${type || 'info'}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; }, 2800);
  setTimeout(() => el.remove(), 3200);
}

function buildTimeline(status, startDate) {
  const statusIndex = {
    'Draft': 0, 'Submitted': 1, 'Under NGO Review': 2, 'Under Admin Review': 3,
    'Approved': 4, 'Funds Released': 5, 'Completed': 6, 'Rejected': 3
  };
  const active = statusIndex[status] ?? 1;
  return APPLICATION_TIMELINE_STEPS.map((step, i) => ({
    step,
    date: i <= active ? startDate : '',
    done: i < active || (status === 'Completed' && i <= 6),
    active: i === active && status !== 'Completed' && status !== 'Rejected',
    rejected: status === 'Rejected' && i === active
  }));
}

function getReceiverApplications() {
  if (!appState.currentUser) return [];
  const key = (appState.currentUser.email || '').toLowerCase();
  const name = appState.currentUser.name || '';
  return (appState.receiverApplications || []).filter(a =>
    (a.receiverEmail || '').toLowerCase() === key ||
    a.receiverName === name ||
    key === 'receiver@outlook.com'
  );
}

function getApplicationStats() {
  const apps = getReceiverApplications();
  return {
    total: apps.length,
    approved: apps.filter(a => a.status === 'Approved' || a.status === 'Funds Released' || a.status === 'Completed').length,
    review: apps.filter(a => ['Submitted', 'Under NGO Review', 'Under Admin Review'].includes(a.status)).length,
    rejected: apps.filter(a => a.status === 'Rejected').length,
    draft: apps.filter(a => a.status === 'Draft').length
  };
}

function getStatusBadgeClass(status) {
  const map = {
    'Draft': 'draft', 'Submitted': 'submitted', 'Under NGO Review': 'ngo-review',
    'Under Admin Review': 'admin-review', 'Approved': 'approved',
    'Rejected': 'rejected', 'Funds Released': 'funds', 'Completed': 'completed'
  };
  return map[status] || 'submitted';
}

function renderApplicationTimeline(timeline, status) {
  const steps = (timeline || []).map(t => {
    let cls = 'receiver-timeline-step';
    if (t.done) cls += ' done';
    if (t.active) cls += ' active';
    if (t.rejected) cls += ' rejected';
    return `<div class="${cls}"><div class="receiver-timeline-dot"></div><span>${t.step}</span></div>`;
  }).join('');
  return `<div class="receiver-timeline"><p class="receiver-timeline-title">Application Timeline</p><div class="receiver-timeline-track">${steps}</div></div>`;
}

function getReceiverInitials(name) {
  return (name || 'R').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* --- Registration --- */
function sendReceiverRegOtp(type) {
  showReceiverToast(`OTP sent to your ${type}. Use any 6-digit code for demo.`, 'info');
}

function verifyReceiverRegOtp(type) {
  const inputId = type === 'email' ? 'receiver-email-otp' : 'receiver-mobile-otp';
  const val = document.getElementById(inputId)?.value.trim();
  if (!/^\d{6}$/.test(val)) {
    showReceiverToast('Please enter a valid 6-digit OTP.', 'error');
    return;
  }
  if (type === 'email') {
    receiverModuleMeta.regEmailVerified = true;
    document.getElementById('receiver-email-otp-block')?.classList.add('verified');
    const el = document.getElementById('receiver-email-otp-status');
    if (el) { el.textContent = 'Verified ✓'; el.classList.add('is-verified'); }
  } else {
    receiverModuleMeta.regMobileVerified = true;
    document.getElementById('receiver-mobile-otp-block')?.classList.add('verified');
    const el = document.getElementById('receiver-mobile-otp-status');
    if (el) { el.textContent = 'Verified ✓'; el.classList.add('is-verified'); }
  }
  showReceiverToast(`${type === 'email' ? 'Email' : 'Mobile'} verified successfully!`, 'success');
}

function handleReceiverRegistration(event) {
  if (event) event.preventDefault();

  const fullName = document.getElementById('receiver-full-name')?.value.trim();
  const email = document.getElementById('receiver-email')?.value.trim();
  const mobile = document.getElementById('receiver-mobile')?.value.trim();
  const password = document.getElementById('receiver-password')?.value;
  const confirmPassword = document.getElementById('receiver-confirm-password')?.value;
  const dob = document.getElementById('receiver-dob')?.value;
  const gender = document.getElementById('receiver-gender')?.value;
  const city = document.getElementById('receiver-city')?.value.trim();
  const state = document.getElementById('receiver-state')?.value.trim();
  const address = document.getElementById('receiver-address')?.value.trim();
  const termsAccepted = document.getElementById('receiver-terms')?.checked;

  if (!fullName || !email || !mobile || !password || !dob || !gender || !city || !state) {
    showReceiverToast('Please fill in all required fields.', 'error');
    return;
  }
  if (password.length < 8) {
    showReceiverToast('Password must be at least 8 characters.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showReceiverToast('Passwords do not match.', 'error');
    return;
  }
  if (!receiverModuleMeta.regEmailVerified || !receiverModuleMeta.regMobileVerified) {
    showReceiverToast('Please verify both email and mobile OTP.', 'error');
    return;
  }
  if (!termsAccepted) {
    showReceiverToast('Please accept the Terms & Conditions.', 'error');
    return;
  }

  appState.currentUser = {
    name: fullName,
    email: email,
    mobile: mobile,
    role: 'receiver',
    dob, gender, city, state,
    address: address || '',
    status: 'Registered Receiver',
    memberSince: new Date().toISOString().split('T')[0]
  };

  receiverModuleMeta.regEmailVerified = false;
  receiverModuleMeta.regMobileVerified = false;
  appState.selectedRegistrationRole = null;
  appState.currentTab = 'receiver-dashboard';
  showReceiverToast('Welcome! Your receiver account has been created.', 'success');
  showView('dashboard');
}

/* --- Sidebar --- */
function renderReceiverSidebar(container) {
  const unread = (appState.receiverNotifications || []).filter(n => !n.read).length;
  let html = RECEIVER_NAV_ITEMS.map(item => {
    const badge = item.id === 'receiver-notifications' && unread > 0
      ? `<span style="margin-left:auto;background:#EF4444;color:#fff;font-size:0.65rem;padding:0.1rem 0.4rem;border-radius:999px">${unread}</span>` : '';
    return `<li class="sidebar-item ${appState.currentTab === item.id ? 'active' : ''}">
      <a href="#" onclick="switchTab('${item.id}'); return false;">
        <span class="sidebar-icon">${receiverIcon(item.icon)}</span>
        ${item.label}${badge}
      </a>
    </li>`;
  }).join('');
  html += `<li class="sidebar-item receiver-sidebar-logout">
    <a href="#" onclick="handleLogout(); return false;">
      <span class="sidebar-icon">${receiverIcon('log-out')}</span>
      Logout
    </a>
  </li>`;
  container.innerHTML = html;
  refreshReceiverIcons();
}

function wireReceiverDashboardChrome() {
  const layout = document.querySelector('.dashboard-layout');
  if (layout) layout.classList.add('dashboard-layout--receiver');
  const notifyBtn = document.getElementById('dashboard-notify-btn');
  if (notifyBtn && appState.currentUser?.role === 'receiver') {
    notifyBtn.onclick = () => switchTab('receiver-notifications');
    const unread = (appState.receiverNotifications || []).filter(n => !n.read).length;
    let dot = notifyBtn.querySelector('.rcv-notify-dot');
    if (unread > 0) {
      if (!dot) {
        dot = document.createElement('span');
        dot.className = 'rcv-notify-dot';
        dot.style.cssText = 'position:absolute;top:6px;right:6px;width:8px;height:8px;background:#EF4444;border-radius:50%;border:2px solid #fff';
        notifyBtn.style.position = 'relative';
        notifyBtn.appendChild(dot);
      }
    } else if (dot) dot.remove();
  }
}

/* --- Tab router --- */
function renderReceiverTabContent(container, tab) {
  wireReceiverDashboardChrome();
  const views = {
    'receiver-dashboard': renderReceiverDashboardHome,
    'receiver-apply': renderReceiverApplyView,
    'receiver-browse-ngos': renderReceiverBrowseNgos,
    'receiver-ngo-detail': renderReceiverNgoDetail,
    'receiver-applications': renderReceiverApplications,
    'receiver-application-detail': renderReceiverApplicationDetail,
    'receiver-notifications': renderReceiverNotifications,
    'receiver-profile': renderReceiverProfile,
    'receiver-settings': renderReceiverSettings,
    'receiver-request': renderReceiverApplyView,
    'receiver-history': renderReceiverApplications
  };
  const fn = views[tab] || renderReceiverDashboardHome;
  fn(container);
  refreshReceiverIcons();
}

/* --- Dashboard Home --- */
function renderReceiverDashboardHome(container) {
  const user = appState.currentUser;
  const stats = getApplicationStats();
  const apps = getReceiverApplications().slice(0, 3);

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <div class="receiver-hero-banner">
        <div>
          <div class="receiver-welcome-row">
            <h1>We're here to support you.</h1>
            <span class="receiver-badge receiver-badge--registered">${receiverIcon('shield', 12)} Registered Receiver</span>
          </div>
          <p>Hello, <strong>${user.name}</strong>. Find the right assistance through trusted NGOs and Aja Abayahastham.</p>
        </div>
        <div class="receiver-hero-illus" aria-hidden="true">🤗</div>
      </div>

      <div class="receiver-stats-grid">
        <article class="receiver-stat-card">
          <div class="receiver-stat-icon receiver-stat-icon--blue">${receiverIcon('file-plus', 20)}</div>
          <p class="receiver-stat-label">Applications Submitted</p>
          <p class="receiver-stat-value">${stats.total}</p>
        </article>
        <article class="receiver-stat-card">
          <div class="receiver-stat-icon receiver-stat-icon--green">${receiverIcon('circle-check', 20)}</div>
          <p class="receiver-stat-label">Approved</p>
          <p class="receiver-stat-value">${stats.approved}</p>
        </article>
        <article class="receiver-stat-card">
          <div class="receiver-stat-icon receiver-stat-icon--orange">${receiverIcon('clock', 20)}</div>
          <p class="receiver-stat-label">Under Review</p>
          <p class="receiver-stat-value">${stats.review}</p>
        </article>
        <article class="receiver-stat-card">
          <div class="receiver-stat-icon receiver-stat-icon--red">${receiverIcon('x-circle', 20)}</div>
          <p class="receiver-stat-label">Rejected</p>
          <p class="receiver-stat-value">${stats.rejected}</p>
        </article>
      </div>

      <div class="receiver-section">
        <div class="receiver-section-head"><h2 class="receiver-section-title">Quick Actions</h2></div>
        <div class="receiver-quick-actions">
          <button type="button" class="receiver-quick-btn" onclick="switchTab('receiver-apply')">
            <span class="receiver-quick-btn-icon">${receiverIcon('file-heart', 22)}</span>
            Apply for Assistance
          </button>
          <button type="button" class="receiver-quick-btn" onclick="switchTab('receiver-browse-ngos')">
            <span class="receiver-quick-btn-icon">${receiverIcon('building-2', 22)}</span>
            Browse NGOs
          </button>
          <button type="button" class="receiver-quick-btn" onclick="switchTab('receiver-applications')">
            <span class="receiver-quick-btn-icon">${receiverIcon('clipboard-list', 22)}</span>
            My Applications
          </button>
          <button type="button" class="receiver-quick-btn" onclick="switchTab('receiver-notifications')">
            <span class="receiver-quick-btn-icon">${receiverIcon('bell', 22)}</span>
            Notifications
          </button>
        </div>
      </div>

      <div class="receiver-grid-2">
        <div class="receiver-section">
          <div class="receiver-section-head">
            <h2 class="receiver-section-title">Recent Applications</h2>
            <button type="button" class="receiver-section-link" onclick="switchTab('receiver-applications')">View all</button>
          </div>
          <div class="receiver-activity-list">
            ${apps.length ? apps.map(a => `
              <div class="receiver-activity-item" onclick="viewReceiverApplication('${a.id}')" style="cursor:pointer">
                <div class="receiver-activity-icon">${receiverIcon('file-text', 18)}</div>
                <div class="receiver-activity-body">
                  <strong>${a.assistanceType} — $${a.amount}</strong>
                  <span>${a.id} · ${a.status} · ${a.appliedDate}</span>
                </div>
              </div>
            `).join('') : '<div class="receiver-empty" style="border:none;padding:2rem"><p>No applications yet</p></div>'}
          </div>
        </div>
        <div class="receiver-section">
          <div class="receiver-section-head"><h2 class="receiver-section-title">Recent Notifications</h2></div>
          <div class="receiver-activity-list">
            ${(appState.receiverNotifications || []).slice(0, 3).map(n => `
              <div class="receiver-activity-item">
                <div class="receiver-activity-icon">${receiverIcon(n.icon || 'bell', 18)}</div>
                <div class="receiver-activity-body">
                  <strong>${n.title}</strong>
                  <span>${n.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

/* --- Apply for Assistance (3-step) --- */
function renderReceiverApplyView(container) {
  const step = receiverModuleMeta.applyStep;
  const f = receiverModuleMeta.applyForm;

  const stepper = [1, 2, 3].map(s => {
    const labels = ['Assistance Type', 'Application Form', 'Upload Documents'];
    let cls = 'receiver-step';
    if (s === step) cls += ' active';
    if (s < step) cls += ' done';
    return `<div class="${cls}"><div class="receiver-step-num">${s < step ? '✓' : s}</div><span class="receiver-step-label">${labels[s - 1]}</span></div>${s < 3 ? '<div class="receiver-step-line"></div>' : ''}`;
  }).join('');

  let stepContent = '';
  if (step === 1) {
    stepContent = `
      <h2>Select assistance type</h2>
      <p>Choose the category that best describes your need.</p>
      <div class="receiver-type-grid">
        ${Object.entries(ASSISTANCE_TYPES).map(([type, info]) => `
          <button type="button" class="receiver-type-opt ${f.assistanceType === type ? 'selected' : ''}" onclick="receiverSelectAssistanceType('${type.replace(/'/g, "\\'")}')">
            <strong>${type}</strong>
            <span>${info.desc}</span>
          </button>
        `).join('')}
      </div>`;
  } else if (step === 2) {
    const ngoOptions = (appState.ngos || []).map(n => `<option value="${n.name}" ${f.preferredNgo === n.name ? 'selected' : ''}>${n.name}</option>`).join('');
    stepContent = `
      <h2>Application details</h2>
      <p>Tell us about your financial need. Documents will be collected in the next step.</p>
      <div class="form-group"><label>Purpose *</label>
        <input type="text" id="rcv-apply-purpose" value="${f.purpose}" placeholder="Brief purpose of assistance"></div>
      <div class="form-group"><label>Required Amount (USD) *</label>
        <input type="number" id="rcv-apply-amount" value="${f.amount}" placeholder="e.g. 500" min="1"></div>
      <div class="form-group"><label>Description *</label>
        <textarea id="rcv-apply-description" rows="4" placeholder="Explain your situation in detail">${f.description}</textarea></div>
      <div class="form-group"><label>Preferred NGO (Optional)</label>
        <select id="rcv-apply-ngo"><option value="">Any verified NGO</option>${ngoOptions}</select></div>
      <div class="form-row">
        <div class="form-group"><label>Expected Date</label>
          <input type="date" id="rcv-apply-date" value="${f.expectedDate}"></div>
        <div class="form-group"><label>Additional Notes</label>
          <input type="text" id="rcv-apply-notes" value="${f.notes}" placeholder="Any extra information"></div>
      </div>`;
  } else {
    const typeInfo = ASSISTANCE_TYPES[f.assistanceType];
    const allDocs = typeInfo ? [...typeInfo.docs.common, ...typeInfo.docs.specific] : [];
    stepContent = `
      <h2>Upload documents</h2>
      <p>Documents required for <strong>${f.assistanceType}</strong>. Upload clear copies (PDF/JPG, max 5 MB).</p>
      <div class="receiver-doc-grid">
        ${allDocs.map(doc => {
          const uploaded = receiverModuleMeta.uploadedDocs[doc];
          return `
            <label class="receiver-doc-upload ${uploaded ? 'uploaded' : ''}" id="doc-zone-${doc.replace(/\s/g, '-')}">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onchange="receiverDocUploaded('${doc.replace(/'/g, "\\'")}', this)">
              <div class="receiver-doc-icon">${receiverIcon(uploaded ? 'check-circle' : 'upload', 20)}</div>
              <div class="receiver-doc-info">
                <strong>${doc}</strong>
                <span>${uploaded ? 'Uploaded ✓' : 'Click to upload'}</span>
                ${uploaded ? '<div class="receiver-doc-progress"><div class="receiver-doc-progress-bar" style="width:100%"></div></div>' : ''}
              </div>
            </label>`;
        }).join('')}
      </div>`;
  }

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <div class="receiver-page-header">
        <h1>Apply for Financial Assistance</h1>
        <p>Complete all steps to submit your application for review.</p>
      </div>
      <div class="receiver-stepper">${stepper}</div>
      <div class="receiver-form-card">
        ${stepContent}
        <div class="receiver-form-actions">
          <button type="button" class="btn-outline" onclick="receiverApplyStepBack()" ${step === 1 ? 'disabled style="opacity:0.4"' : ''}>Back</button>
          <div style="display:flex;gap:0.5rem">
            <button type="button" class="btn-ghost" onclick="saveReceiverApplicationDraft()">Save as Draft</button>
            ${step < 3
              ? `<button type="button" class="login-submit" onclick="receiverApplyStepNext()">Continue</button>`
              : `<button type="button" class="login-submit" onclick="submitReceiverApplication()">Submit Application</button>`}
          </div>
        </div>
      </div>
    </div>`;
  refreshReceiverIcons();
}

function receiverSelectAssistanceType(type) {
  receiverModuleMeta.applyForm.assistanceType = type;
  receiverModuleMeta.uploadedDocs = {};
  renderDashboardLayout();
}

function receiverApplyStepNext() {
  const f = receiverModuleMeta.applyForm;
  if (receiverModuleMeta.applyStep === 1 && !f.assistanceType) {
    showReceiverToast('Please select an assistance type.', 'error'); return;
  }
  if (receiverModuleMeta.applyStep === 2) {
    f.purpose = document.getElementById('rcv-apply-purpose')?.value.trim();
    f.amount = document.getElementById('rcv-apply-amount')?.value;
    f.description = document.getElementById('rcv-apply-description')?.value.trim();
    f.preferredNgo = document.getElementById('rcv-apply-ngo')?.value;
    f.expectedDate = document.getElementById('rcv-apply-date')?.value;
    f.notes = document.getElementById('rcv-apply-notes')?.value.trim();
    if (!f.purpose || !f.amount || !f.description) {
      showReceiverToast('Please fill purpose, amount, and description.', 'error'); return;
    }
  }
  receiverModuleMeta.applyStep++;
  renderDashboardLayout();
}

function receiverApplyStepBack() {
  if (receiverModuleMeta.applyStep > 1) {
    if (receiverModuleMeta.applyStep === 3) receiverModuleMeta.uploadedDocs = {};
    receiverModuleMeta.applyStep--;
    renderDashboardLayout();
  }
}

function receiverDocUploaded(docName, input) {
  if (!input.files.length) return;
  receiverModuleMeta.uploadedDocs[docName] = true;
  const zone = document.getElementById('doc-zone-' + docName.replace(/\s/g, '-'));
  if (zone) zone.classList.add('uploaded');
  showReceiverToast(`${docName} uploaded.`, 'success');
  setTimeout(() => renderDashboardLayout(), 400);
}

function saveReceiverApplicationDraft() {
  const f = receiverModuleMeta.applyForm;
  if (receiverModuleMeta.applyStep >= 2) {
    f.purpose = document.getElementById('rcv-apply-purpose')?.value.trim() || f.purpose;
    f.amount = document.getElementById('rcv-apply-amount')?.value || f.amount;
    f.description = document.getElementById('rcv-apply-description')?.value.trim() || f.description;
    f.preferredNgo = document.getElementById('rcv-apply-ngo')?.value || f.preferredNgo;
    f.expectedDate = document.getElementById('rcv-apply-date')?.value || f.expectedDate;
    f.notes = document.getElementById('rcv-apply-notes')?.value.trim() || f.notes;
  }
  const user = appState.currentUser;
  const appId = 'APP-DRAFT-' + Date.now();
  appState.receiverApplications.unshift({
    id: appId,
    receiverEmail: user.email,
    receiverName: user.name,
    assistanceType: f.assistanceType || 'Other Financial Assistance',
    purpose: f.purpose || 'Draft application',
    amount: parseFloat(f.amount) || 0,
    description: f.description || '',
    preferredNgo: f.preferredNgo || '',
    expectedDate: f.expectedDate || '',
    notes: f.notes || '',
    status: 'Draft',
    appliedDate: new Date().toISOString().split('T')[0],
    documents: { ...receiverModuleMeta.uploadedDocs },
    timeline: buildTimeline('Draft', new Date().toISOString().split('T')[0]),
    rejectionReason: null
  });
  resetReceiverApplyForm();
  showReceiverToast('Application saved as draft.', 'success');
  switchTab('receiver-applications');
}

function submitReceiverApplication() {
  const f = receiverModuleMeta.applyForm;
  const typeInfo = ASSISTANCE_TYPES[f.assistanceType];
  const requiredDocs = typeInfo ? [...typeInfo.docs.common] : ['Aadhaar Card'];
  const missing = requiredDocs.filter(d => !receiverModuleMeta.uploadedDocs[d]);
  if (missing.length) {
    showReceiverToast(`Please upload: ${missing.join(', ')}`, 'error');
    return;
  }

  const user = appState.currentUser;
  const appId = 'APP-' + new Date().getFullYear() + '-' + String((appState.receiverApplications.length + 1)).padStart(3, '0');
  const today = new Date().toISOString().split('T')[0];

  const application = {
    id: appId,
    receiverEmail: user.email,
    receiverName: user.name,
    assistanceType: f.assistanceType,
    purpose: f.purpose,
    amount: parseFloat(f.amount),
    description: f.description,
    preferredNgo: f.preferredNgo,
    expectedDate: f.expectedDate,
    notes: f.notes,
    status: 'Submitted',
    appliedDate: today,
    documents: { ...receiverModuleMeta.uploadedDocs },
    timeline: buildTimeline('Submitted', today),
    rejectionReason: null
  };

  appState.receiverApplications.unshift(application);

  appState.requests.unshift({
    id: 'req-' + (appState.requests.length + 1),
    requester: user.name + ' (Receiver)',
    type: 'Financial Support',
    details: `[${f.assistanceType}] Needs $${f.amount} for: ${f.purpose}. ${f.description}`,
    status: 'Pending'
  });

  appState.receiverNotifications.unshift({
    id: 'rn-' + Date.now(),
    title: 'Application Submitted',
    message: `${appId} has been submitted and is awaiting review.`,
    time: 'Just now',
    group: 'today',
    read: false,
    icon: 'send'
  });

  resetReceiverApplyForm();
  showReceiverToast('Application submitted successfully!', 'success');
  switchTab('receiver-applications');
}

function resetReceiverApplyForm() {
  receiverModuleMeta.applyStep = 1;
  receiverModuleMeta.applyForm = { assistanceType: '', purpose: '', amount: '', description: '', preferredNgo: '', expectedDate: '', notes: '' };
  receiverModuleMeta.uploadedDocs = {};
}

/* --- Browse NGOs --- */
function renderReceiverBrowseNgos(container) {
  const filter = receiverModuleMeta.ngoFilter.toLowerCase();
  const cat = receiverModuleMeta.ngoCategory;
  const loc = receiverModuleMeta.ngoLocation;
  const ngos = (appState.ngos || []).filter(n => {
    const matchSearch = !filter || n.name.toLowerCase().includes(filter) || n.city.toLowerCase().includes(filter);
    const matchCat = cat === 'all' || n.categories.some(c => c.toLowerCase().includes(cat.toLowerCase()));
    const matchLoc = loc === 'all' || n.city === loc;
    return matchSearch && matchCat && matchLoc;
  });
  const cities = ['all', ...new Set((appState.ngos || []).map(n => n.city))];
  const categories = ['all', 'Medical', 'Food', 'Education', 'Elderly Care', 'Disaster Relief', 'Children'];

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <div class="receiver-page-header">
        <h1>Browse NGOs</h1>
        <p>Explore verified partner organizations before applying for assistance.</p>
      </div>
      <div class="receiver-ngo-filters">
        <div class="receiver-ngo-search">
          <span class="receiver-ngo-search-icon">${receiverIcon('search', 16)}</span>
          <input type="search" placeholder="Search NGOs…" value="${receiverModuleMeta.ngoFilter}" oninput="receiverFilterNgos(this.value)">
        </div>
        <select class="receiver-location-select" onchange="receiverFilterNgoLocation(this.value)">
          ${cities.map(c => `<option value="${c}" ${loc === c ? 'selected' : ''}>${c === 'all' ? 'All Locations' : c}</option>`).join('')}
        </select>
        <div class="receiver-filter-chips">
          ${categories.map(c => `<button type="button" class="receiver-filter-chip ${cat === c ? 'active' : ''}" onclick="receiverFilterNgoCategory('${c}')">${c === 'all' ? 'All' : c}</button>`).join('')}
        </div>
      </div>
      <div class="receiver-ngo-grid">
        ${ngos.length ? ngos.map(n => renderReceiverNgoCard(n)).join('') : `
          <div class="receiver-empty" style="grid-column:1/-1">
            <div class="receiver-empty-icon">🔍</div>
            <h3>No NGOs found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>`}
      </div>
    </div>`;
  refreshReceiverIcons();
}

function renderReceiverNgoCard(n) {
  const yearsActive = n.regNumber ? '15+' : '10+';
  return `
    <article class="receiver-ngo-card">
      <div class="receiver-ngo-card-top">
        <div class="receiver-ngo-logo">${n.logo}</div>
        <div class="receiver-ngo-meta">
          <h3>${n.name} ${n.verified ? '<span class="receiver-badge receiver-badge--registered" style="font-size:0.6rem">✓ Verified</span>' : ''}</h3>
          <p class="receiver-ngo-city">${receiverIcon('map-pin', 12)} ${n.city}</p>
        </div>
      </div>
      <div class="receiver-ngo-tags">${n.categories.map(c => `<span class="receiver-ngo-tag">${c}</span>`).join('')}</div>
      <p class="receiver-ngo-desc">${n.description}</p>
      <p class="receiver-ngo-contact">${receiverIcon('mail', 12)} ${n.contact.email}</p>
      <div class="receiver-ngo-stats">
        <div class="receiver-ngo-stat"><strong>${yearsActive} yrs</strong><span>Active</span></div>
        <div class="receiver-ngo-stat"><strong>${(n.peopleHelped / 1000).toFixed(1)}k</strong><span>Beneficiaries</span></div>
      </div>
      <button type="button" class="btn-secondary-blue" style="width:100%" onclick="viewReceiverNgoDetail('${n.id}')">View Details</button>
    </article>`;
}

function receiverFilterNgos(val) { receiverModuleMeta.ngoFilter = val; renderDashboardLayout(); }
function receiverFilterNgoCategory(cat) { receiverModuleMeta.ngoCategory = cat; renderDashboardLayout(); }
function receiverFilterNgoLocation(loc) { receiverModuleMeta.ngoLocation = loc; renderDashboardLayout(); }

function viewReceiverNgoDetail(ngoId) {
  receiverModuleMeta.selectedNgoId = ngoId;
  appState.currentTab = 'receiver-ngo-detail';
  renderDashboardLayout();
}

function renderReceiverNgoDetail(container) {
  const n = (appState.ngos || []).find(x => x.id === receiverModuleMeta.selectedNgoId);
  if (!n) { switchTab('receiver-browse-ngos'); return; }

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <button type="button" class="receiver-back-btn" onclick="switchTab('receiver-browse-ngos')">${receiverIcon('arrow-left', 16)} Back to NGOs</button>
      <div class="receiver-ngo-detail-hero">
        <div class="receiver-ngo-detail-banner"></div>
        <div class="receiver-ngo-detail-head">
          <div class="receiver-ngo-detail-logo">${n.logo}</div>
          <div>
            <h1 style="font-size:1.5rem;font-weight:800">${n.name}</h1>
            <p style="color:#6B7280;font-size:0.875rem">${receiverIcon('map-pin', 14)} ${n.location}</p>
            ${n.verified ? '<span class="receiver-badge receiver-badge--registered" style="margin-top:0.5rem">✓ Verified Partner</span>' : '<span style="color:#F59E0B;font-size:0.75rem">Pending Verification</span>'}
          </div>
        </div>
        <h3 style="font-weight:700;margin-bottom:0.5rem">Mission</h3>
        <p style="color:#374151;font-style:italic;margin-bottom:1rem">"${n.mission}"</p>
        <h3 style="font-weight:700;margin-bottom:0.5rem">About</h3>
        <p style="color:#6B7280;line-height:1.6;margin-bottom:1rem">${n.about}</p>
        <p style="font-size:0.875rem;color:#6B7280"><strong>Reg. No:</strong> ${n.regNumber}</p>
        <p style="font-size:0.875rem;color:#6B7280;margin-top:0.35rem"><strong>Contact:</strong> ${n.contact.email} · ${n.contact.phone}</p>
        <div class="receiver-stats-grid" style="margin:1.5rem 0">
          <div class="receiver-stat-card"><p class="receiver-stat-label">Families Helped</p><p class="receiver-stat-value">${n.impact.families.toLocaleString()}</p></div>
          <div class="receiver-stat-card"><p class="receiver-stat-label">Beneficiaries</p><p class="receiver-stat-value">${(n.peopleHelped/1000).toFixed(1)}k</p></div>
        </div>
        <h3 style="font-weight:700;margin-bottom:0.75rem">Programs Offered</h3>
        <div class="receiver-ngo-programs">${n.categories.map(c => `<span class="receiver-ngo-program">${c}</span>`).join('')}</div>
        <div class="receiver-eligibility-box">
          <strong>Eligibility:</strong> Open to verified receivers with supporting documents. Applications reviewed within 3–5 business days.
        </div>
        <button type="button" class="login-submit" style="margin-top:1.25rem" onclick="receiverApplyToNgo('${n.name.replace(/'/g, "\\'")}')">${receiverIcon('file-heart', 18)} Apply for Assistance</button>
      </div>
    </div>`;
  refreshReceiverIcons();
}

function receiverApplyToNgo(ngoName) {
  receiverModuleMeta.applyForm.preferredNgo = ngoName;
  receiverModuleMeta.applyStep = 2;
  switchTab('receiver-apply');
}

/* --- My Applications --- */
function renderReceiverApplications(container) {
  const apps = getReceiverApplications();

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <div class="receiver-page-header">
        <h1>My Applications</h1>
        <p>Track every application and see where it stands in the review process.</p>
      </div>
      ${apps.length ? apps.map(a => `
        <article class="receiver-app-card">
          <div class="receiver-app-card-inner">
            <div>
              <p class="receiver-app-id">${a.id}</p>
              <div class="receiver-app-info">
                <h3>${a.assistanceType}</h3>
                <p>${a.purpose} · Applied ${a.appliedDate}</p>
              </div>
            </div>
            <div style="text-align:right">
              <p class="receiver-app-amount">$${Number(a.amount).toLocaleString()}</p>
              <span class="receiver-status-badge receiver-status-badge--${getStatusBadgeClass(a.status)}">${a.status}</span>
            </div>
          </div>
          ${renderApplicationTimeline(a.timeline, a.status)}
          ${a.rejectionReason ? `<div class="receiver-rejection-box"><strong>Rejection reason:</strong> ${a.rejectionReason}</div>` : ''}
          <div style="padding:0 1.25rem 1rem">
            <button type="button" class="btn-outline btn-sm" onclick="viewReceiverApplication('${a.id}')">View Details</button>
            ${a.status === 'Draft' ? `<button type="button" class="btn-sm-card" style="margin-left:0.5rem" onclick="resumeReceiverDraft('${a.id}')">Continue</button>` : ''}
            ${a.status === 'Rejected' ? `<button type="button" class="btn-sm-card" style="margin-left:0.5rem" onclick="switchTab('receiver-apply')">Resubmit</button>` : ''}
          </div>
        </article>
      `).join('') : `
        <div class="receiver-empty">
          <div class="receiver-empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Apply for financial assistance when you're ready — we're here to help.</p>
          <button type="button" class="login-submit" onclick="switchTab('receiver-apply')">Apply for Assistance</button>
        </div>`}
    </div>`;
}

function viewReceiverApplication(appId) {
  receiverModuleMeta.selectedApplicationId = appId;
  appState.currentTab = 'receiver-application-detail';
  renderDashboardLayout();
}

function renderReceiverApplicationDetail(container) {
  const a = getReceiverApplications().find(x => x.id === receiverModuleMeta.selectedApplicationId);
  if (!a) { switchTab('receiver-applications'); return; }

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <button type="button" class="receiver-back-btn" onclick="switchTab('receiver-applications')">${receiverIcon('arrow-left', 16)} Back to Applications</button>
      <div class="receiver-form-card" style="max-width:100%">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
          <div>
            <p class="receiver-app-id">${a.id}</p>
            <h2 style="font-size:1.25rem;font-weight:800">${a.assistanceType}</h2>
            <span class="receiver-status-badge receiver-status-badge--${getStatusBadgeClass(a.status)}">${a.status}</span>
          </div>
          <p class="receiver-app-amount">$${Number(a.amount).toLocaleString()}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:0.875rem;margin-bottom:1.5rem">
          <p><strong>Purpose:</strong> ${a.purpose}</p>
          <p><strong>Applied:</strong> ${a.appliedDate}</p>
          <p><strong>Preferred NGO:</strong> ${a.preferredNgo || 'Any'}</p>
          <p><strong>Expected Date:</strong> ${a.expectedDate || '—'}</p>
        </div>
        <p style="font-size:0.875rem;color:#6B7280;margin-bottom:1rem"><strong>Description:</strong> ${a.description}</p>
        ${a.notes ? `<p style="font-size:0.875rem;color:#6B7280;margin-bottom:1rem"><strong>Notes:</strong> ${a.notes}</p>` : ''}
        <h3 style="font-weight:700;margin-bottom:0.75rem">Uploaded Documents</h3>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem">
          ${Object.keys(a.documents || {}).filter(k => a.documents[k]).map(d => `<span class="receiver-ngo-tag" style="background:#ECFDF5;color:#16A34A">${receiverIcon('check', 12)} ${d}</span>`).join('') || '<span style="color:#9CA3AF">No documents</span>'}
        </div>
        ${renderApplicationTimeline(a.timeline, a.status)}
        ${a.rejectionReason ? `<div class="receiver-rejection-box" style="margin-top:1rem"><strong>Rejection reason:</strong> ${a.rejectionReason}</div>` : ''}
      </div>
    </div>`;
  refreshReceiverIcons();
}

function resumeReceiverDraft(appId) {
  const a = getReceiverApplications().find(x => x.id === appId);
  if (!a) return;
  receiverModuleMeta.applyForm = {
    assistanceType: a.assistanceType,
    purpose: a.purpose,
    amount: String(a.amount),
    description: a.description,
    preferredNgo: a.preferredNgo,
    expectedDate: a.expectedDate,
    notes: a.notes
  };
  receiverModuleMeta.uploadedDocs = { ...a.documents };
  receiverModuleMeta.applyStep = 2;
  switchTab('receiver-apply');
}

/* --- Notifications --- */
function renderReceiverNotifications(container) {
  const groups = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' };
  const notifs = appState.receiverNotifications || [];

  let html = '<div class="receiver-page receiver-module"><div class="receiver-page-header"><h1>Notifications</h1><p>Updates about your applications and available programs.</p></div>';

  if (!notifs.length) {
    html += `<div class="receiver-empty"><div class="receiver-empty-icon">🔔</div><h3>No notifications</h3><p>You're all caught up!</p></div>`;
  } else {
    Object.keys(groups).forEach(key => {
      const items = notifs.filter(n => n.group === key);
      if (!items.length) return;
      html += `<div class="receiver-notif-group"><p class="receiver-notif-group-title">${groups[key]}</p>`;
      items.forEach(n => {
        html += `<div class="receiver-notif-item ${n.read ? '' : 'unread'}" onclick="markReceiverNotificationRead('${n.id}')">
          <div class="receiver-notif-icon">${receiverIcon(n.icon || 'bell', 20)}</div>
          <div class="receiver-notif-body"><strong>${n.title}</strong><p>${n.message}</p><p class="receiver-notif-time">${n.time}</p></div>
        </div>`;
      });
      html += '</div>';
    });
  }
  html += '</div>';
  container.innerHTML = html;
  refreshReceiverIcons();
}

function markReceiverNotificationRead(id) {
  const n = (appState.receiverNotifications || []).find(x => x.id === id);
  if (n) n.read = true;
  renderDashboardLayout();
}

/* --- Profile --- */
function renderReceiverProfile(container) {
  const user = appState.currentUser;
  const stats = getApplicationStats();
  const apps = getReceiverApplications().slice(0, 3);

  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <div class="receiver-profile-hero">
        <div class="receiver-profile-avatar">${getReceiverInitials(user.name)}</div>
        <div>
          <h1 style="font-size:1.35rem;font-weight:800;margin-bottom:0.35rem">${user.name}</h1>
          <p style="color:#6B7280;font-size:0.875rem;margin-bottom:0.5rem">${user.email} · ${user.mobile || ''}</p>
          <span class="receiver-badge receiver-badge--registered">${receiverIcon('user-check', 12)} ${user.status || 'Registered Receiver'}</span>
          <p style="font-size:0.75rem;color:#9CA3AF;margin-top:0.5rem">${user.city || ''}, ${user.state || ''} · Member since ${user.memberSince || '2026'}</p>
        </div>
      </div>
      <div class="receiver-stats-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="receiver-stat-card"><p class="receiver-stat-label">Submitted</p><p class="receiver-stat-value">${stats.total}</p></div>
        <div class="receiver-stat-card"><p class="receiver-stat-label">Approved</p><p class="receiver-stat-value">${stats.approved}</p></div>
        <div class="receiver-stat-card"><p class="receiver-stat-label">Under Review</p><p class="receiver-stat-value">${stats.review}</p></div>
      </div>
      <div class="receiver-section">
        <h2 class="receiver-section-title" style="margin-bottom:1rem">Recent Activity</h2>
        <div class="receiver-activity-list">
          ${apps.length ? apps.map(a => `
            <div class="receiver-activity-item">
              <div class="receiver-activity-icon">${receiverIcon('file-text', 18)}</div>
              <div class="receiver-activity-body"><strong>${a.assistanceType}</strong><span>${a.status} · ${a.appliedDate}</span></div>
            </div>
          `).join('') : '<p style="color:#9CA3AF;padding:1rem">No activity yet</p>'}
        </div>
      </div>
      <div class="receiver-form-card" style="margin-top:1.5rem">
        <h2>Edit Profile</h2>
        <div class="form-group"><label>Full Name</label><input type="text" id="rcv-profile-name" value="${user.name}"></div>
        <div class="form-group"><label>Mobile</label><input type="tel" id="rcv-profile-mobile" value="${user.mobile || ''}"></div>
        <div class="form-row">
          <div class="form-group"><label>City</label><input type="text" id="rcv-profile-city" value="${user.city || ''}"></div>
          <div class="form-group"><label>State</label><input type="text" id="rcv-profile-state" value="${user.state || ''}"></div>
        </div>
        <div class="form-group"><label>Address (Optional)</label><textarea id="rcv-profile-address" rows="2">${user.address || ''}</textarea></div>
        <button type="button" class="login-submit" onclick="saveReceiverProfile()">Save Changes</button>
        <button type="button" class="btn-outline" style="margin-left:0.5rem" onclick="showReceiverToast('Password reset link sent to your email.', 'info')">Change Password</button>
      </div>
    </div>`;
  refreshReceiverIcons();
}

function saveReceiverProfile() {
  const user = appState.currentUser;
  const name = document.getElementById('rcv-profile-name')?.value.trim();
  if (name) user.name = name;
  user.mobile = document.getElementById('rcv-profile-mobile')?.value.trim() || user.mobile;
  user.city = document.getElementById('rcv-profile-city')?.value.trim() || user.city;
  user.state = document.getElementById('rcv-profile-state')?.value.trim() || user.state;
  user.address = document.getElementById('rcv-profile-address')?.value.trim() || user.address;
  updateGlobalHeader();
  showReceiverToast('Profile updated successfully.', 'success');
}

/* --- Settings --- */
function renderReceiverSettings(container) {
  container.innerHTML = `
    <div class="receiver-page receiver-module">
      <div class="receiver-page-header"><h1>Settings</h1><p>Manage your preferences and notification settings.</p></div>
      <div class="receiver-settings-card">
        <h3>Notifications</h3>
        <div class="receiver-toggle-row"><span>Application status updates</span><input type="checkbox" checked></div>
        <div class="receiver-toggle-row"><span>Document requests</span><input type="checkbox" checked></div>
        <div class="receiver-toggle-row"><span>New NGO programs</span><input type="checkbox" checked></div>
        <div class="receiver-toggle-row"><span>SMS alerts</span><input type="checkbox"></div>
      </div>
      <div class="receiver-settings-card">
        <h3>Privacy</h3>
        <div class="receiver-toggle-row"><span>Share profile with assigned NGO</span><input type="checkbox" checked></div>
      </div>
      <div class="receiver-settings-card">
        <h3>Security</h3>
        <button type="button" class="btn-outline" onclick="showReceiverToast('Password reset link sent.', 'info')">Change Password</button>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', initReceiverModuleData);
