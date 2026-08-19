import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';

export default function NotificationMenu({
  notification,
  onMarkRead,
  onView,
  onDelete,
  showView = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="notif-item__menu" ref={ref}>
      <button
        type="button"
        className="notif-item__menu-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Actions for ${notification.title}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreVertical size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="notif-item__dropdown" role="menu">
          {!notification.read && (
            <button
              type="button"
              role="menuitem"
              className="notif-item__dropdown-item"
              onClick={() => { onMarkRead(); close(); }}
            >
              <Check size={15} aria-hidden="true" />
              Mark as read
            </button>
          )}
          {showView && (
            <button
              type="button"
              role="menuitem"
              className="notif-item__dropdown-item"
              onClick={() => { onView(); close(); }}
            >
              <ExternalLink size={15} aria-hidden="true" />
              View
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className="notif-item__dropdown-item notif-item__dropdown-item--danger"
            onClick={() => { onDelete(); close(); }}
          >
            <Trash2 size={15} aria-hidden="true" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
