import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ExpandableCardProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Expandable card / modal overlay.
 * Core interaction pattern used for certificates, experience, and projects.
 *
 * Renders via React Portal to escape the panel-container's CSS transform,
 * which would otherwise break `position: fixed` positioning.
 *
 * Features:
 * - Smooth scale-in animation with backdrop blur
 * - Close via ESC, click-outside, or X button
 * - Focus trapping for accessibility
 * - Returns focus to trigger element on close
 */
export default function ExpandableCard({
  isOpen,
  onClose,
  children,
  className = '',
}: ExpandableCardProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focus management — focus card when opened, return focus on close
  useEffect(() => {
    if (isOpen && cardRef.current) {
      const timer = setTimeout(() => {
        cardRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // ESC to close, Tab cycles within the dialog
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !cardRef.current) return;

      const focusable = cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === cardRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent background scroll while the modal is open.
  // Panels are the scroll containers here, not body — but body/html still need
  // locking so iOS Safari doesn't rubber-band the page behind the overlay.
  useEffect(() => {
    if (!isOpen) return;

    const panels = document.querySelectorAll<HTMLElement>('.panel');
    const previousBodyOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    panels.forEach((panel) => {
      panel.style.overflow = 'hidden';
    });
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.setAttribute('data-expandable-open', 'true');

    return () => {
      panels.forEach((panel) => {
        panel.style.overflow = '';
      });
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.body.removeAttribute('data-expandable-open');
    };
  }, [isOpen]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Render via Portal to escape the panel-container's transform
  // This ensures position:fixed works correctly relative to the viewport
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8"
          onClick={handleOverlayClick}
          data-expandable-open="true"
        >
          {/* Backdrop — only this fades in/out */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Card — scales up, no separate opacity on top of backdrop */}
          <motion.div
            ref={cardRef}
            className={`
              relative z-10 w-full max-w-5xl overflow-y-auto overscroll-contain
              modal-max-h
              glass-card !rounded-2xl !border-white/[0.08]
              bg-surface-100/95 backdrop-blur-xl
              shadow-2xl shadow-black/40
              scrollbar-thin
              ${className}
            `}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            {/* Close bar sits in normal flow and sticks while scrolling, so it can
                never overlap the content underneath on a narrow screen */}
            <div className="sticky top-0 z-20 flex justify-end px-3 pt-3 pb-1 sm:px-4 sm:pt-4 bg-surface-100/95 backdrop-blur-xl rounded-t-2xl">
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-6 sm:px-8 sm:pb-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Portal renders outside the panel-container DOM tree
  return createPortal(modalContent, document.body);
}
