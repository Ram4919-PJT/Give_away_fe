import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Inbox, Package, Clock, ShieldCheck } from 'lucide-react';
import {
  completeItemRequest,
  getMyItemDonation,
  listDonorItemRequests,
  respondToItemRequest,
  statusBadgeClass,
  statusLabel,
} from '../../../api/itemDonationClient';
import {
  IdwBack,
  IdwCard,
  IdwDetailGrid,
  IdwEmpty,
  IdwLoading,
  IdwMediaPlaceholder,
  IdwPage,
  IdwPageHeader,
  IdwStatusBadge,
} from './ItemDonationUi';
import { formatCondition, formatItemDate } from './itemDonationHelpers';

export function DonorItemDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justSubmitted = searchParams.get('submitted') === '1';
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyItemDonation(id).then(setItem).catch(() => setItem(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <IdwPage className="donor-page donor-module page-route">
        <IdwLoading label="Loading item details…" />
      </IdwPage>
    );
  }

  if (!item) {
    return (
      <IdwPage className="donor-page donor-module page-route">
        <IdwEmpty title="Item not found" description="This donation item may have been removed." />
      </IdwPage>
    );
  }

  const photos = item.photo_urls || [];

  return (
    <IdwPage className="donor-page donor-module page-route idw-detail-page">
      <IdwBack to="/dashboard/donor-my-donations" label="Back to My Donations" />

      <div className="idw-detail-page__hero">
        <div className="idw-detail-page__gallery">
          {photos.length > 0 ? (
            <div className="idw-photo-grid idw-photo-grid--hero">
              {photos.map((url) => (
                <div key={url} className="idw-photo-thumb"><img src={url} alt="" /></div>
              ))}
            </div>
          ) : (
            <div className="idw-detail-page__gallery-empty">
              <IdwMediaPlaceholder Icon={Package} />
            </div>
          )}
        </div>

        <div className="idw-detail-page__summary">
          <div className="idw-detail-page__title-row">
            <h1>{item.item_name || item.category}</h1>
            <IdwStatusBadge status={item.status} />
          </div>
          <p className="idw-detail-page__desc">{item.description}</p>

          {justSubmitted && (
            <div className="idw-verify-banner idw-verify-banner--success" role="status">
              <ShieldCheck size={20} aria-hidden="true" />
              <div>
                <strong>Submitted for admin review</strong>
                <p>Your item and photos are with our team. Receivers will see it only after approval.</p>
              </div>
            </div>
          )}

          {['PENDING_VERIFICATION', 'SUBMITTED', 'UNDER_REVIEW'].includes(item.status) && (
            <div className="idw-verify-banner" role="status">
              <Clock size={20} aria-hidden="true" />
              <div>
                <strong>Awaiting admin approval</strong>
                <p>This item is not visible to receivers until an administrator reviews and approves it.</p>
              </div>
            </div>
          )}

          {item.status === 'AVAILABLE' && (
            <div className="idw-verify-banner idw-verify-banner--success" role="status">
              <ShieldCheck size={20} aria-hidden="true" />
              <div>
                <strong>Live for receivers</strong>
                <p>Your item has been approved and is visible in the receiver browse catalog.</p>
              </div>
            </div>
          )}

          {item.rejection_reason && (
            <div className="idw-alert idw-alert--error idw-alert--compact">
              <strong>Not approved</strong>
              <p>{item.rejection_reason}</p>
            </div>
          )}
          {item.change_request_comment && (
            <div className="idw-verify-banner idw-verify-banner--info">
              <strong>Changes requested</strong>
              <p>{item.change_request_comment}</p>
            </div>
          )}

          <IdwDetailGrid
            items={[
              { label: 'Category', value: item.category },
              { label: 'Subcategory', value: item.subcategory || '—' },
              { label: 'Condition', value: formatCondition(item.condition) },
              { label: 'Quantity', value: `${item.quantity} total · ${item.quantity_available ?? 0} available` },
              { label: 'Brand', value: item.brand || '—' },
              { label: 'Model / variant', value: item.model_variant || '—' },
              {
                label: 'Location',
                value: [item.display_city, item.display_state, item.display_pincode].filter(Boolean).join(', ') || '—',
              },
              { label: 'Submitted', value: formatItemDate(item.submitted_at) || '—' },
              { label: 'Reviewed', value: formatItemDate(item.reviewed_at) || '—' },
            ]}
          />

          {(item.pickup_availability || item.preferred_pickup_time) && (
            <IdwDetailGrid
              items={[
                { label: 'Pickup availability', value: item.pickup_availability || '—' },
                { label: 'Preferred time', value: item.preferred_pickup_time || '—' },
              ]}
            />
          )}

          <div className="idw-detail-page__actions">
            {item.status === 'DRAFT' && (
              <button
                type="button"
                className="idw-btn idw-btn--primary idw-btn--sm"
                onClick={() => navigate(`/dashboard/donor-add-item?edit=${item.item_donation_id}`)}
              >
                Edit &amp; submit
              </button>
            )}
            {item.status === 'REJECTED' && (
              <button
                type="button"
                className="idw-btn idw-btn--primary idw-btn--sm"
                onClick={() => navigate(`/dashboard/donor-add-item?edit=${item.item_donation_id}`)}
              >
                Edit &amp; resubmit
              </button>
            )}
            {['AVAILABLE', 'REQUESTED', 'RESERVED', 'FULFILLMENT_IN_PROGRESS', 'UNAVAILABLE'].includes(item.status) && (
              <button
                type="button"
                className="idw-btn idw-btn--secondary idw-btn--sm"
                onClick={() => navigate(`/dashboard/donor-item-requests?item=${item.item_donation_id}`)}
              >
                View requests
              </button>
            )}
          </div>
        </div>
      </div>
    </IdwPage>
  );
}

export function DonorItemRequestsView() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    listDonorItemRequests(itemId ? Number(itemId) : null)
      .then(setRequests)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [itemId]);

  const respond = async (requestId, action) => {
    const response = action === 'reject' ? prompt('Optional reason for declining:') : '';
    setBusyId(requestId);
    try {
      await respondToItemRequest(requestId, { action, response: response || undefined });
      load();
    } finally {
      setBusyId(null);
    }
  };

  const complete = async (requestId) => {
    setBusyId(requestId);
    try {
      await completeItemRequest(requestId);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <IdwPage className="donor-page donor-module page-route">
      <IdwBack to="/dashboard/donor-my-donations" label="Back to My Donations" />
      <IdwPageHeader
        title="Donation Requests"
        subtitle="Review and respond to requests from receivers."
      />

      {loading && <IdwLoading label="Loading requests…" />}

      {!loading && requests.length === 0 && (
        <IdwEmpty
          icon={Inbox}
          title="No requests yet"
          description="When someone requests your items, they'll appear here."
        />
      )}

      <div className="idw-request-list">
        {requests.map((req) => (
          <IdwCard key={req.request_id} className="idw-request-card">
            <div className="idw-request-card__main">
              <div className="idw-request-card__head">
                <strong>{req.item_name}</strong>
                <span className={statusBadgeClass(req.status)}>{statusLabel(req.status)}</span>
              </div>
              <p className="idw-request-card__meta">
                From <strong>{req.receiver_name || 'Receiver'}</strong>
                {' · '}Qty {req.quantity_requested}
              </p>
              {req.message && <p className="idw-request-card__message">{req.message}</p>}
              {req.donor_response && (
                <p className="idw-request-card__response">Your response: {req.donor_response}</p>
              )}
            </div>
            <div className="idw-request-card__actions">
              {req.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    className="idw-btn idw-btn--primary idw-btn--sm"
                    disabled={busyId === req.request_id}
                    onClick={() => respond(req.request_id, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="idw-btn idw-btn--secondary idw-btn--sm"
                    disabled={busyId === req.request_id}
                    onClick={() => respond(req.request_id, 'reject')}
                  >
                    Decline
                  </button>
                </>
              )}
              {req.status === 'ACCEPTED' && (
                <button
                  type="button"
                  className="idw-btn idw-btn--primary idw-btn--sm"
                  disabled={busyId === req.request_id}
                  onClick={() => complete(req.request_id)}
                >
                  Mark completed
                </button>
              )}
            </div>
          </IdwCard>
        ))}
      </div>
    </IdwPage>
  );
}
