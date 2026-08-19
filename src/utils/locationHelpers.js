export const GUEST_LOCATION_KEY = 'giveaway_guest_location';
export const RECENT_LOCATIONS_KEY = 'giveaway_recent_locations';
export const RADIUS_OPTIONS_KM = [5, 10, 25, 50];

export function formatDistanceKm(km) {
  const value = Number(km);
  if (!Number.isFinite(value) || value < 0) return '';
  if (value < 1) return `${Math.round(value * 1000)} m away`;
  const decimals = value < 10 ? 1 : 0;
  return `${value.toFixed(decimals)} km away`;
}

export function buildLocationLabel(location) {
  if (!location) return null;
  if (location.label) return location.label;
  const parts = [location.city, location.state].filter(Boolean);
  return parts.length ? parts.join(', ') : location.formatted_address || null;
}

export function normalizeLocation(raw) {
  if (!raw || raw.latitude == null || raw.longitude == null) return null;
  const latitude = Number(raw.latitude);
  const longitude = Number(raw.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const city = raw.city || null;
  const state = raw.state || null;
  const country = raw.country || null;
  return {
    latitude,
    longitude,
    city,
    state,
    country,
    formatted_address: raw.formatted_address || null,
    label: buildLocationLabel({ city, state, formatted_address: raw.formatted_address }),
    updated_at: raw.updated_at || null,
  };
}

export function readGuestLocation() {
  try {
    const raw = localStorage.getItem(GUEST_LOCATION_KEY);
    if (!raw) return null;
    return normalizeLocation(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeGuestLocation(location) {
  if (!location) {
    localStorage.removeItem(GUEST_LOCATION_KEY);
    return;
  }
  localStorage.setItem(GUEST_LOCATION_KEY, JSON.stringify(location));
}

export function readRecentLocations() {
  try {
    const raw = localStorage.getItem(RECENT_LOCATIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.map(normalizeLocation).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function pushRecentLocation(location) {
  const normalized = normalizeLocation(location);
  if (!normalized?.label) return;
  const key = `${normalized.latitude.toFixed(4)},${normalized.longitude.toFixed(4)}`;
  const existing = readRecentLocations().filter(
    (item) => `${item.latitude.toFixed(4)},${item.longitude.toFixed(4)}` !== key
  );
  const next = [normalized, ...existing].slice(0, 5);
  localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(next));
}

export function isGeolocationSupported() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}
