import { apiRequest } from './client';

const CACHE_KEY = 'receiver_assistance_config_v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

let memoryCache = null;
let memoryCacheAt = 0;

function readSessionCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeSessionCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ignore quota */
  }
}

export async function getReceiverAssistanceConfig({ force = false } = {}) {
  if (!force && memoryCache && Date.now() - memoryCacheAt < CACHE_TTL_MS) {
    return memoryCache;
  }
  if (!force) {
    const cached = readSessionCache();
    if (cached) {
      memoryCache = cached;
      memoryCacheAt = Date.now();
      return cached;
    }
  }
  const data = await apiRequest('/core/config/receiver-assistance');
  memoryCache = data;
  memoryCacheAt = Date.now();
  writeSessionCache(data);
  return data;
}

export function clearReceiverAssistanceConfigCache() {
  memoryCache = null;
  memoryCacheAt = 0;
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

const KYC_CACHE_KEY = 'receiver_kyc_config_v1';
let kycMemoryCache = null;
let kycMemoryCacheAt = 0;

export async function getReceiverKycConfig({ force = false } = {}) {
  if (!force && kycMemoryCache && Date.now() - kycMemoryCacheAt < CACHE_TTL_MS) {
    return kycMemoryCache;
  }
  const data = await apiRequest('/core/config/receiver-kyc');
  kycMemoryCache = data;
  kycMemoryCacheAt = Date.now();
  return data;
}

let donorVerificationMemoryCache = null;
let donorVerificationMemoryCacheAt = 0;

export async function getDonorVerificationConfig({ force = false } = {}) {
  if (
    !force
    && donorVerificationMemoryCache
    && Date.now() - donorVerificationMemoryCacheAt < CACHE_TTL_MS
  ) {
    return donorVerificationMemoryCache;
  }
  const data = await apiRequest('/core/config/donor-verification');
  donorVerificationMemoryCache = data;
  donorVerificationMemoryCacheAt = Date.now();
  return data;
}
