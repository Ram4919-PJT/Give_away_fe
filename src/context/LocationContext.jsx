import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchNearbyNgos,
  getMySavedLocation,
  saveMyLocation,
  searchLocations,
  searchLocationsPublic,
} from '../api/locationClient';
import { useApp } from './AppContext';
import {
  buildLocationLabel,
  normalizeLocation,
  pushRecentLocation,
  readGuestLocation,
  writeGuestLocation,
} from '../utils/locationHelpers';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const { currentUser } = useApp();
  const isDonor = currentUser?.role === 'donor';
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const applyLocation = useCallback((next) => {
    const normalized = normalizeLocation(next);
    setLocation(normalized);
    if (normalized) pushRecentLocation(normalized);
    return normalized;
  }, []);

  const loadSavedLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isDonor) {
        const data = await getMySavedLocation();
        if (data?.location) {
          applyLocation(data.location);
        } else {
          const guest = readGuestLocation();
          if (guest) setLocation(guest);
        }
      } else {
        const guest = readGuestLocation();
        if (guest) setLocation(guest);
      }
    } catch (err) {
      setError(err?.message || 'Unable to load saved location.');
    } finally {
      setLoading(false);
    }
  }, [applyLocation, isDonor]);

  useEffect(() => {
    loadSavedLocation();
  }, [loadSavedLocation, currentUser?.user_id, currentUser?.role]);

  const persistLocation = useCallback(async (coords) => {
    const normalizedInput = normalizeLocation(coords);
    if (!normalizedInput) throw new Error('Invalid coordinates.');

    setSaving(true);
    setError(null);
    try {
      if (isDonor) {
        const data = await saveMyLocation(normalizedInput);
        const saved = applyLocation(data?.location || normalizedInput);
        writeGuestLocation(saved);
        return saved;
      }
      const saved = applyLocation(normalizedInput);
      writeGuestLocation(saved);
      return saved;
    } catch (err) {
      setError(err?.message || 'Unable to save location.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [applyLocation, isDonor]);

  const searchPlaces = useCallback(async (query) => {
    const q = String(query || '').trim();
    if (q.length < 2) return [];
    const searchFn = isDonor ? searchLocations : searchLocationsPublic;
    const data = await searchFn(q);
    return Array.isArray(data?.results) ? data.results : [];
  }, [isDonor]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    writeGuestLocation(null);
  }, []);

  const value = useMemo(() => ({
    location,
    locationLabel: buildLocationLabel(location),
    loading,
    saving,
    error,
    hasLocation: Boolean(location?.latitude != null && location?.longitude != null),
    isDonor,
    persistLocation,
    searchPlaces,
    clearLocation,
    reloadLocation: loadSavedLocation,
    fetchNearby: (radiusKm) => {
      if (!location) return Promise.resolve({ ngos: [], count: 0 });
      return fetchNearbyNgos(location.latitude, location.longitude, radiusKm);
    },
  }), [
    location,
    loading,
    saving,
    error,
    isDonor,
    persistLocation,
    searchPlaces,
    clearLocation,
    loadSavedLocation,
  ]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
