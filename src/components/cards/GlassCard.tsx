import { useRef, useState, ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Enable spotlight follow effect on hover */
  spotlight?: boolean;
  /** Enable hover lift */
  hoverLift?: boolean;
  onClick?: () => void;
}

/**
 * Glassmorphism card with optional spotlight cursor-follow effect.
 * Slightly lifts on hover with soft glow.
 */
export default function GlassCard({
  children,
  className = '',
  spotlight = true,
  hoverLift = true,
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !spotlight) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={hoverLift ? { y: -4, transition: { duration: 0.3 } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Spotlight gradient overlay */}
      {spotlight && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(
              300px circle at ${spotlightPos.x}% ${spotlightPos.y}%,
              rgba(34, 211, 238, 0.06) 0%,
              transparent 60%
            )`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
