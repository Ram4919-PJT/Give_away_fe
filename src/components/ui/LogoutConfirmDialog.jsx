import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';

export default function LogoutConfirmDialog({ open, onCancel, onConfirm, loading, userName }) {
  if (!open) return null;

  return createPortal(
    <div className="logout-dialog-backdrop" onClick={loading ? undefined : onCancel}>
      <div
        className="logout-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="logout-dialog__close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="logout-dialog__icon" aria-hidden="true">
          <LogOut size={26} strokeWidth={2} />
        </div>

        <h2 id="logout-dialog-title" className="logout-dialog__title">Sign out?</h2>
        <p className="logout-dialog__body">
          {userName ? (
            <>You&apos;re signed in as <strong>{userName}</strong>. You&apos;ll need to sign in again to access your dashboard.</>
          ) : (
            <>You&apos;ll need to sign in again to access your dashboard.</>
          )}
        </p>

        <div className="logout-dialog__actions">
          <button type="button" className="logout-dialog__btn logout-dialog__btn--ghost" onClick={onCancel} disabled={loading}>
            Stay signed in
          </button>
          <button type="button" className="logout-dialog__btn logout-dialog__btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
