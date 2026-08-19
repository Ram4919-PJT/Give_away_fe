import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { saveNgoLocation } from '../../api/locationClient';
import useBrowserGeolocation from '../../hooks/useBrowserGeolocation';
import { useLocation } from '../../context/LocationContext';
import { buildLocationLabel } from '../../utils/locationHelpers';

export default function NgoLocationPicker({ form, onPatch }) {
  const { searchPlaces } = useLocation();
  const { showToast } = useToast();
  const geo = useBrowserGeolocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const searchTimer = useRef(null);

  const runSearch = async (value) => {
    const q = String(value || '').trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const rows = await searchPlaces(q);
      setResults(rows);
    } catch (err) {
      showToast(err?.message || 'Address search failed.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const applyPlace = async (place) => {
    setSaving(true);
    try {
      const data = await saveNgoLocation({
        latitude: place.latitude,
        longitude: place.longitude,
        line1: form.address || place.formatted_address,
        city: place.city || form.city,
        state: place.state || form.state,
        pincode: place.pincode || form.pincode,
        country: place.country,
      });
      const loc = data?.location;
      onPatch?.({
        address: loc?.line1 || form.address,
        city: loc?.city || form.city,
        state: loc?.state || form.state,
        pincode: loc?.pincode || form.pincode,
      });
      showToast(`Location saved: ${buildLocationLabel(loc)}`, 'success');
      setResults([]);
      setQuery('');
    } catch (err) {
      showToast(err?.message || 'Unable to save NGO location.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const useGps = async () => {
    try {
      const coords = await geo.detect();
      await applyPlace(coords);
    } catch {
      // geo hook surfaces errors
    }
  };

  return (
    <div className="loc-ngo-picker">
      <p className="loc-ngo-picker__hint">
        Pin your organization on the map so donors can discover you nearby. Search an address or use GPS.
      </p>

      <div className="loc-ngo-picker__actions">
        <button
          type="button"
          className="loc-btn loc-btn--ghost"
          onClick={useGps}
          disabled={geo.status === 'detecting' || saving || !geo.supported}
        >
          <MapPin size={16} aria-hidden="true" />
          {geo.status === 'detecting' ? 'Detecting…' : 'Use Current Location'}
        </button>
      </div>

      {geo.error && (
        <p className="loc-hint" role="alert">{geo.error}</p>
      )}

      <label className="loc-search-label" htmlFor="ngo-loc-search">
        Search address
      </label>
      <div className="loc-search">
        <MapPin size={18} aria-hidden="true" />
        <input
          id="ngo-loc-search"
          type="search"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => runSearch(value), 320);
          }}
          placeholder="Search street, area or pincode…"
          autoComplete="off"
        />
        {searching && <span className="loc-hint">…</span>}
      </div>

      {results.length > 0 && (
        <div className="loc-search-results">
          {results.map((item) => (
            <button
              key={`${item.latitude}-${item.longitude}-${item.formatted_address}`}
              type="button"
              className="loc-search-result"
              onClick={() => applyPlace(item)}
              disabled={saving}
            >
              <MapPin size={16} aria-hidden="true" />
              <span>
                <strong>{buildLocationLabel(item) || item.formatted_address}</strong>
                {item.formatted_address && (
                  <small>{item.formatted_address}</small>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
