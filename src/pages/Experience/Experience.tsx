import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  FlaskConical,
  Trophy,
  Calendar,
  MapPin,
  ExternalLink,
  Github,
} from 'lucide-react';
import TextReveal from '../../components/animations/TextReveal';
import Timeline from '../../components/animations/Timeline';
import ExperienceCard from '../../components/cards/ExperienceCard';
import ExpandableCard from '../../components/modals/ExpandableCard';
import Badge from '../../components/ui/Badge';
import MagneticButton from '../../components/buttons/MagneticButton';

// ─── Types ─────────────────────────────────────────
interface ExperienceItem {
  id: string;
  type: 'experience' | 'research' | 'achievement';
  title: string;
  organization: string;
  summary: string;
  duration?: string;
  role?: string;
  description: string;
  responsibilities?: string[];
  skills: string[];
  keyTakeaways?: string[];
  links?: { label: string; href: string; icon: 'github' | 'external' }[];
  image?: string;
}

// ─── Data ──────────────────────────────────────────
const TIMELINE_NODES = [
  { label: 'Started B.Tech', sublabel: 'October 2022' },
  { label: 'Programming Fundamentals', sublabel: 'C, Java, Python' },
  { label: 'Machine Learning', sublabel: 'Stanford ML Specialization' },
  { label: 'Deep Learning & CV', sublabel: 'TensorFlow, OpenCV' },
  { label: 'Research', sublabel: 'SlipSense — Landslide Prediction' },
  { label: 'Hackathons & Events', sublabel: 'RIBC, NASA, MediHack' },
  { label: 'Present', sublabel: 'Building AI Systems', isCurrent: true },
];

const EXPERIENCES: ExperienceItem[] = [];

const RESEARCH: ExperienceItem[] = [
  {
    id: 'slipsense',
    type: 'research',
    title: 'SlipSense — AI-based Landslide Prediction',
    organization: 'LBS College of Engineering',
    summary: 'Conference paper on AI-powered landslide prediction system.',
    duration: '2024',
    role: 'Primary Researcher',
    description:
      'Developed an AI-powered landslide prediction system using machine learning models trained on geospatial and meteorological data. Published research findings at a national conference.',
    responsibilities: [
      'Designed the ML pipeline for landslide prediction',
      'Collected and preprocessed geospatial datasets',
      'Trained and evaluated multiple prediction models',
      'Authored and presented the conference paper',
    ],
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science', 'Research', 'GIS'],
    keyTakeaways: [
      'End-to-end ML research pipeline experience',
      'Scientific writing and conference presentation',
      'Working with real-world geospatial data',
    ],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
      { label: 'View Paper', href: '#', icon: 'external' },
    ],
  },
];

const ACHIEVEMENTS: ExperienceItem[] = [
  {
    id: 'ribc',
    type: 'achievement',
    title: 'RIBC Hackathon',
    organization: 'RIBC',
    summary: 'Participated in competitive hackathon.',
    description: 'Participated in the RIBC Hackathon, building solutions under tight deadlines.',
    skills: ['Problem Solving', 'Teamwork', 'Rapid Prototyping'],
    image: '/assets/achievements/ribc hackathon/Screenshot_2026-07-22-16-09-01-72_254de13a4bc8758c9908fff1f73e3725.jpg',
  },
  {
    id: 'nasa',
    type: 'achievement',
    title: 'NASA Space Apps Challenge',
    organization: 'NASA',
    summary: 'Game development for space-themed challenge.',
    description: 'Developed a space-themed game for the NASA Space Apps Challenge, applying creative problem-solving to simulate space exploration scenarios.',
    skills: ['Game Development', 'Creative Problem Solving', 'Space Science'],
    image: '/assets/achievements/nasa space apps/IMG_20260722_155111.jpg',
  },
  {
    id: 'medihack',
    type: 'achievement',
    title: 'MediHack',
    organization: 'MediHack Hackathon',
    summary: 'Built a full-stack telemedicine platform.',
    description: 'Developed a full-stack telemedicine platform featuring a medicine marketplace, real-time video/voice chat, patient consent management, and doctor access to medical records.',
    skills: ['Full-Stack', 'Real-time Communication', 'Healthcare Tech', 'React'],
    image: '/assets/achievements/medihack.jpg',
  },
  {
    id: 'techlift',
    type: 'achievement',
    title: 'Techlift Hackathon',
    organization: 'Techlift',
    summary: 'Frontend for real-time heart rate monitoring and alerts.',
    description: 'Created a responsive frontend for a heart rate monitoring and real-time alert application during the Techlift Hackathon.',
    skills: ['React', 'Frontend', 'Real-time', 'Healthcare'],
  },
  {
    id: 'cgaming',
    type: 'achievement',
    title: 'CGaming Event',
    organization: 'CGaming',
    summary: 'Participated in competitive gaming and tech event.',
    description: 'Participated in the CGaming event, combining gaming skills with technical knowledge in a competitive environment.',
    skills: ['Game Development', 'Competition', 'Technical Skills'],
    image: '/assets/achievements/cgaming/IMG_20260722_155135.jpg',
  },
  {
    id: 'microsoft-ai-fest',
    type: 'achievement',
    title: 'Microsoft AI Skills Fest',
    organization: 'Microsoft',
    summary: 'Completed Microsoft AI skills challenge.',
    description: 'Participated in the Microsoft AI Skills Fest, gaining hands-on experience with Microsoft AI tools, Azure AI services, and applied AI problem-solving techniques.',
    skills: ['Azure AI', 'Microsoft AI', 'Cloud Computing', 'AI Tools'],
    image: '/assets/achievements/microsoft_ai_skills_fest/Screenshot_2026-07-22-15-57-29-56_254de13a4bc8758c9908fff1f73e3725.jpg',
  },
];

// ─── Component ─────────────────────────────────────
interface ExperienceProps {
  isActive?: boolean;
}

export default function Experience({ isActive }: ExperienceProps) {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);

  // Close modal when navigating away from this panel
  useEffect(() => {
    if (!isActive) setSelectedItem(null);
  }, [isActive]);

  const renderExpandedContent = (item: ExperienceItem) => (
    <div className="grid md:grid-cols-[40%_60%] gap-8">
      {/* Left — Image placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-200 to-surface-300 rounded-xl flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-center text-gray-500 p-6">
            {item.type === 'research' ? (
              <FlaskConical size={48} className="mx-auto mb-3 text-gray-600" />
            ) : item.type === 'achievement' ? (
              <Trophy size={48} className="mx-auto mb-3 text-gray-600" />
            ) : (
              <Briefcase size={48} className="mx-auto mb-3 text-gray-600" />
            )}
            <p className="text-sm font-medium">
              {item.type === 'research' ? 'Research Poster' : item.type === 'achievement' ? 'Event Photo' : 'Training Photo'}
            </p>
          </div>
        )}
      </div>

      {/* Right — Details */}
      <div className="flex flex-col">
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
          {item.title}
        </h3>
        <p className="text-accent-cyan font-medium mb-1">{item.organization}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
          {item.duration && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {item.duration}
            </span>
          )}
          {item.role && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} /> {item.role}
            </span>
          )}
        </div>

        <div className="h-px bg-white/5 my-3" />

        <p className="text-gray-300 text-sm leading-relaxed mb-5">
          {item.description}
        </p>

        {item.responsibilities && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-1.5">
              {item.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="w-1 h-1 rounded-full bg-accent-cyan/60 mt-2 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.keyTakeaways && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Key Takeaways
            </h4>
            <ul className="space-y-1.5">
              {item.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="w-1 h-1 rounded-full bg-accent-purple/60 mt-2 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Technologies & Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {item.skills.map((s) => (
              <Badge key={s} label={s} variant="cyan" />
            ))}
          </div>
        </div>

        {/* Links */}
        {item.links && item.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-auto">
            {item.links.map((link) => (
              <MagneticButton
                key={link.label}
                variant="secondary"
                size="sm"
                href={link.href}
                target="_blank"
              >
                {link.icon === 'github' ? <Github size={14} /> : <ExternalLink size={14} />}
                {link.label}
              </MagneticButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="section-padding pt-24">
      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <div className="mb-16">
          <TextReveal
            text="Experience"
            as="h2"
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white"
          />
          <motion.p
            className="mt-4 text-lg text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Engineering Journey
          </motion.p>
        </div>

        {/* ─── Timeline ─── */}
        <div className="mb-20">
          <Timeline nodes={TIMELINE_NODES} />
        </div>

        {/* ─── Professional Experience ─── */}
        {EXPERIENCES.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h3 className="text-lg font-heading font-semibold text-gray-300 flex items-center gap-2">
              <Briefcase size={20} className="text-accent-cyan" />
              Professional Experience
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {EXPERIENCES.map((exp, i) => (
              <ExperienceCard
                key={exp.id}
                title={exp.title}
                organization={exp.organization}
                summary={exp.summary}
                onClick={() => setSelectedItem(exp)}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
        )}

        {/* ─── Research ─── */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h3 className="text-lg font-heading font-semibold text-gray-300 flex items-center gap-2">
              <FlaskConical size={20} className="text-accent-purple" />
              Research
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {RESEARCH.map((exp, i) => (
              <ExperienceCard
                key={exp.id}
                title={exp.title}
                organization={exp.organization}
                summary={exp.summary}
                onClick={() => setSelectedItem(exp)}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>

        {/* ─── Achievements ─── */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h3 className="text-lg font-heading font-semibold text-gray-300 flex items-center gap-2">
              <Trophy size={20} className="text-accent-pink" />
              Achievements
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((exp, i) => (
              <ExperienceCard
                key={exp.id}
                title={exp.title}
                organization={exp.organization}
                summary={exp.summary}
                onClick={() => setSelectedItem(exp)}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>

        {/* ─── Expanded Viewer ─── */}
        <ExpandableCard
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        >
          {selectedItem && renderExpandedContent(selectedItem)}
        </ExpandableCard>
      </div>
    </div>
  );
}
