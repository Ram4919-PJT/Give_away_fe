export function AdminModuleShell({ title, subtitle, children, actions }) {
  return (
    <div className="admin-module page-route">
      <header className="admin-module__header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="admin-module__actions">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function AdminStatStrip({ items }) {
  return (
    <div className="admin-mod-stats">
      {items.map(([label, value, accent]) => (
        <div key={label} className={`admin-mod-stat admin-mod-stat--${accent || 'blue'}`}>
          <span className="admin-mod-stat__val">{value}</span>
          <span className="admin-mod-stat__lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminToolbar({ children }) {
  return <div className="admin-mod-toolbar">{children}</div>;
}

export function AdminSearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <input
      type="search"
      className="admin-mod-search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function AdminSelect({ value, onChange, options, label }) {
  return (
    <label className="admin-mod-select-wrap">
      {label && <span>{label}</span>}
      <select className="admin-mod-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
    </label>
  );
}

export function AdminEmpty({ icon: Icon, title, desc, action }) {
  return (
    <div className="admin-mod-empty">
      {Icon && <Icon size={40} strokeWidth={1.25} />}
      <h3>{title}</h3>
      <p>{desc}</p>
      {action}
    </div>
  );
}

export function AdminBadge({ children, variant = 'default' }) {
  return <span className={`admin-mod-badge admin-mod-badge--${variant}`}>{children}</span>;
}

export function AdminSidePanel({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <>
      <div className="admin-mod-panel-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="admin-mod-panel" role="dialog" aria-modal="true" aria-label={title}>
        <header className="admin-mod-panel__head">
          <h2>{title}</h2>
          <button type="button" className="admin-mod-panel__close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="admin-mod-panel__body">{children}</div>
      </aside>
    </>
  );
}
