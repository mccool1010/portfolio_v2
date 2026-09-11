import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  GraduationCap,
  Briefcase,
  Code2,
  Mail,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  activePanel: number;
  onNavigate: (index: number) => void;
}

const NAV_ITEMS = [
  { label: 'Home', icon: Home },
  { label: 'Education', icon: GraduationCap },
  { label: 'Experience', icon: Briefcase },
  { label: 'Projects', icon: Code2 },
  { label: 'Contact', icon: Mail },
];

export default function Navbar({ activePanel, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen to scroll on the active panel to toggle navbar backdrop
  useEffect(() => {
    const panel = document.querySelector(`[data-panel="${activePanel}"]`);
    if (!panel) return;

    const handleScroll = () => setScrolled(panel.scrollTop > 40);

    // Re-sync immediately: switching panels used to leave the backdrop showing
    // the previous panel's scroll state until the next scroll event.
    handleScroll();

    panel.addEventListener('scroll', handleScroll, { passive: true });
    return () => panel.removeEventListener('scroll', handleScroll);
  }, [activePanel]);

  // Close the mobile drawer on Escape or when the viewport grows to desktop
  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };

    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [mobileOpen]);

  const handleNav = useCallback(
    (index: number) => {
      onNavigate(index);
      setMobileOpen(false);
    },
    [onNavigate]
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <motion.button
            onClick={() => handleNav(0)}
            className="font-heading font-bold text-lg tracking-tight text-white/90 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="gradient-text-cyan">HK</span>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activePanel === index;
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(index)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-accent-cyan'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Tap-outside catcher for the mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 -z-10"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden glass-nav border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto">
              {NAV_ITEMS.map((item, index) => {
                const isActive = activePanel === index;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(index)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-accent-cyan bg-accent-cyan/10'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
