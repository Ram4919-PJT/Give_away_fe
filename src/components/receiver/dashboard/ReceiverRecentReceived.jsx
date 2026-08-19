import { useNavigate } from 'react-router-dom';
import { getInitials } from '../../../utils/receiverHelpers';
import { formatCurrency } from '../../../utils/donorHelpers';
import { formatDisplayDate } from '../../../utils/receiverDashboardHelpers';

function Avatar({ name, src }) {
  if (src) {
    return <img src={src} alt="" className="rd-avatar rd-avatar--img" />;
  }
  return <div className="rd-avatar">{getInitials(name)}</div>;
}

export default function ReceiverRecentReceived({ items, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="rd-card rd-panel rd-skeleton rd-skeleton--list" aria-hidden="true" />;
  }

  return (
    <article className="rd-card rd-panel">
      <header className="rd-panel__head">
        <h2 className="rd-section-title">Recent Support Received</h2>
        {items?.length > 0 && (
          <button
            type="button"
            className="rd-link-btn"
            onClick={() => navigate('/dashboard/receiver-requests')}
          >
            View all →
          </button>
        )}
      </header>

      {!items?.length ? (
        <div className="rd-empty-state rd-empty-state--compact">
          <p>No support received yet.</p>
          <span className="rd-muted">Approved financial assistance will appear here.</span>
        </div>
      ) : (
        <ul className="rd-activity-list">
          {items.map((item) => (
            <li key={item.id} className="rd-activity-item">
              <Avatar name={item.donorName} src={item.avatar} />
              <div className="rd-activity-item__body">
                <strong>{item.donorName}</strong>
                <span>{item.title}</span>
                <span className="rd-muted">{formatDisplayDate(item.date)}</span>
              </div>
              <div className="rd-activity-item__meta">
                {item.amount != null && item.amount > 0 && (
                  <strong>{formatCurrency(item.amount)}</strong>
                )}
                <span className="rd-badge rd-badge--success">{item.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
