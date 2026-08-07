import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

interface TimelineNode {
  label: string;
  sublabel?: string;
  isCurrent?: boolean;
}

interface TimelineProps {
  nodes: TimelineNode[];
}

/**
 * Animated vertical timeline with draw-in line and node animations.
 * Current stage is highlighted with a glow effect.
 */
export default function Timeline({ nodes }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative max-w-2xl mx-auto py-4" role="list" aria-label="Engineering journey timeline">
      {/* Animated line */}
      <motion.div
        className="absolute left-[19px] top-0 w-[2px] bg-gradient-to-b from-accent-cyan/60 via-accent-purple/40 to-accent-cyan/20 origin-top"
        initial={{ scaleY: 0 }}
        animate={isVisible ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%' }}
      />

      {nodes.map((node, index) => (
        <motion.div
          key={index}
          className="relative flex items-start gap-4 mb-8 last:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
          role="listitem"
        >
          {/* Node dot */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                node.isCurrent
                  ? 'border-accent-cyan bg-accent-cyan/20 shadow-lg shadow-accent-cyan/30'
                  : 'border-white/20 bg-surface-200'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  node.isCurrent ? 'bg-accent-cyan' : 'bg-white/30'
                }`}
              />
            </div>
            {/* Glow for current */}
            {node.isCurrent && (
              <div className="absolute inset-0 rounded-full bg-accent-cyan/20 blur-md animate-glow-pulse" />
            )}
          </div>

          {/* Content */}
          <div className="pt-1.5">
            <h4 className={`font-heading font-semibold text-sm sm:text-base ${
              node.isCurrent ? 'text-accent-cyan' : 'text-gray-200'
            }`}>
              {node.label}
            </h4>
            {node.sublabel && (
              <p className="text-xs text-gray-500 mt-0.5">{node.sublabel}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
