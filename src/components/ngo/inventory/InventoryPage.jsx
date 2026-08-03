import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble, HeartPulse, Accessibility, UtensilsCrossed, Package,
  Hand, Eye, Warehouse, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../ui/Toast';
import {
  getInventoryStockStatus,
  INVENTORY_CATEGORY_ICONS
} from '../../../utils/inventoryHelpers';

const ICONS = {
  BedDouble,
  HeartPulse,
  Accessibility,
  UtensilsCrossed,
  Package
};

function ItemIcon({ category, size = 28 }) {
  const name = INVENTORY_CATEGORY_ICONS[category] || 'Package';
  const Icon = ICONS[name] || Package;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}

function DetailsModal({ item, onClose }) {
  const status = getInventoryStockStatus(item.qty);

  return (
    <div className="inv-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="inv-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inv-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inv-modal__head">
          <div className="inv-modal__icon">
            <ItemIcon category={item.category} />
          </div>
          <div>
            <h2 id="inv-details-title">{item.name}</h2>
            <p>{item.category}</p>
          </div>
          <button type="button" className="inv-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <dl className="inv-modal__meta">
          <div>
            <dt>Item ID</dt>
            <dd>{item.id}</dd>
          </div>
          <div>
            <dt>Available Quantity</dt>
            <dd>{item.qty} {item.unit}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`inv-status inv-status--${status.tone}`}>{status.label}</span>
            </dd>
          </div>
        </dl>
        <p className="inv-modal__note">
          Request this item from available platform inventory. Quantity cannot exceed current stock.
        </p>
        <button type="button" className="inv-btn inv-btn--primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { inventory } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [detailsItem, setDetailsItem] = useState(null);

  const items = useMemo(() => inventory || [], [inventory]);
  const availableCount = items.filter((i) => Number(i.qty) > 0).length;

  const requestItem = (item) => {
    if (!item || Number(item.qty) <= 0) {
      showToast('This item is currently out of stock', 'error');
      return;
    }
    navigate('/dashboard/ngo-request-donations', {
      state: { inventoryItem: item, fromInventory: true }
    });
  };

  return (
    <div className="inv-page ngo-page ngo-module page-route">
      <header className="inv-hero">
        <div className="inv-hero__icon" aria-hidden="true">
          <Warehouse size={22} />
        </div>
        <div>
          <h1>Inventory</h1>
          <p>
            Browse available platform stock and request items for your beneficiaries in one step.
          </p>
        </div>
        <div className="inv-hero__stat">
          <strong>{availableCount}</strong>
          <span>items in stock</span>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="inv-empty">
          <Package size={40} strokeWidth={1.5} />
          <p>No inventory items available right now.</p>
        </div>
      ) : (
        <div className="inv-grid">
          {items.map((item) => {
            const status = getInventoryStockStatus(item.qty);
            const outOfStock = Number(item.qty) <= 0;

            return (
              <article key={item.id} className={`inv-card${outOfStock ? ' is-out' : ''}`}>
                <div className="inv-card__top">
                  <div className="inv-card__icon">
                    <ItemIcon category={item.category} />
                  </div>
                  <div className="inv-card__titles">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                  </div>
                </div>

                <div className="inv-card__qty">
                  <span className="inv-card__qty-label">Available Quantity</span>
                  <strong>
                    {item.qty} <span>{item.unit}</span>
                  </strong>
                </div>

                <span className={`inv-status inv-status--${status.tone}`}>{status.label}</span>

                <div className="inv-card__divider" aria-hidden="true" />

                <div className="inv-card__actions">
                  <button
                    type="button"
                    className="inv-btn inv-btn--primary"
                    disabled={outOfStock}
                    onClick={() => requestItem(item)}
                  >
                    <Hand size={16} />
                    Request Item
                  </button>
                  <button
                    type="button"
                    className="inv-btn inv-btn--link"
                    onClick={() => setDetailsItem(item)}
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {detailsItem && (
        <DetailsModal item={detailsItem} onClose={() => setDetailsItem(null)} />
      )}
    </div>
  );
}
