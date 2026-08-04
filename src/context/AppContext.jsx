import { createContext, useContext, useMemo, useReducer, useEffect, useCallback, useState } from 'react';
import { createInitialState } from '../data/mockData';
import {
  loadVerifications,
  persistVerifications,
  loadNgoProfiles,
  persistNgoProfile,
  deriveNgoUserFields,
  ngoEmailMatches,
  VERIFICATIONS_STORAGE_KEY
} from '../utils/ngoVerificationStore';
import {
  login as iamLogin,
  register as iamRegister,
  logout as iamLogout,
  refresh as iamRefresh,
  getMe,
  saveTokens,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken
} from '../api/iamClient';
import { mapIamUser, mapRoleToIam, normalizeMobileInput } from '../utils/roleMap';

const AppContext = createContext(null);

function getDefaultTab(role) {
  const map = {
    'super-admin': 'admin-dashboard',
    donor: 'donor-dashboard',
    ngo: 'ngo-dashboard',
    receiver: 'receiver-dashboard'
  };
  return map[role] || 'donor-dashboard';
}

const RECEIVER_APPS_STORAGE_KEY = 'giveaway-receiver-applications';

function loadReceiverApplications(defaultApps) {
  if (typeof window === 'undefined') return defaultApps;
  try {
    const raw = localStorage.getItem(RECEIVER_APPS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultApps;
}

function persistReceiverApplications(apps) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECEIVER_APPS_STORAGE_KEY, JSON.stringify(apps));
  } catch {
    /* ignore */
  }
}

function makeNotification(id, title, message, icon = 'bell') {
  return {
    id,
    title,
    message,
    time: 'Just now',
    group: 'today',
    read: false,
    icon
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const user = action.payload;
      return { ...state, currentUser: user, currentTab: getDefaultTab(user.role) };
    }
    case 'LOGOUT':
      return { ...state, currentUser: null, currentTab: 'overview', editingDonationId: null };
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'UPDATE_USER':
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };
    case 'SET_EDITING_DONATION':
      return { ...state, editingDonationId: action.payload };
    case 'PATCH_DATA':
      return { ...state, ...action.payload };
    case 'ADD_DONATION':
      return { ...state, donations: [action.payload, ...state.donations] };
    case 'UPDATE_DONATION':
      return {
        ...state,
        donations: state.donations.map((d) => (d.id === action.payload.id ? { ...d, ...action.payload } : d))
      };
    case 'ADD_VERIFICATION': {
      const verifications = [action.payload, ...state.verifications];
      persistVerifications(verifications);
      return { ...state, verifications };
    }
    case 'UPSERT_NGO_VERIFICATION': {
      const payload = action.payload;
      const email = (payload.email || '').toLowerCase();
      const existingIdx = state.verifications.findIndex(
        (v) => v.type === 'NGO' && (v.email || '').toLowerCase() === email && v.status === 'Pending'
      );
      let verifications;
      if (existingIdx >= 0) {
        verifications = state.verifications.map((v, i) =>
          i === existingIdx ? { ...v, ...payload, status: 'Pending' } : v
        );
      } else {
        verifications = [payload, ...state.verifications];
      }
      persistVerifications(verifications);

      const ngoNotifications = [
        makeNotification(
          `nn-${Date.now()}`,
          'Verification Submitted',
          'Your documents have been submitted and are pending admin review.',
          'clock'
        ),
        ...(state.ngoNotifications || [])
      ];
      const adminNotifications = [
        makeNotification(
          `adm-n-${Date.now()}`,
          'New NGO Verification',
          `${payload.name} submitted verification documents for review.`,
          'shield'
        ),
        ...(state.adminNotifications || [])
      ];

      persistNgoProfile(email, { verified: 'pending', verificationStatus: 'submitted', status: 'Registered NGO' });

      let currentUser = state.currentUser;
      if (state.currentUser?.role === 'ngo' && (state.currentUser.email || '').toLowerCase() === email) {
        currentUser = {
          ...state.currentUser,
          verified: 'pending',
          verificationStatus: 'submitted',
          status: 'Registered NGO',
          rejectionReason: undefined
        };
      }

      return {
        ...state,
        verifications,
        ngoNotifications,
        adminNotifications,
        currentUser
      };
    }
    case 'UPDATE_VERIFICATION': {
      const verifications = state.verifications.map((v) =>
        v.id === action.payload.id ? { ...v, ...action.payload } : v
      );
      persistVerifications(verifications);
      return { ...state, verifications };
    }
    case 'APPROVE_VERIFICATION': {
      const { id, approvedBy = 'Platform Admin' } = action.payload;
      const item = state.verifications.find((v) => v.id === id);
      if (!item) return state;

      const reviewedAt = new Date().toISOString().split('T')[0];
      const verifications = state.verifications.map((v) =>
        v.id === id
          ? { ...v, status: 'Verified', reviewedAt, approvedBy, reviewer: approvedBy }
          : v
      );
      persistVerifications(verifications);

      let ngos = state.ngos;
      let currentUser = state.currentUser;
      let ngoNotifications = state.ngoNotifications || [];
      let adminNotifications = state.adminNotifications || [];

      if (item.type === 'NGO') {
        ngos = (state.ngos || []).map((n) =>
          ngoEmailMatches(n, item.email) ? { ...n, verified: true, status: 'Verified' } : n
        );
        persistNgoProfile(item.email, {
          verified: true,
          verificationStatus: 'approved',
          status: 'Verified NGO',
          verifiedAt: reviewedAt,
          rejectionReason: undefined
        });

        if (state.currentUser?.role === 'ngo' && (state.currentUser.email || '').toLowerCase() === (item.email || '').toLowerCase()) {
          currentUser = {
            ...state.currentUser,
            verified: true,
            verificationStatus: 'approved',
            status: 'Verified NGO',
            rejectionReason: undefined,
            verifiedAt: reviewedAt
          };
        }

        ngoNotifications = [
          makeNotification(
            `nn-${Date.now()}`,
            'Verification Approved',
            'Congratulations! Your organization has been successfully verified.',
            'shield-check'
          ),
          ...ngoNotifications
        ];
        adminNotifications = [
          makeNotification(
            `adm-n-${Date.now()}`,
            'NGO Verification Approved',
            `NGO Verification Approved Successfully — ${item.name}.`,
            'circle-check'
          ),
          ...adminNotifications
        ];
      } else if (item.type === 'Donor') {
        if (state.currentUser && (state.currentUser.email === item.email || state.currentUser.name === item.name)) {
          currentUser = { ...state.currentUser, verified: true };
        }
      }

      return {
        ...state,
        verifications,
        ngos,
        currentUser,
        ngoNotifications,
        adminNotifications
      };
    }
    case 'REJECT_VERIFICATION': {
      const { id, reason = 'Documents could not be verified. Please resubmit.' } = action.payload;
      const item = state.verifications.find((v) => v.id === id);
      if (!item) return state;

      if (item.type !== 'NGO' && item.type !== 'Donor') {
        const verifications = state.verifications.filter((v) => v.id !== id);
        persistVerifications(verifications);
        return { ...state, verifications };
      }

      const reviewedAt = new Date().toISOString().split('T')[0];
      const verifications = state.verifications.map((v) =>
        v.id === id
          ? { ...v, status: 'Rejected', rejectionReason: reason, reviewedAt, reviewer: 'Platform Admin' }
          : v
      );
      persistVerifications(verifications);

      let currentUser = state.currentUser;
      let ngoNotifications = state.ngoNotifications || [];
      let adminNotifications = state.adminNotifications || [];

      if (item.type === 'NGO') {
        persistNgoProfile(item.email, {
          verified: 'rejected',
          verificationStatus: 'rejected',
          status: 'Verification Rejected',
          rejectionReason: reason
        });

        if (state.currentUser?.role === 'ngo' && (state.currentUser.email || '').toLowerCase() === (item.email || '').toLowerCase()) {
          currentUser = {
            ...state.currentUser,
            verified: 'rejected',
            verificationStatus: 'rejected',
            status: 'Verification Rejected',
            rejectionReason: reason
          };
        }

        ngoNotifications = [
          makeNotification(
            `nn-${Date.now()}`,
            'Verification Rejected',
            `Your verification was rejected: ${reason}`,
            'alert-circle'
          ),
          ...ngoNotifications
        ];
        adminNotifications = [
          makeNotification(
            `adm-n-${Date.now()}`,
            'NGO Verification Rejected',
            `${item.name} verification was rejected.`,
            'x-circle'
          ),
          ...adminNotifications
        ];
      } else if (state.currentUser?.email === item.email) {
        currentUser = {
          ...state.currentUser,
          verified: 'rejected',
          verificationStatus: 'rejected',
          rejectionReason: reason
        };
      }

      return {
        ...state,
        verifications,
        currentUser,
        ngoNotifications,
        adminNotifications
      };
    }
    case 'UPDATE_NGO':
      return {
        ...state,
        ngos: (state.ngos || []).map((n) =>
          n.id === action.payload.id ? { ...n, ...action.payload } : n
        )
      };
    case 'ADD_REQUEST':
      return { ...state, requests: [action.payload, ...state.requests] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map((r) => (r.id === action.payload.id ? { ...r, ...action.payload } : r))
      };
    case 'ADJUST_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: Math.max(0, item.qty + action.payload.delta) }
            : item
        )
      };
    case 'ADD_NGO_REQUEST':
      return { ...state, ngoRequests: [action.payload, ...(state.ngoRequests || [])] };
    case 'ADD_RECEIVER_APPLICATION': {
      const receiverApplications = [action.payload, ...(state.receiverApplications || [])];
      persistReceiverApplications(receiverApplications);
      return { ...state, receiverApplications };
    }
    case 'UPDATE_RECEIVER_APPLICATION': {
      const receiverApplications = (state.receiverApplications || []).map((a) =>
        a.id === action.payload.id ? { ...a, ...action.payload } : a
      );
      persistReceiverApplications(receiverApplications);
      return { ...state, receiverApplications };
    }
    case 'MARK_NOTIFICATION_READ': {
      const { listKey, id } = action.payload;
      return {
        ...state,
        [listKey]: (state[listKey] || []).map((n) => (n.id === id ? { ...n, read: true } : n))
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const base = createInitialState();
    return {
      currentUser: null,
      currentTab: 'overview',
      editingDonationId: null,
      ...base,
      verifications: loadVerifications(base.verifications),
      receiverApplications: loadReceiverApplications(base.receiverApplications)
    };
  });

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const refreshToken = getStoredRefreshToken();
      const accessToken = getStoredAccessToken();

      if (!refreshToken && !accessToken) {
        if (!cancelled) setAuthLoading(false);
        return;
      }

      try {
        let token = accessToken;
        if (refreshToken) {
          const tokens = await iamRefresh(refreshToken);
          saveTokens(tokens);
          token = tokens.access_token;
        }
        const me = await getMe(token);
        if (!cancelled) {
          dispatch({ type: 'LOGIN', payload: mapIamUser(me) });
        }
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== VERIFICATIONS_STORAGE_KEY || !e.newValue) return;
      try {
        const verifications = JSON.parse(e.newValue);
        dispatch({ type: 'PATCH_DATA', payload: { verifications } });
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('giveaway-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    if (state.currentUser?.role !== 'ngo') return;
    const email = state.currentUser.email;
    const profiles = loadNgoProfiles();
    const derived = deriveNgoUserFields(email, state.verifications, profiles[(email || '').toLowerCase()] || {});
    const changed =
      derived.verified !== state.currentUser.verified
      || derived.verificationStatus !== state.currentUser.verificationStatus
      || derived.rejectionReason !== state.currentUser.rejectionReason;
    if (changed) {
      dispatch({ type: 'UPDATE_USER', payload: derived });
    }
  }, [state.verifications, state.currentUser?.role, state.currentUser?.email, state.currentUser?.verified, state.currentUser?.verificationStatus]);

  const login = useCallback(async (email, password) => {
    const tokens = await iamLogin(email, password);
    saveTokens(tokens);
    const me = await getMe(tokens.access_token);
    const user = mapIamUser(me);
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  }, []);

  const register = useCallback(async ({ role, full_name, email, mobile, password, profile = {} }) => {
    const role_name = mapRoleToIam(role);
    if (!role_name) {
      throw new Error('Invalid role for registration.');
    }

    const normalizedMobile = normalizeMobileInput(mobile);
    if (normalizedMobile.length !== 10) {
      throw new Error('Enter a valid 10-digit mobile number.');
    }

    const tokens = await iamRegister({
      full_name,
      email,
      mobile: normalizedMobile,
      password,
      role_name
    });
    saveTokens(tokens);
    const me = await getMe(tokens.access_token);
    const user = { ...mapIamUser(me), ...profile };
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    clearTokens();
    dispatch({ type: 'LOGOUT' });
    await iamLogout(refreshToken);
  }, []);

  const verifyEntity = useCallback((id, approvedBy) => {
    dispatch({ type: 'APPROVE_VERIFICATION', payload: { id, approvedBy: approvedBy || 'Platform Admin' } });
  }, []);

  const rejectEntity = useCallback((id, reason) => {
    dispatch({
      type: 'REJECT_VERIFICATION',
      payload: { id, reason: reason || 'Documents could not be verified. Please resubmit.' }
    });
  }, []);

  const submitNgoVerification = useCallback((payload) => {
    dispatch({ type: 'UPSERT_NGO_VERIFICATION', payload });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      authLoading,
      dispatch,
      login,
      register,
      logout,
      verifyEntity,
      rejectEntity,
      submitNgoVerification,
      setTab: (tab) => dispatch({ type: 'SET_TAB', payload: tab })
    }),
    [state, authLoading, login, register, logout, verifyEntity, rejectEntity, submitNgoVerification]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function getRoleDisplayName(role) {
  const map = {
    donor: 'Donor',
    ngo: 'NGO Partner',
    receiver: 'Receiver',
    'super-admin': 'Platform Admin'
  };
  return map[role] || role;
}

export function isNgoVerified(user) {
  return user?.verified === true;
}

export function isRoleVerified(user) {
  if (!user) return false;
  if (user.role === 'ngo') return isNgoVerified(user);
  if (user.role === 'donor' || user.role === 'receiver') return user.verified === true;
  return true;
}

export function getNgoVerificationStatus(user) {
  if (!user) return 'registered';
  if (user.verificationStatus === 'approved' || user.verified === true) return 'verified';
  if (user.verificationStatus === 'submitted' || user.verified === 'pending') return 'pending';
  if (user.verificationStatus === 'rejected' || user.verified === 'rejected') return 'rejected';
  if (user.verified === 'suspended') return 'suspended';
  return 'registered';
}

export function isNgoVerificationSubmitted(user) {
  return getNgoVerificationStatus(user) === 'pending';
}

export { getNgoVerificationProgress } from '../utils/ngoVerificationStore';
