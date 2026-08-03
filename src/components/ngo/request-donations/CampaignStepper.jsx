import { Check } from 'lucide-react';
import { CAMPAIGN_WIZARD_STEPS } from '../../../data/ngoDonationCategories';

export default function CampaignStepper({ step }) {
  return (
    <nav className="mb-6" aria-label="Campaign builder progress">
      <ol className="flex items-start justify-between gap-2">
        {CAMPAIGN_WIZARD_STEPS.map((s) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <li key={s.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isActive && 'bg-brand text-white shadow-sm shadow-emerald-200',
                  isDone && 'bg-brand-tint text-brand-dark ring-1 ring-brand/30',
                  !isActive && !isDone && 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
                ].filter(Boolean).join(' ')}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : s.id}
              </span>
              <span
                className={[
                  'text-center text-[11px] font-semibold leading-tight sm:text-xs',
                  isActive ? 'text-slate-800' : isDone ? 'text-brand-dark' : 'text-slate-400'
                ].join(' ')}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-slate-500">{CAMPAIGN_WIZARD_STEPS[step - 1]?.short}</p>
    </nav>
  );
}
