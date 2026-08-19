import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import useBrowserGeolocation from '../../hooks/useBrowserGeolocation';
import { useLocation } from '../../context/LocationContext';
import { buildLocationLabel, readRecentLocations } from '../../utils/locationHelpers';
import { useToast } from '../ui/Toast';

function SearchResultItem({ item, onSelect }) {
  const label = buildLocationLabel(item) || item.formatted_address || 'Selected place';
  return (
    <button type="button" className="loc-search-result" onClick={() => onSelect(item)}>
      <MapPin size={16} aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        {item.formatted_address && item.formatted_address !== label && (
          <small>{item.formatted_address}</small>
        )}
      </span>
    </button>
  );
}

export default function LocationSelector({ open, onClose, onSaved }) {
  const { persistLocation, saving, searchPlaces } = useLocation();
  const { showToast } = useToast();
  const geo = useBrowserGeolocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recent, setRecent] = useState([]);
  const searchTimer = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setRecent(readRecentLocations());
    geo.reset();
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setSearching(false);
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const runSearch = async (value) => {
    const q = String(value || '').trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const rows = await searchPlaces(q);
      setResults(rows);
    } catch (err) {
      showToast(err?.message || 'Location search failed.', 'error');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(value), 320);
  };

  const selectPlace = async (place) => {
    try {
      const saved = await persistLocation(place);
      showToast(`Location set to ${buildLocationLabel(saved)}`, 'success');
      onSaved?.(saved);
      onClose?.();
    } catch {
      // toast handled in context
    }
  };

  const useCurrentLocation = async () => {
    try {
      const coords = await geo.detect();
      const saved = await persistLocation(coords);
      showToast(`Location detected: ${buildLocationLabel(saved)}`, 'success');
      onSaved?.(saved);
      onClose?.();
    } catch {
      // geo hook sets status
    }
  };

  if (!open) return null;

  const detecting = geo.status === 'detecting' || saving;

  return (
    <div className="loc-overlay" role="presentation" onClick={onClose}>
      <div
        className="loc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loc-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="loc-modal__head">
          <div>
            <p className="loc-modal__eyebrow">Location</p>
            <h2 id="loc-modal-title">Find NGOs near you</h2>
            <p className="loc-modal__sub">
              Allow location access to discover NGOs, campaigns and causes near your location.
            </p>
          </div>
          <button type="button" className="loc-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="loc-modal__body">
          <button
            type="button"
            className="loc-btn loc-btn--primary loc-btn--block"
            onClick={useCurrentLocation}
            disabled={detecting || !geo.supported}
          >
            {detecting ? <Loader2 size={18} className="loc-spin" aria-hidden="true" /> : <MapPin size={18} aria-hidden="true" />}
            <span>{detecting ? 'Detecting your location…' : 'Use My Current Location'}</span>
          </button>

          {!geo.supported && (
            <p className="loc-hint" role="status">
              Your browser does not support GPS. Please search for your city below.
            </p>
          )}

          {geo.status === 'denied' && (
            <div className="loc-alert loc-alert--warn" role="alert">
              <p>Location access was denied.</p>
              <div className="loc-alert__actions">
                <button type="button" className="loc-btn loc-btn--ghost" onClick={useCurrentLocation}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {geo.status === 'unavailable' && geo.error && (
            <div className="loc-alert loc-alert--warn" role="alert">
              <p>{geo.error}</p>
            </div>
          )}

          <div className="loc-divider" aria-hidden="true">
            <span>OR</span>
          </div>

          <label className="loc-search-label" htmlFor="loc-search-input">
            Enter location manually
          </label>
          <div className="loc-search">
            <Search size={18} aria-hidden="true" />
            <input
              id="loc-search-input"
              ref={inputRef}
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search city, area or pincode…"
              autoComplete="off"
            />
            {searching && <Loader2 size={16} className="loc-spin" aria-label="Searching" />}
          </div>

          {results.length > 0 && (
            <div className="loc-search-results" role="listbox" aria-label="Search results">
              {results.map((item) => (
                <SearchResultItem
                  key={`${item.latitude}-${item.longitude}-${item.formatted_address}`}
                  item={item}
                  onSelect={selectPlace}
                />
              ))}
            </div>
          )}

          {query.trim().length >= 2 && !searching && results.length === 0 && (
            <p className="loc-hint">No places found. Try a nearby city or pincode.</p>
          )}

          {recent.length > 0 && (
            <div className="loc-recent">
              <p className="loc-recent__title">Recent locations</p>
              <ul>
                {recent.map((item) => (
                  <li key={`${item.latitude}-${item.longitude}`}>
                    <button type="button" onClick={() => selectPlace(item)}>
                      <MapPin size={14} aria-hidden="true" />
                      {buildLocationLabel(item)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
