import { Github, ExternalLink, Linkedin, FileText, BookOpen } from 'lucide-react';
import type { Project } from '../../data/projectData';
import ImageCarousel from '../ui/ImageCarousel';
import Badge from '../ui/Badge';
import MagneticButton from '../buttons/MagneticButton';

interface ProjectViewerProps {
  project: Project;
}

const LINK_ICONS = {
  github: Github,
  external: ExternalLink,
  linkedin: Linkedin,
  paper: FileText,
  docs: BookOpen,
};

/**
 * Expanded project viewer — full case study layout.
 * Left: Media carousel. Right: Structured project information.
 */
export default function ProjectViewer({ project }: ProjectViewerProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* ─── Left Side: Media ─── */}
      <div className="space-y-4">
        <ImageCarousel media={project.media} projectName={project.id} />
      </div>

      {/* ─── Right Side: Information ───
          Only scrolls independently on desktop, where it sits beside the media.
          On mobile it stacks and the modal itself scrolls — a nested scroller
          there is nearly impossible to drive with a thumb. */}
      <div className="flex flex-col min-w-0 md:overflow-y-auto md:max-h-[65vh] md:pr-2 md:scrollbar-thin">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-1">
            {project.name}
          </h3>
          {/* Gap-separated rather than bullet-separated: dangling separators
              looked broken once the row wrapped on a narrow screen */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-accent-cyan font-medium">{project.category}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              project.status === 'Completed'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : project.status === 'In Progress'
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {project.status}
            </span>
            {project.duration && (
              <span className="text-gray-500">{project.duration}</span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5 mb-4" />

        {/* Overview */}
        <Section title="Overview">
          <p className="text-sm text-gray-300 leading-relaxed">{project.overview}</p>
        </Section>

        {/* Problem */}
        <Section title="Problem">
          <p className="text-sm text-gray-300 leading-relaxed">{project.problem}</p>
        </Section>

        {/* Solution */}
        <Section title="Solution">
          <p className="text-sm text-gray-300 leading-relaxed">{project.solution}</p>
        </Section>

        {/* Features */}
        <Section title="Features">
          <ul className="space-y-1.5">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="w-1 h-1 rounded-full bg-accent-cyan/60 mt-2 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </Section>

        {/* Tech Stack */}
        <Section title="Technology Stack">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <Badge key={t} label={t} variant="cyan" />
            ))}
          </div>
        </Section>

        {/* Architecture */}
        {project.architecture && (
          <Section title="Architecture">
            <div className="glass-card p-3 !rounded-lg text-xs font-mono text-gray-400 leading-relaxed break-words">
              {project.architecture}
            </div>
          </Section>
        )}

        {/* Challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <Section title="Challenges">
            <ul className="space-y-1.5">
              {project.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="w-1 h-1 rounded-full bg-accent-purple/60 mt-2 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Future Work */}
        {project.futureWork && project.futureWork.length > 0 && (
          <Section title="Future Improvements">
            <ul className="space-y-1.5">
              {project.futureWork.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="w-1 h-1 rounded-full bg-accent-cyan/40 mt-2 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Links */}
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/5">
            {project.links.map((link) => {
              const Icon = LINK_ICONS[link.icon] || ExternalLink;
              return (
                <MagneticButton
                  key={link.label}
                  variant={link.icon === 'github' ? 'primary' : 'secondary'}
                  size="sm"
                  href={link.href}
                  target="_blank"
                >
                  <Icon size={14} />
                  {link.label}
                </MagneticButton>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section helper ──
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}
