import { createContext, useContext, useMemo, useReducer, useEffect, useCallback, useState } from 'react';
import { createInitialState } from '../data/mockData';
import {
  loadVerifications,
  persistVerifications,
  loadNgoProfiles,
  persistNgoProfile,
  deriveNgoUserFields,
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
import { mapIamUser, mapRoleToIam, normalizeMobileInput, isUserAppRole, ADMIN_PORTAL_MESSAGE } from '../utils/roleMap';
import { fetchPlatformData, coreClient, notificationsClient } from '../api/platformApi';
import { mapDonationFromApi, mapVerificationFromApi, mapAssistanceRequestFromApi, buildAssistanceRequestPayload } from '../api/mappers';
import { deriveDonorVerificationFromRequests, deriveReceiverVerificationFromRequests } from '../utils/donorVerification';

const AppContext = createContext(null);

function getDefaultTab(role) {
  const map = {
    donor: 'donor-dashboard',
    ngo: 'ngo-dashboard',
    receiver: 'receiver-dashboard'
  };
  return map[role] || 'donor-dashboard';
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
    case 'SET_PLATFORM_DATA':
      return { ...state, ...action.payload };
    case 'SET_PLATFORM_LOADING':
      return { ...state, platformLoading: action.payload };
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
    case 'ADD_RECEIVER_APPLICATION':
      return {
        ...state,
        receiverApplications: [action.payload, ...(state.receiverApplications || [])]
      };
    case 'UPDATE_RECEIVER_APPLICATION': {
      const receiverApplications = (state.receiverApplications || []).map((a) =>
        a.id === action.payload.id ? { ...a, ...action.payload } : a
      );
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
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const base = createInitialState();
    return {
      currentUser: null,
      currentTab: 'overview',
      editingDonationId: null,
      platformLoading: false,
      ...base,
      verifications: loadVerifications(base.verifications),
      receiverApplications: []
    };
  });

  const refreshPlatformData = useCallback(async (role) => {
    if (!role) return;
    dispatch({ type: 'SET_PLATFORM_LOADING', payload: true });
    try {
      const data = await fetchPlatformData(role);
      dispatch({ type: 'SET_PLATFORM_DATA', payload: data });
      if (role === 'donor') {
        const verificationPatch = deriveDonorVerificationFromRequests(data.verifications);
        if (verificationPatch) {
          dispatch({ type: 'UPDATE_USER', payload: verificationPatch });
        }
      }
      if (role === 'receiver') {
        const verificationPatch = deriveReceiverVerificationFromRequests(data.verifications);
        if (verificationPatch) {
          dispatch({ type: 'UPDATE_USER', payload: verificationPatch });
        }
      }
    } finally {
      dispatch({ type: 'SET_PLATFORM_LOADING', payload: false });
    }
  }, []);

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
          const user = mapIamUser(me);
          if (!isUserAppRole(user.role) || (user.status && user.status !== 'ACTIVE')) {
            clearTokens();
            return;
          }
          dispatch({ type: 'LOGIN', payload: user });
          await refreshPlatformData(user.role);
        }
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    restoreSession();
    return () => { cancelled = true; };
  }, [refreshPlatformData]);

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
    if (!isUserAppRole(user.role)) {
      clearTokens();
      throw new Error(ADMIN_PORTAL_MESSAGE);
    }
    if (user.status && user.status !== 'ACTIVE') {
      clearTokens();
      throw new Error('Your account is awaiting admin approval. Please try again after approval.');
    }
    dispatch({ type: 'LOGIN', payload: user });
    await refreshPlatformData(user.role);
    return user;
  }, [refreshPlatformData]);

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
    try {
      await coreClient.createVerificationRequest({
        entity_type: role_name,
        notes: `${role_name} registration pending admin approval`,
      });
    } catch {
      /* verification queue is best-effort; account remains pending */
    }
    try {
      await iamLogout(tokens.refresh_token);
    } catch {
      /* revoke best-effort */
    }
    clearTokens();
    return {
      pendingApproval: true,
      name: full_name,
      email,
      role,
      status: 'PENDING',
      ...profile,
    };
  }, []);

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await iamLogout(refreshToken);
    } catch {
      /* revoke best-effort */
    } finally {
      clearTokens();
      dispatch({ type: 'LOGOUT' });
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLogoutLoading(false);
    }
  }, []);

  const submitNgoVerification = useCallback((payload) => {
    dispatch({ type: 'UPSERT_NGO_VERIFICATION', payload });
  }, []);

  const submitDonation = useCallback(async (payload) => {
    const created = await coreClient.createDonation(payload);
    const mapped = mapDonationFromApi(created);
    dispatch({ type: 'ADD_DONATION', payload: mapped });
    await refreshPlatformData(state.currentUser?.role);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.role]);

  const submitDonorVerification = useCallback(async ({ notes }) => {
    let profile = await coreClient.getMyDonorProfile().catch(() => null);
    if (!profile) {
      profile = await coreClient.createDonorProfile({
        organization_name: state.currentUser?.name || undefined,
      });
    }
    const created = await coreClient.createVerificationRequest({
      entity_type: 'DONOR',
      entity_id: profile.donor_profile_id,
      notes: notes || 'Donor verification request',
    });
    const mapped = mapVerificationFromApi(created);
    dispatch({ type: 'ADD_VERIFICATION', payload: mapped });
    dispatch({ type: 'UPDATE_USER', payload: { verified: 'pending', verificationStatus: 'submitted' } });
    await refreshPlatformData('donor');
    return mapped;
  }, [refreshPlatformData, state.currentUser?.name]);

  const loadDonorProfile = useCallback(async () => {
    const profile = await coreClient.getMyDonorProfile().catch(() => null);
    if (profile) {
      dispatch({
        type: 'UPDATE_USER',
        payload: {
          donorProfileId: profile.donor_profile_id,
          panNumber: profile.pan_number,
          profileStatus: profile.status,
        },
      });
    }
    return profile;
  }, []);

  const submitAssistanceRequest = useCallback(async ({ categoryId, categoryTitle, form }) => {
    const payload = buildAssistanceRequestPayload({ categoryId, categoryTitle, form });
    const created = await coreClient.createAssistanceRequest(payload);
    const mapped = mapAssistanceRequestFromApi(created);
    dispatch({ type: 'ADD_RECEIVER_APPLICATION', payload: mapped });
    await refreshPlatformData(state.currentUser?.role);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.role]);

  const markNotificationReadRemote = useCallback(async (listKey, id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { listKey, id } });
    try {
      await notificationsClient.markNotificationRead(id);
    } catch {
      /* optimistic UI */
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      authLoading,
      logoutLoading,
      dispatch,
      login,
      register,
      logout,
      refreshPlatformData,
      submitDonation,
      submitDonorVerification,
      loadDonorProfile,
      submitAssistanceRequest,
      markNotificationReadRemote,
      submitNgoVerification,
      setTab: (tab) => dispatch({ type: 'SET_TAB', payload: tab })
    }),
    [state, authLoading, logoutLoading, login, register, logout, refreshPlatformData, submitDonation, submitDonorVerification, loadDonorProfile, submitAssistanceRequest, markNotificationReadRemote, submitNgoVerification]
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
