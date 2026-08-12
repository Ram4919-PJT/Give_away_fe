import { ROLE_AUTH_CONFIG } from '../../data/constants';

export default function RoleAuthModal({ roleKey, onClose, onRegister, onLogin }) {
  if (!roleKey) return null;
  const config = ROLE_AUTH_CONFIG[roleKey];
  if (!config) return null;

  return (
    <div className="role-auth-modal" aria-hidden="false">
      <div className="role-auth-backdrop" onClick={onClose} />
      <div className="role-auth-dialog" role="dialog" aria-modal="true">
        <button type="button" className="role-auth-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="role-auth-icon" aria-hidden="true">
          {config.icon}
        </div>
        <h2 className="role-auth-title">{config.title}</h2>
        <p className="role-auth-desc">{config.desc}</p>
        <div className="role-auth-actions">
          <button type="button" className="lp-btn" onClick={onRegister}>
            {config.registerLabel}
          </button>
          <button type="button" className="lp-btn-outline" onClick={onLogin}>
            Sign In
          </button>
        </div>
        <p className="role-auth-footnote">{config.footnote}</p>
      </div>
    </div>
  );
}
