import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ShieldAlert } from 'lucide-react';
import { useApp, isRoleVerified } from '../../../context/AppContext';
import {
  getDonorVerificationStatus,
  listMyItemDonations,
} from '../../../api/itemDonationClient';
import {
  ITEM_TABS,
  computeItemStats,
  filterAndSortItems,
  getEmptyStateCopy,
  getUniqueCategories,
  getUniqueConditions,
} from './itemDonationHelpers';
import {
  IdwErrorState,
  IdwItemCard,
  IdwItemFilters,
  IdwItemStats,
  IdwItemTabs,
  IdwSectionEmpty,
  IdwSkeletonCard,
} from './ItemDonationUi';

const SKELETON_COUNT = 4;

export default function MyDonationItems() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const verified = isRoleVerified(currentUser);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiVerified, setApiVerified] = useState(verified);

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('newest');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, status] = await Promise.all([
        listMyItemDonations(),
        getDonorVerificationStatus().catch(() => ({ verified })),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setApiVerified(Boolean(status?.verified ?? verified));
    } catch {
      setError('Unable to load donation items.');
    } finally {
      setLoading(false);
    }
  }, [verified]);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => computeItemStats(items), [items]);
  const categories = useMemo(() => getUniqueCategories(items), [items]);
  const conditions = useMemo(() => getUniqueConditions(items), [items]);

  const tabCounts = useMemo(() => ({
    all: items.length,
    approved: stats.approved,
    pending: stats.pending,
    requested: stats.requested,
    rejected: stats.rejected,
  }), [items.length, stats]);

  const filteredItems = useMemo(
    () => filterAndSortItems(items, { tab, search, category, condition, sort }),
    [items, tab, search, category, condition, sort]
  );

  const canAdd = apiVerified;
  const emptyCopy = getEmptyStateCopy(tab);

  const goToItem = (id) => navigate(`/dashboard/donor-item-donation/${id}`);
  const goToRequests = (id) => navigate(`/dashboard/donor-item-requests?item=${id}`);
  const goToEdit = (id) => navigate(`/dashboard/donor-add-item?edit=${id}`);

  return (
    <section className="idw-items-page">
      <header className="idw-items-page__head">
        <div>
          <h2 className="idw-items-page__title">Item Donations</h2>
          <p className="idw-items-page__sub">
            Manage your donated items, requests and verification status.
          </p>
        </div>
        {canAdd ? (
          <button
            type="button"
            className="idw-btn idw-btn--primary"
            onClick={() => navigate('/dashboard/donor-add-item')}
          >
            <Plus size={18} aria-hidden="true" />
            Add Donation Item
          </button>
        ) : (
          <button
            type="button"
            className="idw-btn idw-btn--secondary"
            disabled
            title="Verification required"
          >
            <Plus size={18} aria-hidden="true" />
            Add Donation Item
          </button>
        )}
      </header>

      {!canAdd && (
        <div className="idw-verify-banner" role="status">
          <ShieldAlert size={20} aria-hidden="true" />
          <div>
            <strong>Verification required</strong>
            <p>Your donor verification is pending. You can add donation items after your account has been verified.</p>
            <Link to="/dashboard/donor-verify" className="idw-link">Complete donor verification →</Link>
          </div>
        </div>
      )}

      <IdwItemStats stats={stats} loading={loading} />

      {!loading && !error && items.length > 0 && (
        <>
          <IdwItemFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            condition={condition}
            onConditionChange={setCondition}
            sort={sort}
            onSortChange={setSort}
            categories={categories}
            conditions={conditions}
          />

          <IdwItemTabs
            tabs={ITEM_TABS}
            active={tab}
            onChange={setTab}
            counts={tabCounts}
          />
        </>
      )}

      {loading && (
        <div className="idw-item-grid idw-item-grid--v2" aria-busy="true" aria-label="Loading items">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <IdwSkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <IdwErrorState message={error} onRetry={load} />
      )}

      {!loading && !error && items.length === 0 && (
        <IdwSectionEmpty
          title={emptyCopy.title}
          description={emptyCopy.description}
          action={canAdd && (
            <button type="button" className="idw-btn idw-btn--primary" onClick={() => navigate('/dashboard/donor-add-item')}>
              <Plus size={16} aria-hidden="true" />
              Add Donation Item
            </button>
          )}
        />
      )}

      {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
        <IdwSectionEmpty
          title="No items match your filters"
          description="Try adjusting your search or filters to see more items."
          action={
            <button
              type="button"
              className="idw-btn idw-btn--secondary"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setCondition('all');
                setTab('all');
              }}
            >
              Clear filters
            </button>
          }
        />
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="idw-items-panel" key={tab}>
          {tab === 'pending' && (
            <p className="idw-items-panel__hint">
              These items are waiting for admin verification.
            </p>
          )}
          {tab === 'requested' && (
            <p className="idw-items-panel__hint">
              Items with active receiver requests appear here.
            </p>
          )}
          <div className="idw-item-grid idw-item-grid--v2" role="tabpanel">
            {filteredItems.map((item) => (
              <IdwItemCard
                key={item.item_donation_id}
                item={item}
                onView={() => goToItem(item.item_donation_id)}
                onRequests={() => goToRequests(item.item_donation_id)}
                onContinue={() => goToEdit(item.item_donation_id)}
                onEdit={() => goToEdit(item.item_donation_id)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
