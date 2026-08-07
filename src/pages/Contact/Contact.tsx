import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Download,
  Briefcase,
} from 'lucide-react';
import TextReveal from '../../components/animations/TextReveal';
import GlassCard from '../../components/cards/GlassCard';
import MagneticButton from '../../components/buttons/MagneticButton';

// ─── Copy Hook ─────────────────────────────────
function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }, []);

  return { copiedKey, copy };
}

// ─── Contact Methods ───────────────────────────
const CONTACT_METHODS = [
  {
    key: 'email',
    icon: Mail,
    label: 'Email',
    value: 'harikrishnaarun5@gmail.com',
    href: 'mailto:harikrishnaarun5@gmail.com',
    actionLabel: 'Email',
    copyable: true,
  },
  {
    key: 'phone',
    icon: Phone,
    label: 'Phone',
    value: '+91 9207499037',
    href: 'tel:+919207499037',
    actionLabel: 'Call',
    copyable: true,
  },
  {
    key: 'location',
    icon: MapPin,
    label: 'Location',
    value: 'Kerala, India',
    copyable: false,
  },
  {
    key: 'status',
    icon: Briefcase,
    label: 'Status',
    value: 'Open to Opportunities',
    copyable: false,
    isStatus: true,
  },
];

const PROFILE_CARDS = [
  {
    key: 'github',
    icon: Github,
    label: 'GitHub',
    description: 'Explore my repositories',
    href: 'https://github.com/harikrishna-git',
  },
  {
    key: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    description: 'Professional updates',
    href: 'https://linkedin.com/in/hari-krishna-01378a248',
  },
  {
    key: 'resume',
    icon: FileText,
    label: 'Resume',
    description: 'Download PDF',
    href: '/assets/resume/Hari_Krishna_Resume.pdf',
    isDownload: true,
  },
];

// ─── Component ─────────────────────────────────
export default function Contact() {
  const { copiedKey, copy } = useCopyToClipboard();

  return (
    <div className="section-padding pt-24 min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* ─── Header ─── */}
        <div className="mb-12 text-center">
          <TextReveal
            text="Let's Build Something Together"
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white"
            stagger={0.025}
          />
          <motion.p
            className="mt-4 text-gray-400 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            Open to opportunities, collaborations, and interesting AI projects.
          </motion.p>
        </div>

        {/* ─── Main Content: Contact Card + Profile Cards ─── */}
        <div className="grid lg:grid-cols-[55%_45%] gap-8 mb-16">
          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="p-6 sm:p-8" spotlight>
              {/* Availability badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-sm text-green-400 font-medium">
                  Available for AI/ML Roles
                </span>
              </div>

              {/* Contact methods */}
              <div className="space-y-4">
                {CONTACT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isCopied = copiedKey === method.key;

                  return (
                    <div
                      key={method.key}
                      className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                          <Icon size={16} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {method.label}
                          </p>
                          <p className={`text-sm truncate ${
                            (method as { isStatus?: boolean }).isStatus
                              ? 'text-green-400 font-medium'
                              : 'text-gray-200'
                          }`}>
                            {method.value}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {method.copyable && (
                          <button
                            onClick={() => copy(method.value, method.key)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            aria-label={`Copy ${method.label}`}
                          >
                            {isCopied ? (
                              <>
                                <Check size={12} className="text-green-400" />
                                <span className="text-green-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                        {method.href && (
                          <a
                            href={method.href}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan transition-all"
                            aria-label={`${method.actionLabel} via ${method.label}`}
                          >
                            <ExternalLink size={12} />
                            {method.actionLabel}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Profile Cards */}
          <div className="space-y-4">
            {PROFILE_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <GlassCard
                    className="p-5 flex items-center gap-4"
                    onClick={() => {
                      if (card.isDownload) {
                        // Trigger download
                        const a = document.createElement('a');
                        a.href = card.href;
                        a.download = '';
                        a.click();
                      } else {
                        window.open(card.href, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    spotlight
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                      <Icon size={22} className="text-accent-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-heading font-semibold text-white">
                        {card.label}
                      </h4>
                      <p className="text-sm text-gray-400">{card.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-gray-500">
                      {card.isDownload ? <Download size={18} /> : <ExternalLink size={18} />}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── Social Icons Row ─── */}
        <motion.div
          className="flex justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: Github, href: 'https://github.com/harikrishna-git', label: 'GitHub' },
            { icon: Linkedin, href: 'https://linkedin.com/in/hari-krishna-01378a248', label: 'LinkedIn' },
            { icon: Mail, href: 'mailto:harikrishnaarun5@gmail.com', label: 'Email' },
            { icon: Phone, href: 'tel:+919207499037', label: 'Phone' },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center justify-center w-11 h-11 rounded-xl glass-card !bg-white/[0.03] hover:!bg-accent-cyan/10 hover:!border-accent-cyan/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <Icon size={18} className="text-gray-400 group-hover:text-accent-cyan transition-colors" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* ─── Footer ─── */}
        <footer className="mt-auto pt-8 pb-4 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            Designed & Developed by{' '}
            <span className="text-gray-300 font-medium">Hari Krishna</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            © 2026 · Built with React, TypeScript & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
