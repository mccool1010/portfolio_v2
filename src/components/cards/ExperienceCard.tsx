import { motion } from 'motion/react';

interface ExperienceCardProps {
  title: string;
  organization: string;
  summary: string;
  onClick: () => void;
  delay?: number;
}

/**
 * Collapsed experience/achievement card.
 * Shows title, organization, and one-line summary.
 * Entire card is clickable to open the expanded viewer.
 */
export default function ExperienceCard({
  title,
  organization,
  summary,
  onClick,
  delay = 0,
}: ExperienceCardProps) {
  return (
    <motion.button
      className="w-full text-left glass-card p-5 sm:p-6 hover-glow group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:ring-offset-2 focus:ring-offset-surface"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${title} details`}
    >
      <h4 className="text-base sm:text-lg font-heading font-semibold text-white group-hover:text-accent-cyan transition-colors mb-1">
        {title}
      </h4>
      <p className="text-sm text-accent-cyan/80 font-medium mb-2">
        {organization}
      </p>
      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
        {summary}
      </p>

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
