import { useEffect, useRef } from 'react';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

let leafletPromise;

function loadLeaflet() {
  if (typeof window !== 'undefined' && window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return leafletPromise;
}

export default function NearbyMap({ center, ngos = [], onSelectNgo }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || !center) return;
      try {
        const L = await loadLeaflet();
        if (cancelled) return;

        if (!mapRef.current) {
          mapRef.current = L.map(containerRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
          }).setView([center.latitude, center.longitude], 12);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);
        } else {
          mapRef.current.setView([center.latitude, center.longitude], 12);
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const userIcon = L.divIcon({
          className: 'loc-map-pin loc-map-pin--user',
          html: '<span aria-hidden="true">📍</span>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        markersRef.current.push(
          L.marker([center.latitude, center.longitude], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup('Your location')
        );

        ngos.forEach((ngo) => {
          if (ngo.latitude == null || ngo.longitude == null) return;
          const marker = L.marker([ngo.latitude, ngo.longitude])
            .addTo(mapRef.current)
            .bindPopup(`<strong>${ngo.name}</strong><br/>${ngo.city || ''}`);
          marker.on('click', () => onSelectNgo?.(ngo));
          markersRef.current.push(marker);
        });

        if (ngos.length > 0) {
          const bounds = L.latLngBounds([
            [center.latitude, center.longitude],
            ...ngos
              .filter((n) => n.latitude != null && n.longitude != null)
              .map((n) => [n.latitude, n.longitude]),
          ]);
          mapRef.current.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
        }

        setTimeout(() => mapRef.current?.invalidateSize(), 120);
      } catch {
        // Map load failure — list view still works
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [center, ngos, onSelectNgo]);

  useEffect(() => () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  return (
    <div className="loc-map-wrap" aria-label="Map of nearby NGOs">
      <div ref={containerRef} className="loc-map" role="application" />
    </div>
  );
}
