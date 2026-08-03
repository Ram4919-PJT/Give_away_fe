import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter
} from '../../../ui/Dialog';
import { getCategoryById } from '../../../../data/ngoDonationCategories';
import CategoryIcon from '../CategoryIcon';
import CategoryModalPlaceholder from './CategoryModalPlaceholder';

export default function CategoryModal({ categoryId, open, onClose, onConfirm }) {
  const category = getCategoryById(categoryId);

  if (!category || !open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose} className="rd-cat-dialog">
        <DialogHeader className="!px-5 !py-4 !pr-12">
          <div className="flex items-center gap-2.5">
            <span className="rd-cat-card__icon">
              <CategoryIcon name={category.iconName} size={18} strokeWidth={1.75} />
            </span>
            <div>
              <DialogTitle className="!text-base">{category.label}</DialogTitle>
              <p className="mt-0.5 text-xs text-[#6B7280]">{category.description}</p>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="!px-5 !py-4 !max-h-[50vh]">
          <CategoryModalPlaceholder categoryId={categoryId} />
        </DialogBody>

        <DialogFooter className="!gap-2 !px-5 !py-3">
          <button type="button" onClick={onClose} className="rd-cat-modal-btn rd-cat-modal-btn--ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(categoryId)}
            className="rd-cat-modal-btn rd-cat-modal-btn--primary"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
