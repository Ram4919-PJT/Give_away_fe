/* ==========================================================================
   Donor Module — Modern Charity Portal (Give Away)
   Preserves appState.donations and existing submit flows
   ========================================================================== */

const DONOR_NAV_ITEMS = [
  { id: 'donor-dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'donor-donate-item', label: 'Donate Item', icon: 'package' },
  { id: 'donor-donate-money', label: 'Donate Money', icon: 'heart-handshake' },
  { id: 'donor-browse-ngos', label: 'Browse NGOs', icon: 'building-2' },
  { id: 'donor-my-donations', label: 'My Donations', icon: 'gift' },
  { id: 'donor-notifications', label: 'Notifications', icon: 'bell' },
  { id: 'donor-profile', label: 'Profile', icon: 'user' },
  { id: 'donor-settings', label: 'Settings', icon: 'settings' }
];

const donorModuleMeta = {
  itemDonateStep: 1,
  itemForm: { category: '', description: '', address: '', date: '', images: null },
  moneyForm: { amount: '', purpose: '', payment: 'upi' },
  ngoFilter: '',
  ngoCategory: 'all',
  selectedNgoId: null,
  regEmailVerified: false,
  regMobileVerified: false
};

function initDonorModuleData() {
  if (!appState.ngos) {
    appState.ngos = [
      {
        id: 'ngo-1', name: 'Asha Kiran Foundation', city: 'Mumbai',
        categories: ['Medical', 'Food', 'Shelter'], verified: true,
        description: 'Providing emergency relief, medical camps, and shelter support to underserved communities across Maharashtra.',
        peopleHelped: 12500, donationsReceived: 342, rating: 4.8, logo: '🏛',
        mission: 'To ensure no family goes without food, shelter, or medical care during crises.',
        about: 'Founded in 2010, Asha Kiran Foundation has served over 12,500 people through verified relief programs, community kitchens, and mobile health units.',
        gallery: ['🍲', '🏥', '👨‍👩‍👧'],
        location: 'Andheri East, Mumbai, Maharashtra',
        contact: { email: 'contact@ashakiran.org', phone: '+91 22 4000 1234' },
        regNumber: 'MH/NGO/2010/004521',
        impact: { families: 3200, meals: 85000, shelters: 12 }
      },
      {
        id: 'ngo-2', name: 'Helpage India', city: 'Delhi',
        categories: ['Elderly Care', 'Medical', 'Food'], verified: true,
        description: 'Dedicated to the welfare of elderly citizens through lunch programs, healthcare, and livelihood support.',
        peopleHelped: 45000, donationsReceived: 890, rating: 4.9, logo: '💚',
        mission: 'Championing the dignity and wellbeing of India\'s elderly population.',
        about: 'Helpage India operates nationwide programs for senior citizens including mobile medical units, cataract surgeries, and elder helplines.',
        gallery: ['👴', '🍽️', '💊'],
        location: 'C-14, Qutab Institutional Area, New Delhi',
        contact: { email: 'info@helpageindia.org', phone: '+91 11 4200 5000' },
        regNumber: 'DL/NGO/1978/001102',
        impact: { families: 18000, meals: 240000, shelters: 45 }
      },
      {
        id: 'ngo-3', name: 'Goonj Foundation', city: 'Delhi',
        categories: ['Clothes', 'Disaster Relief', 'Education'], verified: true,
        description: 'Transforming urban discard into rural development resource through dignified giving.',
        peopleHelped: 28000, donationsReceived: 567, rating: 4.7, logo: '🧥',
        mission: 'Making giving a joyful, dignified experience while addressing rural development needs.',
        about: 'Goonj channels donated materials to disaster-affected and remote communities with transparency and accountability.',
        gallery: ['📦', '🌾', '📚'],
        location: 'J-93, Sarita Vihar, New Delhi',
        contact: { email: 'mail@goonj.org', phone: '+91 11 4140 1212' },
        regNumber: 'DL/NGO/1999/002334',
        impact: { families: 9500, meals: 0, shelters: 28 }
      },
      {
        id: 'ngo-4', name: 'Akshaya Patra', city: 'Bengaluru',
        categories: ['Food', 'Education', 'Children'], verified: true,
        description: 'Mid-day meal program feeding millions of school children daily across India.',
        peopleHelped: 2000000, donationsReceived: 2100, rating: 4.9, logo: '🍛',
        mission: 'No child in India shall be deprived of education because of hunger.',
        about: 'Operating 65 kitchens across 14 states, Akshaya Patra serves nutritious meals to government school children.',
        gallery: ['🍲', '🏫', '👧'],
        location: 'HK Hill, Chord Road, Bengaluru',
        contact: { email: 'info@akshayapatra.org', phone: '+91 80 2347 1900' },
        regNumber: 'KA/NGO/2000/003891',
        impact: { families: 0, meals: 3000000, shelters: 0 }
      },
      {
        id: 'ngo-5', name: 'Smile Foundation', city: 'Gurugram',
        categories: ['Education', 'Healthcare', 'Livelihood'], verified: false,
        description: 'Empowering underprivileged children and youth through education and healthcare initiatives.',
        peopleHelped: 15000, donationsReceived: 198, rating: 4.5, logo: '😊',
        mission: 'To bring lasting positive change in the lives of underserved communities.',
        about: 'Smile Foundation runs education centers, mobile health clinics, and skill development programs in 25 states.',
        gallery: ['📖', '🏥', '💼'],
        location: 'Vardhman Corporate Plaza, Gurugram',
        contact: { email: 'info@smilefoundationindia.org', phone: '+91 124 400 4444' },
        regNumber: 'HR/NGO/2002/005678',
        impact: { families: 4200, meals: 120000, shelters: 8 }
      },
      {
        id: 'ngo-6', name: 'Uday Foundation', city: 'Mumbai',
        categories: ['Medical', 'Children', 'Disaster Relief'], verified: true,
        description: 'Supporting children with critical illnesses and families affected by disasters.',
        peopleHelped: 8200, donationsReceived: 276, rating: 4.6, logo: '🏥',
        mission: 'Providing hope and healing to children battling life-threatening diseases.',
        about: 'Uday Foundation runs pediatric care programs, disaster response teams, and winter clothing drives.',
        gallery: ['🧸', '❄️', '💉'],
        location: 'Bandra West, Mumbai',
        contact: { email: 'info@udayfoundation.org', phone: '+91 22 2640 1234' },
        regNumber: 'MH/NGO/2007/006789',
        impact: { families: 2100, meals: 45000, shelters: 5 }
      }
    ];
  }

  if (!appState.notifications) {
    appState.notifications = [
      { id: 'n-1', title: 'Donation received', message: 'Your $300 donation to Disaster Rehabilitation has been allocated.', time: '2 hours ago', group: 'today', read: false, icon: 'check-circle' },
      { id: 'n-2', title: 'Pickup scheduled', message: 'Pickup for winter jackets confirmed for July 12, 10 AM.', time: '5 hours ago', group: 'today', read: false, icon: 'truck' },
      { id: 'n-3', title: 'Impact update', message: 'Admin published fund usage for your $1,000 medical donation.', time: 'Yesterday', group: 'yesterday', read: true, icon: 'bar-chart-3' },
      { id: 'n-4', title: 'Welcome to Give Away', message: 'Thank you for joining Aja Abayahastham. Start making a difference today!', time: '2 days ago', group: 'earlier', read: true, icon: 'heart' },
      { id: 'n-5', title: 'NGO verified', message: 'Helpage India has been verified on our platform.', time: '3 days ago', group: 'earlier', read: true, icon: 'shield-check' }
    ];
  }
}

function donorLucide(name, size) {
  const s = size || 18;
  return `<i data-lucide="${name}" style="width:${s}px;height:${s}px"></i>`;
}

function refreshDonorIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showDonorToast(message, type) {
  const root = document.getElementById('donor-toast-root');
  if (!root) { alert(message); return; }
  const el = document.createElement('div');
  el.className = `donor-toast donor-toast--${type || 'info'}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, 2800);
  setTimeout(() => el.remove(), 3200);
}

function isDonorVerified() {
  return appState.currentUser && appState.currentUser.verified === true;
}

function getDonorVerificationStatus() {
  if (!appState.currentUser) return 'none';
  return appState.currentUser.verified || false;
}

function getDonorBadgeHtml() {
  const status = getDonorVerificationStatus();
  if (status === true) return '<span class="donor-badge donor-badge--verified">' + donorLucide('badge-check', 12) + ' Verified Donor</span>';
  if (status === 'pending') return '<span class="donor-badge donor-badge--pending">' + donorLucide('clock', 12) + ' Verification Pending</span>';
  if (status === 'rejected') return '<span class="donor-badge donor-badge--pending">' + donorLucide('x-circle', 12) + ' Verification Rejected</span>';
  return '<span class="donor-badge donor-badge--basic">' + donorLucide('user', 12) + ' Basic Donor</span>';
}

function getDonorInitials(name) {
  return (name || 'D').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getDonorStats() {
  const donations = getDonorDonations();
  const totalFinancial = donations.filter(d => d.type === 'Financial' && d.amount).reduce((s, d) => s + Number(d.amount), 0);
  const items = donations.filter(d => d.type === 'Items').length;
  const ngos = new Set();
  donations.forEach(d => {
    if (d.usage && d.usage.allocations) {
      d.usage.allocations.forEach(a => { if (a.recipient && a.recipient.includes('NGO')) ngos.add(a.recipient); });
    }
  });
  return { totalFinancial, count: donations.length, items, ngosSupported: ngos.size || 2, deployed: donations.filter(d => d.status === 'Fully Deployed').length };
}

function getDonationTimelineStatus(status) {
  const map = {
    'Pending Verification': { steps: ['Submitted', 'Verification', 'Pickup', 'Delivered'], active: 1 },
    'Pending Allocation': { steps: ['Received', 'Processing', 'Allocated', 'Deployed'], active: 1 },
    'Allocated': { steps: ['Received', 'Processing', 'Allocated', 'Deployed'], active: 2 },
    'Fully Deployed': { steps: ['Received', 'Processing', 'Allocated', 'Deployed'], active: 3 }
  };
  return map[status] || { steps: ['Submitted', 'In Progress', 'Complete'], active: 0 };
}

function renderDonationTimeline(status) {
  const t = getDonationTimelineStatus(status);
  const steps = t.steps.map((label, i) => {
    let cls = 'donor-timeline-step';
    if (i < t.active) cls += ' done';
    if (i === t.active) cls += ' active';
    return `<div class="${cls}"><div class="donor-timeline-dot"></div><span>${label}</span></div>`;
  }).join('');
  return `<div class="donor-timeline"><p class="donor-timeline-title">Tracking</p><div class="donor-timeline-steps">${steps}</div></div>`;
}

function getDonationStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('deployed')) return 'deployed';
  if (s.includes('allocated')) return 'allocated';
  if (s.includes('verification')) return 'verification';
  return 'pending';
}

function getDonationEmoji(don) {
  if (don.type === 'Financial') return '💰';
  const d = (don.details || '').toLowerCase();
  if (d.includes('wheelchair') || d.includes('medical')) return '🏥';
  if (d.includes('blanket') || d.includes('cloth')) return '🧥';
  if (d.includes('food')) return '🍲';
  return '📦';
}

/* --- Registration --- */
function sendDonorRegOtp(type) {
  showDonorToast(`OTP sent to your ${type}. Use any 6-digit code for demo.`, 'info');
}

function verifyDonorRegOtp(type) {
  const inputId = type === 'email' ? 'donor-email-otp' : 'donor-mobile-otp';
  const val = document.getElementById(inputId)?.value.trim();
  if (!/^\d{6}$/.test(val)) {
    showDonorToast('Please enter a valid 6-digit OTP.', 'error');
    return;
  }
  if (type === 'email') {
    donorModuleMeta.regEmailVerified = true;
    document.getElementById('donor-email-otp-block')?.classList.add('verified');
    document.getElementById('donor-email-otp-status').textContent = 'Verified ✓';
    document.getElementById('donor-email-otp-status').classList.add('is-verified');
  } else {
    donorModuleMeta.regMobileVerified = true;
    document.getElementById('donor-mobile-otp-block')?.classList.add('verified');
    document.getElementById('donor-mobile-otp-status').textContent = 'Verified ✓';
    document.getElementById('donor-mobile-otp-status').classList.add('is-verified');
  }
  showDonorToast(`${type === 'email' ? 'Email' : 'Mobile'} verified successfully!`, 'success');
}

function handleDonorRegistration(event) {
  if (event) event.preventDefault();

  const fullName = document.getElementById('donor-full-name')?.value.trim();
  const email = document.getElementById('donor-email')?.value.trim();
  const mobile = document.getElementById('donor-mobile')?.value.trim();
  const password = document.getElementById('donor-password')?.value;
  const confirmPassword = document.getElementById('donor-confirm-password')?.value;
  const termsAccepted = document.getElementById('donor-terms')?.checked;

  if (!fullName || !email || !mobile || !password) {
    showDonorToast('Please fill in all required fields.', 'error');
    return;
  }
  if (password.length < 8) {
    showDonorToast('Password must be at least 8 characters.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showDonorToast('Passwords do not match.', 'error');
    return;
  }
  if (!donorModuleMeta.regEmailVerified || !donorModuleMeta.regMobileVerified) {
    showDonorToast('Please verify both email and mobile OTP.', 'error');
    return;
  }
  if (!termsAccepted) {
    showDonorToast('Please accept the Terms & Conditions.', 'error');
    return;
  }

  appState.currentUser = {
    name: fullName,
    email: email,
    mobile: mobile,
    role: 'donor',
    verified: false,
    memberSince: new Date().toISOString().split('T')[0]
  };

  donorModuleMeta.regEmailVerified = false;
  donorModuleMeta.regMobileVerified = false;
  appState.selectedRegistrationRole = null;
  appState.currentTab = 'donor-dashboard';
  showDonorToast('Welcome! Your donor account has been created.', 'success');
  showView('dashboard');
}

/* --- Sidebar --- */
function renderDonorSidebar(container) {
  const unread = (appState.notifications || []).filter(n => !n.read).length;
  let html = DONOR_NAV_ITEMS.map(item => {
    const badge = item.id === 'donor-notifications' && unread > 0
      ? `<span style="margin-left:auto;background:#EF4444;color:#fff;font-size:0.65rem;padding:0.1rem 0.4rem;border-radius:999px">${unread}</span>` : '';
    return `<li class="sidebar-item ${appState.currentTab === item.id ? 'active' : ''}">
      <a href="#" onclick="switchTab('${item.id}'); return false;">
        <span class="sidebar-icon">${donorLucide(item.icon)}</span>
        ${item.label}${badge}
      </a>
    </li>`;
  }).join('');
  html += `<li class="sidebar-item donor-sidebar-logout">
    <a href="#" onclick="handleLogout(); return false;">
      <span class="sidebar-icon">${donorLucide('log-out')}</span>
      Logout
    </a>
  </li>`;
  container.innerHTML = html;
  refreshDonorIcons();
}

function wireDonorDashboardChrome() {
  const layout = document.querySelector('.dashboard-layout');
  if (layout) layout.classList.add('dashboard-layout--donor');
  const notifyBtn = document.getElementById('dashboard-notify-btn');
  if (notifyBtn && appState.currentUser?.role === 'donor') {
    notifyBtn.onclick = () => switchTab('donor-notifications');
    const unread = (appState.notifications || []).filter(n => !n.read).length;
    let dot = notifyBtn.querySelector('.donor-notify-dot');
    if (unread > 0) {
      if (!dot) {
        dot = document.createElement('span');
        dot.className = 'donor-notify-dot';
        dot.style.cssText = 'position:absolute;top:6px;right:6px;width:8px;height:8px;background:#EF4444;border-radius:50%;border:2px solid #fff';
        notifyBtn.style.position = 'relative';
        notifyBtn.appendChild(dot);
      }
    } else if (dot) dot.remove();
  }
}

/* --- Tab router --- */
function renderDonorTabContent(container, tab) {
  wireDonorDashboardChrome();
  const views = {
    'donor-dashboard': renderDonorDashboardHome,
    'donor-donate-item': renderDonorDonateItemView,
    'donor-donate-money': renderDonorDonateMoneyView,
    'donor-browse-ngos': renderDonorBrowseNgos,
    'donor-ngo-detail': renderDonorNgoDetail,
    'donor-my-donations': renderDonorMyDonations,
    'donor-notifications': renderDonorNotifications,
    'donor-profile': renderDonorProfile,
    'donor-settings': renderDonorSettings,
    'donor-verify': renderDonorVerifyAccount,
    'donor-donate': renderDonorDonateMoneyView,
    'donor-history': renderDonorMyDonations
  };
  const fn = views[tab] || renderDonorDashboardHome;
  fn(container);
  refreshDonorIcons();
}

/* --- Dashboard Home --- */
function renderDonorDashboardHome(container) {
  const user = appState.currentUser;
  const stats = getDonorStats();
  const donations = getDonorDonations().slice(0, 3);
  const showVerifyCta = getDonorVerificationStatus() !== true && getDonorVerificationStatus() !== 'pending';

  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-hero-banner">
        <div>
          <div class="donor-welcome-row">
            <h1>Thank you for making a difference.</h1>
            ${getDonorBadgeHtml()}
          </div>
          <p>Welcome back, <strong>${user.name}</strong>. Every donation creates hope for someone in need.</p>
        </div>
        <div class="donor-hero-illus" aria-hidden="true">🤝</div>
      </div>

      ${showVerifyCta ? `
        <div class="donor-verify-cta">
          <div>
            <h3>Become a Verified Donor</h3>
            <p>Increase trust in your donations and unlock faster approvals.</p>
            <ul><li>Receive a Verified Badge</li><li>Get faster approvals</li><li>Build community trust</li></ul>
          </div>
          <button type="button" class="btn-verify-cta" onclick="switchTab('donor-verify')">Verify My Account</button>
        </div>
      ` : getDonorVerificationStatus() === 'pending' ? `
        <div class="donor-verify-status-card donor-verify-status-card--pending">
          ${donorLucide('clock', 24)}
          <div><strong>Verification in progress</strong><p style="font-size:0.875rem;margin-top:0.25rem">Our team is reviewing your documents. This usually takes 1–2 business days.</p></div>
        </div>
      ` : ''}

      <div class="donor-stats-grid">
        <article class="donor-stat-card">
          <div class="donor-stat-icon donor-stat-icon--green">${donorLucide('indian-rupee', 20)}</div>
          <p class="donor-stat-label">Total Donated</p>
          <p class="donor-stat-value">${stats.totalFinancial ? '$' + stats.totalFinancial.toLocaleString() : '$0'}</p>
        </article>
        <article class="donor-stat-card">
          <div class="donor-stat-icon donor-stat-icon--blue">${donorLucide('gift', 20)}</div>
          <p class="donor-stat-label">Donations Made</p>
          <p class="donor-stat-value">${stats.count}</p>
        </article>
        <article class="donor-stat-card">
          <div class="donor-stat-icon donor-stat-icon--orange">${donorLucide('package', 20)}</div>
          <p class="donor-stat-label">Items Donated</p>
          <p class="donor-stat-value">${stats.items}</p>
        </article>
        <article class="donor-stat-card">
          <div class="donor-stat-icon donor-stat-icon--purple">${donorLucide('building-2', 20)}</div>
          <p class="donor-stat-label">NGOs Supported</p>
          <p class="donor-stat-value">${stats.ngosSupported}</p>
        </article>
      </div>

      <div class="donor-section">
        <div class="donor-section-head">
          <h2 class="donor-section-title">Quick Actions</h2>
        </div>
        <div class="donor-quick-actions">
          <button type="button" class="donor-quick-btn" onclick="switchTab('donor-donate-money')">
            <span class="donor-quick-btn-icon">${donorLucide('heart-handshake', 22)}</span>
            Donate Money
          </button>
          <button type="button" class="donor-quick-btn" onclick="switchTab('donor-donate-item')">
            <span class="donor-quick-btn-icon">${donorLucide('package', 22)}</span>
            Donate Item
          </button>
          <button type="button" class="donor-quick-btn" onclick="switchTab('donor-browse-ngos')">
            <span class="donor-quick-btn-icon">${donorLucide('building-2', 22)}</span>
            Browse NGOs
          </button>
          <button type="button" class="donor-quick-btn" onclick="switchTab('donor-my-donations')">
            <span class="donor-quick-btn-icon">${donorLucide('bar-chart-3', 22)}</span>
            My Impact
          </button>
        </div>
      </div>

      <div class="donor-grid-2">
        <div class="donor-section">
          <div class="donor-section-head">
            <h2 class="donor-section-title">Recent Activity</h2>
            <button type="button" class="donor-section-link" onclick="switchTab('donor-my-donations')">View all</button>
          </div>
          <div class="donor-activity-list">
            ${donations.length ? donations.map(d => `
              <div class="donor-activity-item">
                <div class="donor-activity-icon">${getDonationEmoji(d)}</div>
                <div class="donor-activity-body">
                  <strong>${d.type === 'Financial' ? '$' + d.amount + ' — ' + d.fund : d.details}</strong>
                  <span>${d.date} · ${d.status}</span>
                </div>
              </div>
            `).join('') : '<div class="donor-empty" style="border:none;padding:2rem"><p>No donations yet</p></div>'}
          </div>
        </div>
        <div class="donor-section">
          <div class="donor-section-head">
            <h2 class="donor-section-title">Upcoming Pickups</h2>
          </div>
          <div class="donor-pickup-list">
            <div class="donor-pickup-item">
              <div class="donor-activity-icon">${donorLucide('truck', 20)}</div>
              <div class="donor-activity-body">
                <strong>Winter Jackets (5)</strong>
                <span>Jul 12, 2026 · 10:00 AM · Mumbai</span>
              </div>
            </div>
            <div class="donor-pickup-item">
              <div class="donor-activity-icon">${donorLucide('calendar', 20)}</div>
              <div class="donor-activity-body">
                <strong>First Aid Kits</strong>
                <span>Jul 15, 2026 · 2:00 PM · Self drop-off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* --- Donate Item (multi-step) --- */
function renderDonorDonateItemView(container) {
  const step = donorModuleMeta.itemDonateStep;
  const f = donorModuleMeta.itemForm;

  const stepper = [1, 2, 3, 4].map(s => {
    const labels = ['Category', 'Details', 'Pickup', 'Review'];
    let cls = 'donor-step';
    if (s === step) cls += ' active';
    if (s < step) cls += ' done';
    return `<div class="${cls}"><div class="donor-step-num">${s < step ? '✓' : s}</div><span class="donor-step-label">${labels[s - 1]}</span></div>${s < 4 ? '<div class="donor-step-line"></div>' : ''}`;
  }).join('');

  let stepContent = '';
  if (step === 1) {
    const cats = [
      { id: 'Medical Equipment', icon: '🏥', label: 'Medical' },
      { id: 'Medical Supplies', icon: '💊', label: 'Supplies' },
      { id: 'Shelter/Clothing', icon: '🧥', label: 'Clothing' },
      { id: 'Food & Rations', icon: '🍲', label: 'Food' },
      { id: 'Electronics', icon: '💻', label: 'Electronics' },
      { id: 'Furniture', icon: '🪑', label: 'Furniture' }
    ];
    stepContent = `
      <h2>Select category</h2><p>What type of items are you donating?</p>
      <div class="donor-category-grid">
        ${cats.map(c => `<button type="button" class="donor-category-opt ${f.category === c.id ? 'selected' : ''}" onclick="donorSelectItemCategory('${c.id}')"><span>${c.icon}</span><strong>${c.label}</strong></button>`).join('')}
      </div>`;
  } else if (step === 2) {
    stepContent = `
      <h2>Item details</h2><p>Describe what you're donating and upload photos.</p>
      <div class="form-group"><label>Description</label>
        <textarea id="donor-item-desc" rows="4" placeholder="e.g. 5 winter jackets, good condition">${f.description}</textarea>
      </div>
      <label class="donor-upload-zone">
        <input type="file" id="donor-item-images" accept="image/*" multiple onchange="donorItemImagesSelected(this)">
        ${donorLucide('image-plus', 32)}<p style="margin-top:0.5rem;font-weight:600">Upload photos</p>
        <p style="font-size:0.75rem;color:#9CA3AF">JPG, PNG · Max 5 MB each</p>
      </label>`;
  } else if (step === 3) {
    stepContent = `
      <h2>Pickup details</h2><p>Where and when should we collect the items?</p>
      <div class="form-group"><label>Pickup Address</label>
        <textarea id="donor-item-address" rows="2" placeholder="Full address with landmark">${f.address}</textarea>
      </div>
      <div class="form-group"><label>Pickup Date</label>
        <input type="date" id="donor-item-date" value="${f.date}">
      </div>
      <div class="form-group"><label>Delivery Mode</label>
        <select id="donor-item-delivery">
          <option>Schedule Pickup Request</option>
          <option>Self Drop-off at Abhayahastam Warehouse</option>
        </select>
      </div>`;
  } else {
    stepContent = `
      <h2>Review & submit</h2><p>Please confirm your donation details.</p>
      <div style="background:#F8FAFC;border-radius:12px;padding:1.25rem;font-size:0.875rem;line-height:1.8">
        <p><strong>Category:</strong> ${f.category || '—'}</p>
        <p><strong>Description:</strong> ${f.description || '—'}</p>
        <p><strong>Address:</strong> ${f.address || '—'}</p>
        <p><strong>Date:</strong> ${f.date || '—'}</p>
      </div>`;
  }

  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-page-header">
        <h1>Donate Items</h1>
        <p>Give physical goods to verified NGOs and communities in need.</p>
      </div>
      <div class="donor-stepper">${stepper}</div>
      <div class="donor-form-card">
        ${stepContent}
        <div class="donor-form-actions">
          <button type="button" class="btn-outline" onclick="donorItemStepBack()" ${step === 1 ? 'disabled style="opacity:0.4"' : ''}>Back</button>
          ${step < 4
            ? `<button type="button" class="login-submit" onclick="donorItemStepNext()">Continue</button>`
            : `<button type="button" class="login-submit" onclick="submitDonorItemDonation()">Submit Donation</button>`}
        </div>
      </div>
    </div>`;
}

function donorSelectItemCategory(cat) {
  donorModuleMeta.itemForm.category = cat;
  renderDashboardLayout();
}

function donorItemImagesSelected(input) {
  if (input.files.length) donorModuleMeta.itemForm.images = input.files.length + ' file(s)';
}

function donorItemStepNext() {
  const f = donorModuleMeta.itemForm;
  if (donorModuleMeta.itemDonateStep === 1 && !f.category) {
    showDonorToast('Please select a category.', 'error'); return;
  }
  if (donorModuleMeta.itemDonateStep === 2) {
    f.description = document.getElementById('donor-item-desc')?.value.trim();
    if (!f.description) { showDonorToast('Please describe your items.', 'error'); return; }
  }
  if (donorModuleMeta.itemDonateStep === 3) {
    f.address = document.getElementById('donor-item-address')?.value.trim();
    f.date = document.getElementById('donor-item-date')?.value;
    if (!f.address || !f.date) { showDonorToast('Please enter pickup address and date.', 'error'); return; }
  }
  donorModuleMeta.itemDonateStep++;
  renderDashboardLayout();
}

function donorItemStepBack() {
  if (donorModuleMeta.itemDonateStep > 1) {
    donorModuleMeta.itemDonateStep--;
    renderDashboardLayout();
  }
}

function submitDonorItemDonation() {
  const f = donorModuleMeta.itemForm;
  const delivery = document.getElementById('donor-item-delivery')?.value || 'Schedule Pickup';
  const details = `${f.description} · Pickup: ${f.address} on ${f.date} (${delivery})`;

  appState.donations.unshift({
    id: 'don-' + (Date.now()),
    donor: appState.currentUser.name,
    donorEmail: appState.currentUser.email,
    type: 'Items',
    amount: null,
    fund: f.category,
    details: `[${f.category}] ${details}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending Verification',
    usage: null
  });

  donorModuleMeta.itemDonateStep = 1;
  donorModuleMeta.itemForm = { category: '', description: '', address: '', date: '', images: null };
  showDonorToast('Item donation submitted! Pickup will be scheduled shortly.', 'success');
  appState.currentTab = 'donor-my-donations';
  renderDashboardLayout();
}

/* --- Donate Money --- */
function renderDonorDonateMoneyView(container) {
  const amounts = [500, 1000, 2500, 5000];
  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-page-header">
        <h1>Donate Money</h1>
        <p>Your financial contribution directly supports verified relief programs.</p>
      </div>
      <div class="donor-form-card" style="max-width:520px">
        <h2>Choose amount</h2>
        <p>Select a quick amount or enter your own.</p>
        <div class="donor-amount-grid">
          ${amounts.map(a => `<button type="button" class="donor-amount-btn" onclick="donorSelectAmount(${a})">$${a.toLocaleString()}</button>`).join('')}
        </div>
        <div class="form-group">
          <label>Custom Amount (USD)</label>
          <input type="number" id="donor-amount" placeholder="Enter amount" min="1">
        </div>
        <div class="form-group">
          <label>Purpose</label>
          <select id="donor-fund-designation">
            <option value="General Charity Relief">General Charity Relief</option>
            <option value="Medical Financial Assistance Fund">Medical Financial Assistance</option>
            <option value="Disaster Rehabilitation">Disaster Rehabilitation</option>
            <option value="Education Support Fund">Education Support Fund</option>
          </select>
        </div>
        <h2 style="margin-top:1.5rem">Payment method</h2>
        <div class="donor-payment-methods">
          <button type="button" class="donor-payment-opt selected" onclick="donorSelectPayment(this,'upi')">UPI</button>
          <button type="button" class="donor-payment-opt" onclick="donorSelectPayment(this,'card')">Card</button>
          <button type="button" class="donor-payment-opt" onclick="donorSelectPayment(this,'netbanking')">Net Banking</button>
        </div>
        <button type="button" class="login-submit" style="width:100%;margin-top:0.5rem" onclick="submitDonorMoneyDonation()">
          ${donorLucide('heart', 18)} Donate Now
        </button>
      </div>
    </div>`;
  refreshDonorIcons();
}

function donorSelectAmount(amt) {
  document.querySelectorAll('.donor-amount-btn').forEach(b => b.classList.remove('selected'));
  if (typeof event !== 'undefined' && event.target) event.target.classList.add('selected');
  const input = document.getElementById('donor-amount');
  if (input) input.value = amt;
}

function donorSelectPayment(el, method) {
  document.querySelectorAll('.donor-payment-opt').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  donorModuleMeta.moneyForm.payment = method;
}

function submitDonorMoneyDonation() {
  const amount = document.getElementById('donor-amount')?.value;
  const designation = document.getElementById('donor-fund-designation')?.value;
  if (!amount || parseFloat(amount) <= 0) {
    showDonorToast('Please enter a valid donation amount.', 'error');
    return;
  }
  appState.donations.unshift({
    id: 'don-' + Date.now(),
    donor: appState.currentUser.name,
    donorEmail: appState.currentUser.email,
    type: 'Financial',
    amount: parseFloat(amount),
    fund: designation,
    details: `$${amount} donation towards ${designation}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending Allocation',
    usage: null
  });
  showDonorToast(`Thank you! Your $${amount} donation has been received.`, 'success');
  appState.currentTab = 'donor-my-donations';
  renderDashboardLayout();
}

/* --- Browse NGOs --- */
function renderDonorBrowseNgos(container) {
  const filter = donorModuleMeta.ngoFilter.toLowerCase();
  const cat = donorModuleMeta.ngoCategory;
  const ngos = appState.ngos.filter(n => {
    const matchSearch = !filter || n.name.toLowerCase().includes(filter) || n.city.toLowerCase().includes(filter);
    const matchCat = cat === 'all' || n.categories.some(c => c.toLowerCase().includes(cat.toLowerCase()));
    return matchSearch && matchCat;
  });

  const categories = ['all', 'Medical', 'Food', 'Shelter', 'Education', 'Elderly Care'];

  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-page-header">
        <h1>Browse NGOs</h1>
        <p>Discover verified partner organizations making real impact in communities.</p>
      </div>
      <div class="donor-ngo-filters">
        <div class="donor-ngo-search">
          <span class="donor-ngo-search-icon">${donorLucide('search', 16)}</span>
          <input type="search" placeholder="Search NGOs by name or city…" value="${donorModuleMeta.ngoFilter}" oninput="donorFilterNgos(this.value)">
        </div>
        <div class="donor-filter-chips">
          ${categories.map(c => `<button type="button" class="donor-filter-chip ${cat === c ? 'active' : ''}" onclick="donorFilterNgoCategory('${c}')">${c === 'all' ? 'All' : c}</button>`).join('')}
        </div>
      </div>
      <div class="donor-ngo-grid">
        ${ngos.length ? ngos.map(n => renderNgoCard(n)).join('') : '<div class="donor-empty" style="grid-column:1/-1"><div class="donor-empty-icon">🔍</div><h3>No NGOs found</h3><p>Try adjusting your search or filters.</p></div>'}
      </div>
    </div>`;
  refreshDonorIcons();
}

function renderNgoCard(n) {
  return `
    <article class="donor-ngo-card">
      <div class="donor-ngo-card-top">
        <div class="donor-ngo-logo">${n.logo}</div>
        <div class="donor-ngo-meta">
          <h3>${n.name} ${n.verified ? '<span class="donor-badge donor-badge--verified" style="font-size:0.6rem;vertical-align:middle">✓ Verified</span>' : ''}</h3>
          <p class="donor-ngo-city">${donorLucide('map-pin', 12)} ${n.city}</p>
        </div>
      </div>
      <div class="donor-ngo-tags">${n.categories.map(c => `<span class="donor-ngo-tag">${c}</span>`).join('')}</div>
      <p class="donor-ngo-desc">${n.description}</p>
      <div class="donor-ngo-rating">${'★'.repeat(Math.floor(n.rating))} ${n.rating}</div>
      <div class="donor-ngo-stats">
        <div class="donor-ngo-stat"><strong>${(n.peopleHelped / 1000).toFixed(1)}k</strong><span>Helped</span></div>
        <div class="donor-ngo-stat"><strong>${n.donationsReceived}</strong><span>Donations</span></div>
        <div class="donor-ngo-stat"><strong>${n.categories.length}</strong><span>Programs</span></div>
      </div>
      <button type="button" class="btn-secondary-blue" style="width:100%" onclick="viewDonorNgoDetail('${n.id}')">View Details</button>
    </article>`;
}

function donorFilterNgos(val) {
  donorModuleMeta.ngoFilter = val;
  renderDashboardLayout();
}

function donorFilterNgoCategory(cat) {
  donorModuleMeta.ngoCategory = cat;
  renderDashboardLayout();
}

function viewDonorNgoDetail(ngoId) {
  donorModuleMeta.selectedNgoId = ngoId;
  appState.currentTab = 'donor-ngo-detail';
  renderDashboardLayout();
}

function renderDonorNgoDetail(container) {
  const n = appState.ngos.find(x => x.id === donorModuleMeta.selectedNgoId);
  if (!n) { switchTab('donor-browse-ngos'); return; }

  container.innerHTML = `
    <div class="donor-page donor-module">
      <button type="button" class="donor-back-btn" onclick="switchTab('donor-browse-ngos')">${donorLucide('arrow-left', 16)} Back to NGOs</button>
      <div class="donor-ngo-detail-hero">
        <div class="donor-ngo-detail-head">
          <div class="donor-ngo-detail-logo">${n.logo}</div>
          <div>
            <h1 style="font-size:1.5rem;font-weight:800;margin-bottom:0.35rem">${n.name}</h1>
            <p class="donor-ngo-city">${donorLucide('map-pin', 14)} ${n.location}</p>
            ${n.verified ? '<span class="donor-badge donor-badge--verified" style="margin-top:0.5rem">' + donorLucide('shield-check', 12) + ' Verified Partner</span>' : ''}
            <div class="donor-ngo-rating" style="margin-top:0.5rem">${'★'.repeat(Math.floor(n.rating))} ${n.rating} rating</div>
          </div>
        </div>
        <p style="color:#6B7280;line-height:1.6;margin-bottom:1rem">${n.about}</p>
        <h3 style="font-weight:700;margin-bottom:0.5rem">Mission</h3>
        <p style="color:#374151;font-style:italic">"${n.mission}"</p>
        <div class="donor-ngo-impact-grid">
          <div class="donor-stat-card"><p class="donor-stat-label">Families Helped</p><p class="donor-stat-value">${n.impact.families.toLocaleString()}</p></div>
          <div class="donor-stat-card"><p class="donor-stat-label">Meals Served</p><p class="donor-stat-value">${n.impact.meals ? (n.impact.meals / 1000).toFixed(0) + 'k' : '—'}</p></div>
          <div class="donor-stat-card"><p class="donor-stat-label">Shelters</p><p class="donor-stat-value">${n.impact.shelters || '—'}</p></div>
          <div class="donor-stat-card"><p class="donor-stat-label">People Helped</p><p class="donor-stat-value">${(n.peopleHelped / 1000).toFixed(1)}k</p></div>
        </div>
        <h3 style="font-weight:700;margin-bottom:0.75rem">Gallery</h3>
        <div class="donor-ngo-gallery">${n.gallery.map(g => `<div class="donor-ngo-gallery-item">${g}</div>`).join('')}</div>
        <div style="margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid #E5E7EB">
          <p style="font-size:0.875rem;color:#6B7280"><strong>Registration:</strong> ${n.regNumber}</p>
          <p style="font-size:0.875rem;color:#6B7280;margin-top:0.35rem"><strong>Contact:</strong> ${n.contact.email} · ${n.contact.phone}</p>
        </div>
        <button type="button" class="login-submit" style="margin-top:1.25rem" onclick="switchTab('donor-donate-money')">${donorLucide('heart-handshake', 18)} Donate to ${n.name}</button>
      </div>
    </div>`;
  refreshDonorIcons();
}

/* --- My Donations --- */
function renderDonorMyDonations(container) {
  const donations = getDonorDonations();

  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-page-header">
        <h1>My Donations</h1>
        <p>Track every contribution and see how your generosity creates impact.</p>
      </div>
      ${donations.length ? `<div style="display:flex;flex-direction:column;gap:1rem">
        ${donations.map(d => `
          <article class="donor-donation-card">
            <div class="donor-donation-card-inner">
              <div class="donor-donation-thumb">${getDonationEmoji(d)}</div>
              <div class="donor-donation-info">
                <h3>${d.type === 'Financial' ? '$' + Number(d.amount).toLocaleString() + ' — ' + d.fund : d.details}</h3>
                <p>${d.type} · ${d.date}</p>
              </div>
              <span class="donor-status-badge donor-status-badge--${getDonationStatusClass(d.status)}">${d.status}</span>
            </div>
            ${renderDonationTimeline(d.status)}
            ${d.usage ? `<div style="padding:0 1.25rem 1rem;font-size:0.8125rem;color:#6B7280">${d.usage.summary}</div>` : ''}
          </article>
        `).join('')}
      </div>` : `
        <div class="donor-empty">
          <div class="donor-empty-icon">💝</div>
          <h3>No donations yet</h3>
          <p>Start making a difference — every gift creates hope.</p>
          <button type="button" class="login-submit" onclick="switchTab('donor-donate-money')">Make your first donation</button>
        </div>`}
    </div>`;
}

/* --- Notifications --- */
function renderDonorNotifications(container) {
  const groups = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' };
  const notifs = appState.notifications || [];

  let html = '<div class="donor-page donor-module"><div class="donor-page-header"><h1>Notifications</h1><p>Stay updated on your donations and platform activity.</p></div>';

  Object.keys(groups).forEach(key => {
    const items = notifs.filter(n => n.group === key);
    if (!items.length) return;
    html += `<div class="donor-notif-group"><p class="donor-notif-group-title">${groups[key]}</p>`;
    items.forEach(n => {
      html += `<div class="donor-notif-item ${n.read ? '' : 'unread'}" onclick="markDonorNotificationRead('${n.id}')">
        <div class="donor-notif-icon">${donorLucide(n.icon || 'bell', 20)}</div>
        <div class="donor-notif-body"><strong>${n.title}</strong><p>${n.message}</p><p class="donor-notif-time">${n.time}</p></div>
      </div>`;
    });
    html += '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
  refreshDonorIcons();
}

function markDonorNotificationRead(id) {
  const n = appState.notifications.find(x => x.id === id);
  if (n) n.read = true;
  renderDashboardLayout();
}

/* --- Profile --- */
function renderDonorProfile(container) {
  const user = appState.currentUser;
  const stats = getDonorStats();

  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-profile-hero">
        <div class="donor-profile-avatar">${getDonorInitials(user.name)}</div>
        <div>
          <h1 style="font-size:1.35rem;font-weight:800;margin-bottom:0.35rem">${user.name}</h1>
          <p style="color:#6B7280;font-size:0.875rem;margin-bottom:0.5rem">${user.email} · ${user.mobile || ''}</p>
          ${getDonorBadgeHtml()}
          <p style="font-size:0.75rem;color:#9CA3AF;margin-top:0.5rem">Member since ${user.memberSince || '2026'}</p>
        </div>
      </div>
      <div class="donor-profile-stats">
        <div class="donor-stat-card"><p class="donor-stat-label">Total Donated</p><p class="donor-stat-value">${stats.totalFinancial ? '$' + stats.totalFinancial.toLocaleString() : '$0'}</p></div>
        <div class="donor-stat-card"><p class="donor-stat-label">Donations</p><p class="donor-stat-value">${stats.count}</p></div>
        <div class="donor-stat-card"><p class="donor-stat-label">Fully Deployed</p><p class="donor-stat-value">${stats.deployed}</p></div>
      </div>
      <div class="donor-form-card">
        <h2>Edit Profile</h2>
        <div class="form-group"><label>Full Name</label><input type="text" id="profile-name" value="${user.name}"></div>
        <div class="form-group"><label>Email</label><input type="email" id="profile-email" value="${user.email}" readonly style="opacity:0.7"></div>
        <div class="form-group"><label>Mobile</label><input type="tel" id="profile-mobile" value="${user.mobile || ''}"></div>
        <button type="button" class="login-submit" onclick="saveDonorProfile()">Save Changes</button>
      </div>
      ${getDonorVerificationStatus() !== true ? `
        <div class="donor-verify-cta" style="margin-top:1.5rem">
          <div><h3>Get Verified</h3><p>Build trust with NGOs and receivers by verifying your identity.</p></div>
          <button type="button" class="btn-verify-cta" onclick="switchTab('donor-verify')">Verify My Account</button>
        </div>` : ''}
    </div>`;
  refreshDonorIcons();
}

function saveDonorProfile() {
  const name = document.getElementById('profile-name')?.value.trim();
  const mobile = document.getElementById('profile-mobile')?.value.trim();
  if (name) appState.currentUser.name = name;
  if (mobile) appState.currentUser.mobile = mobile;
  updateGlobalHeader();
  showDonorToast('Profile updated successfully.', 'success');
}

/* --- Settings --- */
function renderDonorSettings(container) {
  container.innerHTML = `
    <div class="donor-page donor-module">
      <div class="donor-page-header"><h1>Settings</h1><p>Manage your preferences and account security.</p></div>
      <div class="donor-settings-card">
        <h3>Notifications</h3>
        <div class="donor-toggle-row"><span>Email notifications</span><input type="checkbox" checked></div>
        <div class="donor-toggle-row"><span>SMS alerts for pickups</span><input type="checkbox" checked></div>
        <div class="donor-toggle-row"><span>Donation impact updates</span><input type="checkbox" checked></div>
      </div>
      <div class="donor-settings-card">
        <h3>Privacy</h3>
        <div class="donor-toggle-row"><span>Show name on public donor wall</span><input type="checkbox"></div>
        <div class="donor-toggle-row"><span>Anonymous donations by default</span><input type="checkbox"></div>
      </div>
      <div class="donor-settings-card">
        <h3>Security</h3>
        <button type="button" class="btn-outline" onclick="showDonorToast('Password reset link sent to your email.', 'info')">Change Password</button>
      </div>
    </div>`;
}

/* --- Verify Account --- */
function renderDonorVerifyAccount(container) {
  const status = getDonorVerificationStatus();

  if (status === true) {
    container.innerHTML = `
      <div class="donor-page donor-module donor-verify-page">
        <div class="donor-verify-status-card donor-verify-status-card--verified">
          ${donorLucide('badge-check', 28)}
          <div><strong>You're a Verified Donor!</strong><p style="font-size:0.875rem;margin-top:0.25rem">Your identity has been confirmed. Thank you for building trust in our community.</p></div>
        </div>
      </div>`;
    refreshDonorIcons();
    return;
  }

  if (status === 'pending') {
    container.innerHTML = `
      <div class="donor-page donor-module donor-verify-page">
        <div class="donor-verify-status-card donor-verify-status-card--pending">
          ${donorLucide('clock', 28)}
          <div><strong>Verification Pending</strong><p style="font-size:0.875rem;margin-top:0.25rem">Our admin team is reviewing your documents. You'll be notified once approved.</p></div>
        </div>
      </div>`;
    refreshDonorIcons();
    return;
  }

  if (status === 'rejected') {
    container.innerHTML = `
      <div class="donor-page donor-module donor-verify-page">
        <div class="donor-verify-status-card donor-verify-status-card--rejected">
          ${donorLucide('x-circle', 28)}
          <div><strong>Verification Rejected</strong><p style="font-size:0.875rem;margin-top:0.25rem">Please re-upload clear documents and try again.</p></div>
        </div>
        <button type="button" class="login-submit" onclick="appState.currentUser.verified=false;switchTab('donor-verify')">Try Again</button>
      </div>`;
    refreshDonorIcons();
    return;
  }

  container.innerHTML = `
    <div class="donor-page donor-module donor-verify-page">
      <button type="button" class="donor-back-btn" onclick="switchTab('donor-dashboard')">${donorLucide('arrow-left', 16)} Back to Dashboard</button>
      <div class="donor-page-header"><h1>Verify My Account</h1><p>Upload documents to become a Verified Donor and build community trust.</p></div>
      <div class="donor-form-card">
        <div class="donor-doc-upload required" id="aadhaar-upload-zone">
          <label>
            <input type="file" id="verify-aadhaar" accept=".pdf,.jpg,.jpeg,.png" onchange="donorDocSelected('aadhaar', this)">
            ${donorLucide('file-text', 32)}
            <p style="font-weight:700;margin-top:0.5rem">Upload Aadhaar <span style="color:#EF4444">(Required)</span></p>
            <p style="font-size:0.75rem;color:#9CA3AF">PDF, JPG, or PNG · Max 5 MB</p>
          </label>
        </div>
        <div class="donor-doc-upload" id="selfie-upload-zone">
          <label>
            <input type="file" id="verify-selfie" accept="image/*" onchange="donorDocSelected('selfie', this)">
            ${donorLucide('camera', 32)}
            <p style="font-weight:700;margin-top:0.5rem">Selfie <span style="color:#9CA3AF">(Optional)</span></p>
            <p style="font-size:0.75rem;color:#9CA3AF">Clear face photo for identity match</p>
          </label>
        </div>
        <div class="donor-doc-upload" id="address-upload-zone">
          <label>
            <input type="file" id="verify-address" accept=".pdf,.jpg,.jpeg,.png" onchange="donorDocSelected('address', this)">
            ${donorLucide('home', 32)}
            <p style="font-weight:700;margin-top:0.5rem">Address Proof <span style="color:#9CA3AF">(Optional)</span></p>
            <p style="font-size:0.75rem;color:#9CA3AF">Utility bill, Voter ID, Passport, etc.</p>
          </label>
        </div>
        <button type="button" class="login-submit" style="width:100%" onclick="submitDonorVerification()">Submit for Review</button>
      </div>
    </div>`;
  refreshDonorIcons();
}

const donorVerifyDocs = { aadhaar: false, selfie: false, address: false };

function donorDocSelected(type, input) {
  if (!input.files.length) return;
  donorVerifyDocs[type] = true;
  const zoneId = type === 'aadhaar' ? 'aadhaar-upload-zone' : type === 'selfie' ? 'selfie-upload-zone' : 'address-upload-zone';
  document.getElementById(zoneId)?.classList.add('has-file');
  showDonorToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded.`, 'success');
}

function submitDonorVerification() {
  if (!donorVerifyDocs.aadhaar) {
    const input = document.getElementById('verify-aadhaar');
    if (!input?.files?.length) {
      showDonorToast('Aadhaar document is required.', 'error');
      return;
    }
  }
  const user = appState.currentUser;
  appState.verifications.unshift({
    id: 'v-donor-' + Date.now(),
    name: user.name,
    email: user.email,
    type: 'Donor',
    doc: 'aadhaar_verification.pdf',
    status: 'Pending',
    submitted: new Date().toISOString().split('T')[0]
  });
  user.verified = 'pending';
  donorVerifyDocs.aadhaar = false;
  donorVerifyDocs.selfie = false;
  donorVerifyDocs.address = false;
  showDonorToast('Documents submitted! Admin will review shortly.', 'success');
  appState.currentTab = 'donor-dashboard';
  renderDashboardLayout();
}

/* --- Sync donor verification on admin approve --- */
function syncDonorVerificationOnApprove(verification) {
  if (verification.type !== 'Donor') return;
  const email = verification.email || verification.name;
  if (appState.currentUser && (appState.currentUser.email === email || appState.currentUser.name === verification.name)) {
    if (verification.status === 'Verified') appState.currentUser.verified = true;
    else if (verification.status === 'Rejected') appState.currentUser.verified = 'rejected';
    else appState.currentUser.verified = 'pending';
  }
}

document.addEventListener('DOMContentLoaded', initDonorModuleData);
