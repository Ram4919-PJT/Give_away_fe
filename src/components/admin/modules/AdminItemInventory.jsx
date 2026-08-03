import { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import {
  ADMIN_INVENTORY_ITEMS, INVENTORY_CATEGORIES, ITEM_CONDITIONS, ITEM_STATUSES, getInventorySummary
} from '../../../data/adminMockData';
import {
  AdminModuleShell, AdminStatStrip, AdminToolbar, AdminSearchInput, AdminSelect, AdminBadge, AdminEmpty
} from '../AdminModuleShell';

const STATUS_VARIANT = { Available: 'green', Reserved: 'orange', Delivered: 'blue', 'In Storage': 'muted' };

export default function AdminItemInventory() {
  const { showToast } = useToast();
  const [items] = useState(ADMIN_INVENTORY_ITEMS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');

  const summary = getInventorySummary(items);

  const filtered = useMemo(() => {
    let list = items.filter((item) => {
      const q = search.toLowerCase();
      const matchQ = !q || item.name.toLowerCase().includes(q) || item.donorName.toLowerCase().includes(q);
      const matchC = category === 'All' || item.category === category;
      const matchCo = condition === 'All' || item.condition === condition;
      const matchS = status === 'All' || item.status === status;
      return matchQ && matchC && matchCo && matchS;
    });
    if (sort === 'oldest') list = [...list].reverse();
    else if (sort === 'quantity') list = [...list].sort((a, b) => b.quantity - a.quantity);
    return list;
  }, [items, search, category, condition, status, sort]);

  return (
    <AdminModuleShell title="Item Inventory" subtitle="Track donated items, storage locations, and NGO assignments.">
      <AdminStatStrip items={[
        ['Total Items', summary.total, 'blue'],
        ['Available', summary.available, 'green'],
        ['Reserved', summary.reserved, 'orange'],
        ['Delivered', summary.delivered, 'purple']
      ]} />

      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search items or donors…" />
        <AdminSelect value={category} onChange={setCategory} label="Category" options={['All', ...INVENTORY_CATEGORIES]} />
        <AdminSelect value={condition} onChange={setCondition} label="Condition" options={['All', ...ITEM_CONDITIONS]} />
        <AdminSelect value={status} onChange={setStatus} label="Status" options={['All', ...ITEM_STATUSES]} />
        <AdminSelect value={sort} onChange={setSort} label="Sort" options={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'quantity', label: 'Quantity' }
        ]} />
      </AdminToolbar>

      {filtered.length ? (
        <div className="admin-mod-inventory-grid">
          {filtered.map((item) => (
            <article key={item.id} className="admin-mod-inventory-card">
              <div className="admin-mod-inventory-card__image" aria-hidden="true">{item.emoji}</div>
              <div className="admin-mod-inventory-card__body">
                <div className="admin-mod-inventory-card__head">
                  <h3>{item.name}</h3>
                  <AdminBadge variant={STATUS_VARIANT[item.status] || 'muted'}>{item.status}</AdminBadge>
                </div>
                <dl className="admin-mod-inventory-card__meta">
                  <div><dt>Category</dt><dd>{item.category}</dd></div>
                  <div><dt>Condition</dt><dd>{item.condition}</dd></div>
                  <div><dt>Quantity</dt><dd>{item.quantity}</dd></div>
                  <div><dt>Donor</dt><dd>{item.donorName}</dd></div>
                  <div><dt>Received</dt><dd>{item.receivedDate}</dd></div>
                  <div><dt>Storage</dt><dd>{item.storageLocation}</dd></div>
                  <div><dt>Assigned NGO</dt><dd>{item.assignedNgo || '—'}</dd></div>
                </dl>
                <div className="admin-mod-inventory-card__actions">
                  <button type="button" className="admin-mod-btn admin-mod-btn--outline" onClick={() => showToast(`Viewing ${item.name}…`, 'info')}>View Details</button>
                  <button type="button" className="admin-mod-btn admin-mod-btn--primary" onClick={() => showToast(`Assign ${item.name} — wireframe.`, 'info')}>Assign</button>
                  <button type="button" className="admin-mod-btn admin-mod-btn--green" onClick={() => showToast(`Marked ${item.name} delivered.`, 'success')}>Mark Delivered</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty icon={Package} title="No inventory items" desc="Donated items will appear here once received." />
      )}
    </AdminModuleShell>
  );
}
