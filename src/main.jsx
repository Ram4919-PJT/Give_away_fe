import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { LocationProvider } from './context/LocationContext';
import { ToastProvider } from './components/ui/Toast';
import LogoutOverlay from './components/ui/LogoutOverlay';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <LocationProvider>
          <ToastProvider>
            <LogoutOverlay />
            <App />
          </ToastProvider>
        </LocationProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
