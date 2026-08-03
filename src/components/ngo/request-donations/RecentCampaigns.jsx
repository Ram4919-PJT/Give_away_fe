import { Clock, CheckCircle, XCircle, Package, Copy, ArrowUpRight, Plus } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { getPriorityStyle, normalizeCampaignStatus } from '../../../data/ngoDonationCategories';
import CategoryIcon from './CategoryIcon';
import { DONATION_CATEGORIES } from '../../../data/ngoDonationCategories';

const STATUS = {
  Pending: {
    icon: Clock,
    badge: 'bg-amber-50 text-amber-700 ring-amber-200/80',
    label: 'PENDING'
  },
  Approved: {
    icon: CheckCircle,
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
    label: 'APPROVED'
  },
  Rejected: {
    icon: XCircle,
    badge: 'bg-red-50 text-red-700 ring-red-200/80',
    label: 'REJECTED'
  },
  Completed: {
    icon: CheckCircle,
    badge: 'bg-sky-50 text-sky-700 ring-sky-200/80',
    label: 'COMPLETED'
  }
};

function matchCategory(req) {
  return DONATION_CATEGORIES.find(
    (c) => c.label === req.category || c.label.toLowerCase().includes((req.category || '').split('/')[0]?.toLowerCase())
  );
}

export default function RecentCampaigns({ requests, onCreateClick, onDuplicate }) {
  const { showToast } = useToast();
  const campaigns = (requests || []).filter((r) => r.type === 'Items');

  return (
    <section className="mt-10 max-w-4xl" aria-labelledby="recent-campaigns-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="recent-campaigns-heading" className="text-lg font-bold tracking-tight text-slate-800">
          Recent Campaigns
        </h2>
        {campaigns.length > 0 && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand"
          >
            <Plus size={16} />
            New Campaign
          </button>
        )}
      </div>

      {!campaigns.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-tint text-brand">
            <Package size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No campaigns yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first donation campaign using the builder above.</p>
          <button
            type="button"
            onClick={onCreateClick}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            Start Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((req) => {
            const cat = matchCategory(req);
            const statusKey = normalizeCampaignStatus(req.status);
            const statusCfg = STATUS[statusKey];
            const StatusIcon = statusCfg.icon;
            const pri = getPriorityStyle(req.priority || 'Medium');

            return (
              <article
                key={req.id}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-tint text-brand">
                    <CategoryIcon name={cat?.iconName || 'Package'} size={20} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ring-1 ring-inset ${statusCfg.badge}`}
                  >
                    <StatusIcon size={11} />
                    {statusCfg.label}
                  </span>
                </div>

                <h3 className="text-base font-semibold leading-snug text-slate-800">
                  {req.title || req.purpose?.slice(0, 48) || 'Untitled Campaign'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {req.category || 'General'} · {req.appliedDate || '—'}
                </p>
                {req.itemLabels?.length > 0 && (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                    {req.itemLabels.slice(0, 3).join(', ')}
                    {req.itemLabels.length > 3 && ` +${req.itemLabels.length - 3} more`}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset"
                    style={{ background: pri.bg, color: pri.color, borderColor: pri.border }}
                  >
                    {req.priority || 'Medium'} Priority
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      title="View"
                      onClick={() => showToast(`Opening ${req.id} (wireframe).`, 'info')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-brand/30 hover:bg-brand-tint hover:text-brand"
                    >
                      <ArrowUpRight size={15} />
                    </button>
                    <button
                      type="button"
                      title="Duplicate"
                      onClick={() => onDuplicate?.(req)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-brand/30 hover:bg-brand-tint hover:text-brand"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
