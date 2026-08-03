import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import {
  ArrowRight, ArrowLeft, MapPin, Send, ChevronRight, Check,
  Upload, Calendar, Target, Users, Sparkles, Image, FileText, Package
} from 'lucide-react';
import CampaignStepper from './CampaignStepper';
import CategoryIcon from './CategoryIcon';
import CategorySelectModal from './CategorySelectModal';
import {
  DONATION_CATEGORIES,
  PRIORITY_OPTIONS,
  PURPOSE_MAX_LENGTH,
  INITIAL_CAMPAIGN_FORM,
  getCategoryById,
  computeEstimatedImpact
} from '../../../data/ngoDonationCategories';
import { getCategorySubitems, getSelectedItemLabels } from '../../../data/ngoDonationSubcategories';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45';
const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50';
const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-brand transition hover:border-brand/40 hover:bg-brand-tint';

function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <header className="mb-6 flex items-start gap-4">
      {Icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
          <Icon size={22} strokeWidth={1.75} />
        </span>
      )}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </header>
  );
}

function StepCategory({ form, onChange }) {
  const select = (catId) => {
    if (form.category === catId) return;
    onChange({ category: catId, selectedItems: [] });
  };

  return (
    <>
      <StepHeader
        icon={Sparkles}
        title="Choose Donation Category"
        subtitle="Select the primary category for your donation campaign."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {DONATION_CATEGORIES.map((cat) => {
          const selected = form.category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => select(cat.id)}
              aria-pressed={selected}
              className={[
                'group relative flex w-full items-start gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition duration-200',
                'hover:-translate-y-0.5 hover:border-brand hover:shadow-md',
                selected ? 'border-brand ring-2 ring-brand/20' : 'border-slate-200'
              ].join(' ')}
            >
              {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
                <CategoryIcon name={cat.iconName} size={20} />
              </span>
              <span className="min-w-0 flex-1 pr-6">
                <span className="block font-semibold text-slate-800">{cat.label}</span>
                <span className="mt-0.5 block text-sm text-slate-500">{cat.description}</span>
              </span>
              <ChevronRight
                size={18}
                className="absolute bottom-4 right-3 shrink-0 text-slate-300 transition group-hover:text-brand"
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepItems({ form, onChange, autoOpenModal }) {
  const [modalOpen, setModalOpen] = useState(false);
  const category = getCategoryById(form.category);
  const config = getCategorySubitems(form.category);
  const labels = getSelectedItemLabels(form.category, form.selectedItems);

  useEffect(() => {
    if (autoOpenModal && category && config && !form.selectedItems.length) {
      setModalOpen(true);
    }
  }, [autoOpenModal, category, config, form.selectedItems.length]);

  if (!category || !config) {
    return (
      <StepHeader
        icon={Package}
        title="Choose Required Items"
        subtitle="Go back and select a category first."
      />
    );
  }

  const toggleItem = (id) => {
    const next = form.selectedItems.includes(id)
      ? form.selectedItems.filter((x) => x !== id)
      : [...form.selectedItems, id];
    onChange({ selectedItems: next });
  };

  return (
    <>
      <StepHeader
        icon={Package}
        title={`Choose ${category.label} Items`}
        subtitle="Select one or more specific items needed for this campaign."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-tint text-brand">
          <CategoryIcon name={category.iconName} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800">{category.label}</p>
          <p className="text-sm text-slate-500">
            {labels.length ? `${labels.length} selected` : 'No items selected yet'}
          </p>
        </div>
        <button type="button" className={btnGhost} onClick={() => setModalOpen(true)}>
          Open picker
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {config.items.map((item) => {
          const on = form.selectedItems.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleItem(item.id)}
              className={[
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition',
                on
                  ? 'border-brand bg-brand-tint text-brand-dark'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand/40'
              ].join(' ')}
            >
              {on && <Check size={14} strokeWidth={3} />}
              <CategoryIcon name={item.iconName} size={15} />
              {item.label}
            </button>
          );
        })}
      </div>

      {labels.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
          {labels.map((l) => (
            <span key={l} className="rounded-md bg-brand-tint px-2 py-1 text-xs font-semibold text-brand-dark">
              {l}
            </span>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategorySelectModal
          categoryId={form.category}
          initialSelected={form.selectedItems}
          onClose={() => setModalOpen(false)}
          onContinue={(_, items) => {
            onChange({ selectedItems: items });
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}

function StepDetails({ form, onChange }) {
  const purposeLen = (form.purpose || '').length;

  return (
    <>
      <StepHeader
        icon={FileText}
        title="Campaign Details"
        subtitle="Give your campaign a clear name, purpose, and delivery expectations."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <label htmlFor="cb-title" className="block text-sm font-semibold text-slate-800">
            Campaign Name
          </label>
          <p className="mb-2 text-xs text-slate-500">A short, memorable title for donors and admins.</p>
          <input
            id="cb-title"
            type="text"
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Winter Clothing Drive 2026"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <label htmlFor="cb-purpose" className="block text-sm font-semibold text-slate-800">
            Purpose
          </label>
          <p className="mb-2 text-xs text-slate-500">Explain why this campaign is needed and how items will be used.</p>
          <textarea
            id="cb-purpose"
            value={form.purpose}
            onChange={(e) => onChange({ purpose: e.target.value.slice(0, PURPOSE_MAX_LENGTH) })}
            placeholder="Describe the community need and expected outcomes..."
            rows={4}
            maxLength={PURPOSE_MAX_LENGTH}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <span className={`mt-1 block text-right text-xs ${purposeLen > PURPOSE_MAX_LENGTH - 50 ? 'text-amber-600' : 'text-slate-400'}`}>
            {purposeLen}/{PURPOSE_MAX_LENGTH}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <label className="block text-sm font-semibold text-slate-800">Priority</label>
          <p className="mb-3 text-xs text-slate-500">How urgently should this campaign be reviewed?</p>
          <div className="space-y-2">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ priority: p.id })}
                className={[
                  'flex w-full flex-col items-start rounded-lg border px-3 py-2.5 text-left transition hover:-translate-y-px',
                  form.priority === p.id ? 'ring-1' : 'border-slate-200 bg-white'
                ].join(' ')}
                style={
                  form.priority === p.id
                    ? { borderColor: p.border, background: p.bg, color: p.color, ringColor: p.border }
                    : undefined
                }
              >
                <strong className="text-sm">{p.label}</strong>
                <small className="text-xs opacity-80">{p.hint}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <label htmlFor="cb-qty" className="block text-sm font-semibold text-slate-800">
              Quantity
            </label>
            <p className="mb-2 text-xs text-slate-500">Total units requested across all items.</p>
            <input
              id="cb-qty"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => onChange({ quantity: e.target.value })}
              placeholder="e.g. 500"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <label htmlFor="cb-target" className="block text-sm font-semibold text-slate-800">
              Target Date
            </label>
            <p className="mb-2 text-xs text-slate-500">When do you need these donations by?</p>
            <div className="relative">
              <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="cb-target"
                type="date"
                value={form.targetDate}
                onChange={(e) => onChange({ targetDate: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StepBeneficiary({ form, onChange }) {
  const fieldClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20';
  const cardClass = 'rounded-xl border border-slate-200 bg-slate-50/80 p-4';

  return (
    <>
      <StepHeader
        icon={Users}
        title="Beneficiary Details"
        subtitle="Tell us who will receive support and where distribution will happen."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={cardClass}>
          <label htmlFor="cb-ben" className="block text-sm font-semibold text-slate-800">Beneficiary Count</label>
          <p className="mb-2 text-xs text-slate-500">Estimated number of people who will benefit.</p>
          <input id="cb-ben" type="number" min="1" value={form.beneficiaryCount} onChange={(e) => onChange({ beneficiaryCount: e.target.value })} placeholder="e.g. 200" className={fieldClass} />
        </div>
        <div className={cardClass}>
          <label htmlFor="cb-loc" className="block text-sm font-semibold text-slate-800">Location</label>
          <p className="mb-2 text-xs text-slate-500">City or district for this campaign.</p>
          <input id="cb-loc" type="text" value={form.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="e.g. Mumbai, Maharashtra" className={fieldClass} />
        </div>
        <div className={cardClass}>
          <label htmlFor="cb-area" className="block text-sm font-semibold text-slate-800">Distribution Area</label>
          <p className="mb-2 text-xs text-slate-500">Specific neighborhoods, camps, or centers.</p>
          <input id="cb-area" type="text" value={form.distributionArea} onChange={(e) => onChange({ distributionArea: e.target.value })} placeholder="e.g. Andheri East shelter cluster" className={fieldClass} />
        </div>
        <div className={cardClass}>
          <label htmlFor="cb-dist-date" className="block text-sm font-semibold text-slate-800">Expected Distribution Date</label>
          <p className="mb-2 text-xs text-slate-500">When items will reach beneficiaries.</p>
          <input id="cb-dist-date" type="date" value={form.distributionDate} onChange={(e) => onChange({ distributionDate: e.target.value })} className={fieldClass} />
        </div>
        <div className={`${cardClass} sm:col-span-2`}>
          <label htmlFor="cb-notes" className="block text-sm font-semibold text-slate-800">Additional Notes</label>
          <p className="mb-2 text-xs text-slate-500">Optional context for the review team.</p>
          <textarea id="cb-notes" value={form.notes} onChange={(e) => onChange({ notes: e.target.value })} rows={3} placeholder="Special delivery instructions..." className={`${fieldClass} resize-none`} />
        </div>
        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
            <Image size={28} className="text-slate-400" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-slate-700">Image Upload</span>
            <span className="text-xs text-slate-400">Attach campaign photos</span>
            <button type="button" className={btnGhost} onClick={() => {}}>
              <Upload size={14} /> Browse
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50/50 p-6 text-center">
            <MapPin size={28} className="text-slate-400" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-slate-700">Map Preview</span>
            <span className="max-w-[200px] text-xs text-slate-400">
              {form.location || form.distributionArea || 'Location will appear here'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function StepReview({ form, ngoName, onEdit }) {
  const category = getCategoryById(form.category);
  const items = getSelectedItemLabels(form.category, form.selectedItems);
  const timeline = [
    { label: 'Campaign Created', done: true },
    { label: 'Submitted for Review', active: true },
    { label: 'Admin Approval' },
    { label: 'Distribution' }
  ];

  return (
    <>
      <StepHeader
        icon={Target}
        title="Review & Submit"
        subtitle="Confirm everything looks correct before sending for approval."
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
        <div className="mb-5 flex gap-4 border-b border-slate-200 pb-5">
          {category && (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <CategoryIcon name={category.iconName} size={26} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-800">{form.title || 'Untitled Campaign'}</h3>
            <p className="mt-1 text-sm text-slate-500">{form.purpose || '—'}</p>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ['Category', category?.label || '—'],
            ['Priority', form.priority],
            ['Quantity', form.quantity ? `${form.quantity} units` : '—'],
            ['Beneficiaries', form.beneficiaryCount || '—'],
            ['Target Date', form.targetDate || '—'],
            ['Distribution', form.distributionDate || '—'],
            ['Location', [form.location, form.distributionArea].filter(Boolean).join(' · ') || '—'],
            ['Organized by', ngoName],
            ['Estimated Impact', computeEstimatedImpact(form)]
          ].map(([label, value]) => (
            <div key={label} className={`rounded-lg border border-slate-200 bg-white p-3 ${label === 'Location' || label === 'Estimated Impact' ? 'sm:col-span-2' : ''}`}>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
              <dd className={`mt-1 text-sm font-semibold ${label === 'Estimated Impact' ? 'text-brand' : 'text-slate-800'}`}>
                {value}
              </dd>
            </div>
          ))}
          <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-white p-3">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Items ({items.length})</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {items.length ? items.map((i) => (
                <span key={i} className="rounded-md bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand-dark">{i}</span>
              )) : '—'}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign Timeline</p>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {timeline.map((t) => (
              <div key={t.label} className="flex min-w-[90px] flex-1 flex-col items-center gap-2 text-center">
                <div className={`h-2.5 w-2.5 rounded-full ${t.done || t.active ? 'bg-brand' : 'bg-slate-200'}`} />
                <span className={`text-[10px] font-semibold leading-tight ${t.active ? 'text-brand' : t.done ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="button" onClick={onEdit} className={`${btnGhost} mt-4`}>
        Edit campaign
      </button>
    </>
  );
}

function validateStep(step, form) {
  if (step === 1) return !!form.category;
  if (step === 2) return (form.selectedItems?.length || 0) > 0;
  if (step === 3) {
    return form.title.trim() && form.purpose.trim() && form.priority && form.quantity && form.targetDate;
  }
  if (step === 4) {
    return form.beneficiaryCount && form.location.trim() && form.distributionArea.trim() && form.distributionDate;
  }
  return true;
}

export default forwardRef(function CampaignWizard({ ngoName, onSubmit }, ref) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_CAMPAIGN_FORM });

  const patch = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const resetWizard = () => {
    setForm({ ...INITIAL_CAMPAIGN_FORM });
    setStep(1);
  };

  useImperativeHandle(ref, () => ({
    scrollIntoView: () => document.getElementById('cb-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    reset: resetWizard,
    duplicate: (req) => {
      setForm({
        category: DONATION_CATEGORIES.find((c) => c.label === req.category)?.id || null,
        selectedItems: req.selectedItems || [],
        title: req.title || '',
        purpose: req.purpose || '',
        priority: req.priority || 'Medium',
        quantity: req.quantity != null ? String(req.quantity) : '',
        targetDate: req.targetDate || '',
        beneficiaryCount: req.beneficiaryCount != null ? String(req.beneficiaryCount) : '',
        location: req.location || '',
        distributionArea: req.distributionArea || '',
        distributionDate: req.distributionDate || '',
        notes: req.notes || ''
      });
      setStep(1);
      document.getElementById('cb-builder')?.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  const goNext = () => {
    if (!validateStep(step, form)) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    onSubmit(form);
    resetWizard();
  };

  const canNext = validateStep(step, form);

  return (
    <div id="cb-builder" className="max-w-4xl font-sans">
      <CampaignStepper step={step} />

      <div key={step} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-opacity duration-300">
        {step === 1 && <StepCategory form={form} onChange={patch} />}
        {step === 2 && <StepItems form={form} onChange={patch} autoOpenModal />}
        {step === 3 && <StepDetails form={form} onChange={patch} />}
        {step === 4 && <StepBeneficiary form={form} onChange={patch} />}
        {step === 5 && <StepReview form={form} ngoName={ngoName} onEdit={() => setStep(1)} />}

        <footer className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <div>
            {step > 1 && (
              <button type="button" className={btnSecondary} onClick={goBack}>
                <ArrowLeft size={18} />
                Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 5 ? (
              <button type="button" className={btnPrimary} onClick={goNext} disabled={!canNext}>
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button type="button" className={`${btnPrimary} min-w-[180px]`} onClick={handleSubmit}>
                <Send size={18} />
                Submit Campaign
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
});
