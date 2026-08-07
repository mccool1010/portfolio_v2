interface BadgeProps {
  label: string;
  variant?: 'cyan' | 'purple' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Technology / skill badge chip.
 * Used throughout the portfolio for tech stacks and skills.
 */
export default function Badge({
  label,
  variant = 'cyan',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20 hover:bg-accent-cyan/20',
    purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20 hover:bg-accent-purple/20',
    default: 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        transition-colors duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {label}
    </span>
  );
}
