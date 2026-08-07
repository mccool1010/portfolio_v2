import { motion } from 'motion/react';

interface CertificationCardProps {
  title: string;
  issuer: string;
  onClick: () => void;
  delay?: number;
}

/**
 * Collapsed certification tile — provider + name only.
 * Entire card is clickable to expand certificate viewer.
 */
export default function CertificationCard({
  title,
  issuer,
  onClick,
  delay = 0,
}: CertificationCardProps) {
  return (
    <motion.button
      className="w-full text-left glass-card p-5 sm:p-6 hover-glow group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:ring-offset-2 focus:ring-offset-surface"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${title} certificate details`}
    >
      {/* Issuer logo placeholder */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan text-xs font-bold">
          {issuer.charAt(0)}
        </div>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {issuer}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm sm:text-base font-medium text-gray-200 group-hover:text-white transition-colors leading-snug">
        {title}
      </h4>

      {/* Hover indicator */}
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 group-hover:text-accent-cyan transition-colors">
        <span>View Details</span>
        <motion.span
          className="inline-block"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </div>
    </motion.button>
  );
}
