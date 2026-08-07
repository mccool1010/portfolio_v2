import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: LucideIcon;
  delay?: number;
}

/**
 * Compact stat card with count-up animation and subtle hover lift.
 * Used in the Home panel quick statistics row.
 */
export default function StatCard({
  value,
  label,
  icon: Icon,
  delay = 0,
}: StatCardProps) {
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
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="glass-card px-5 py-4 text-center hover-glow"
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {Icon && (
        <Icon
          size={18}
          className="mx-auto mb-2 text-accent-cyan/70"
        />
      )}
      <div className="text-2xl font-bold font-heading gradient-text-cyan">
        {value}
      </div>
      <div className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}
