import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import TextReveal from '../../components/animations/TextReveal';
import ProjectTile from '../../components/cards/ProjectTile';
import ExpandableCard from '../../components/modals/ExpandableCard';
import ProjectViewer from '../../components/modals/ProjectViewer';
import { PROJECTS, type Project } from '../../data/projectData';

interface ProjectsProps {
  isActive?: boolean;
}

export default function Projects({ isActive }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Close modal when navigating away from this panel
  useEffect(() => {
    if (!isActive) setSelectedProject(null);
  }, [isActive]);

  return (
    <div className="section-padding pt-24">
      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <div className="mb-4">
          <TextReveal
            text="Projects"
            as="h2"
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white"
          />
          <motion.p
            className="mt-4 text-lg text-accent-cyan/80 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Engineering Portfolio
          </motion.p>
          <motion.p
            className="mt-2 text-gray-400 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            Explore selected AI, Machine Learning, Computer Vision, and Software
            Engineering projects.
          </motion.p>
        </div>

        {/* ─── Project Grid ─── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-12">
          {PROJECTS.map((project, index) => (
            <ProjectTile
              key={project.id}
              name={project.name}
              shortDescription={project.shortDescription}
              onClick={() => setSelectedProject(project)}
              delay={index * 0.08}
            />
          ))}
        </div>

        {/* ─── Expanded Project Viewer ─── */}
        <ExpandableCard
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        >
          {selectedProject && <ProjectViewer project={selectedProject} />}
        </ExpandableCard>
      </div>
    </div>
  );
}
