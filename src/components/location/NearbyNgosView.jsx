import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Heart, Loader2, Map as MapIcon, MapPin, RefreshCw } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import LocationSelector from './LocationSelector';
import NearbyMap from './NearbyMap';
import ApiEmptyState from '../ui/ApiEmptyState';
import { formatDistanceKm, RADIUS_OPTIONS_KM } from '../../utils/locationHelpers';

function NgoSkeleton() {
  return (
    <article className="loc-ngo-card loc-ngo-card--skeleton" aria-hidden="true">
      <div className="loc-skel loc-skel--logo" />
      <div className="loc-skel loc-skel--line" />
      <div className="loc-skel loc-skel--line short" />
    </article>
  );
}

function NearbyNgoCard({ ngo, onView, onDonate }) {
  const verified = ngo.verification_status === 'VERIFIED';
  const locationLine = [ngo.city, ngo.state].filter(Boolean).join(', ');

  return (
    <article className="loc-ngo-card">
      <div className="loc-ngo-card__icon" aria-hidden="true">
        <Heart size={22} />
      </div>
      <div className="loc-ngo-card__body">
        <h3>{ngo.name}</h3>
        <p className="loc-ngo-card__meta">{locationLine || 'Location on file'}</p>
        <p className="loc-ngo-card__distance">
          <MapPin size={14} aria-hidden="true" />
          {formatDistanceKm(ngo.distance_km)}
        </p>
        <div className="loc-ngo-card__actions">
          <span className={`loc-badge ${verified ? 'loc-badge--verified' : ''}`}>
            {verified ? 'Verified' : ngo.verification_status || 'Registered'}
          </span>
          <div className="loc-ngo-card__btns">
            <button type="button" className="loc-btn loc-btn--ghost" onClick={onView}>
              View NGO
            </button>
            <button type="button" className="loc-btn loc-btn--primary" onClick={onDonate}>
              Donate
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NearbyNgosView() {
  const navigate = useNavigate();
  const { location, hasLocation, fetchNearby } = useLocation();
  const [radius, setRadius] = useState(10);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const loadNearby = useCallback(async () => {
    if (!hasLocation) {
      setNgos([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNearby(radius);
      setNgos(Array.isArray(data?.ngos) ? data.ngos : []);
    } catch (err) {
      setError(err?.message || 'Unable to find NGOs near your location.');
      setNgos([]);
    } finally {
      setLoading(false);
    }
  }, [fetchNearby, hasLocation, radius]);

  useEffect(() => {
    loadNearby();
  }, [loadNearby]);

  const handleDonate = () => navigate('/dashboard/donor-donate-money');
  const handleView = () => navigate('/dashboard/donor-campaigns');

  return (
    <div className="loc-page donor-page page-route">
      <header className="loc-page__hero">
        <div>
          <p className="loc-page__eyebrow">
            <Building2 size={16} aria-hidden="true" />
            NGO Partners
          </p>
          <h1>NGOs Near You</h1>
          <p>Discover verified partner organizations within your chosen radius.</p>
        </div>
      </header>

      {!hasLocation ? (
        <div className="loc-card loc-card--center">
          <MapPin size={40} className="loc-page__icon" aria-hidden="true" />
          <h2>Set your location to discover nearby NGOs</h2>
          <p>We use your city or area — never your exact home address on public pages.</p>
          <button type="button" className="loc-btn loc-btn--primary" onClick={() => setSelectorOpen(true)}>
            Set Location
          </button>
        </div>
      ) : (
        <>
          <div className="loc-toolbar">
            <div className="loc-radius" role="group" aria-label="Search radius">
              {RADIUS_OPTIONS_KM.map((km) => (
                <button
                  key={km}
                  type="button"
                  className={`loc-radius__chip${radius === km ? ' is-active' : ''}`}
                  onClick={() => setRadius(km)}
                  aria-pressed={radius === km}
                >
                  {km} km
                </button>
              ))}
            </div>

            <div className="loc-view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={viewMode === 'list' ? 'is-active' : ''}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                List View
              </button>
              <button
                type="button"
                className={viewMode === 'map' ? 'is-active' : ''}
                onClick={() => setViewMode('map')}
                aria-pressed={viewMode === 'map'}
              >
                <MapIcon size={14} aria-hidden="true" />
                Map View
              </button>
            </div>

            <button
              type="button"
              className="loc-btn loc-btn--ghost loc-toolbar__refresh"
              onClick={loadNearby}
              disabled={loading}
              aria-label="Refresh nearby NGOs"
            >
              <RefreshCw size={16} className={loading ? 'loc-spin' : ''} aria-hidden="true" />
            </button>
          </div>

          {error && (
            <div className="loc-alert loc-alert--warn" role="alert">
              <p>{error}</p>
              <div className="loc-alert__actions">
                <button type="button" className="loc-btn loc-btn--ghost" onClick={loadNearby}>
                  Try Again
                </button>
                <button type="button" className="loc-btn loc-btn--primary" onClick={() => setSelectorOpen(true)}>
                  Change Location
                </button>
              </div>
            </div>
          )}

          <div className={`loc-results loc-results--${viewMode}`}>
            {viewMode === 'map' && location && (
              <NearbyMap
                center={location}
                ngos={ngos}
                onSelectNgo={handleView}
              />
            )}

            <div className="loc-results__list">
              {loading && (
                <div className="loc-ngo-grid" aria-live="polite" aria-busy="true">
                  <NgoSkeleton />
                  <NgoSkeleton />
                  <NgoSkeleton />
                </div>
              )}

              {!loading && !error && ngos.length === 0 && (
                <ApiEmptyState
                  icon={MapPin}
                  title="No NGOs found nearby"
                  description={`We couldn't find NGOs within ${radius} km of your selected location.`}
                  actionLabel={radius < 50 ? `Search ${RADIUS_OPTIONS_KM.find((k) => k > radius) || 50} km` : 'Change Location'}
                  onAction={() => {
                    const next = RADIUS_OPTIONS_KM.find((k) => k > radius);
                    if (next) setRadius(next);
                    else setSelectorOpen(true);
                  }}
                />
              )}

              {!loading && ngos.length > 0 && (
                <div className="loc-ngo-grid">
                  {ngos.map((ngo) => (
                    <NearbyNgoCard
                      key={ngo.ngo_id}
                      ngo={ngo}
                      onView={handleView}
                      onDonate={handleDonate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <LocationSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSaved={() => loadNearby()}
      />
    </div>
  );
}
