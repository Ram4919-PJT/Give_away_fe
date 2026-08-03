import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { getCategoryById } from '../../../data/ngoDonationCategories';
import { getCategorySubitems } from '../../../data/ngoDonationSubcategories';

export default function CategorySelectModal({ categoryId, initialSelected = [], onClose, onContinue }) {
  const category = getCategoryById(categoryId);
  const config = getCategorySubitems(categoryId);
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [categoryId, initialSelected]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!category || !config) return null;

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (!selected.length) return;
    onContinue(categoryId, selected);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[min(88vh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
        >
          <X size={18} />
        </button>

        <header className="flex gap-4 border-b border-slate-100 px-6 pb-4 pt-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
            <CategoryIcon name={category.iconName} size={28} strokeWidth={1.75} />
          </div>
          <div className="pr-8">
            <h2 id="cat-modal-title" className="text-lg font-bold text-slate-800">
              {config.modalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{config.modalDescription}</p>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-6 sm:grid-cols-3">
          {config.items.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(item.id)}
                className={[
                  'relative flex flex-col gap-1 rounded-xl border p-3 text-left transition hover:-translate-y-0.5',
                  isSelected
                    ? 'border-brand bg-brand-tint ring-1 ring-brand/20'
                    : 'border-slate-200 bg-white hover:border-brand/40'
                ].join(' ')}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <CategoryIcon name={item.iconName} size={17} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                <span className="text-xs leading-snug text-slate-500">{item.description}</span>
              </button>
            );
          })}
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <span className="text-sm font-semibold text-brand">
            {selected.length > 0 && `${selected.length} item${selected.length !== 1 ? 's' : ''} selected`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!selected.length}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-45"
            >
              Continue
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
