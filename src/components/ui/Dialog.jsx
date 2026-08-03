import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogTrigger({ className, ...props }) {
  return <DialogPrimitive.Trigger className={cn(className)} {...props} />;
}

export function DialogPortal({ children }) {
  return <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>;
}

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({ className, children, onClose, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-[501] w-[calc(100%-2rem)] max-w-[560px] max-h-[min(80vh,560px)]',
          '-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] border border-[#E5E7EB]',
          'bg-white shadow-[0_16px_48px_rgba(15,23,42,0.12)] focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
        {onClose && (
          <DialogPrimitive.Close
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:bg-[#F9FAFB] hover:text-[#111827]"
            aria-label="Close"
          >
            <X size={18} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('border-b border-[#E5E7EB] px-5 py-4 pr-12', className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-bold tracking-tight text-[#111827]', className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn('mt-1 text-sm text-[#6B7280]', className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }) {
  return <div className={cn('overflow-y-auto px-5 py-4', className)} style={{ maxHeight: 'calc(80vh - 140px)' }} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 border-t border-[#E5E7EB] bg-[#FAFAFA] px-5 py-3', className)}
      {...props}
    />
  );
}
