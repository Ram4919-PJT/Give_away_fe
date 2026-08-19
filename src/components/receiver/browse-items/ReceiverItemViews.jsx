import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, MapPin, Package, Search } from 'lucide-react';
import {
  createItemRequest,
  getCatalogItem,
  listCatalogItems,
  listItemCategories,
} from '../../../api/itemDonationClient';
import { formatApiError } from '../../../utils/formErrors';
import { useReceiverVerification } from '../../../hooks/useReceiverVerification';
import VerificationRequiredModal from '../verification/VerificationRequiredModal';
import {
  IdwBack,
  IdwCard,
  IdwEmpty,
  IdwLoading,
  IdwMediaPlaceholder,
  IdwPage,
  IdwPageHeader,
} from '../../donor/item-donations/ItemDonationUi';

export function BrowseItemsView() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', search: '', city: '', page: 1 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { listItemCategories().then(setCategories).catch(() => []); }, []);

  useEffect(() => {
    setLoading(true);
    listCatalogItems({ ...filters, page_size: 12 })
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <IdwPage className="receiver-page receiver-module page-route idw-browse">
      <IdwPageHeader
        title="Browse Donation Items"
        subtitle="Approved items available from verified donors in your area."
      />

      <IdwCard className="idw-filters-card">
        <div className="idw-filters">
          <div className="idw-search">
            <Search size={16} aria-hidden="true" />
            <input
              placeholder="Search by name or description…"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            />
          </div>
          <select
            className="idw-filter-select"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))}
          >
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <input
            className="idw-filter-input"
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value, page: 1 }))}
          />
        </div>
      </IdwCard>

      {loading && <IdwLoading label="Finding available items…" />}

      {!loading && items.length === 0 && (
        <IdwEmpty
          title="No items available"
          description="No donation items match your filters right now. Try adjusting your search."
        />
      )}

      {!loading && items.length > 0 && (
        <div className="idw-item-grid">
          {items.map((item) => (
            <article
              key={item.item_donation_id}
              className="idw-item-card idw-item-card--click"
              onClick={() => navigate(`/dashboard/receiver-item/${item.item_donation_id}`)}
            >
              <div className="idw-item-card__media">
                {item.photo_urls?.[0] ? (
                  <img src={item.photo_urls[0]} alt="" />
                ) : (
                  <IdwMediaPlaceholder />
                )}
              </div>
              <div className="idw-item-card__body">
                <h3>{item.item_name}</h3>
                <p className="idw-item-card__category">
                  {item.category} · {(item.condition || '').replace(/_/g, ' ')}
                </p>
                <div className="idw-item-card__stats">
                  <span><strong>{item.quantity_available}</strong> available</span>
                  {item.display_city && (
                    <span className="idw-item-card__location">
                      <MapPin size={12} aria-hidden="true" />
                      {item.display_city}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {total > 12 && (
        <div className="idw-pagination">
          <button
            type="button"
            className="btn-outline btn-sm-card"
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
          >
            Previous
          </button>
          <span className="idw-pagination__label">Page {filters.page}</span>
          <button
            type="button"
            className="btn-outline btn-sm-card"
            disabled={filters.page * 12 >= total}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}

      <div className="idw-page-footer-link">
        <Link to="/dashboard/receiver-my-item-requests" className="idw-link">
          View my requests →
        </Link>
      </div>
    </IdwPage>
  );
}

export function ReceiverItemDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { verified, guardAction, modalOpen, closeModal, goToVerification } = useReceiverVerification();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const [pickup, setPickup] = useState('pickup');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCatalogItem(id).then(setItem).catch(() => setItem(null)).finally(() => setLoading(false));
  }, [id]);

  const submit = async () => {
    if (!verified) {
      guardAction();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createItemRequest(Number(id), {
        quantity_requested: Number(qty),
        message,
        pickup_or_delivery: pickup,
      });
      navigate('/dashboard/receiver-my-item-requests');
    } catch (e) {
      const messageText = formatApiError(e);
      if (/verification/i.test(messageText)) {
        guardAction();
      }
      setError(messageText);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <IdwPage className="receiver-page receiver-module page-route">
        <IdwLoading label="Loading item…" />
      </IdwPage>
    );
  }

  if (!item) {
    return (
      <IdwPage className="receiver-page receiver-module page-route">
        <IdwEmpty title="Item not found" description="This item may no longer be available." />
      </IdwPage>
    );
  }

  return (
    <IdwPage className="receiver-page receiver-module page-route idw-detail-page">
      <IdwBack onClick={() => navigate('/dashboard/receiver-browse-items')} label="Back to browse" />

      <div className="idw-detail-page__hero">
        <div className="idw-detail-page__gallery">
          {item.photo_urls?.length > 0 ? (
            <div className="idw-photo-grid idw-photo-grid--hero">
              {item.photo_urls.map((url) => (
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
          <h1>{item.item_name}</h1>
          <p className="idw-detail-page__meta">
            {item.category} · {(item.condition || '').replace(/_/g, ' ')}
            {item.display_city && (
              <> · <MapPin size={14} style={{ verticalAlign: '-2px' }} /> {item.display_city}, {item.display_state}</>
            )}
          </p>
          <p className="idw-detail-page__desc">{item.description}</p>
          <p className="idw-detail-page__availability">
            <strong>{item.quantity_available}</strong> units available
          </p>

          {!confirm ? (
            <button
              type="button"
              className={`dd-btn idw-detail-page__cta${verified ? '' : ' dd-btn--locked'}`}
              onClick={() => guardAction(() => setConfirm(true))}
            >
              {verified ? 'Request This Item' : (
                <>
                  <Lock size={16} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                  Request This Item
                </>
              )}
            </button>
          ) : (
            <IdwCard className="idw-request-form">
              <h3>Request item</h3>
              <p className="idw-muted">
                You are requesting <strong>{qty}</strong> unit(s). The donor will review your request.
              </p>
              <label className="idw-field">
                <span className="idw-field__label">Quantity</span>
                <input
                  type="number"
                  min={1}
                  max={item.quantity_available}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </label>
              <label className="idw-field">
                <span className="idw-field__label">Message to donor</span>
                <textarea rows={3} placeholder="Why do you need this item?" value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>
              <label className="idw-field">
                <span className="idw-field__label">Preference</span>
                <select value={pickup} onChange={(e) => setPickup(e.target.value)}>
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
              </label>
              {error && (
                <div className="idw-alert idw-alert--error idw-alert--compact" role="alert">
                  <p>{error}</p>
                </div>
              )}
              <div className="idw-request-form__actions">
                <button type="button" className="btn-outline" onClick={() => setConfirm(false)} disabled={busy}>
                  Cancel
                </button>
                <button type="button" className="dd-btn" disabled={busy} onClick={submit}>
                  Submit Request
                </button>
              </div>
            </IdwCard>
          )}
        </div>
      </div>
      <VerificationRequiredModal
        open={modalOpen}
        onClose={closeModal}
        onVerify={goToVerification}
        message="Complete your receiver verification to request donation items."
      />
    </IdwPage>
  );
}

export { default as ReceiverMyItemRequestsView } from '../item-requests/ReceiverMyItemRequestsPage';
