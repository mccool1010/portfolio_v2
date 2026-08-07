import { motion } from 'motion/react';

interface FloatingBadgeProps {
  label: string;
  /** Delay offset for staggered animation */
  delay?: number;
  className?: string;
}

/**
 * Floating tech chip that slowly drifts around the profile image area.
 * Each badge gets a unique animation delay for organic movement.
 */
export default function FloatingBadge({
  label,
  delay = 0,
  className = '',
}: FloatingBadgeProps) {
  return (
    <motion.div
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
        bg-surface-200/60 text-gray-300 border border-white/[0.06]
        backdrop-blur-sm shadow-lg shadow-black/20
        select-none pointer-events-none
        ${className}
      `}
      animate={{
        y: [0, -8, 2, -4, 0],
        x: [0, 3, -2, 4, 0],
        rotate: [0, 1, -1, 0.5, 0],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 mr-2" />
      {label}
    </motion.div>
  );
}
