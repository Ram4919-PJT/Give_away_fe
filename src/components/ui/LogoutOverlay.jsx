import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LogoutOverlay() {
  const { logoutLoading } = useApp();
  if (!logoutLoading) return null;

  return createPortal(
    <div className="logout-overlay" role="alertdialog" aria-live="polite" aria-busy="true" aria-label="Signing out">
      <div className="logout-overlay__card">
        <div className="logout-overlay__spinner" aria-hidden="true" />
        <div className="logout-overlay__icon" aria-hidden="true">
          <LogOut size={22} strokeWidth={2} />
        </div>
        <h2 className="logout-overlay__title">Signing you out</h2>
        <p className="logout-overlay__text">Securing your session…</p>
      </div>
    </div>,
    document.body
  );
}
