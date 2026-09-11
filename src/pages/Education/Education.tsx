import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Calendar,
  BookOpen,
  ExternalLink,
  Download,
  Award,
} from 'lucide-react';
import TextReveal from '../../components/animations/TextReveal';
import GlassCard from '../../components/cards/GlassCard';
import CertificationCard from '../../components/cards/CertificationCard';
import ExpandableCard from '../../components/modals/ExpandableCard';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/cards/StatCard';
import MagneticButton from '../../components/buttons/MagneticButton';

// ─── Data ─────────────────────────────────────────
interface Certification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialId?: string;
  description: string;
  skills: string[];
  verifyUrl?: string;
  certificateImage?: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    id: 'coursera-tensorflow',
    title: 'DeepLearning.AI TensorFlow Developer',
    issuer: 'DeepLearning.AI (Coursera)',
    date: '1 June 2026',
    description:
      'Professional Certificate spanning 4 courses: Introduction to TensorFlow for Artificial Intelligence, Machine Learning and Deep Learning; Convolutional Neural Networks in TensorFlow; Natural Language Processing in TensorFlow; and Sequences, Time Series and Prediction. Instructor: Laurence Moroney.',
    skills: ['TensorFlow', 'CNNs', 'NLP', 'Time Series', 'Deep Learning', 'Computer Vision'],
    verifyUrl: 'https://coursera.org/verify/professional-cert/N2SJE9DKVWR6',
    certificateImage: '/assets/achievements/tensorflow_developer.jpg',
  },
  {
    id: 'stanford-ml',
    title: 'Machine Learning Specialization',
    issuer: 'Stanford Online & DeepLearning.AI (Coursera)',
    date: '11 September 2025',
    description:
      'Three-course specialization taught by Andrew Ng, covering supervised learning (linear regression, logistic regression, neural networks, decision trees), unsupervised learning (clustering, anomaly detection), recommender systems, and reinforcement learning, alongside best practices for building machine learning models.',
    skills: ['Python', 'TensorFlow', 'Regression', 'Classification', 'Neural Networks', 'Recommender Systems', 'Reinforcement Learning'],
    verifyUrl: 'https://coursera.org/verify/specialization/0Q7MA38CY03N',
    certificateImage: '/assets/achievements/ml_specialization.jpg',
  },
  {
    id: 'nptel-ml',
    title: 'Introduction to Machine Learning — Elite',
    issuer: 'NPTEL / IIT Kharagpur',
    date: 'Jul–Sep 2024',
    credentialId: 'NPTEL24CS81S440800077',
    description:
      'Elite grade in the 8-week NPTEL Introduction to Machine Learning course from IIT Kharagpur, with a consolidated score of 67% (Online Assignments 22.38/25, Proctored Exam 44.9/75). 6,812 candidates were certified in this run.',
    skills: ['Machine Learning', 'Statistics', 'Probability', 'Optimization', 'ML Algorithms', 'Python'],
    certificateImage: '/assets/achievements/nptel_intro_ml.jpg',
  },
  {
    id: 'hexinox-mern',
    title: 'Full Stack Development (MERN) with AI — Internship',
    issuer: 'Hexinox Innovations Pvt. Ltd., Kochi',
    date: 'June 2025',
    credentialId: 'HX25IN0716',
    description:
      'Seven-day offline internship program at Hexinox Innovations, Kochi, starting 19 June 2025, with area of exposure in Full Stack Development (MERN) with AI. Completed successfully; certificate issued 26 July 2025.',
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Supabase', 'AI Integration'],
    certificateImage: '/assets/achievements/hexinox_mern_internship.jpg',
  },
  {
    id: 'cdac-ethical-hacking',
    title: 'Ethical Hacking & Penetration Testing',
    issuer: 'C-DAC Noida (MeitY, Govt. of India)',
    date: '19 Aug – 3 Oct 2024',
    credentialId: '1561/329632/CG/(19)/2024',
    description:
      'Completed the 25-hour online training program on Ethical Hacking and Penetration Testing conducted by C-DAC, NOIDA under the Cyber Gyan Project, supported by the Ministry of Electronics and Information Technology, Government of India.',
    skills: ['Ethical Hacking', 'Penetration Testing', 'Cybersecurity', 'Network Security', 'Vulnerability Assessment'],
    certificateImage: '/assets/achievements/cdac_ethical_hacking.jpg',
  },
  {
    id: 'cisco-network',
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    date: '29 January 2025',
    description:
      'Foundational networking course from the Cisco Networking Academy program, covering network fundamentals, protocols, addressing, and basic security concepts.',
    skills: ['Network Fundamentals', 'Protocols', 'OSI Model', 'IP Addressing', 'Security Basics'],
    certificateImage: '/assets/achievements/cisco_networkbasics.jpg',
  },
  {
    id: 'microsoft-ai-fest',
    title: 'Microsoft AI Skills Fest — Festival Participation',
    issuer: 'Microsoft',
    date: '1 June 2025',
    description:
      'Completed the Microsoft AI Skills Fest festival participation track, working hands-on with Microsoft AI tooling and Azure AI services.',
    skills: ['Azure AI', 'Microsoft AI', 'Cloud Computing', 'AI Tools'],
    certificateImage: '/assets/achievements/microsoft_ai_skills_fest.jpg',
  },
  {
    id: 'microsoft-purview',
    title: 'AI Skills Fest Challenge: Manage AI Data Security with Microsoft Purview',
    issuer: 'Microsoft',
    date: '24 May 2025',
    description:
      'Completed the Microsoft AI Skills Fest challenge on managing AI data security with Microsoft Purview — data governance, classification, and protection controls for AI workloads.',
    skills: ['Microsoft Purview', 'AI Data Security', 'Data Governance', 'Azure', 'Compliance'],
    certificateImage: '/assets/achievements/microsoft_purview_challenge.jpg',
  },
  {
    id: 'ibm-skillsbuild-bob',
    title: 'Lab: Troubleshoot Your Code Using IBM Bob',
    issuer: 'IBM SkillsBuild',
    date: '18 August 2026',
    credentialId: 'ALM-COURSE_4071307',
    description:
      'Hands-on IBM SkillsBuild lab on debugging and troubleshooting code with IBM Bob, the AI coding assistant. Completion recorded 18 Aug 2026 (30 minutes of learning).',
    skills: ['Debugging', 'AI Coding Assistants', 'IBM Bob', 'Code Troubleshooting'],
    certificateImage: '/assets/achievements/ibm_skillsbuild_bob_lab.pdf',
  },
];

// ─── Component ────────────────────────────────────
interface EducationProps {
  isActive?: boolean;
}

export default function Education({ isActive }: EducationProps) {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Close modal when navigating away from this panel
  useEffect(() => {
    if (!isActive) setSelectedCert(null);
  }, [isActive]);

  return (
    <div className="section-padding pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <div className="mb-10 sm:mb-16">
          <TextReveal
            text="Education"
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
            Academic Journey & Professional Certifications
          </motion.p>
        </div>

        {/* ─── College Section ─── */}
        <motion.div
          className="mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-0 overflow-hidden" spotlight>
            <div className="grid md:grid-cols-[40%_60%]">
              {/* College Image */}
              <div className="relative h-56 md:h-auto bg-gradient-to-br from-surface-200 to-surface-300 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/education/lbs_college.jpg"
                  alt="LBS College of Engineering, Kasaragod"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Academic Info */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-1">
                  LBS College of Engineering
                </h3>
                <p className="text-accent-cyan font-medium mb-4">
                  APJ Abdul Kalam Technological University
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-start gap-2 text-gray-300">
                    <BookOpen size={16} className="text-gray-500 flex-shrink-0 mt-1" />
                    <span>Bachelor of Technology — Computer Science &amp; Engineering</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <Calendar size={16} className="text-gray-500 flex-shrink-0 mt-1" />
                    <span>2022 – April 2026 · 8 semesters, 162 credits</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-1" />
                    <span>Kasaragod, Kerala</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Graduated April 2026 with a CGPA of 7.42 (First Class). Coursework
                  centred on Data Structures & Algorithms, DBMS, Operating Systems,
                  Computer Networks, and OOP, extended into Machine Learning, Computer
                  Vision, and full-stack engineering through research, internships,
                  and hackathons.
                </p>

                {/* Academic detail mini-cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard value="7.42" label="CGPA · First Class" delay={0} />
                  <StatCard value="B.Tech" label="Degree" delay={0.1} />
                  <StatCard value="KTU" label="University" delay={0.2} />
                  <StatCard value="2026" label="Graduation" delay={0.3} />
                </div>

                {/* Official records */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <MagneticButton
                    variant="secondary"
                    size="sm"
                    href="/assets/education/provisional_cert.pdf"
                    target="_blank"
                  >
                    <ExternalLink size={14} />
                    Provisional Certificate
                  </MagneticButton>
                  <MagneticButton
                    variant="ghost"
                    size="sm"
                    href="/assets/education/grade_card.pdf"
                    target="_blank"
                  >
                    <ExternalLink size={14} />
                    Consolidated Grade Card
                  </MagneticButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ─── Divider ─── */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h3 className="text-lg font-heading font-semibold text-gray-300 flex items-center gap-2">
              <Award size={20} className="text-accent-cyan" />
              Professional Certifications
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* ─── Certification Grid ─── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATIONS.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              title={cert.title}
              issuer={cert.issuer}
              onClick={() => setSelectedCert(cert)}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* ─── Expanded Certificate Viewer ─── */}
        <ExpandableCard
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
        >
          {selectedCert && (
            <div className="grid md:grid-cols-[45%_55%] gap-6 md:gap-8">
              {/* Left — Certificate Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-200 to-surface-300 rounded-xl flex items-center justify-center overflow-hidden">
                {selectedCert.certificateImage ? (
                  selectedCert.certificateImage.endsWith('.pdf') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
                      <Award size={48} className="text-accent-cyan" />
                      <p className="text-sm font-medium text-gray-300">{selectedCert.title}</p>
                      <a
                        href={selectedCert.certificateImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-cyan hover:underline"
                      >
                        View PDF Certificate →
                      </a>
                    </div>
                  ) : (
                    <img
                      src={selectedCert.certificateImage}
                      alt={`${selectedCert.title} certificate`}
                      className="w-full h-full object-contain p-2"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="text-center text-gray-500 p-6">
                    <Award size={48} className="mx-auto mb-3 text-gray-600" />
                    <p className="text-sm font-medium">Certificate Image</p>
                  </div>
                )}
              </div>

              {/* Right — Certificate Details */}
              <div className="flex flex-col">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
                  {selectedCert.title}
                </h3>
                <p className="text-accent-cyan font-medium mb-1">
                  {selectedCert.issuer}
                </p>
                {selectedCert.date && (
                  <p className="text-sm text-gray-500 mb-1">
                    Completed: {selectedCert.date}
                  </p>
                )}
                {selectedCert.credentialId && (
                  <p className="text-xs text-gray-600 font-mono mb-4">
                    ID: {selectedCert.credentialId}
                  </p>
                )}

                <div className="h-px bg-white/5 my-4" />

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {selectedCert.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Skills Learned
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill) => (
                      <Badge key={skill} label={skill} variant="cyan" />
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 mt-auto">
                  {selectedCert.verifyUrl && (
                    <MagneticButton
                      variant="secondary"
                      size="sm"
                      href={selectedCert.verifyUrl}
                      target="_blank"
                    >
                      <ExternalLink size={14} />
                      View Credential
                    </MagneticButton>
                  )}
                  {selectedCert.certificateImage && (
                    <MagneticButton
                      variant="ghost"
                      size="sm"
                      href={selectedCert.certificateImage}
                      target="_blank"
                    >
                      <Download size={14} />
                      Certificate
                    </MagneticButton>
                  )}
                </div>
              </div>
            </div>
          )}
        </ExpandableCard>
      </div>
    </div>
  );
}
