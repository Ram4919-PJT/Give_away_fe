import { useCallback, useState } from 'react';
import { isGeolocationSupported } from '../utils/locationHelpers';

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

export default function useBrowserGeolocation() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const detect = useCallback(() => {
    if (!isGeolocationSupported()) {
      setStatus('unsupported');
      setError('Your browser does not support location detection.');
      return Promise.reject(new Error('unsupported'));
    }

    setStatus('detecting');
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus('granted');
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (geoError) => {
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setStatus('denied');
            setError('Location access was denied.');
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            setStatus('unavailable');
            setError("We couldn't determine your location.");
          } else {
            setStatus('unavailable');
            setError('Location request timed out. Please try again.');
          }
          reject(geoError);
        },
        GEO_OPTIONS
      );
    });
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, detect, reset, supported: isGeolocationSupported() };
}
