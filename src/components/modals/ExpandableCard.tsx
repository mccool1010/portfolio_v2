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

  // ESC to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent panel scroll when modal is open
  // Target the active panel element, not body (since body doesn't scroll — panels do)
  useEffect(() => {
    if (isOpen) {
      // Find all panel elements and disable their scrolling
      const panels = document.querySelectorAll('.panel');
      panels.forEach((panel) => {
        (panel as HTMLElement).style.overflow = 'hidden';
      });
      // Mark as open for PanelLayout keyboard nav check
      document.body.setAttribute('data-expandable-open', 'true');
    } else {
      // Re-enable panel scrolling
      const panels = document.querySelectorAll('.panel');
      panels.forEach((panel) => {
        (panel as HTMLElement).style.overflow = '';
      });
      document.body.removeAttribute('data-expandable-open');
    }
    return () => {
      const panels = document.querySelectorAll('.panel');
      panels.forEach((panel) => {
        (panel as HTMLElement).style.overflow = '';
      });
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
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
              relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto
              glass-card !rounded-2xl !border-white/[0.08]
              bg-surface-100/95 backdrop-blur-xl
              shadow-2xl shadow-black/40
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
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8">
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
