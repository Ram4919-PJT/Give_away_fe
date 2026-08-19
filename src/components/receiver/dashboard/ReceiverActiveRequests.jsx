import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/donorHelpers';
import LockedFeatureCard from '../verification/LockedFeatureCard';
import { useReceiverVerification } from '../../../hooks/useReceiverVerification';

export default function ReceiverActiveRequests({ items, loading, verified }) {
  const navigate = useNavigate();
  const { goToVerification } = useReceiverVerification();

  if (loading) {
    return <div className="rd-card rd-panel rd-skeleton rd-skeleton--list" aria-hidden="true" />;
  }

  if (!verified) {
    return (
      <article className="rd-card rd-panel">
        <header className="rd-panel__head">
          <h2 className="rd-section-title">Active Requests</h2>
        </header>
        <LockedFeatureCard
          title="Verification Required"
          description="Complete your profile verification to request financial assistance."
          onVerify={goToVerification}
          compact
        />
      </article>
    );
  }

  return (
    <article className="rd-card rd-panel">
      <header className="rd-panel__head">
        <h2 className="rd-section-title">Active Requests</h2>
        {items?.length > 0 && (
          <button
            type="button"
            className="rd-link-btn"
            onClick={() => navigate('/dashboard/receiver-requests')}
          >
            Manage →
          </button>
        )}
      </header>

      {!items?.length ? (
        <div className="rd-empty-state rd-empty-state--compact">
          <p>You haven&apos;t created any active financial assistance requests.</p>
          <div className="rd-empty-state__actions">
            <button type="button" className="rd-btn rd-btn--primary rd-btn--sm" onClick={() => navigate('/dashboard/receiver-apply')}>
              Request Financial Assistance
            </button>
          </div>
        </div>
      ) : (
        <ul className="rd-request-list">
          {items.map((item) => (
            <li key={item.id} className="rd-request-card">
              <div className="rd-request-card__media">
                {item.image ? (
                  <img src={item.image} alt="" />
                ) : (
                  <div className="rd-request-card__placeholder" aria-hidden="true">📋</div>
                )}
              </div>
              <div className="rd-request-card__body">
                <div className="rd-request-card__head">
                  <strong>{item.title}</strong>
                  <span className={`rd-priority rd-priority--${item.priority === 'High Priority' ? 'high' : 'normal'}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="rd-muted">{item.category}</p>
                {item.amount != null && item.amount > 0 && (
                  <p className="rd-request-card__amount">{formatCurrency(item.amount)} requested</p>
                )}
                <p className="rd-request-card__status">
                  Status: {item.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
