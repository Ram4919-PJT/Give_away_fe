import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
  Package,
  Search,
  XCircle,
} from 'lucide-react';
import {
  cancelItemRequest,
  createItemRequest,
  listCatalogItems,
  listItemCategories,
  listMyItemRequests,
  statusBadgeClass,
  statusLabel,
} from '../../../api/itemDonationClient';
import { formatCondition } from '../../donor/item-donations/itemDonationHelpers';
import {
  IdwCard,
  IdwEmpty,
  IdwLoading,
  IdwMediaPlaceholder,
  IdwPage,
  IdwPageHeader,
} from '../../donor/item-donations/ItemDonationUi';
import { useReceiverVerification } from '../../../hooks/useReceiverVerification';
import { useToast } from '../../ui/Toast';
import { formatApiError } from '../../../utils/formErrors';
import LockedFeatureCard from '../verification/LockedFeatureCard';
import VerificationRequiredModal from '../verification/VerificationRequiredModal';
import {
  REQUEST_SORT_OPTIONS,
  REQUEST_STATUS_TABS,
  computeItemRequestSummary,
  filterItemRequests,
  formatRequestDateTime,
  getActiveRequestMap,
  getItemPhoto,
  getRequestPhoto,
} from '../../../utils/receiverItemRequestHelpers';

const SUMMARY_ICONS = {
  blue: Package,
  amber: Clock,
  green: CheckCircle2,
  purple: CheckCircle2,
  red: XCircle,
};

const PAGE_SIZE = 6;

function ItemImage({ src, alt = '' }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return <IdwMediaPlaceholder Icon={Package} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="rir-summary" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rir-summary__card rir-skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="rir-summary" aria-label="Request summary">
      {stats.map((stat) => {
        const Icon = SUMMARY_ICONS[stat.tone] || Package;
        return (
          <article key={stat.key} className={`rir-summary__card rir-summary__card--${stat.tone}`}>
            <span className={`rir-summary__icon rir-summary__icon--${stat.tone}`} aria-hidden="true">
              <Icon size={20} strokeWidth={2} />
            </span>
            <div>
              <p className="rir-summary__label">{stat.label}</p>
              <p className="rir-summary__value">{stat.value}</p>
              <p className="rir-summary__hint">{stat.hint}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function RequestItemModal({
  item,
  open,
  verified,
  activeRequest,
  onClose,
  onSuccess,
  onVerify,
}) {
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const [pickup, setPickup] = useState('pickup');
  const [step, setStep] = useState('form');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setQty(1);
    setMessage('');
    setPickup('pickup');
    setStep('form');
    setError(null);
    setBusy(false);
  }, [open, item?.item_donation_id]);

  if (!open || !item) return null;

  const photo = getItemPhoto(item);
  const locked = !verified;
  const hasActive = Boolean(activeRequest);

  const submit = async () => {
    if (locked) {
      onVerify();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createItemRequest(item.item_donation_id, {
        quantity_requested: Number(qty),
        message: message.trim() || undefined,
        pickup_or_delivery: pickup,
      });
      showToast('Item request submitted successfully.', 'success');
      onSuccess();
      onClose();
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rir-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="rir-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rir-request-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rir-modal__head">
          <h2 id="rir-request-title">Request Item</h2>
          <button type="button" className="rir-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="rir-modal__item">
          <div className="rir-modal__thumb">
            <ItemImage src={photo} />
          </div>
          <div>
            <strong>{item.item_name}</strong>
            <p className="rir-muted">
              {item.category} · {formatCondition(item.condition)}
            </p>
            <p className="rir-muted">Available: <strong>{item.quantity_available}</strong></p>
          </div>
        </div>

        {locked && (
          <div className="rir-alert rir-alert--warn">
            Complete your profile verification before requesting donation items.
          </div>
        )}

        {hasActive && (
          <div className="rir-alert rir-alert--info">
            You already have an active request for this item ({statusLabel(activeRequest.status)}).
          </div>
        )}

        {step === 'form' && !hasActive && (
          <>
            <label className="idw-field">
              <span className="idw-field__label">Requested quantity</span>
              <input
                type="number"
                min={1}
                max={item.quantity_available}
                value={qty}
                disabled={locked}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
            <label className="idw-field">
              <span className="idw-field__label">Why do you need this item?</span>
              <textarea
                rows={3}
                placeholder="Optional message to the donor"
                value={message}
                disabled={locked}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <label className="idw-field">
              <span className="idw-field__label">Preference</span>
              <select value={pickup} disabled={locked} onChange={(e) => setPickup(e.target.value)}>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </label>
            {error && (
              <div className="idw-alert idw-alert--error idw-alert--compact" role="alert">
                <p>{error}</p>
              </div>
            )}
            <div className="rir-modal__actions">
              <button type="button" className="btn-outline" onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button
                type="button"
                className="dd-btn"
                disabled={locked || busy}
                onClick={() => {
                  if (locked) {
                    onVerify();
                    return;
                  }
                  setStep('confirm');
                }}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 'confirm' && !hasActive && (
          <>
            <div className="rir-confirm">
              <p>Request this item?</p>
              <dl>
                <div><dt>Item</dt><dd>{item.item_name}</dd></div>
                <div><dt>Quantity</dt><dd>{qty}</dd></div>
              </dl>
            </div>
            {error && (
              <div className="idw-alert idw-alert--error idw-alert--compact" role="alert">
                <p>{error}</p>
              </div>
            )}
            <div className="rir-modal__actions">
              <button type="button" className="btn-outline" onClick={() => setStep('form')} disabled={busy}>
                Back
              </button>
              <button type="button" className="dd-btn" disabled={busy} onClick={submit}>
                {busy ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </>
        )}

        {hasActive && (
          <div className="rir-modal__actions">
            <button type="button" className="dd-btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReceiverMyItemRequestsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { verified, guardAction, modalOpen, closeModal, goToVerification } = useReceiverVerification();

  const [requests, setRequests] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [availableTotal, setAvailableTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsError, setItemsError] = useState(null);

  const [itemFilters, setItemFilters] = useState({ search: '', category: '', page: 1 });
  const [requestFilters, setRequestFilters] = useState({
    status: 'ALL',
    search: '',
    sort: 'newest',
    page: 1,
  });

  const [modalItem, setModalItem] = useState(null);

  const loadRequests = useCallback(() => {
    setLoading(true);
    setError(null);
    return listMyItemRequests()
      .then((data) => setRequests(data || []))
      .catch((e) => {
        setError(formatApiError(e));
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadItems = useCallback(() => {
    setItemsLoading(true);
    setItemsError(null);
    return listCatalogItems({ ...itemFilters, page_size: PAGE_SIZE })
      .then((res) => {
        setAvailableItems(res.items || []);
        setAvailableTotal(res.total || 0);
      })
      .catch((e) => {
        setItemsError(formatApiError(e));
        setAvailableItems([]);
        setAvailableTotal(0);
      })
      .finally(() => setItemsLoading(false));
  }, [itemFilters]);

  useEffect(() => { listItemCategories().then(setCategories).catch(() => []); }, []);
  useEffect(() => { loadRequests(); }, [loadRequests]);
  useEffect(() => { loadItems(); }, [loadItems]);

  const activeRequestMap = useMemo(() => getActiveRequestMap(requests), [requests]);
  const summary = useMemo(
    () => computeItemRequestSummary(requests, availableTotal),
    [requests, availableTotal],
  );

  const filteredRequests = useMemo(
    () => filterItemRequests(requests, requestFilters),
    [requests, requestFilters],
  );

  const requestPageCount = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const requestPage = Math.min(requestFilters.page, requestPageCount);
  const pagedRequests = filteredRequests.slice((requestPage - 1) * PAGE_SIZE, requestPage * PAGE_SIZE);

  const handleCancel = async (requestId) => {
    try {
      await cancelItemRequest(requestId);
      showToast('Request cancelled.', 'success');
      await Promise.all([loadRequests(), loadItems()]);
    } catch (e) {
      showToast(formatApiError(e), 'error');
    }
  };

  const openRequestModal = (item) => {
    if (!verified) {
      guardAction();
      return;
    }
    setModalItem(item);
  };

  if (!verified) {
    return (
      <IdwPage className="receiver-page receiver-module page-route rir-page">
        <IdwPageHeader
          title="My Item Requests"
          subtitle="Browse approved donation items and track the items you have requested."
        />
        <LockedFeatureCard
          title="Verification Required"
          description="Complete your profile verification before requesting donation items."
          onVerify={goToVerification}
        />
        <VerificationRequiredModal
          open={modalOpen}
          onClose={closeModal}
          onVerify={goToVerification}
          message="Complete your receiver verification to request donation items."
        />
      </IdwPage>
    );
  }

  return (
    <IdwPage className="receiver-page receiver-module page-route rir-page">
      <IdwPageHeader
        title="My Item Requests"
        subtitle="Browse approved donation items and track the items you have requested."
        action={(
          <button
            type="button"
            className="dd-btn rir-header-btn"
            onClick={() => document.getElementById('rir-available')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse Available Items
          </button>
        )}
      />

      <SummaryCards stats={summary} loading={loading || itemsLoading} />

      <section id="rir-available" className="rir-section" aria-labelledby="rir-available-title">
        <header className="rir-section__head">
          <div>
            <h2 id="rir-available-title" className="rir-section__title">Available Donation Items</h2>
            <p className="rir-muted">These items have been approved and are available to request.</p>
          </div>
        </header>

        <IdwCard className="idw-filters-card">
          <div className="idw-filters">
            <div className="idw-search">
              <Search size={16} aria-hidden="true" />
              <input
                placeholder="Search items…"
                value={itemFilters.search}
                onChange={(e) => setItemFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
              />
            </div>
            <select
              className="idw-filter-select"
              value={itemFilters.category}
              onChange={(e) => setItemFilters((f) => ({ ...f, category: e.target.value, page: 1 }))}
            >
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        </IdwCard>

        {itemsLoading && <IdwLoading label="Loading available items…" />}

        {itemsError && !itemsLoading && (
          <IdwCard className="rir-error">
            <AlertCircle size={18} aria-hidden="true" />
            <p>Unable to load donation items.</p>
            <button type="button" className="btn-outline btn-sm-card" onClick={loadItems}>Retry</button>
          </IdwCard>
        )}

        {!itemsLoading && !itemsError && availableItems.length === 0 && (
          <IdwEmpty
            title="No donation items are currently available"
            description="Approved donation items will appear here when they become available."
          />
        )}

        {!itemsLoading && !itemsError && availableItems.length > 0 && (
          <>
            <div className="rir-item-grid">
              {availableItems.map((item) => {
                const activeReq = activeRequestMap.get(item.item_donation_id);
                const photo = getItemPhoto(item);
                return (
                  <article key={item.item_donation_id} className="rir-item-card">
                    <div className="rir-item-card__media">
                      <ItemImage src={photo} />
                    </div>
                    <div className="rir-item-card__body">
                      <h3>{item.item_name}</h3>
                      <p className="rir-item-card__meta">
                        {item.category} · {formatCondition(item.condition)}
                      </p>
                      <p className="rir-item-card__qty">
                        Available: <strong>{item.quantity_available}</strong>
                      </p>
                      <div className="rir-item-card__actions">
                        <button
                          type="button"
                          className="btn-outline btn-sm-card"
                          onClick={() => navigate(`/dashboard/receiver-item/${item.item_donation_id}`)}
                        >
                          View Details
                        </button>
                        {activeReq ? (
                          <button type="button" className="btn-outline btn-sm-card" disabled>
                            {statusLabel(activeReq.status)}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="dd-btn btn-sm-card"
                            onClick={() => openRequestModal(item)}
                          >
                            Request Item
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {availableTotal > PAGE_SIZE && (
              <div className="idw-pagination">
                <button
                  type="button"
                  className="btn-outline btn-sm-card"
                  disabled={itemFilters.page <= 1}
                  onClick={() => setItemFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  Previous
                </button>
                <span className="idw-pagination__label">
                  Showing {(itemFilters.page - 1) * PAGE_SIZE + 1}–
                  {Math.min(itemFilters.page * PAGE_SIZE, availableTotal)} of {availableTotal}
                </span>
                <button
                  type="button"
                  className="btn-outline btn-sm-card"
                  disabled={itemFilters.page * PAGE_SIZE >= availableTotal}
                  onClick={() => setItemFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="rir-section" aria-labelledby="rir-requests-title">
        <header className="rir-section__head">
          <div>
            <h2 id="rir-requests-title" className="rir-section__title">My Item Requests</h2>
            <p className="rir-muted">Track the status of items you have requested.</p>
          </div>
        </header>

        <IdwCard className="rir-tabs-card">
          <div className="rir-tabs" role="tablist" aria-label="Request status">
            {REQUEST_STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={requestFilters.status === tab.id}
                className={`rir-tab${requestFilters.status === tab.id ? ' is-active' : ''}`}
                onClick={() => setRequestFilters((f) => ({ ...f, status: tab.id, page: 1 }))}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="idw-filters rir-request-filters">
            <div className="idw-search">
              <Search size={16} aria-hidden="true" />
              <input
                placeholder="Search requests…"
                value={requestFilters.search}
                onChange={(e) => setRequestFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
              />
            </div>
            <select
              className="idw-filter-select"
              value={requestFilters.sort}
              onChange={(e) => setRequestFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
            >
              {REQUEST_SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </IdwCard>

        {loading && <IdwLoading label="Loading your requests…" />}

        {error && !loading && (
          <IdwCard className="rir-error">
            <AlertCircle size={18} aria-hidden="true" />
            <p>Unable to load your item requests.</p>
            <button type="button" className="btn-outline btn-sm-card" onClick={loadRequests}>Retry</button>
          </IdwCard>
        )}

        {!loading && !error && filteredRequests.length === 0 && (
          <IdwEmpty
            icon={Inbox}
            title="No item requests yet"
            description="Browse available donation items and submit your first request."
            action={(
              <button
                type="button"
                className="dd-btn"
                onClick={() => document.getElementById('rir-available')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse available items
              </button>
            )}
          />
        )}

        {!loading && !error && pagedRequests.length > 0 && (
          <>
            <div className="rir-request-table" role="table" aria-label="My item requests">
              <div className="rir-request-table__head" role="row">
                <span role="columnheader">Item</span>
                <span role="columnheader">Quantity</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Requested</span>
                <span role="columnheader">Updated</span>
                <span role="columnheader">Actions</span>
              </div>
              {pagedRequests.map((req) => {
                const photo = getRequestPhoto(req);
                return (
                  <article key={req.request_id} className="rir-request-row" role="row">
                    <div className="rir-request-row__item" role="cell">
                      <div className="rir-request-row__thumb">
                        <ItemImage src={photo} />
                      </div>
                      <div>
                        <strong>{req.item_name}</strong>
                        {req.category && (
                          <p className="rir-muted">{req.category}</p>
                        )}
                      </div>
                    </div>
                    <span role="cell">{req.quantity_requested}</span>
                    <span role="cell">
                      <span className={statusBadgeClass(req.status)}>{statusLabel(req.status)}</span>
                    </span>
                    <span role="cell">{formatRequestDateTime(req.created_at)}</span>
                    <span role="cell">{formatRequestDateTime(req.updated_at || req.created_at)}</span>
                    <span className="rir-request-row__actions" role="cell">
                      <button
                        type="button"
                        className="btn-outline btn-sm-card"
                        onClick={() => navigate(`/dashboard/receiver-item/${req.item_donation_id}`)}
                      >
                        View Details
                      </button>
                      {req.status === 'PENDING' && (
                        <button
                          type="button"
                          className="btn-outline btn-sm-card"
                          onClick={() => handleCancel(req.request_id)}
                        >
                          Cancel
                        </button>
                      )}
                    </span>
                    {req.donor_response && (
                      <p className="rir-request-row__note">Donor: {req.donor_response}</p>
                    )}
                  </article>
                );
              })}
            </div>
            {filteredRequests.length > PAGE_SIZE && (
              <div className="idw-pagination">
                <button
                  type="button"
                  className="btn-outline btn-sm-card"
                  disabled={requestPage <= 1}
                  onClick={() => setRequestFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  Previous
                </button>
                <span className="idw-pagination__label">
                  Showing {(requestPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(requestPage * PAGE_SIZE, filteredRequests.length)} of {filteredRequests.length}
                </span>
                <button
                  type="button"
                  className="btn-outline btn-sm-card"
                  disabled={requestPage >= requestPageCount}
                  onClick={() => setRequestFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <div className="rir-footer-links">
        <Link to="/dashboard/receiver-browse-items" className="idw-link">Open full browse page →</Link>
      </div>

      <RequestItemModal
        item={modalItem}
        open={Boolean(modalItem)}
        verified={verified}
        activeRequest={modalItem ? activeRequestMap.get(modalItem.item_donation_id) : null}
        onClose={() => setModalItem(null)}
        onSuccess={() => Promise.all([loadRequests(), loadItems()])}
        onVerify={guardAction}
      />

      <VerificationRequiredModal
        open={modalOpen}
        onClose={closeModal}
        onVerify={goToVerification}
        message="Complete your receiver verification to request donation items."
      />
    </IdwPage>
  );
}
