/* ==========================================================================
   Give Away Platform - Grayscale Wireframe App Controller (Interactive JS)
   ========================================================================== */

// --- In-Memory Mock Database ---
let appState = {
  currentUser: null, // Holds { name, email, role } when logged in
  currentView: 'home', // 'home' | 'login' | 'register-role' | 'register' | 'dashboard'
  currentTab: 'overview', // Current active sidebar tab in dashboards
  selectedRegistrationRole: null, // Role chosen during sign-up flow
  activeLoginTab: 'donor', // Active tab on unified login page
  editingDonationId: null, // Admin: donation being edited for usage update
  
  // Mock Data lists for prototype interactivity
  verifications: [
    { id: 'v-1', name: "Asha Kiran Foundation", type: "NGO", doc: "ngo_registration.pdf", status: "Pending", submitted: "2026-07-08" },
    { id: 'v-2', name: "Ravi Kumar", type: "Receiver", doc: "hardship_proof_rent.pdf", status: "Pending", submitted: "2026-07-07" },
    { id: 'v-3', name: "Helpage India", type: "NGO", doc: "trust_deed_12A.pdf", status: "Verified", submitted: "2026-07-05" },
    { id: 'v-4', name: "Sunita Deshmukh", type: "Receiver", doc: "income_cert.pdf", status: "Pending", submitted: "2026-07-09" }
  ],
  
  requests: [
    { id: 'req-1', requester: "Asha Kiran Foundation (NGO)", type: "Items Assistance", details: "Needs 20x Winter Blankets for shelter housing", status: "Pending" },
    { id: 'req-2', requester: "Ravi Kumar (Receiver)", type: "Financial Support", details: "Requires $400 for emergency house rent support. Support Doc: income_proof.pdf", status: "Pending" },
    { id: 'req-3', requester: "Sunita Deshmukh (Receiver)", type: "Items Assistance", details: "Category: Food & Rations. Details: Needs monthly family ration kit. Support Doc: ID_verification.pdf", status: "Pending" },
    { id: 'req-4', requester: "Helpage India (NGO)", type: "Financial Assistance", details: "Requesting $1,500 to expand elderly lunch program support", status: "Approved" }
  ],
  
  inventory: [
    { id: 'inv-1', name: "Winter Blankets", category: "Shelter/Clothing", qty: 45, unit: "pcs" },
    { id: 'inv-2', name: "First Aid Kits", category: "Medical Supplies", qty: 30, unit: "kits" },
    { id: 'inv-3', name: "Wheelchairs", category: "Medical Equipment", qty: 8, unit: "units" },
    { id: 'inv-4', name: "Canned Vegetables", category: "Food & Rations", qty: 250, unit: "cans" }
  ],
  
  donations: [
    {
      id: 'don-1',
      donor: "Rajesh Mehta",
      donorEmail: "rajesh@example.com",
      type: "Financial",
      amount: 500,
      fund: "General Health Fund",
      details: "$500 donation towards General Health Fund",
      date: "2026-07-06",
      status: "Fully Deployed",
      usage: {
        summary: "Your contribution fully funded emergency medical supplies and partial rent relief for verified receivers.",
        purpose: "General Health Fund",
        utilizationPercent: 100,
        updatedByAdmin: true,
        updatedAt: "2026-07-08",
        allocations: [
          { date: "2026-07-07", purpose: "Emergency house rent support", recipient: "Ravi Kumar (Receiver)", amount: "$400", status: "Disbursed" },
          { date: "2026-07-08", purpose: "First aid kit distribution", recipient: "Asha Kiran Foundation (NGO)", amount: "$100", status: "Disbursed" }
        ]
      }
    },
    {
      id: 'don-2',
      donor: "Meera Nair",
      donorEmail: "meera@example.com",
      type: "Items",
      amount: null,
      fund: "Medical Supplies",
      details: "15x First Aid Kits, 5x Wheelchairs",
      date: "2026-07-07",
      status: "Pending Verification",
      usage: null
    },
    {
      id: 'don-3',
      donor: "donor@gmail.com",
      donorEmail: "donor@gmail.com",
      type: "Financial",
      amount: 1000,
      fund: "Medical Financial Assistance Fund",
      details: "$1,000 donation towards Medical Financial Assistance Fund",
      date: "2026-07-05",
      status: "Fully Deployed",
      usage: {
        summary: "Your donation directly supported verified medical and food relief for two receiver families in need.",
        purpose: "Medical Financial Assistance Fund",
        utilizationPercent: 100,
        updatedByAdmin: true,
        updatedAt: "2026-07-07",
        allocations: [
          { date: "2026-07-06", purpose: "Monthly family ration kit", recipient: "Sunita Deshmukh (Receiver)", amount: "$350", status: "Disbursed" },
          { date: "2026-07-06", purpose: "Emergency medical consultation & medicines", recipient: "Ravi Kumar (Receiver)", amount: "$450", status: "Disbursed" },
          { date: "2026-07-07", purpose: "Elderly lunch program supplement", recipient: "Helpage India (NGO)", amount: "$200", status: "Disbursed" }
        ]
      }
    },
    {
      id: 'don-4',
      donor: "donor@gmail.com",
      donorEmail: "donor@gmail.com",
      type: "Financial",
      amount: 300,
      fund: "Disaster Rehabilitation",
      details: "$300 donation towards Disaster Rehabilitation",
      date: "2026-07-08",
      status: "Allocated",
      usage: {
        summary: "Funds are being routed to shelter rehabilitation — partial deployment is in progress.",
        purpose: "Disaster Rehabilitation",
        utilizationPercent: 65,
        updatedByAdmin: true,
        updatedAt: "2026-07-09",
        allocations: [
          { date: "2026-07-09", purpose: "Winter blanket procurement", recipient: "Asha Kiran Foundation (NGO)", amount: "$195", status: "Disbursed" },
          { date: "2026-07-10", purpose: "Temporary shelter materials", recipient: "Pending allocation", amount: "$105", status: "In Progress" }
        ]
      }
    }
  ]
};

// --- Page & Navigation Controller ---
function showView(viewName) {
  appState.currentView = viewName;
  
  // Hide all view elements
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active-view');
  });
  
  // Remove active styling from nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Handle active states and dashboard renders
  if (viewName === 'home') {
    document.getElementById('landing-view').classList.add('active-view');
    const publicNav = document.getElementById('public-nav-links');
    if (publicNav) publicNav.querySelector('[href="#home"]')?.classList.add('active');
    
    // Dynamic Landing Page adjustment based on session
    const loggedOutCtas = document.getElementById('hero-logged-out-ctas');
    const loggedInCtas = document.getElementById('hero-logged-in-ctas');
    const analyticsSection = document.getElementById('home-analytics-section');
    const welcomeText = document.getElementById('hero-welcome-text');
    
    if (appState.currentUser) {
      if (loggedOutCtas) loggedOutCtas.style.display = 'none';
      if (loggedInCtas) loggedInCtas.style.display = 'block';
      if (analyticsSection) analyticsSection.style.display = 'block';
      if (welcomeText) {
        welcomeText.textContent = `Welcome back, ${appState.currentUser.name}! You are logged in as ${getRoleDisplayName(appState.currentUser.role)}.`;
      }
    } else {
      if (loggedOutCtas) loggedOutCtas.style.display = 'block';
      if (loggedInCtas) loggedInCtas.style.display = 'none';
      if (analyticsSection) analyticsSection.style.display = 'none';
    }
  } else if (viewName === 'login') {
    document.getElementById('login-view').classList.add('active-view');
    document.getElementById('nav-login').classList.add('active');
    switchLoginTab(appState.activeLoginTab || 'donor', false);
  } else if (viewName === 'register-role') {
    document.getElementById('register-role-view').classList.add('active-view');
    document.getElementById('nav-register').classList.add('active');
    resetRoleSelectionUI();
  } else if (viewName === 'register') {
    if (!appState.selectedRegistrationRole) {
      showView('register-role');
      return;
    }
    if (appState.selectedRegistrationRole === 'ngo') {
      showView('register-ngo');
      return;
    }
    if (appState.selectedRegistrationRole === 'donor') {
      showView('register-donor');
      return;
    }
    if (appState.selectedRegistrationRole === 'receiver') {
      showView('register-receiver');
      return;
    }
  } else if (viewName === 'register-receiver') {
    if (appState.selectedRegistrationRole !== 'receiver') {
      showView('register-role');
      return;
    }
    document.getElementById('receiver-register-view').classList.add('active-view');
    document.getElementById('nav-register').classList.add('active');
  } else if (viewName === 'register-donor') {
    if (appState.selectedRegistrationRole !== 'donor') {
      showView('register-role');
      return;
    }
    document.getElementById('donor-register-view').classList.add('active-view');
    document.getElementById('nav-register').classList.add('active');
  } else if (viewName === 'register-ngo') {
    if (appState.selectedRegistrationRole !== 'ngo') {
      showView('register-role');
      return;
    }
    document.getElementById('ngo-register-view').classList.add('active-view');
    document.getElementById('nav-register').classList.add('active');
  } else if (viewName === 'dashboard') {
    if (!appState.currentUser) {
      // Direct redirect back to login if not authenticated
      showView('login');
      return;
    }
    document.getElementById('dashboard-view').classList.add('active-view');
    document.getElementById('nav-dashboard-link').classList.add('active');
    renderDashboardLayout();
  }
  
  updateGlobalHeader();
  updatePublicNavVisibility();
  window.scrollTo(0, 0);
}

function updateGlobalHeader() {
  const loggedInNav = document.getElementById('logged-in-nav');
  const loggedOutNav = document.getElementById('logged-out-nav');
  
  if (appState.currentUser) {
    // Show logged in nav
    loggedOutNav.style.display = 'none';
    loggedInNav.style.display = 'flex';
    document.getElementById('nav-dashboard-user').textContent = appState.currentUser.name;
    document.getElementById('nav-dashboard-role').textContent = getRoleDisplayName(appState.currentUser.role);
  } else {
    // Show logged out nav
    loggedOutNav.style.display = 'flex';
    loggedInNav.style.display = 'none';
  }
}

function getRoleDisplayName(role) {
  switch (role) {
    case 'super-admin': return 'Super Admin';
    case 'donor': return 'Donor';
    case 'ngo': return 'NGO Partner';
    case 'receiver': return 'Receiver';
    default: return 'User';
  }
}

// --- Auth Mock Actions ---
function selectRegistrationRole(role) {
  appState.selectedRegistrationRole = role;

  document.querySelectorAll('.role-select-option').forEach(option => {
    const isSelected = option.dataset.role === role;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  const continueBtn = document.getElementById('role-continue-btn');
  if (continueBtn) continueBtn.disabled = false;
}

function resetRoleSelectionUI() {
  document.querySelectorAll('.role-select-option').forEach(option => {
    const isSelected = option.dataset.role === appState.selectedRegistrationRole;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  const continueBtn = document.getElementById('role-continue-btn');
  if (continueBtn) continueBtn.disabled = !appState.selectedRegistrationRole;
}

function startRegistration() {
  appState.selectedRegistrationRole = null;
  showView('register-role');
}

function proceedToRegistration() {
  if (!appState.selectedRegistrationRole) return;
  if (appState.selectedRegistrationRole === 'ngo') {
    showView('register-ngo');
  } else if (appState.selectedRegistrationRole === 'donor') {
    showView('register-donor');
  } else if (appState.selectedRegistrationRole === 'receiver') {
    showView('register-receiver');
  }
}

// --- Unified Login Tab Controller ---
const LOGIN_TAB_CONFIG = {
  donor: {
    title: 'Welcome back, Donor',
    subtitle: 'Sign in to manage your contributions and track your impact.',
    primaryLabel: 'Email Address',
    primaryType: 'email',
    primaryPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    showMfa: false,
    mfaLabel: '',
    showHelpDesk: false,
    buttonText: 'Secure Login to Abayahastham',
    buttonClass: 'auth-btn-green',
    showAdminNotice: false,
    appRole: 'donor',
    footerLinks: [
      { label: 'Forgot Password?', action: () => alert('Password reset link would be sent to your registered email.') },
      { label: "Don't have an account? Sign Up", action: () => startRegistration() }
    ]
  },
  ngo: {
    title: 'NGO Partner Portal',
    subtitle: 'Access your organization dashboard and manage relief programs.',
    primaryLabel: 'Organization Email',
    primaryType: 'email',
    primaryPlaceholder: 'contact@yourngo.org',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    showMfa: true,
    mfaLabel: '2FA Verification Code',
    showHelpDesk: false,
    buttonText: 'Access Partner Portal',
    buttonClass: 'auth-btn-blue',
    showAdminNotice: false,
    appRole: 'ngo',
    footerLinks: [
      { label: 'Request NGO Account', action: () => { appState.selectedRegistrationRole = 'ngo'; showView('register-ngo'); } },
      { label: 'Reset Password', action: () => alert('NGO password reset instructions would be sent to your organization email.') }
    ]
  },
  receiver: {
    title: 'Receiver Sign In',
    subtitle: 'Log in to request and receive verified support from our network.',
    primaryLabel: 'Registered Mobile / Email',
    primaryType: 'text',
    primaryPlaceholder: '+91 98765 43210 or you@example.com',
    passwordLabel: 'PIN / Password',
    passwordPlaceholder: 'Enter your PIN or password',
    showMfa: false,
    mfaLabel: '',
    showHelpDesk: true,
    buttonText: 'Log In to Receive Support',
    buttonClass: 'auth-btn-teal',
    showAdminNotice: false,
    appRole: 'receiver',
    footerLinks: [
      { label: 'New to the platform? Apply for Support', action: () => { appState.selectedRegistrationRole = 'receiver'; showView('register-receiver'); } }
    ]
  },
  admin: {
    title: 'Command Center Access',
    subtitle: 'Restricted administrative login for authorized platform operators.',
    primaryLabel: 'Admin ID / Security Email',
    primaryType: 'text',
    primaryPlaceholder: 'admin@abhayahastam.org',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your secure password',
    showMfa: true,
    mfaLabel: '2FA Authenticator Token',
    showHelpDesk: false,
    buttonText: 'Access Command Center',
    buttonClass: 'auth-btn-admin',
    showAdminNotice: true,
    appRole: 'super-admin',
    footerLinks: []
  }
};

function switchLoginTab(role, animate = true) {
  const config = LOGIN_TAB_CONFIG[role];
  if (!config) return;

  appState.activeLoginTab = role;

  document.querySelectorAll('.auth-tab').forEach(tab => {
    const isActive = tab.dataset.loginRole === role;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.tabIndex = isActive ? 0 : -1;
  });

  const panel = document.getElementById('auth-tabpanel');
  if (panel) panel.setAttribute('aria-labelledby', `auth-tab-${role}`);

  const titleEl = document.getElementById('auth-panel-title');
  const subtitleEl = document.getElementById('auth-panel-subtitle');
  if (titleEl) titleEl.textContent = config.title;
  if (subtitleEl) subtitleEl.textContent = config.subtitle;

  const primaryLabel = document.getElementById('auth-primary-label');
  const primaryInput = document.getElementById('auth-primary-input');
  const passwordLabel = document.getElementById('auth-password-label');
  const passwordInput = document.getElementById('auth-password-input');
  const mfaWrap = document.getElementById('auth-field-mfa-wrap');
  const mfaLabel = document.getElementById('auth-mfa-label');
  const mfaInput = document.getElementById('auth-mfa-input');
  const helpDesk = document.getElementById('auth-help-desk');
  const submitBtn = document.getElementById('auth-submit-btn');
  const adminNotice = document.getElementById('auth-admin-notice');
  const fieldsWrap = document.getElementById('auth-form-fields');

  if (primaryLabel) primaryLabel.textContent = config.primaryLabel;
  if (primaryInput) {
    primaryInput.type = config.primaryType;
    primaryInput.placeholder = config.primaryPlaceholder;
    primaryInput.classList.remove('auth-input-error');
  }

  const primaryIcon = document.getElementById('auth-primary-icon');
  if (primaryIcon) {
    if (config.primaryType === 'email') {
      primaryIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>';
    } else if (role === 'admin') {
      primaryIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    } else {
      primaryIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    }
  }
  if (passwordLabel) passwordLabel.textContent = config.passwordLabel;
  if (passwordInput) {
    passwordInput.placeholder = config.passwordPlaceholder;
    passwordInput.classList.remove('auth-input-error');
  }

  if (mfaWrap) mfaWrap.hidden = !config.showMfa;
  if (mfaLabel) mfaLabel.textContent = config.mfaLabel;
  if (mfaInput) {
    mfaInput.value = '';
    mfaInput.required = config.showMfa;
    mfaInput.classList.remove('auth-input-error');
    mfaInput.placeholder = role === 'admin' ? 'Enter authenticator code' : 'Enter 6-digit MFA token';
  }

  if (helpDesk) helpDesk.hidden = !config.showHelpDesk;
  if (submitBtn) {
    const submitText = document.getElementById('auth-submit-text');
    if (submitText) submitText.textContent = config.buttonText;
    else submitBtn.textContent = config.buttonText;
    submitBtn.className = `login-submit auth-submit-btn ${config.buttonClass}`;
  }
  if (adminNotice) adminNotice.hidden = !config.showAdminNotice;

  clearAuthFieldErrors();

  const footerLinks = document.getElementById('auth-footer-links');
  if (footerLinks) {
    footerLinks.innerHTML = config.footerLinks.map((link, i) => {
      const separator = i < config.footerLinks.length - 1
        ? '<span class="auth-footer-separator" aria-hidden="true">·</span>'
        : '';
      return `<button type="button" class="auth-footer-link" data-link-index="${i}">${link.label}</button>${separator}`;
    }).join('');

    footerLinks.querySelectorAll('.auth-footer-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.linkIndex, 10);
        config.footerLinks[idx].action();
      });
    });
  }

  if (animate && fieldsWrap) {
    fieldsWrap.classList.add('is-transitioning');
    setTimeout(() => {
      fieldsWrap.classList.remove('is-transitioning');
      fieldsWrap.classList.remove('auth-fade-in');
      void fieldsWrap.offsetWidth;
      fieldsWrap.classList.add('auth-fade-in');
    }, 140);
  }
}

function clearAuthFieldErrors() {
  ['auth-primary-error', 'auth-password-error', 'auth-mfa-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.hidden = true;
    }
  });
  document.querySelectorAll('#auth-login-form input').forEach(input => {
    input.classList.remove('auth-input-error');
  });
}

function setAuthFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('auth-input-error');
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  clearAuthFieldErrors();

  const role = appState.activeLoginTab || 'donor';
  const config = LOGIN_TAB_CONFIG[role];
  const username = document.getElementById('auth-primary-input').value.trim();
  const password = document.getElementById('auth-password-input').value;
  const mfaInput = document.getElementById('auth-mfa-input');
  let hasError = false;

  if (!username) {
    setAuthFieldError('auth-primary-input', 'auth-primary-error', 'This field is required.');
    hasError = true;
  } else if (config.primaryType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    setAuthFieldError('auth-primary-input', 'auth-primary-error', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!password) {
    setAuthFieldError('auth-password-input', 'auth-password-error', 'Please enter your password.');
    hasError = true;
  }

  if (config.showMfa) {
    const mfa = mfaInput ? mfaInput.value.trim() : '';
    if (!mfa) {
      setAuthFieldError('auth-mfa-input', 'auth-mfa-error', 'Verification code is required.');
      hasError = true;
    } else if (!/^\d{6}$/.test(mfa)) {
      setAuthFieldError('auth-mfa-input', 'auth-mfa-error', 'Enter a valid 6-digit code.');
      hasError = true;
    }
  }

  if (hasError) return;

  handleLogin(username, config.appRole);
}

function initLoginTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchLoginTab(tab.dataset.loginRole));
    tab.addEventListener('keydown', (e) => {
      const tabs = Array.from(document.querySelectorAll('.auth-tab'));
      const idx = tabs.indexOf(tab);
      let nextIdx = idx;

      if (e.key === 'ArrowRight') {
        nextIdx = (idx + 1) % tabs.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        nextIdx = (idx - 1 + tabs.length) % tabs.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIdx = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIdx = tabs.length - 1;
        e.preventDefault();
      } else {
        return;
      }

      tabs[nextIdx].focus();
      switchLoginTab(tabs[nextIdx].dataset.loginRole);
    });
  });

  const helpDesk = document.getElementById('auth-help-desk');
  if (helpDesk) {
    helpDesk.addEventListener('click', (e) => {
      e.preventDefault();
      alert('WhatsApp Help Desk: +91 98765 43210\nOur support team is available Mon–Sat, 9 AM – 6 PM IST.');
    });
  }

  switchLoginTab('donor', false);
}

function handleLogin(username, role) {
  const isDemoDonor = (username || '').toLowerCase() === 'donor@gmail.com';
  const isDemoReceiver = (username || '').toLowerCase() === 'receiver@outlook.com';
  const isDemoNgo = (username || '').toLowerCase() === 'ngo@ashakiran.org';
  appState.currentUser = {
    name: isDemoDonor ? 'Demo Donor' : isDemoReceiver ? 'Ravi Kumar' : isDemoNgo ? 'Asha Kiran Foundation' : (username || 'Test User'),
    email: username || '',
    role: role || 'donor',
    verified: isDemoDonor ? true : isDemoNgo ? false : false,
    mobile: isDemoDonor ? '+91 98765 43210' : isDemoReceiver ? '+91 98765 43211' : isDemoNgo ? '+91 22 4000 1234' : '',
    city: isDemoReceiver ? 'Mumbai' : isDemoNgo ? 'Mumbai' : '',
    state: isDemoReceiver ? 'Maharashtra' : isDemoNgo ? 'Maharashtra' : '',
    repName: isDemoNgo ? 'Priya Sharma' : undefined,
    orgType: isDemoNgo ? 'Registered Trust' : undefined,
    status: isDemoNgo ? 'Registered NGO' : isDemoReceiver ? 'Registered Receiver' : undefined,
    memberSince: isDemoNgo ? '2026-06-15' : isDemoReceiver ? '2026-06-01' : '2026-01-15'
  };
  
  // Set default initial tab based on role
  if (appState.currentUser.role === 'super-admin') {
    appState.currentTab = 'admin-dashboard';
  } else if (appState.currentUser.role === 'donor') {
    appState.currentTab = 'donor-dashboard';
  } else if (appState.currentUser.role === 'ngo') {
    appState.currentTab = 'ngo-dashboard';
  } else if (appState.currentUser.role === 'receiver') {
    appState.currentTab = 'receiver-dashboard';
  }

  showView('dashboard');
}

function handleLogout() {
  appState.currentUser = null;
  appState.currentTab = 'overview';
  appState.selectedRegistrationRole = null;
  showView('home');
}

// --- Admin Dashboard Helpers ---
function getAdminNavIcon(name) {
  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    logs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    verify: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    ledger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  };
  return icons[name] || '';
}

function renderAdminVerificationRows(compact) {
  return appState.verifications.map(v => `
    <tr>
      <td class="admin-td-date">${v.submitted || '—'}</td>
      <td><span class="admin-entity-badge admin-entity-${v.type.toLowerCase()}">${v.type}</span></td>
      <td><strong class="admin-cell-name">${v.name}</strong></td>
      <td><a href="#" class="admin-doc-link" onclick="return false;">${v.doc}</a></td>
      ${compact ? '' : `<td><span class="admin-status-pill admin-status-${v.status.toLowerCase()}">${v.status}</span></td>`}
      <td>
        ${v.status === 'Pending' ? `
          <div class="admin-action-btns">
            <button type="button" class="admin-btn admin-btn-approve" onclick="verifyEntity('${v.id}')">Approve Account</button>
            <button type="button" class="admin-btn admin-btn-defer" onclick="flagEntity('${v.id}')">Defer / Flag</button>
          </div>
        ` : `<span class="admin-action-done admin-action-${v.status.toLowerCase()}">${v.status}</span>`}
      </td>
    </tr>
  `).join('');
}

function renderAdminCommandDashboard(container) {
  const pendingCount = appState.verifications.filter(v => v.status === 'Pending').length;
  const ngoCount = appState.verifications.filter(v => v.type === 'NGO' && v.status === 'Verified').length + 298;
  const recipientsServed = appState.requests.filter(r => r.status === 'Approved').length * 38 + 1240;
  const queueRows = renderAdminVerificationRows(true);

  const ledgerRows = [
    { date: '2026-07-07', source: 'Rajesh Mehta (Donor)', amountIn: '$500', recipient: 'General Health Fund', amountOut: '—', balance: '$24,500' },
    { date: '2026-07-06', source: 'Meera Nair (Donor)', amountIn: '15 Kits', recipient: 'Asha Kiran Foundation', amountOut: 'Medical Supplies', balance: '—' },
    { date: '2026-07-05', source: 'Platform Reserve', amountIn: '—', recipient: 'Ravi Kumar (Receiver)', amountOut: '$400', balance: '$24,000' },
    { date: '2026-07-04', source: 'Anonymous Donor', amountIn: '$1,200', recipient: 'Helpage India', amountOut: '$1,500 Program', balance: '$24,400' },
    { date: '2026-07-03', source: 'Corporate Match', amountIn: '$2,000', recipient: 'Sunita Deshmukh', amountOut: '$350 Relief', balance: '$23,200' }
  ].map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.source}</td>
      <td class="admin-ledger-in">${r.amountIn}</td>
      <td>${r.recipient}</td>
      <td class="admin-ledger-out">${r.amountOut}</td>
      <td><strong>${r.balance}</strong></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="admin-cmd">
      <header class="admin-cmd-header">
        <div>
          <p class="admin-cmd-eyebrow">Admin Command &amp; Analytics</p>
          <h1 class="admin-cmd-title">Platform Overview</h1>
          <p class="admin-cmd-subtitle">Real-time statistics, verification queue, and audit-transparent financial ledger.</p>
        </div>
        <div class="admin-cmd-status">
          <span class="admin-status-dot" aria-hidden="true"></span>
          <div>
            <span class="admin-status-label">System Operational</span>
            <span class="admin-status-meta">99.9% uptime · ${pendingCount} pending reviews</span>
          </div>
        </div>
      </header>

      <div class="admin-kpi-grid">
        <article class="admin-kpi-card">
          <div class="admin-kpi-head">
            <span class="admin-kpi-label">Total Funds Collected</span>
            <span class="admin-kpi-trend admin-kpi-trend--up">+12.4%</span>
          </div>
          <p class="admin-kpi-value">$24,500</p>
          <div class="admin-sparkline" aria-hidden="true">
            <span style="height:28%"></span><span style="height:42%"></span><span style="height:35%"></span>
            <span style="height:55%"></span><span style="height:48%"></span><span style="height:62%"></span>
            <span style="height:58%"></span><span style="height:75%"></span><span style="height:68%"></span>
            <span style="height:85%"></span><span style="height:72%"></span><span style="height:92%"></span>
          </div>
        </article>

        <article class="admin-kpi-card">
          <div class="admin-kpi-head">
            <span class="admin-kpi-label">System Request Flow</span>
            <span class="admin-kpi-badge">Live</span>
          </div>
          <p class="admin-kpi-value">847<span class="admin-kpi-unit"> req/hr</span></p>
          <ul class="admin-kpi-meta">
            <li><span>Pipeline latency</span><strong>42ms</strong></li>
            <li><span>Active sessions</span><strong>128</strong></li>
          </ul>
        </article>

        <article class="admin-kpi-card">
          <div class="admin-kpi-head">
            <span class="admin-kpi-label">Active NGO Network</span>
          </div>
          <p class="admin-kpi-value">${ngoCount}<span class="admin-kpi-unit"> partners</span></p>
          <p class="admin-kpi-footnote">${appState.verifications.filter(v => v.type === 'NGO').length} pending onboarding</p>
        </article>

        <article class="admin-kpi-card">
          <div class="admin-kpi-head">
            <span class="admin-kpi-label">Aid Recipients Served</span>
          </div>
          <p class="admin-kpi-value">${recipientsServed.toLocaleString()}</p>
          <p class="admin-kpi-footnote">Across verified relief allocations</p>
        </article>
      </div>

      <div class="admin-split-grid">
        <article class="admin-panel admin-panel-chart">
          <div class="admin-panel-head">
            <h2 class="admin-panel-title">Platform Engagement Flow</h2>
            <span class="admin-panel-tag">Last 24 hours</span>
          </div>
          <div class="admin-chart-wrap">
            <div class="admin-chart-bars" aria-hidden="true">
              <div class="admin-chart-bar" style="--h:35%"><span>6a</span></div>
              <div class="admin-chart-bar" style="--h:28%"><span>8a</span></div>
              <div class="admin-chart-bar" style="--h:45%"><span>10a</span></div>
              <div class="admin-chart-bar" style="--h:62%"><span>12p</span></div>
              <div class="admin-chart-bar" style="--h:78%"><span>2p</span></div>
              <div class="admin-chart-bar" style="--h:85%"><span>4p</span></div>
              <div class="admin-chart-bar" style="--h:70%"><span>6p</span></div>
              <div class="admin-chart-bar" style="--h:55%"><span>8p</span></div>
              <div class="admin-chart-bar" style="--h:40%"><span>10p</span></div>
            </div>
            <div class="admin-flow-legend">
              <span><i class="admin-legend-dot admin-legend-dot--req"></i> Requests</span>
              <span><i class="admin-legend-dot admin-legend-dot--ver"></i> Verifications</span>
              <span><i class="admin-legend-dot admin-legend-dot--don"></i> Donations</span>
            </div>
          </div>
        </article>

        <article class="admin-panel admin-panel-queue">
          <div class="admin-panel-head">
            <h2 class="admin-panel-title">Verification Queue</h2>
            <button type="button" class="admin-panel-link" onclick="switchTab('admin-verifications')">View all</button>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table admin-table-compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Account Name</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${queueRows || '<tr><td colspan="5" class="admin-empty">No pending applications.</td></tr>'}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article class="admin-panel admin-panel-ledger">
        <div class="admin-panel-head">
          <h2 class="admin-panel-title">Financial Distribution Ledger</h2>
          <span class="admin-panel-tag">Audit transparency</span>
        </div>
        <p class="admin-panel-desc">Incoming donation streams matched against distributed receiver and NGO allocations.</p>
        <div class="admin-table-wrap">
          <table class="admin-table admin-table-ledger">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donation Source</th>
                <th>Amount In</th>
                <th>Recipient / Allocation</th>
                <th>Amount Out</th>
                <th>Running Balance</th>
              </tr>
            </thead>
            <tbody>${ledgerRows}</tbody>
          </table>
        </div>
      </article>
    </div>
  `;
}

function getDonationStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('pending')) return 'admin-status-pending';
  if (s.includes('fully') || s.includes('verified')) return 'admin-status-verified';
  if (s.includes('allocated')) return 'admin-status-verified';
  return '';
}

function setEditingDonation(donationId) {
  appState.editingDonationId = donationId;
  renderDashboardLayout();
}

function cancelDonationUsageEdit() {
  appState.editingDonationId = null;
  renderDashboardLayout();
}

function renderAdminAllocationRow(allocation, index) {
  const a = allocation || { date: '', purpose: '', recipient: '', amount: '', status: 'In Progress' };
  return `
    <div class="admin-alloc-row" data-index="${index}">
      <input type="date" class="admin-alloc-input" data-field="date" value="${a.date || ''}" aria-label="Allocation date">
      <input type="text" class="admin-alloc-input" data-field="purpose" value="${a.purpose || ''}" placeholder="Purpose / reason" aria-label="Purpose">
      <input type="text" class="admin-alloc-input" data-field="recipient" value="${a.recipient || ''}" placeholder="Recipient" aria-label="Recipient">
      <input type="text" class="admin-alloc-input admin-alloc-input--amount" data-field="amount" value="${a.amount || ''}" placeholder="Amount" aria-label="Amount">
      <select class="admin-alloc-input" data-field="status" aria-label="Status">
        <option value="In Progress" ${a.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option value="Disbursed" ${a.status === 'Disbursed' ? 'selected' : ''}>Disbursed</option>
        <option value="Pending" ${a.status === 'Pending' ? 'selected' : ''}>Pending</option>
      </select>
      <button type="button" class="admin-btn admin-btn-defer admin-alloc-remove" onclick="removeAllocationRow(this)" title="Remove row">&times;</button>
    </div>
  `;
}

function renderAdminDonationUsageEditor(don) {
  const allocations = (don.usage && don.usage.allocations && don.usage.allocations.length)
    ? don.usage.allocations
    : [{ date: new Date().toISOString().split('T')[0], purpose: '', recipient: '', amount: '', status: 'In Progress' }];

  const summary = don.usage ? (don.usage.summary || '') : '';
  const utilPct = don.usage ? (don.usage.utilizationPercent || 0) : 0;
  const statusOptions = ['Pending Allocation', 'Pending Verification', 'Allocated', 'Partially Deployed', 'Fully Deployed'];

  return `
    <article class="admin-panel admin-usage-editor">
      <div class="admin-panel-head">
        <div>
          <h2 class="admin-panel-title">Update fund usage — ${don.id}</h2>
          <p class="admin-usage-editor-meta">${don.donor} · ${don.type}${don.amount ? ` · $${Number(don.amount).toLocaleString()}` : ''} · ${don.fund} · ${don.date}</p>
        </div>
        <button type="button" class="admin-btn admin-btn-defer" onclick="cancelDonationUsageEdit()">Cancel</button>
      </div>

      <form class="admin-usage-form" onsubmit="saveDonationUsage('${don.id}'); return false;">
        <div class="admin-usage-grid">
          <div class="admin-usage-field">
            <label for="usage-don-status">Donation status</label>
            <select id="usage-don-status" required>
              ${statusOptions.map(s => `<option value="${s}" ${don.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="admin-usage-field">
            <label for="usage-util-pct">Utilization %</label>
            <input type="number" id="usage-util-pct" min="0" max="100" value="${utilPct}" required />
          </div>
        </div>

        <div class="admin-usage-field admin-usage-field--full">
          <label for="usage-summary">Usage reason &amp; summary <span class="admin-usage-required">(visible to donor)</span></label>
          <textarea id="usage-summary" rows="4" required placeholder="Explain how this donation was used, why allocations were made, and the impact achieved...">${summary}</textarea>
        </div>

        <div class="admin-usage-alloc-section">
          <div class="admin-usage-alloc-head">
            <span class="admin-usage-alloc-label">Allocation breakdown</span>
            <button type="button" class="admin-btn admin-btn-approve admin-alloc-add" onclick="addAllocationRow()">+ Add row</button>
          </div>
          <div class="admin-alloc-header" aria-hidden="true">
            <span>Date</span><span>Purpose / reason</span><span>Recipient</span><span>Amount</span><span>Status</span><span></span>
          </div>
          <div id="admin-alloc-list">
            ${allocations.map((a, i) => renderAdminAllocationRow(a, i)).join('')}
          </div>
        </div>

        <div class="admin-usage-actions">
          <button type="submit" class="admin-btn admin-btn-approve admin-usage-save">Publish usage update to donor</button>
        </div>
      </form>
    </article>
  `;
}

function renderAdminDonationUsageView(container) {
  const pendingCount = appState.donations.filter(d => !d.usage || !d.usage.updatedByAdmin).length;
  const editing = appState.editingDonationId
    ? appState.donations.find(d => d.id === appState.editingDonationId)
    : null;

  const rows = appState.donations.map(don => {
    const needsUpdate = !don.usage || !don.usage.updatedByAdmin;
    const amountLabel = don.type === 'Financial' && don.amount ? `$${Number(don.amount).toLocaleString()}` : don.details;
    const statusClass = getDonationStatusClass(don.status);
    return `
      <tr class="${needsUpdate ? 'admin-usage-row--needs' : ''}">
        <td>${don.date}</td>
        <td><strong>${don.donor}</strong><br><span class="admin-usage-email">${don.donorEmail || ''}</span></td>
        <td>${don.type}</td>
        <td>${amountLabel}</td>
        <td>${don.fund || '—'}</td>
        <td><span class="admin-status-pill ${statusClass}">${don.status}</span></td>
        <td>${don.usage && don.usage.updatedByAdmin ? `<span class="admin-usage-updated">Updated ${don.usage.updatedAt || ''}</span>` : `<span class="admin-usage-pending-badge">Needs update</span>`}</td>
        <td><button type="button" class="admin-btn admin-btn-approve" onclick="setEditingDonation('${don.id}')">${needsUpdate ? 'Add usage' : 'Edit'}</button></td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="admin-cmd">
      <header class="admin-cmd-header">
        <div>
          <p class="admin-cmd-eyebrow">Donor transparency</p>
          <h1 class="admin-cmd-title">Fund Usage Updates</h1>
          <p class="admin-cmd-subtitle">Document how each donation was used and the purpose behind every allocation. Donors see your updates in their Donation Impact dashboard.</p>
        </div>
        <div class="admin-cmd-stat-pills">
          <span class="admin-stat-pill admin-stat-pill--warn">Pending updates: ${pendingCount}</span>
          <span class="admin-stat-pill">Total donations: ${appState.donations.length}</span>
        </div>
      </header>

      ${editing ? renderAdminDonationUsageEditor(editing) : ''}

      <article class="admin-panel">
        <div class="admin-panel-head"><h2 class="admin-panel-title">All donations</h2></div>
        <div class="admin-table-wrap">
          <table class="admin-table admin-table-usage">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Fund</th>
                <th>Status</th>
                <th>Usage info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="8" class="admin-empty">No donations recorded.</td></tr>'}</tbody>
          </table>
        </div>
      </article>
    </div>
  `;
}

function addAllocationRow() {
  const list = document.getElementById('admin-alloc-list');
  if (!list) return;
  const index = list.querySelectorAll('.admin-alloc-row').length;
  list.insertAdjacentHTML('beforeend', renderAdminAllocationRow({
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    recipient: '',
    amount: '',
    status: 'In Progress'
  }, index));
}

function removeAllocationRow(btn) {
  const list = document.getElementById('admin-alloc-list');
  const row = btn.closest('.admin-alloc-row');
  if (row && list && list.querySelectorAll('.admin-alloc-row').length > 1) {
    row.remove();
  }
}

function saveDonationUsage(donationId) {
  const don = appState.donations.find(d => d.id === donationId);
  if (!don) return;

  const summaryEl = document.getElementById('usage-summary');
  const statusEl = document.getElementById('usage-don-status');
  const utilEl = document.getElementById('usage-util-pct');
  if (!summaryEl || !statusEl || !utilEl) return;

  const summary = summaryEl.value.trim();
  if (!summary) {
    alert('Please write a usage reason and summary for the donor.');
    return;
  }

  const allocations = [];
  document.querySelectorAll('#admin-alloc-list .admin-alloc-row').forEach(row => {
    const get = (field) => {
      const el = row.querySelector(`[data-field="${field}"]`);
      return el ? el.value.trim() : '';
    };
    const purpose = get('purpose');
    const recipient = get('recipient');
    const amount = get('amount');
    if (purpose || recipient || amount) {
      allocations.push({
        date: get('date') || new Date().toISOString().split('T')[0],
        purpose: purpose || 'Allocation',
        recipient: recipient || 'Verified beneficiary',
        amount: amount || '—',
        status: get('status') || 'In Progress'
      });
    }
  });

  if (!allocations.length) {
    alert('Add at least one allocation row with purpose and amount.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  don.status = statusEl.value;
  don.usage = {
    summary,
    purpose: don.fund,
    utilizationPercent: Math.min(100, Math.max(0, parseInt(utilEl.value, 10) || 0)),
    allocations,
    updatedByAdmin: true,
    updatedAt: today,
    updatedBy: appState.currentUser ? appState.currentUser.email : 'admin'
  };

  appState.editingDonationId = null;
  alert(`Usage information for ${don.id} has been published. The donor will see your update in Donation Impact.`);
  renderDashboardLayout();
}

// --- Dashboard Layout Renderer ---
function renderDashboardLayout() {
  const sidebarNav = document.getElementById('dashboard-sidebar-nav');
  const dashContent = document.getElementById('dashboard-dynamic-content');
  const dashLayout = document.querySelector('.dashboard-layout');
  const role = appState.currentUser.role;

  if (dashLayout) {
    dashLayout.classList.toggle('dashboard-layout--admin', role === 'super-admin');
    dashLayout.classList.toggle('dashboard-layout--donor', role === 'donor');
    dashLayout.classList.toggle('dashboard-layout--receiver', role === 'receiver');
    dashLayout.classList.toggle('dashboard-layout--ngo', role === 'ngo');
  }
  
  // 1. Render Role Specific Sidebar
  let sidebarHTML = '';
  if (role === 'super-admin') {
    const navItems = [
      { id: 'admin-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'admin-donation-usage', label: 'Fund Usage Updates', icon: 'ledger' },
      { id: 'admin-verifications', label: 'Verification Queue', icon: 'verify' },
      { id: 'admin-ledger', label: 'Donation Ledger', icon: 'ledger' },
      { id: 'admin-logs', label: 'System Logs', icon: 'logs' },
      { id: 'admin-users', label: 'User Management', icon: 'users' }
    ];
    sidebarHTML = navItems.map(item => `
      <li class="sidebar-item ${appState.currentTab === item.id ? 'active' : ''}">
        <a href="#" onclick="switchTab('${item.id}'); return false;">
          <span class="sidebar-icon" aria-hidden="true">${getAdminNavIcon(item.icon)}</span>
          ${item.label}
        </a>
      </li>
    `).join('');
  } else if (role === 'donor') {
    renderDonorSidebar(sidebarNav);
  } else if (role === 'ngo') {
    renderNgoSidebar(sidebarNav);
  } else if (role === 'receiver') {
    renderReceiverSidebar(sidebarNav);
  }
  
  if (role !== 'donor' && role !== 'receiver' && role !== 'ngo') {
    sidebarNav.innerHTML = sidebarHTML;
  }
  
  // 2. Render Role / Tab Specific Page Content
  if (role === 'donor') {
    renderDonorTabContent(dashContent, appState.currentTab);
    wireDonorDashboardChrome();
  } else if (role === 'receiver') {
    renderReceiverTabContent(dashContent, appState.currentTab);
    wireReceiverDashboardChrome();
  } else if (role === 'ngo') {
    renderNgoTabContent(dashContent, appState.currentTab);
    wireNgoDashboardChrome();
  } else {
    renderDashboardTabContent(dashContent);
  }
}

function switchTab(tabId) {
  appState.currentTab = tabId;
  renderDashboardLayout();
}

// --- Donor Impact Helpers ---
function getDonorDonations() {
  if (!appState.currentUser) return [];
  const key = (appState.currentUser.email || appState.currentUser.name || '').toLowerCase();
  return appState.donations.filter(d => {
    const donorKey = (d.donorEmail || d.donor || '').toLowerCase();
    return donorKey === key || d.donor === appState.currentUser.name;
  });
}

function renderDonationImpactCard(don) {
  const isFinancial = don.type === 'Financial';
  const amountLabel = isFinancial && don.amount ? `$${Number(don.amount).toLocaleString()}` : don.details;
  const statusClass = (don.status || '').toLowerCase().replace(/\s+/g, '-');
  const hasUsage = don.usage && don.usage.allocations && don.usage.allocations.length;

  const allocationRows = hasUsage
    ? don.usage.allocations.map(a => `
        <tr>
          <td class="donor-impact-td-date">${a.date}</td>
          <td><span class="donor-impact-purpose">${a.purpose}</span></td>
          <td>${a.recipient}</td>
          <td><strong>${a.amount}</strong></td>
          <td><span class="donor-impact-status donor-impact-status--${a.status.toLowerCase().replace(/\s+/g, '-')}">${a.status}</span></td>
        </tr>
      `).join('')
    : '';

  return `
    <article class="donor-impact-card">
      <div class="donor-impact-card-top">
        <div class="donor-impact-card-meta">
          <span class="donor-impact-type">${don.type}</span>
          <span class="donor-impact-date">${don.date}</span>
        </div>
        <span class="donor-impact-badge donor-impact-badge--${statusClass}">${don.status}</span>
      </div>
      <div class="donor-impact-card-body">
        <p class="donor-impact-amount">${amountLabel}</p>
        ${don.fund ? `<p class="donor-impact-fund">Designated fund: ${don.fund}</p>` : ''}
        ${hasUsage ? `
          <div class="donor-impact-usage">
            <div class="donor-impact-usage-head">
              <h3 class="donor-impact-usage-title">Where your donation was used</h3>
              <span class="donor-impact-util">${don.usage.utilizationPercent}% utilized</span>
            </div>
            ${don.usage.updatedByAdmin ? `<p class="donor-impact-admin-note">Updated by platform admin${don.usage.updatedAt ? ` · ${don.usage.updatedAt}` : ''}</p>` : ''}
            <p class="donor-impact-summary">${don.usage.summary}</p>
            <div class="donor-impact-progress" role="progressbar" aria-valuenow="${don.usage.utilizationPercent}" aria-valuemin="0" aria-valuemax="100">
              <div class="donor-impact-progress-bar" style="width: ${don.usage.utilizationPercent}%"></div>
            </div>
            <div class="donor-impact-table-wrap">
              <table class="donor-impact-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Purpose of Use</th>
                    <th>Beneficiary</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>${allocationRows}</tbody>
              </table>
            </div>
          </div>
        ` : `
          <div class="donor-impact-pending">
            <p>${don.status === 'Pending Allocation' ? 'Your donation is received. An admin will publish the fund usage breakdown and purpose details shortly.' : 'Usage breakdown will appear once your donation is verified and allocated by our team.'}</p>
          </div>
        `}
      </div>
    </article>
  `;
}

function renderDonorImpactView(container) {
  const myDonations = getDonorDonations();
  const totalFinancial = myDonations
    .filter(d => d.type === 'Financial' && d.amount)
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const fullyDeployed = myDonations.filter(d => d.status === 'Fully Deployed').length;
  const inProgress = myDonations.filter(d => d.status === 'Allocated' || d.status === 'Verified').length;
  const cards = myDonations.map(renderDonationImpactCard).join('');

  container.innerHTML = `
    <div class="donor-impact-page">
      <header class="donor-impact-header">
        <div>
          <p class="donor-impact-eyebrow">Transparency &amp; Trust</p>
          <h1 class="donor-impact-title">Your Donation Impact</h1>
          <p class="donor-impact-subtitle">See exactly how your contributions are verified, allocated, and used for relief purposes.</p>
        </div>
      </header>
      <div class="donor-impact-kpi-grid">
        <article class="donor-impact-kpi">
          <span class="donor-impact-kpi-label">Total Contributed</span>
          <p class="donor-impact-kpi-value">${totalFinancial ? `$${totalFinancial.toLocaleString()}` : '—'}</p>
        </article>
        <article class="donor-impact-kpi">
          <span class="donor-impact-kpi-label">Donations Made</span>
          <p class="donor-impact-kpi-value">${myDonations.length}</p>
        </article>
        <article class="donor-impact-kpi">
          <span class="donor-impact-kpi-label">Fully Deployed</span>
          <p class="donor-impact-kpi-value">${fullyDeployed}</p>
        </article>
        <article class="donor-impact-kpi">
          <span class="donor-impact-kpi-label">In Allocation</span>
          <p class="donor-impact-kpi-value">${inProgress}</p>
        </article>
      </div>
      <section class="donor-impact-list">
        ${cards || `
          <div class="donor-impact-empty">
            <p>No donations yet.</p>
            <button type="button" onclick="switchTab('donor-donate')">Make your first donation</button>
          </div>
        `}
      </section>
    </div>
  `;
}

// --- Dashboard Tab-Specific Rendering ---
function renderDashboardTabContent(container) {
  const role = appState.currentUser.role;
  const tab = appState.currentTab;
  
  // ADMIN DASHBOARD PANELS
  if (role === 'super-admin') {
    if (tab === 'admin-dashboard') {
      renderAdminCommandDashboard(container);
    }

    else if (tab === 'admin-donation-usage') {
      renderAdminDonationUsageView(container);
    }

    else if (tab === 'admin-logs') {
      container.innerHTML = `
        <div class="admin-cmd">
          <header class="admin-cmd-header">
            <div>
              <p class="admin-cmd-eyebrow">Infrastructure</p>
              <h1 class="admin-cmd-title">System Logs</h1>
              <p class="admin-cmd-subtitle">Platform workflow logs and infrastructure event stream.</p>
            </div>
          </header>
          <article class="admin-panel">
            <div class="admin-log-list">
              <div class="admin-log-item"><span class="admin-log-time">09:41:02</span><span class="admin-log-level admin-log-info">INFO</span><span>Verification pipeline processed 3 applications</span></div>
              <div class="admin-log-item"><span class="admin-log-time">09:38:17</span><span class="admin-log-level admin-log-info">INFO</span><span>Donation webhook received — $500 credit posted</span></div>
              <div class="admin-log-item"><span class="admin-log-time">09:35:44</span><span class="admin-log-level admin-log-warn">WARN</span><span>OTP retry threshold approached for +91•••43210</span></div>
              <div class="admin-log-item"><span class="admin-log-time">09:32:01</span><span class="admin-log-level admin-log-info">INFO</span><span>NGO partner session authenticated — Asha Kiran Foundation</span></div>
              <div class="admin-log-item"><span class="admin-log-time">09:28:33</span><span class="admin-log-level admin-log-info">INFO</span><span>Inventory sync completed — 4 SKU records updated</span></div>
              <div class="admin-log-item"><span class="admin-log-time">09:15:09</span><span class="admin-log-level admin-log-info">INFO</span><span>Scheduled backup completed successfully</span></div>
            </div>
          </article>
        </div>
      `;
    }

    else if (tab === 'admin-verifications') {
      const rows = renderAdminVerificationRows(false);
      container.innerHTML = `
        <div class="admin-cmd">
          <header class="admin-cmd-header">
            <div>
              <p class="admin-cmd-eyebrow">Moderation</p>
              <h1 class="admin-cmd-title">Verification Queue</h1>
              <p class="admin-cmd-subtitle">Review verification documents for registering NGOs, donors, and receivers.</p>
            </div>
            <div class="admin-cmd-stat-pills">
              <span class="admin-stat-pill">Pending: ${appState.verifications.filter(v => v.status === 'Pending').length}</span>
              <span class="admin-stat-pill admin-stat-pill--ok">Verified: ${appState.verifications.filter(v => v.status === 'Verified').length}</span>
            </div>
          </header>
          <article class="admin-panel">
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User Type</th>
                    <th>Account Name</th>
                    <th>Document Proof</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="6" class="admin-empty">No registration applications found.</td></tr>'}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      `;
    }

    else if (tab === 'admin-ledger') {
      container.innerHTML = `
        <div class="admin-cmd">
          <header class="admin-cmd-header">
            <div>
              <p class="admin-cmd-eyebrow">Finance</p>
              <h1 class="admin-cmd-title">Donation Ledger</h1>
              <p class="admin-cmd-subtitle">Complete audit trail of incoming donations and outgoing allocations.</p>
            </div>
          </header>
          <div class="admin-kpi-grid admin-kpi-grid--3">
            <article class="admin-kpi-card"><span class="admin-kpi-label">Total Collected</span><p class="admin-kpi-value">$24,500</p></article>
            <article class="admin-kpi-card"><span class="admin-kpi-label">Total Distributed</span><p class="admin-kpi-value">$18,250</p></article>
            <article class="admin-kpi-card"><span class="admin-kpi-label">Reserve Balance</span><p class="admin-kpi-value">$6,250</p></article>
          </div>
          <article class="admin-panel admin-panel-ledger">
            <div class="admin-panel-head"><h2 class="admin-panel-title">Transaction History</h2></div>
            <div class="admin-table-wrap">
              <table class="admin-table admin-table-ledger">
                <thead>
                  <tr><th>Date</th><th>Donation Source</th><th>Amount In</th><th>Recipient</th><th>Amount Out</th><th>Balance</th></tr>
                </thead>
                <tbody>
                  <tr><td>2026-07-07</td><td>Rajesh Mehta</td><td class="admin-ledger-in">$500</td><td>Health Fund</td><td class="admin-ledger-out">—</td><td><strong>$24,500</strong></td></tr>
                  <tr><td>2026-07-05</td><td>Platform Reserve</td><td class="admin-ledger-in">—</td><td>Ravi Kumar</td><td class="admin-ledger-out">$400</td><td><strong>$24,000</strong></td></tr>
                  <tr><td>2026-07-04</td><td>Anonymous</td><td class="admin-ledger-in">$1,200</td><td>Helpage India</td><td class="admin-ledger-out">$1,500</td><td><strong>$24,400</strong></td></tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      `;
    }

    else if (tab === 'admin-users') {
      container.innerHTML = `
        <div class="admin-cmd">
          <header class="admin-cmd-header">
            <div>
              <p class="admin-cmd-eyebrow">Access Control</p>
              <h1 class="admin-cmd-title">User Management</h1>
              <p class="admin-cmd-subtitle">Manage platform roles, permissions, and account lifecycle.</p>
            </div>
          </header>
          <article class="admin-panel">
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr><th>Account</th><th>Role</th><th>Status</th><th>Last Active</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>admin@abhayahastam.org</strong></td><td><span class="admin-entity-badge">Admin</span></td><td><span class="admin-status-pill admin-status-verified">Active</span></td><td>Today</td><td><button type="button" class="admin-btn admin-btn-defer">Manage</button></td></tr>
                  <tr><td><strong>donor@gmail.com</strong></td><td><span class="admin-entity-badge admin-entity-donor">Donor</span></td><td><span class="admin-status-pill admin-status-verified">Active</span></td><td>2026-07-08</td><td><button type="button" class="admin-btn admin-btn-defer">Manage</button></td></tr>
                  <tr><td><strong>ngo@ashakiran.org</strong></td><td><span class="admin-entity-badge admin-entity-ngo">NGO</span></td><td><span class="admin-status-pill admin-status-pending">Pending</span></td><td>2026-07-07</td><td><button type="button" class="admin-btn admin-btn-defer">Manage</button></td></tr>
                  <tr><td><strong>receiver@outlook.com</strong></td><td><span class="admin-entity-badge admin-entity-receiver">Receiver</span></td><td><span class="admin-status-pill admin-status-verified">Active</span></td><td>2026-07-06</td><td><button type="button" class="admin-btn admin-btn-defer">Manage</button></td></tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      `;
    }

    else if (tab === 'admin-inventory') {
      let cards = appState.inventory.map(item => `
        <div class="inventory-card">
          <div class="inventory-card-top">
            <div>
              <h3 class="inventory-item-name">${item.name}</h3>
              <span class="badge badge-gray">${item.category}</span>
            </div>
            <div class="inventory-qty-block">
              <span class="inventory-qty">${item.qty}</span>
              <span class="inventory-unit">${item.unit}</span>
            </div>
          </div>
          <div class="inventory-card-actions">
            <button type="button" class="btn-outline btn-sm" onclick="adjustInventory('${item.id}', -10)">− 10</button>
            <button type="button" class="btn-outline btn-sm" onclick="adjustInventory('${item.id}', 10)">+ 10</button>
          </div>
        </div>
      `).join('');
      
      container.innerHTML = `
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Inventory</h1>
            <p class="dashboard-subtitle">Warehouse stock available for NGO and receiver requests.</p>
          </div>
          <button type="button" class="btn-sm" onclick="addNewInventoryPrompt()">+ Add Item</button>
        </div>

        <div class="inventory-grid">
          ${cards}
        </div>

        <div class="dash-card inventory-note-card">
          <p class="inventory-note">
            Verified NGOs can request these items. Adjust stock with +10 / −10, or add a new item for the demo.
          </p>
        </div>
      `;
    }
    
    else if (tab === 'admin-requests') {
      let rows = appState.requests.map(req => `
        <tr>
          <td>
            <div class="cell-primary">${req.requester}</div>
          </td>
          <td><span class="badge badge-gray">${req.type}</span></td>
          <td><div class="cell-details">${req.details}</div></td>
          <td><span class="badge ${req.status === 'Approved' ? 'status-approved' : req.status === 'Rejected' ? 'status-rejected' : 'status-pending'}">${req.status}</span></td>
          <td>
            ${req.status === 'Pending' ? `
              <div class="action-btns">
                <button type="button" class="btn-approve" onclick="approveRequest('${req.id}')">Approve</button>
                <button type="button" class="btn-reject" onclick="rejectRequest('${req.id}')">Reject</button>
              </div>
            ` : `
              <span class="action-done">Done</span>
            `}
          </td>
        </tr>
      `).join('');
      
      container.innerHTML = `
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Requests</h1>
            <p class="dashboard-subtitle">Review NGO and receiver assistance requests.</p>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-card-title">Assistance queue</div>
          <div class="table-container">
            <table class="wireframe-table requests-table">
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows.length ? rows : '<tr><td colspan="5" class="text-center">No active requests found.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
    
    else if (tab === 'admin-reports') {
      container.innerHTML = `
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Reports & Impact Analytics</h1>
            <p class="dashboard-subtitle">Monitor distribution metrics, donations flow, and platform operation graphs.</p>
          </div>
        </div>
        
        <div class="dash-metrics-grid">
          <div class="metric-card">
            <div class="metric-card-label">Total Monetary Donations</div>
            <div class="metric-card-value">$24,500</div>
          </div>
          <div class="metric-card">
            <div class="metric-card-label">Items Distributed</div>
            <div class="metric-card-value">1,480 units</div>
          </div>
          <div class="metric-card">
            <div class="metric-card-label">Hardship Cases Helped</div>
            <div class="metric-card-value">142 Cases</div>
          </div>
        </div>

        <div class="dash-sections-grid equal-cols">
          <div class="dash-card">
            <div class="dash-card-title">Donation Flow Trend</div>
            <div class="illustration-placeholder" style="min-height: 250px; background: linear-gradient(135deg, #e0e7ff 0%, #eeeffc 100%);">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📈</div>
              <span style="color: var(--color-primary);">Donations Volume Graph</span>
            </div>
          </div>
          <div class="dash-card">
            <div class="dash-card-title">Distribution by Category</div>
            <div class="illustration-placeholder" style="min-height: 250px; background: linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 100%);">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📊</div>
              <span style="color: var(--color-secondary);">Relief Distribution Analysis</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  else if (role === 'donor') {
    renderDonorTabContent(container, tab);
    return;
  }

  else if (role === 'receiver') {
    renderReceiverTabContent(container, tab);
    return;
  }

  else if (role === 'ngo') {
    renderNgoTabContent(container, tab);
    return;
  }
}

// --- Interactive Simulation Functions ---

// 1. Admin action: verify user/ngo/receiver
function verifyEntity(id) {
  let item = appState.verifications.find(v => v.id === id);
  if (item) {
    item.status = "Verified";
    if (typeof syncDonorVerificationOnApprove === 'function') {
      syncDonorVerificationOnApprove(item);
    }
    if (typeof syncNgoVerificationOnApprove === 'function') {
      syncNgoVerificationOnApprove(item);
    }
    alert(`Success: ${item.name} has been verified successfully!`);
    renderDashboardLayout();
  }
}

function rejectEntity(id) {
  let item = appState.verifications.find(v => v.id === id);
  if (item) {
    if (item.type === 'Donor') {
      item.status = 'Rejected';
      if (typeof syncDonorVerificationOnApprove === 'function') {
        syncDonorVerificationOnApprove(item);
      }
      alert(`Verification for ${item.name} has been rejected.`);
    } else if (item.type === 'NGO') {
      item.status = 'Rejected';
      if (typeof syncNgoVerificationOnApprove === 'function') {
        syncNgoVerificationOnApprove(item);
      }
      alert(`Verification for ${item.name} has been rejected.`);
    } else {
      appState.verifications.splice(appState.verifications.indexOf(item), 1);
      alert(`Registration request declined.`);
    }
    renderDashboardLayout();
  }
}

function flagEntity(id) {
  let item = appState.verifications.find(v => v.id === id);
  if (item) {
    item.status = 'Flagged';
    alert(`${item.name} has been flagged for further review.`);
    renderDashboardLayout();
  }
}

// 2. Admin action: approve/reject relief requests
function approveRequest(id) {
  let req = appState.requests.find(r => r.id === id);
  if (req) {
    req.status = "Approved";
    
    // If it's an item assistance request, deduct it from inventory
    if (req.type === "Items Assistance") {
      // Try to parse quantity and name from details
      // Detail example: "Needs 20x Winter Blankets for shelter housing"
      let qtyMatch = req.details.match(/Needs (\d+)x (.+) for/);
      if (qtyMatch) {
        let requestedQty = parseInt(qtyMatch[1], 10);
        let itemName = qtyMatch[2].trim();
        let invItem = appState.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (invItem) {
          invItem.qty = Math.max(0, invItem.qty - requestedQty);
        }
      }
    }
    
    alert(`Request ${id} approved successfully!`);
    renderDashboardLayout();
  }
}

function rejectRequest(id) {
  let req = appState.requests.find(r => r.id === id);
  if (req) {
    req.status = "Rejected";
    alert(`Request ${id} rejected.`);
    renderDashboardLayout();
  }
}

// 3. Admin action: stock adjustment
function adjustInventory(id, amount) {
  let item = appState.inventory.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(0, item.qty + amount);
    renderDashboardLayout();
  }
}

function addNewInventoryPrompt() {
  let name = prompt("Enter Item Name:");
  if (!name) return;
  let category = prompt("Enter Category (Medical Supplies / Food & Rations / Shelter/Clothing):", "Medical Supplies");
  if (!category) return;
  let qty = parseInt(prompt("Enter Initial Stock Quantity:", "10"), 10);
  if (isNaN(qty)) qty = 0;
  
  let newId = 'inv-' + (appState.inventory.length + 1);
  appState.inventory.push({
    id: newId,
    name: name,
    category: category,
    qty: qty,
    unit: "pcs"
  });
  
  alert(`Successfully added ${name} to inventory!`);
  renderDashboardLayout();
}

// 4. Donor action: submit mock donation
function submitDonation(type) {
  if (type === 'financial') {
    let amount = document.getElementById('donor-amount').value;
    let designation = document.getElementById('donor-fund-designation').value;
    if (!amount) {
      alert("Please enter a donation amount.");
      return;
    }
    
    appState.donations.unshift({
      id: 'don-' + (appState.donations.length + 1),
      donor: appState.currentUser.name,
      donorEmail: appState.currentUser.email || appState.currentUser.name,
      type: "Financial",
      amount: parseFloat(amount),
      fund: designation,
      details: `$${amount} donation towards ${designation}`,
      date: new Date().toISOString().split('T')[0],
      status: "Pending Allocation",
      usage: null
    });
    
    alert(`Thank you! Your donation of $${amount} to "${designation}" has been received. Our admin team will publish fund usage details in your Donation Impact dashboard once allocated.`);
    switchTab('donor-my-donations');
  } 
  else if (type === 'item') {
    let category = document.getElementById('donor-item-category').value;
    let details = document.getElementById('donor-item-details').value;
    if (!details) {
      alert("Please specify what items you are donating.");
      return;
    }
    
    appState.donations.unshift({
      id: 'don-' + (appState.donations.length + 1),
      donor: appState.currentUser.name,
      donorEmail: appState.currentUser.email || appState.currentUser.name,
      type: "Items",
      amount: null,
      fund: category,
      details: `[${category}] ${details}`,
      date: new Date().toISOString().split('T')[0],
      status: "Pending Verification",
      usage: null
    });
    
    alert(`Thank you! Your donation request for "${details}" has been registered. Please drop off the items or expect our pickup agent.`);
    switchTab('donor-my-donations');
  }
}

// 5. NGO action: submit request
function submitNgoRequest(type) {
  if (type === 'item') {
    let itemName = document.getElementById('ngo-req-item').value;
    let qty = document.getElementById('ngo-req-qty').value;
    let purpose = document.getElementById('ngo-req-purpose').value;
    
    if (!qty || !purpose) {
      alert("Please fill in quantity and beneficiary purpose.");
      return;
    }
    
    appState.requests.unshift({
      id: 'req-' + (appState.requests.length + 1),
      requester: appState.currentUser.name + " (NGO)",
      type: "Items Assistance",
      details: `Needs ${qty}x ${itemName} for: ${purpose}`,
      status: "Pending"
    });
    
    alert("Request for items has been submitted to AJA Admins for review.");
    switchTab('ngo-history');
  }
  else if (type === 'financial') {
    let amount = document.getElementById('ngo-req-amount').value;
    let proposal = document.getElementById('ngo-req-proposal').value;
    
    if (!amount || !proposal) {
      alert("Please specify requested funds amount and project proposal.");
      return;
    }
    
    appState.requests.unshift({
      id: 'req-' + (appState.requests.length + 1),
      requester: appState.currentUser.name + " (NGO)",
      type: "Financial Assistance",
      details: `Requesting $${amount} fund allocation. Proposal: ${proposal}`,
      status: "Pending"
    });
    
    alert("Financial grant application submitted to AJA Admin panel.");
    switchTab('ngo-history');
  }
}

// 6. Receiver action: submit financial support request only
function submitReceiverRequest(type) {
  if (type !== 'money') return;

  let amount = document.getElementById('receiver-money-amount').value;
  let details = document.getElementById('receiver-money-details').value;
  let doc = document.getElementById('receiver-money-doc').value;
  
  if (!amount || !details || !doc) {
    alert("Please enter amount, reason, and upload a supporting document.");
    return;
  }
  
  let filename = doc.split('\\').pop() || "proof_of_hardship.pdf";
  
  appState.requests.unshift({
    id: 'req-' + (appState.requests.length + 1),
    requester: appState.currentUser.name + " (Receiver)",
    type: "Financial Support",
    details: `Needs $${amount} for: ${details}. Supporting Doc: ${filename}`,
    status: "Pending"
  });
  
  alert("Your financial support request has been submitted.");
  switchTab('receiver-history');
}

// Function to autofill credentials on login page
function fillCredentials(email, role) {
  const tabRole = role === 'super-admin' ? 'admin' : role;
  switchLoginTab(tabRole, true);

  const emailInput = document.getElementById('auth-primary-input');
  const passwordInput = document.getElementById('auth-password-input');
  const mfaInput = document.getElementById('auth-mfa-input');

  if (emailInput && passwordInput) {
    emailInput.value = email;
    passwordInput.value = 'password123';
    if (mfaInput && LOGIN_TAB_CONFIG[tabRole]?.showMfa) {
      mfaInput.value = '123456';
    }
    clearAuthFieldErrors();

    const card = document.querySelector('.auth-unified-card');
    if (card) {
      card.style.transition = 'box-shadow 0.2s ease';
      card.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.22), var(--shadow-xl)';
      setTimeout(() => {
        card.style.boxShadow = '';
      }, 320);
    }
  }
}

// Route navigation from home/footer links directly to active dashboards tabs if logged in
const ROLE_AUTH_CONFIG = {
  donor: {
    icon: '💚',
    title: 'Continue as Donor',
    desc: 'Sign in or create a donor account to give items, funds, and track your impact.',
    footnote: 'Donors can see exactly how every contribution is used.',
    registerLabel: 'Register as Donor',
    loginTab: 'donor',
    dashboardTab: 'donor-dashboard',
    requiredRole: 'donor'
  },
  receiver: {
    icon: '🙋',
    title: 'Request Support',
    desc: 'Sign in or register as a receiver to request financial help or relief items.',
    footnote: 'Verification keeps the process safe and dignified for everyone.',
    registerLabel: 'Register as Receiver',
    loginTab: 'receiver',
    dashboardTab: 'receiver-dashboard',
    requiredRole: 'receiver'
  },
  ngo: {
    icon: '🏛️',
    title: 'NGO Partner Access',
    desc: 'Sign in or register your organization to request stock, funding, and coordinate relief.',
    footnote: 'Verified NGO partners get access to the coordination portal.',
    registerLabel: 'Register as NGO',
    loginTab: 'ngo',
    dashboardTab: 'ngo-dashboard',
    requiredRole: 'ngo'
  }
};

let pendingRoleAuth = null;

function openRoleAuthModal(roleKey) {
  const config = ROLE_AUTH_CONFIG[roleKey];
  if (!config) return;

  pendingRoleAuth = roleKey;
  const modal = document.getElementById('role-auth-modal');
  const icon = document.getElementById('role-auth-icon');
  const title = document.getElementById('role-auth-title');
  const desc = document.getElementById('role-auth-desc');
  const footnote = document.getElementById('role-auth-footnote');
  const registerBtn = document.getElementById('role-auth-register-btn');
  const loginBtn = document.getElementById('role-auth-login-btn');

  if (icon) icon.textContent = config.icon;
  if (title) title.textContent = config.title;
  if (desc) desc.textContent = config.desc;
  if (footnote) footnote.textContent = config.footnote;
  if (registerBtn) registerBtn.textContent = config.registerLabel;
  if (loginBtn) loginBtn.textContent = 'Sign In';

  if (modal) {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('role-auth-open');
    registerBtn?.focus();
  }
}

function closeRoleAuthModal() {
  const modal = document.getElementById('role-auth-modal');
  if (modal) {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('role-auth-open');
  pendingRoleAuth = null;
}

function confirmRoleRegister() {
  const roleKey = pendingRoleAuth;
  if (!roleKey) return;
  closeRoleAuthModal();
  appState.selectedRegistrationRole = roleKey;
  if (roleKey === 'ngo') showView('register-ngo');
  else if (roleKey === 'donor') showView('register-donor');
  else if (roleKey === 'receiver') showView('register-receiver');
}

function confirmRoleLogin() {
  const roleKey = pendingRoleAuth;
  if (!roleKey) return;
  const config = ROLE_AUTH_CONFIG[roleKey];
  closeRoleAuthModal();
  showView('login');
  switchLoginTab(config.loginTab, true);
}

function handleNavRoleAction(roleKey) {
  const config = ROLE_AUTH_CONFIG[roleKey];
  if (!config) return;

  if (appState.currentUser) {
    if (appState.currentUser.role === config.requiredRole) {
      appState.currentTab = config.dashboardTab;
      showView('dashboard');
      return;
    }
    openRoleAuthModal(roleKey);
    const desc = document.getElementById('role-auth-desc');
    const registerBtn = document.getElementById('role-auth-register-btn');
    const loginBtn = document.getElementById('role-auth-login-btn');
    if (desc) {
      desc.textContent = `You are signed in as ${getRoleDisplayName(appState.currentUser.role)}. Please sign in with a ${getRoleDisplayName(config.requiredRole)} account to continue.`;
    }
    if (registerBtn) registerBtn.textContent = `Register as ${getRoleDisplayName(config.requiredRole)}`;
    if (loginBtn) loginBtn.textContent = `Sign In as ${getRoleDisplayName(config.requiredRole)}`;
    return;
  }

  openRoleAuthModal(roleKey);
}

function handleFooterAction(actionType) {
  const roleMap = { donate: 'donor', receiver: 'receiver', ngo: 'ngo' };
  const roleKey = roleMap[actionType];
  if (roleKey) {
    handleNavRoleAction(roleKey);
    return;
  }
}

const AUTH_VIEWS = ['login', 'register-role', 'register-donor', 'register-receiver', 'register-ngo'];

function goHome() {
  showView('home');
}

function scrollToLandingSection(sectionId) {
  showView('home');
  window.setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function initTheme() {
  const saved = localStorage.getItem('giveaway-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('giveaway-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('giveaway-theme', 'dark');
  }
}

function updatePublicNavVisibility() {
  const publicNav = document.getElementById('public-nav-links');
  if (!publicNav) return;
  const onPublicSurface = appState.currentView === 'home' || AUTH_VIEWS.includes(appState.currentView);
  publicNav.style.display = !appState.currentUser && onPublicSurface ? 'flex' : 'none';
}

// --- Global UI Listeners Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  document.getElementById('nav-login').addEventListener('click', (e) => { e.preventDefault(); showView('login'); });
  document.getElementById('nav-register').addEventListener('click', (e) => { e.preventDefault(); startRegistration(); });
  
  document.getElementById('nav-dashboard-link').addEventListener('click', (e) => { e.preventDefault(); showView('dashboard'); });
  document.getElementById('nav-logout').addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });
  
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const publicNav = document.getElementById('public-nav-links');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (navLinks) navLinks.classList.toggle('mobile-open');
      if (publicNav) publicNav.classList.toggle('is-open');
    });
  }

  initLoginTabs();
  showView('home');

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('role-auth-modal')?.hidden) {
      closeRoleAuthModal();
    }
  });
});
