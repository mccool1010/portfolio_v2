import { useRef, useEffect, useCallback, ReactNode } from 'react';

interface PanelLayoutProps {
  activePanel: number;
  onPanelChange: (index: number) => void;
  children: ReactNode[];
}

/**
 * Horizontal panel container with smooth slide transitions.
 * Each child is rendered as a full-viewport panel.
 * Supports keyboard navigation (left/right arrows).
 */
export default function PanelLayout({
  activePanel,
  onPanelChange,
  children,
}: PanelLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelCount = children.length;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is in an input, textarea, or modal
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Check if an expandable modal is open
      const modal = document.querySelector('[data-expandable-open="true"]');
      if (modal) return;

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
    const panel = document.querySelector(`[data-panel="${activePanel}"]`);
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activePanel]);

  return (
    <div
      ref={containerRef}
      className="panel-container"
      style={{
        transform: `translateX(-${activePanel * 100}vw)`,
      }}
    >
      {children.map((child, index) => (
        <div
          key={index}
          data-panel={index}
          className="panel"
          role="tabpanel"
          aria-label={`Panel ${index + 1}`}
          tabIndex={activePanel === index ? 0 : -1}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
