import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import LocationSelector from './LocationSelector';

export default function LocationBanner({
  className = '',
  compact = false,
  prompt = 'Find causes near you',
  showWhenEmpty = true,
}) {
  const { locationLabel, hasLocation, loading } = useLocation();
  const [selectorOpen, setSelectorOpen] = useState(false);

  if (loading && !hasLocation) {
    return (
      <div className={`loc-banner loc-banner--loading ${className}`.trim()} aria-live="polite">
        <MapPin size={16} aria-hidden="true" />
        <span>Loading your location…</span>
      </div>
    );
  }

  if (!hasLocation && !showWhenEmpty) return null;

  return (
    <>
      <div className={`loc-banner ${compact ? 'loc-banner--compact' : ''} ${className}`.trim()}>
        <MapPin size={16} aria-hidden="true" className="loc-banner__icon" />
        {hasLocation ? (
          <>
            <span className="loc-banner__text">
              {compact ? '' : 'Showing causes near: '}
              <strong>{locationLabel}</strong>
            </span>
            <button
              type="button"
              className="loc-banner__change"
              onClick={() => setSelectorOpen(true)}
            >
              Change
            </button>
          </>
        ) : (
          <>
            <span className="loc-banner__text">
              <strong>{prompt}</strong>
            </span>
            <button
              type="button"
              className="loc-banner__change loc-banner__change--primary"
              onClick={() => setSelectorOpen(true)}
            >
              Set Location
            </button>
          </>
        )}
      </div>

      <LocationSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
      />
    </>
  );
}
