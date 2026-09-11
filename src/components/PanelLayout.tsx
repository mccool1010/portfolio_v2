import { useRef, useEffect, useCallback, ReactNode } from 'react';

interface PanelLayoutProps {
  activePanel: number;
  onPanelChange: (index: number) => void;
  children: ReactNode[];
}

/** Horizontal distance a swipe must cover before it counts as navigation. */
const SWIPE_THRESHOLD_PX = 60;
/** A swipe only navigates if it is clearly more horizontal than vertical. */
const SWIPE_RATIO = 1.5;

/**
 * Horizontal panel container with smooth slide transitions.
 * Each child is rendered as a full-viewport panel.
 *
 * Navigation: left/right arrow keys, and horizontal swipe on touch devices.
 */
export default function PanelLayout({
  activePanel,
  onPanelChange,
  children,
}: PanelLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const panelCount = children.length;

  const isModalOpen = () =>
    document.querySelector('[data-expandable-open="true"]') !== null;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is in an input, textarea, or modal
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (isModalOpen()) return;

      if (e.key === 'ArrowRight' && activePanel < panelCount - 1) {
        e.preventDefault();
        onPanelChange(activePanel + 1);
      } else if (e.key === 'ArrowLeft' && activePanel > 0) {
        e.preventDefault();
        onPanelChange(activePanel - 1);
      }
    },
    [activePanel, panelCount, onPanelChange]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll active panel to top when switching
  useEffect(() => {
    panelRefs.current[activePanel]?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activePanel]);

  // Inactive panels are still painted (so the slide animates) but must not be
  // focusable or exposed to screen readers. `inert` does both without the
  // aria-hidden-on-focusable-content violation.
  useEffect(() => {
    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      if (index === activePanel) {
        panel.removeAttribute('inert');
      } else {
        panel.setAttribute('inert', '');
      }
    });
  }, [activePanel]);

  // ─── Touch swipe navigation ───
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isModalOpen()) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || isModalOpen()) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;

      // Ignore vertical scrolls and short drags
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;

      if (dx < 0 && activePanel < panelCount - 1) {
        onPanelChange(activePanel + 1);
      } else if (dx > 0 && activePanel > 0) {
        onPanelChange(activePanel - 1);
      }
    },
    [activePanel, panelCount, onPanelChange]
  );

  return (
    <div
      ref={containerRef}
      className="panel-container"
      style={{
        // % of the container (one viewport wide) — not vw, which counts the scrollbar
        transform: `translateX(-${activePanel * 100}%)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children.map((child, index) => (
        <div
          key={index}
          ref={(el) => {
            panelRefs.current[index] = el;
          }}
          data-panel={index}
          className="panel"
          role="tabpanel"
          aria-label={`Panel ${index + 1}`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
