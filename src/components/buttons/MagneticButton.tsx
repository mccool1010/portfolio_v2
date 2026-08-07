import { useRef, useState, ReactNode } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  download?: boolean;
}

/**
 * Magnetic button — slight attraction toward cursor on hover.
 * Glow effect, smooth transitions, no excessive bouncing.
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  target,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-accent-cyan/90 to-accent-cyan/70 text-surface font-semibold shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 hover:from-accent-cyan hover:to-accent-cyan/80',
    secondary:
      'border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10 hover:border-accent-cyan/60',
    ghost:
      'text-gray-300 hover:text-white hover:bg-white/5',
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 rounded-lg font-medium
    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:ring-offset-2 focus:ring-offset-surface
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `.trim();

  const motionProps = {
    ref: ref as React.Ref<HTMLButtonElement>,
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 350, damping: 15, mass: 0.5 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileTap: { scale: 0.97 },
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        aria-label={ariaLabel}
        download={download || undefined}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...motionProps}
      onClick={onClick}
      className={baseClasses}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
