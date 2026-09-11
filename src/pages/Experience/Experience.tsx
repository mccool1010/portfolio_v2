import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  FlaskConical,
  Trophy,
  Calendar,
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
  { label: 'Started B.Tech', sublabel: 'LBSCEK, 2022' },
  { label: 'Hackathons', sublabel: 'MediHack 2nd · NASA Space Apps 2024' },
  { label: 'Cybersecurity Intern', sublabel: 'C-DAC Noida, Aug–Oct 2024' },
  { label: 'Cybersecurity Trainer', sublabel: 'LBSCEK, Mar 2025' },
  { label: 'Full-Stack Intern', sublabel: 'Hexinox, Kochi, Jun–Jul 2025' },
  { label: 'Research', sublabel: 'SlipSense — Landslide Prediction' },
  { label: 'Graduated B.Tech CSE', sublabel: 'April 2026 · CGPA 7.42' },
  { label: 'Present', sublabel: 'Building AI Systems', isCurrent: true },
];

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'hexinox',
    type: 'experience',
    title: 'Full-Stack Developer Intern',
    organization: 'Hexinox Innovations Pvt. Ltd., Kochi',
    summary: 'Built and deployed database-driven MERN applications with auth workflows.',
    duration: 'Jun – Jul 2025',
    role: 'Full-Stack Developer Intern',
    description:
      'Seven-day offline internship at Hexinox Innovations, Kochi (Cochin SEZ), in Full Stack Development (MERN) with AI. Built database-driven web applications end to end — user-facing forms, authentication, and deployment.',
    responsibilities: [
      'Developed full-stack web applications using React, JavaScript, MongoDB, and Supabase, including a database-driven shopping platform with user-facing forms and authentication workflows',
      'Implemented CRUD workflows, REST API integrations, authentication, login, and password-protected account functionality, including a forgot-password flow',
      'Integrated Supabase certificate upload and storage workflows with MongoDB-backed application data',
      'Deployed web applications through Netlify using Git/GitHub, validating frontend and backend behaviour through browser and network inspection',
    ],
    skills: ['React', 'JavaScript', 'MongoDB', 'Supabase', 'Node.js', 'REST APIs', 'Authentication', 'Netlify', 'Git'],
    keyTakeaways: [
      'Owning a feature from schema through UI to a live deployment',
      'Wiring third-party storage (Supabase) into an existing MongoDB data model',
      'Debugging full-stack issues from the network layer up',
    ],
    image: '/assets/achievements/hexinox_mern_internship.jpg',
  },
  {
    id: 'lbscek-trainer',
    type: 'experience',
    title: 'Cybersecurity Trainer',
    organization: 'Cyber Community, LBS College of Engineering Kasaragod',
    summary: 'Delivered cryptography training to 50+ students in the Hack the Weeks series.',
    duration: 'March 2025',
    role: 'Trainer / Speaker',
    description:
      'Conducted "Cryptography and Secure Communication" in the Hack the Weeks online webinar series organised by the Cyber Community at LBS College of Engineering, Kasaragod. Recognised with a Certificate of Appreciation on 30 March 2025.',
    responsibilities: [
      'Delivered hands-on cybersecurity training to 50+ students, covering cryptography from fundamentals through advanced concepts',
      'Led practical exercises involving encryption, Python scripting, and applied cybersecurity concepts',
      'Designed session material for a mixed-experience student audience',
    ],
    skills: ['Cryptography', 'Network Security', 'Encryption', 'Python', 'Teaching', 'Public Speaking'],
    keyTakeaways: [
      'Explaining cryptographic primitives to an audience with no prior background',
      'Building runnable exercises that hold attention in an online format',
    ],
    image: '/assets/achievements/crypto_webinar_lbscek.jpg',
  },
  {
    id: 'cdac',
    type: 'experience',
    title: 'Cybersecurity Intern',
    organization: 'C-DAC Noida (MeitY, Govt. of India)',
    summary: 'Malware analysis in an isolated VM environment using Cuckoo Sandbox.',
    duration: 'Aug – Oct 2024',
    role: 'Cybersecurity Intern',
    description:
      'Worked under the Cyber Gyan Project at C-DAC Noida, supported by the Ministry of Electronics and Information Technology, analysing suspicious files in an isolated virtual-machine environment. Completed the accompanying 25-hour Ethical Hacking and Penetration Testing training programme (19 Aug – 3 Oct 2024).',
    responsibilities: [
      'Analysed suspicious files in an isolated virtual-machine environment using Cuckoo Sandbox, examining runtime behaviour, system calls, processes, and network activity',
      'Correlated sandbox findings with VirusTotal results to investigate and profile malware samples',
      'Assisted in sandbox execution, behavioural analysis, and threat profiling workflows',
    ],
    skills: ['Cuckoo Sandbox', 'Malware Analysis', 'VirtualBox', 'VirusTotal', 'Linux', 'Threat Profiling', 'Cybersecurity'],
    keyTakeaways: [
      'Dynamic analysis reveals behaviour that static inspection misses entirely',
      'Corroborating sandbox output against external intelligence before drawing conclusions',
    ],
    image: '/assets/achievements/cdac_ethical_hacking.jpg',
  },
];

const RESEARCH: ExperienceItem[] = [
  {
    id: 'slipsense',
    type: 'research',
    title: 'SlipSense — Landslide Susceptibility & Runout Prediction',
    organization: 'LBS College of Engineering, Kasaragod',
    summary: 'Pixel-level landslide susceptibility and runout modelling for Kerala.',
    duration: '2025 – 2026',
    role: 'Primary Researcher & Developer',
    description:
      'Engineered a pixel-level landslide susceptibility pipeline for Kerala using 9 DEM-derived terrain features, combining Random Forest and U-Net with D8 flow-based runout modelling, and delivered it as a live GIS dashboard with district-level SMS alerting.',
    responsibilities: [
      'Derived 9 terrain features from DEM data — slope, aspect, flow accumulation, TWI, SPI, relief, drainage density, and river proximity',
      'Built a two-stage ML/DL workflow combining Random Forest and U-Net to generate and spatially refine susceptibility rasters',
      'Implemented D8 flow-based runout modelling to trace debris transit and deposition zones',
      'Sourced and processed CartoDEM/SRTM elevation data, GSI/KSDMA historical landslide records, and live OpenWeather data',
      'Classified terrain into a 4-tier hazard system (Safe, Deposition, Transit, Failure) with a combined susceptibility-plus-rainfall risk score',
    ],
    skills: ['Python', 'PyTorch', 'U-Net', 'Random Forest', 'Rasterio', 'GDAL', 'FastAPI', 'GIS', 'Remote Sensing'],
    keyTakeaways: [
      'Training pixel-level models on sparse, spatially clustered ground-truth labels',
      'Turning a research pipeline into an interactive system people can actually query',
      'Working with real geospatial data sources — CartoDEM, SRTM, GSI, KSDMA',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/Slipsense', icon: 'github' },
      { label: 'Live Demo', href: 'https://slipsense-sage.vercel.app', icon: 'external' },
    ],
  },
];

const ACHIEVEMENTS: ExperienceItem[] = [
  {
    id: 'icpc-huawei',
    type: 'achievement',
    title: 'ICPC 2026 Online Challenge — Rank #2632 of 33,953',
    organization: 'ICPC, powered by Huawei (Codeforces)',
    summary: 'Top-8% global finish on an edge-cloud LLM inference scheduling problem.',
    duration: '2026',
    description:
      'Finished #2632 out of 33,953 participants — the top 8% globally — in ICPC 2026 Online Challenge 1 powered by Huawei, hosted on Codeforces, scoring 13,407.172 points on an edge-cloud LLM inference scheduling problem.',
    skills: ['Algorithms', 'Optimization', 'Scheduling', 'Competitive Programming', 'C++'],
    keyTakeaways: [
      'Heuristic search under a hard scoring function and tight time limits',
      'Reasoning about latency/throughput trade-offs in distributed inference',
    ],
  },
  {
    id: 'medihack',
    type: 'achievement',
    title: 'MediHack 2024 — 2nd Prize',
    organization: 'IEEE Computer Society Student Chapter, LBSCEK',
    summary: '2nd place (₹7,000) at a 24-hour national-level hackathon.',
    duration: '2024',
    description:
      'Won 2nd Prize (₹7,000) with Team Anonymous at MediHack, a 24-hour national-level hackathon organised by the IEEE Computer Society Student Chapter at LBSCEK. Built a full-stack telemedicine platform featuring a medicine marketplace, real-time video/voice chat, patient consent management, and doctor access to medical records.',
    skills: ['Full-Stack', 'Real-time Communication', 'Healthcare Tech', 'React', 'Teamwork'],
    keyTakeaways: [
      'Scoping a working telemedicine demo inside 24 hours',
      'Splitting real-time and CRUD workstreams across a five-person team',
    ],
    image: '/assets/achievements/medihack.jpg',
  },
  {
    id: 'nasa',
    type: 'achievement',
    title: 'NASA Space Apps Challenge 2024 — Galactic Problem Solver',
    organization: 'NASA International Space Apps Challenge',
    summary: 'Recognised for outstanding participation at the global 2024 hackathon.',
    duration: 'October 2024',
    description:
      'Awarded the Galactic Problem Solver certificate at the 2024 NASA International Space Apps Challenge (5–6 October 2024) for outstanding participation and efforts to address challenges faced on Earth and in space.',
    skills: ['Creative Problem Solving', 'Space Science', 'Rapid Prototyping', 'Teamwork'],
    image: '/assets/achievements/nasa_space_apps.jpg',
  },
  {
    id: 'ribc',
    type: 'achievement',
    title: 'RIBC Agri-Tech Hackathon',
    organization: 'ICAR–CPCRI, Kasaragod',
    summary: 'Agri-tech hackathon hosted at Central University of Kerala.',
    duration: '2024',
    description:
      'Participated in the RIBC agri-tech hackathon run with ICAR–CPCRI at Central University of Kerala, Kasaragod, prototyping a solution to an agricultural problem statement under a fixed deadline and pitching it to a jury.',
    skills: ['Problem Solving', 'Rapid Prototyping', 'Agri-Tech', 'Teamwork'],
    image: '/assets/achievements/ribc_hackathon/ribc_team.jpg',
  },
  {
    id: 'cgaming',
    type: 'achievement',
    title: 'C Gaming — Yagna Dhruva ’24',
    organization: 'LBS Institute of Technology for Women',
    summary: 'C programming event at an intra-collegiate techno-cultural fest.',
    duration: 'April 2024',
    description:
      'Participated in C Gaming, a C programming event at Yagna Dhruva, the intra-collegiate techno-cultural fest conducted by LBS Institute of Technology for Women on 6 April 2024.',
    skills: ['C Programming', 'Problem Solving', 'Competition'],
    image: '/assets/achievements/cgaming_yagna_dhruva.jpg',
  },
  {
    id: 'techlift',
    type: 'achievement',
    title: 'Techlift Hackathon',
    organization: 'Techlift',
    summary: 'Frontend for real-time heart rate monitoring and alerts.',
    description:
      'Created a responsive frontend for a heart rate monitoring and real-time alert application during the Techlift Hackathon.',
    skills: ['React', 'Frontend', 'Real-time', 'Healthcare'],
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
    <div className="grid md:grid-cols-[40%_60%] gap-6 md:gap-8">
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
    <div className="section-padding pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <div className="mb-10 sm:mb-16">
          <TextReveal
            text="Experience"
            as="h2"
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white"
          />
          <motion.p
            className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Engineering Journey
          </motion.p>
        </div>

        {/* ─── Timeline ─── */}
        <div className="mb-14 sm:mb-20">
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
