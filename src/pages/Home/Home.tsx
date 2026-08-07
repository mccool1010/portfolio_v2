import { motion } from 'motion/react';
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  FolderOpen,
  BrainCircuit,
  FlaskConical,
  Award,
} from 'lucide-react';
import TextReveal from '../../components/animations/TextReveal';
import MagneticButton from '../../components/buttons/MagneticButton';
import GlassCard from '../../components/cards/GlassCard';
import FloatingBadge from '../../components/cards/FloatingBadge';
import StatCard from '../../components/cards/StatCard';

interface HomeProps {
  onNavigate: (panel: number) => void;
}

const FLOATING_TECHS = [
  { label: 'Python', x: '5%', y: '15%', delay: 0 },
  { label: 'TensorFlow', x: '75%', y: '8%', delay: 0.5 },
  { label: 'OpenCV', x: '85%', y: '55%', delay: 1.0 },
  { label: 'React', x: '10%', y: '70%', delay: 1.5 },
  { label: 'Docker', x: '70%', y: '80%', delay: 2.0 },
  { label: 'Machine Learning', x: '60%', y: '25%', delay: 2.5 },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/harikrishna-git',
    tooltip: 'GitHub',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/hari-krishna-01378a248',
    tooltip: 'LinkedIn',
  },
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:harikrishnaarun5@gmail.com',
    tooltip: 'Email',
  },
  {
    icon: FileText,
    label: 'Resume',
    href: '/assets/resume/Hari_Krishna_Resume.pdf',
    tooltip: 'Resume',
  },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="section-padding min-h-screen flex flex-col justify-center relative">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main two-column layout */}
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center min-h-[70vh]">
          {/* ─── Left Side: Hero ─── */}
          <div className="flex flex-col gap-6 lg:gap-8 pt-16 lg:pt-0">
            {/* Name */}
            <TextReveal
              text="Hari Krishna"
              as="h1"
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold tracking-tight text-white leading-[1.1]"
              delay={200}
              stagger={0.04}
            />

            {/* Subtitle */}
            <motion.p
              className="text-xl sm:text-2xl font-heading font-medium gradient-text-cyan"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Applied AI Engineer
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Building intelligent systems that solve real-world problems.
              Specializing in Machine Learning, Computer Vision, and
              full-stack AI applications.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={() => onNavigate(3)}
              >
                <FolderOpen size={18} />
                View Projects
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                size="lg"
                href="/assets/resume/Hari_Krishna_Resume.pdf"
                download
              >
                <FileText size={18} />
                Download Resume
              </MagneticButton>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              className="flex items-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-lg glass-card !bg-white/[0.03] hover:!bg-accent-cyan/10 hover:!border-accent-cyan/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.tooltip}
                  >
                    <Icon size={18} className="text-gray-400 group-hover:text-accent-cyan transition-colors" />
                    {/* Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-surface-300 text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {link.tooltip}
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* ─── Right Side: Visual ─── */}
          <motion.div
            className="relative flex items-center justify-center order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {/* Decorative glow behind profile */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent-cyan/[0.04] blur-[80px]" />
              <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-accent-purple/[0.03] blur-[60px] translate-x-8 -translate-y-8" />
            </div>

            {/* Profile Image Card */}
            <GlassCard
              className="relative w-64 h-80 sm:w-80 sm:h-96 lg:w-[340px] lg:h-[420px] !rounded-2xl overflow-hidden"
              spotlight
            >
              <img
                src="/assets/profile/profile.jpg"
                alt="Hari Krishna — Applied AI Engineer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </GlassCard>

            {/* Floating badges */}
            {FLOATING_TECHS.map((tech) => (
              <div
                key={tech.label}
                className="absolute hidden lg:block"
                style={{ left: tech.x, top: tech.y }}
              >
                <FloatingBadge label={tech.label} delay={tech.delay} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── Quick Stats ─── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-16 lg:mt-20 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <StatCard value="11+" label="Projects" icon={FolderOpen} delay={0} />
          <StatCard value="5+" label="AI Models" icon={BrainCircuit} delay={0.1} />
          <StatCard value="1" label="Research" icon={FlaskConical} delay={0.2} />
          <StatCard value="8+" label="Certifications" icon={Award} delay={0.3} />
        </motion.div>
      </div>
    </div>
  );
}
