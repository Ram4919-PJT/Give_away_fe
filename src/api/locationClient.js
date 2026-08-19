import { apiRequest } from './client';

export async function searchLocationsPublic(query, limit = 6) {
  const q = encodeURIComponent(String(query || '').trim());
  return apiRequest(`/core/public/location/search?q=${q}&limit=${limit}`, { auth: false });
}

export async function searchLocations(query, limit = 8) {
  const q = encodeURIComponent(String(query || '').trim());
  return apiRequest(`/core/location/search?q=${q}&limit=${limit}`);
}

export async function getMySavedLocation() {
  return apiRequest('/core/location/me');
}

export async function saveMyLocation(payload) {
  return apiRequest('/core/location/me', {
    method: 'POST',
    body: {
      latitude: payload.latitude,
      longitude: payload.longitude,
      city: payload.city || undefined,
      state: payload.state || undefined,
      country: payload.country || undefined,
    },
  });
}

export async function saveNgoLocation(payload) {
  return apiRequest('/core/location/ngo/me', {
    method: 'POST',
    body: {
      latitude: payload.latitude,
      longitude: payload.longitude,
      line1: payload.line1 || undefined,
      city: payload.city || undefined,
      state: payload.state || undefined,
      pincode: payload.pincode || undefined,
      country: payload.country || undefined,
    },
  });
}

export async function fetchNearbyNgos(latitude, longitude, radiusKm) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radius: String(radiusKm),
  });
  return apiRequest(`/core/ngos/nearby?${params.toString()}`, { auth: false });
}
