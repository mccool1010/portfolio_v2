import { motion } from 'motion/react';

interface ProjectTileProps {
  name: string;
  shortDescription: string;
  onClick: () => void;
  delay?: number;
}

/**
 * Minimal project tile — name + description only.
 * The tile's job is to make people click. No badges, buttons, or screenshots.
 */
export default function ProjectTile({
  name,
  shortDescription,
  onClick,
  delay = 0,
}: ProjectTileProps) {
  return (
    <motion.button
      className="w-full text-left glass-card p-6 sm:p-8 hover-glow group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:ring-offset-2 focus:ring-offset-surface relative overflow-hidden"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Explore ${name} project`}
    >
      {/* Subtle gradient highlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/[0.02] to-accent-purple/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <h4 className="text-lg sm:text-xl font-heading font-bold text-white group-hover:gradient-text-cyan transition-colors duration-300 mb-2">
          {name}
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          {shortDescription}
        </p>

        {/* Hover arrow */}
        <div className="mt-5 flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-accent-cyan transition-colors duration-300">
          <span>Click to Explore</span>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
}
