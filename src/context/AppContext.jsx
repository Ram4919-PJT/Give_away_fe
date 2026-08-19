import { createContext, useContext, useMemo, useReducer, useEffect, useCallback, useState } from 'react';
import { createInitialState } from '../data/mockData';
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
import { mapIamUser, mapRoleToIam, normalizeMobileInput, isUserAppRole } from '../utils/roleMap';
import { ADMIN_PORTAL_MESSAGE, redirectToAdminPortal } from '../utils/adminPortal';
import { fetchPlatformData, coreClient, notificationsClient } from '../api/platformApi';
import { mapDonationFromApi, mapVerificationFromApi, mapAssistanceRequestFromApi, buildAssistanceRequestPayload } from '../api/mappers';
import {
  deriveDonorVerificationFromRequests,
  deriveReceiverVerificationFromRequests,
  deriveReceiverVerificationFromProfile,
  deriveNgoVerificationFromRequests,
  deriveNgoVerificationFromProfile,
  deriveProfileVerificationFromStatus,
  mergeVerificationPatches,
} from '../utils/donorVerification';

const AppContext = createContext(null);

function getDefaultTab(role) {
  const map = {
    donor: 'donor-dashboard',
    ngo: 'ngo-dashboard',
    receiver: 'receiver-dashboard',
    admin: 'donor-dashboard',
  };
  return map[role] || 'donor-dashboard';
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
        currentUser
      };
    }
    case 'UPDATE_VERIFICATION': {
      const verifications = state.verifications.map((v) =>
        v.id === action.payload.id ? { ...v, ...action.payload } : v
      );
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
    case 'MARK_ALL_NOTIFICATIONS_READ': {
      const { listKey } = action.payload;
      return {
        ...state,
        [listKey]: (state[listKey] || []).map((n) => ({ ...n, read: true })),
        unreadNotificationCount: 0,
      };
    }
    case 'SET_NOTIFICATION_LIST': {
      const { listKey, items, unreadCount } = action.payload;
      return {
        ...state,
        [listKey]: items,
        ...(unreadCount !== undefined ? { unreadNotificationCount: unreadCount } : {}),
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
      ngoProfile: null,
      ...base,
      verifications: [],
      receiverApplications: []
    };
  });

  const refreshPlatformData = useCallback(async (role, userEmail = '', userId = null) => {
    if (!role) return;
    dispatch({ type: 'SET_PLATFORM_LOADING', payload: true });
    try {
      const data = await fetchPlatformData(role, userEmail);
      dispatch({ type: 'SET_PLATFORM_DATA', payload: data });
      if (role === 'donor') {
        const verificationPatch = mergeVerificationPatches(
          data.kycVerification?.profile_status
            ? deriveProfileVerificationFromStatus(
              data.kycVerification.profile_status,
              data.kycVerification.request,
            )
            : deriveDonorVerificationFromRequests(data.verifications, userId),
        );
        if (verificationPatch) {
          dispatch({ type: 'UPDATE_USER', payload: verificationPatch });
        }
      }
      if (role === 'receiver') {
        const verificationPatch = mergeVerificationPatches(
          deriveReceiverVerificationFromProfile(data.receiverProfile),
          data.kycVerification?.profile_status
            ? deriveProfileVerificationFromStatus(data.kycVerification.profile_status, data.kycVerification.request)
            : deriveReceiverVerificationFromRequests(data.verifications, userId),
        );
        if (verificationPatch) {
          dispatch({ type: 'UPDATE_USER', payload: verificationPatch });
        }
      }
      if (role === 'ngo') {
        const verificationPatch = mergeVerificationPatches(
          deriveNgoVerificationFromProfile(data.ngoProfile),
          data.kycVerification?.profile_status
            ? deriveProfileVerificationFromStatus(data.kycVerification.profile_status, data.kycVerification.request)
            : deriveNgoVerificationFromRequests(data.verifications, userId),
        );
        if (verificationPatch) {
          dispatch({ type: 'UPDATE_USER', payload: verificationPatch });
        }
      }
    } catch {
      /* platform data is non-blocking for auth */
    } finally {
      dispatch({ type: 'SET_PLATFORM_LOADING', payload: false });
    }
  }, []);

  const applyAuthenticatedUser = useCallback(async (me) => {
    const user = mapIamUser(me);
    if (user.role === 'admin') {
      clearTokens();
      redirectToAdminPortal();
      throw new Error(ADMIN_PORTAL_MESSAGE);
    }
    if (!isUserAppRole(user.role)) {
      clearTokens();
      throw new Error('This account cannot access the user application.');
    }
    if (user.status && user.status !== 'ACTIVE') {
      clearTokens();
      const pending = String(user.status).toUpperCase() === 'PENDING';
      throw new Error(
        pending
          ? 'Your account is pending activation. Ask an administrator to activate it from Admin → Users.'
          : 'Your account is not active. Please contact support.',
      );
    }
    dispatch({ type: 'LOGIN', payload: user });
    try {
      await refreshPlatformData(user.role, user.email, user.userId);
    } catch {
      /* non-blocking */
    }
    return user;
  }, [refreshPlatformData]);

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
        let me = null;

        if (accessToken) {
          try {
            me = await getMe(accessToken);
          } catch {
            me = null;
          }
        }

        if (!me && refreshToken) {
          const tokens = await iamRefresh(refreshToken);
          saveTokens(tokens);
          me = await getMe(tokens.access_token);
        }

        if (!me) {
          clearTokens();
          return;
        }

        if (!cancelled) {
          await applyAuthenticatedUser(me);
        }
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    restoreSession();
    return () => { cancelled = true; };
  }, [applyAuthenticatedUser]);

  useEffect(() => {
    const theme = localStorage.getItem('giveaway-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const login = useCallback(async (email, password) => {
    const tokens = await iamLogin(email, password);
    saveTokens(tokens);
    const me = await getMe(tokens.access_token);
    const preview = mapIamUser(me);
    if (preview.role === 'admin') {
      clearTokens();
      redirectToAdminPortal();
      throw new Error(ADMIN_PORTAL_MESSAGE);
    }
    return applyAuthenticatedUser(me);
  }, [applyAuthenticatedUser]);

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
      role_name,
    });
    saveTokens(tokens);

    const me = await getMe(tokens.access_token);

    const ensureProfile = async (createProfile) => {
      try {
        await createProfile({
          full_name,
          email,
          mobile: normalizedMobile,
        });
      } catch (err) {
        const message = String(err?.message || '');
        if (!/already exists/i.test(message)) {
          throw err;
        }
      }
    };

    if (role === 'receiver') {
      await ensureProfile(coreClient.createReceiverProfile);
      const user = await applyAuthenticatedUser(me);
      return {
        loggedIn: true,
        requiresKyc: true,
        user,
        name: full_name,
        email,
        role,
        ...profile,
      };
    }

    if (role === 'donor') {
      await ensureProfile(coreClient.createDonorProfile);
      const user = await applyAuthenticatedUser(me);
      return {
        loggedIn: true,
        user,
        name: full_name,
        email,
        role,
        ...profile,
      };
    }

    if (role === 'ngo') {
      const user = await applyAuthenticatedUser(me);
      return {
        loggedIn: true,
        requiresKyc: true,
        user,
        name: full_name,
        email,
        role,
        status: 'Registered NGO',
        ...profile,
      };
    }

    const user = await applyAuthenticatedUser(me);
    return { loggedIn: true, user, name: full_name, email, role, ...profile };
  }, [applyAuthenticatedUser]);

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        await iamLogout(refreshToken);
      }
    } catch {
      /* revoke best-effort */
    } finally {
      clearTokens();
      dispatch({ type: 'LOGOUT' });
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLogoutLoading(false);
    }
  }, []);

  const submitNgoVerification = useCallback(async ({ notes }) => {
    const created = await coreClient.submitNgoVerificationRequest(notes);
    const mapped = mapVerificationFromApi(created);
    dispatch({ type: 'ADD_VERIFICATION', payload: mapped });
    dispatch({ type: 'UPDATE_USER', payload: { verified: 'pending', verificationStatus: 'submitted' } });
    await refreshPlatformData('ngo', state.currentUser?.email, state.currentUser?.userId);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.email]);

  const submitDonation = useCallback(async (payload) => {
    const created = await coreClient.createDonation(payload);
    const mapped = mapDonationFromApi(created);
    dispatch({ type: 'ADD_DONATION', payload: mapped });
    await refreshPlatformData(state.currentUser?.role, state.currentUser?.email, state.currentUser?.userId);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.role]);

  const submitDonorVerification = useCallback(async () => {
    const { createOrResumeVerification, submitVerificationRequest, getKycReadiness } = await import('../api/verificationClient');
    const req = await createOrResumeVerification();
    const readiness = await getKycReadiness(req.request_id, { consentGiven: true });
    if (!readiness.ready) {
      throw new Error(readiness.errors?.[0]?.message || 'Verification is incomplete');
    }
    const updated = await submitVerificationRequest(req.request_id, {
      consentGiven: true,
      consentVersion: 'donor-verification-v1',
    });
    const mapped = mapVerificationFromApi(updated);
    dispatch({ type: 'ADD_VERIFICATION', payload: mapped });
    dispatch({ type: 'UPDATE_USER', payload: { verified: 'pending', verificationStatus: 'submitted' } });
    await refreshPlatformData('donor', state.currentUser?.email, state.currentUser?.userId);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.email, state.currentUser?.userId]);

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
    await refreshPlatformData('receiver', state.currentUser?.email, state.currentUser?.userId);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.email, state.currentUser?.userId]);

  const submitAssistanceBankDetails = useCallback(async (applicationId, bankForm) => {
    const updated = await coreClient.submitAssistanceBankDetails(applicationId, bankForm);
    const mapped = mapAssistanceRequestFromApi(updated);
    dispatch({ type: 'UPDATE_RECEIVER_APPLICATION', payload: mapped });
    await refreshPlatformData('receiver', state.currentUser?.email, state.currentUser?.userId);
    return mapped;
  }, [refreshPlatformData, state.currentUser?.email, state.currentUser?.userId]);

  const markNotificationReadRemote = useCallback(async (listKey, id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { listKey, id } });
    try {
      await notificationsClient.markNotificationRead(id);
    } catch {
      /* optimistic UI */
    }
  }, []);

  const markAllNotificationsReadRemote = useCallback(async (listKey) => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', payload: { listKey } });
    try {
      await notificationsClient.markAllNotificationsRead();
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
      submitAssistanceBankDetails,
      markNotificationReadRemote,
      markAllNotificationsReadRemote,
      submitNgoVerification,
      setTab: (tab) => dispatch({ type: 'SET_TAB', payload: tab })
    }),
    [state, authLoading, logoutLoading, login, register, logout, refreshPlatformData, submitDonation, submitDonorVerification, loadDonorProfile, submitAssistanceRequest, submitAssistanceBankDetails, markNotificationReadRemote, markAllNotificationsReadRemote, submitNgoVerification]
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
    admin: 'Administrator',
  };
  return map[role] || role;
}

export function isNgoVerified(user) {
  return user?.verified === true;
}

export function isNgoSuspended(user) {
  if (!user) return false;
  if (user.verified === 'suspended') return true;
  const status = String(user.verificationStatus || user.verification_status || '').toLowerCase();
  return status === 'suspended';
}

export function isRoleVerified(user) {
  if (!user) return false;
  if (user.role === 'ngo') return isNgoVerified(user);
  if (user.role === 'donor' || user.role === 'receiver') return user.verified === true;
  return true;
}

export function getNgoVerificationStatus(user) {
  if (!user) return 'registered';
  if (isNgoSuspended(user)) return 'suspended';
  if (user.verificationStatus === 'approved' || user.verified === true) return 'verified';
  if (
    user.verificationStatus === 'submitted'
    || user.verified === 'pending'
    || user.verificationStatus === 'under_review'
    || user.verificationStatus === 'documents_submitted'
  ) return 'pending';
  if (user.verificationStatus === 'rejected' || user.verified === 'rejected') return 'rejected';
  return 'registered';
}

export function isNgoVerificationSubmitted(user) {
  return getNgoVerificationStatus(user) === 'pending';
}

