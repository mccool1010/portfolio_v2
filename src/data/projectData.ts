// ─── Project Data Model ─────────────────────────
export interface ProjectMedia {
  type: 'image' | 'video' | 'gif';
  src: string;
  alt: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  icon: 'github' | 'external' | 'linkedin' | 'paper' | 'docs';
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Ongoing';
  duration?: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  architecture?: string;
  challenges?: string[];
  futureWork?: string[];
  media: ProjectMedia[];
  links: ProjectLink[];
}

// ─── Projects ─────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: 'slipsense',
    name: 'SlipSense',
    shortDescription: 'AI-powered landslide prediction system.',
    category: 'AI / ML / Research',
    status: 'Completed',
    duration: '2024',
    overview:
      'An AI-powered landslide prediction system that uses machine learning models trained on geospatial and meteorological data to predict landslide risks in real-time.',
    problem:
      'Landslides cause significant loss of life and property, especially in mountainous regions. Early warning systems are often inaccurate or too slow to provide actionable alerts.',
    solution:
      'Built a machine learning pipeline that processes geospatial, rainfall, and soil data to generate real-time landslide risk predictions, enabling timely evacuation warnings.',
    features: [
      'Real-time landslide prediction',
      'Geospatial data processing',
      'Interactive dashboard',
      'Historical analysis',
      'Risk zone mapping',
    ],
    techStack: ['Python', 'TensorFlow', 'Scikit-learn', 'Flask', 'GIS', 'Pandas'],
    architecture: 'Data Collection → Preprocessing → Feature Engineering → ML Model → Prediction API → Dashboard',
    challenges: [
      'Limited labeled landslide event data',
      'Feature engineering from heterogeneous geospatial sources',
      'Balancing model sensitivity and specificity',
    ],
    futureWork: [
      'Integration with government weather APIs',
      'Mobile application for alerts',
      'Extended to cover more regions',
    ],
    media: [
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0068.jpg', alt: 'SlipSense dashboard view' },
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0070.jpg', alt: 'SlipSense data visualization' },
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0071.jpg', alt: 'SlipSense prediction results' },
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0072.jpg', alt: 'SlipSense risk mapping' },
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0073.jpg', alt: 'SlipSense model architecture' },
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0074.jpg', alt: 'SlipSense analysis output' },
      { type: 'image', src: '/assets/projects/slipsense/IMG-20260113-WA0075.jpg', alt: 'SlipSense system overview' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/Slipsense', icon: 'github' },
      { label: 'Research Paper', href: '#', icon: 'paper' },
    ],
  },
  {
    id: 'ai-home-security',
    name: 'AI Home Security',
    shortDescription: 'Real-time intelligent surveillance system.',
    category: 'Computer Vision / AI',
    status: 'Completed',
    duration: '2024',
    overview:
      'An intelligent home security system that uses computer vision to detect intrusions, recognize faces, and send real-time alerts to homeowners.',
    problem:
      'Traditional security cameras require constant human monitoring and generate too many false alarms, making them unreliable for real home security.',
    solution:
      'Developed a computer vision pipeline that uses deep learning models for real-time person detection, face recognition, and anomaly detection, with automated alert notifications.',
    features: [
      'Real-time person detection',
      'Face recognition',
      'Anomaly detection',
      'Push notifications',
      'Video recording & playback',
    ],
    techStack: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'React'],
    architecture: 'Camera Feed → Frame Processing → Detection Model → Recognition → Alert System → Dashboard',
    challenges: [
      'Real-time processing with limited hardware',
      'Reducing false positive detections',
      'Low-light performance optimization',
    ],
    futureWork: [
      'Cloud deployment',
      'Mobile app integration',
      'Multi-camera support',
    ],
    media: [
      { type: 'gif', src: '/assets/projects/ai_security/2026-07-2216-14-45-ezgif.com-video-to-gif-converter.gif', alt: 'AI Security system demo' },
      { type: 'image', src: '/assets/projects/ai_security/Screenshot_2026-07-22-16-12-02-20_40deb401b9ffe8e1df2f1cc5ba480b12.jpg', alt: 'AI Security detection view' },
      { type: 'image', src: '/assets/projects/ai_security/Screenshot_2026-07-22-16-12-15-01_40deb401b9ffe8e1df2f1cc5ba480b12.jpg', alt: 'AI Security dashboard' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/AI_security_system', icon: 'github' },
    ],
  },
  {
    id: 'talking-tom',
    name: 'AI Talking Tom',
    shortDescription: 'Offline AI virtual companion with emotion detection.',
    category: 'AI / NLP / Computer Vision',
    status: 'Completed',
    duration: '2025',
    overview:
      'An AI-powered virtual companion built with Godot 4.6, Python, and local LLMs. Tom listens to you, understands emotions, remembers conversations, and responds with personality — all running entirely offline.',
    problem:
      'Most AI companions require constant internet connectivity and cloud APIs, raising privacy concerns and adding latency. There is no offline, privacy-first AI companion with real personality.',
    solution:
      'Built a fully offline AI companion using a local LLM (Qwen 2.5 3B via llama.cpp), Faster Whisper for speech recognition, Piper TTS for natural voice, and emotion detection via face + voice fusion — all communicating over a TCP bridge with a Godot 3D avatar.',
    features: [
      'Real-time speech recognition (Faster Whisper)',
      'Local LLM running entirely offline (llama.cpp)',
      'Natural text-to-speech (Piper TTS)',
      'Emotion detection via face + voice fusion',
      'Persistent memory system',
      'Dynamic personality that evolves over conversations',
      '3D animated avatar with 62 animations',
      'Web dashboard for monitoring internal state',
    ],
    techStack: ['Python', 'Godot 4.6', 'llama.cpp', 'Faster Whisper', 'Piper TTS', 'YOLOv8', 'DeepFace', 'MongoDB', 'React', 'TCP/JSON'],
    architecture: 'Godot 3D Avatar ←TCP/JSON→ Python Brain → STT (Whisper) + LLM (llama.cpp) + TTS (Piper)',
    challenges: [
      'Running large language models locally with acceptable performance',
      'Fusing face and voice emotion signals reliably',
      'Synchronizing avatar animations with speech output',
      'Building a persistent memory system without cloud storage',
    ],
    futureWork: [
      'Multi-language support',
      'Improved emotion model accuracy',
      'Mobile companion app',
      'Plugin system for custom personality modules',
    ],
    media: [
      { type: 'gif', src: '/assets/projects/talking_tom/072001_1784496111958-ezgif.com-video-to-gif-converter.gif', alt: 'AI Talking Tom demo animation' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_avatar.png', alt: 'Talking Tom 3D avatar' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_dashboard.png', alt: 'Web dashboard and vitals' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_login.png', alt: 'Dashboard login screen' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_memory.png', alt: 'Memories and conversation logs' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/AI_talking_tom_V1', icon: 'github' },
    ],
  },
  {
    id: 'voice-hr-bot',
    name: 'Voice HR Bot',
    shortDescription: 'AI-powered HR interview simulator with voice input.',
    category: 'AI / Full-Stack',
    status: 'Completed',
    duration: '2025',
    overview:
      'A full-stack AI-powered HR interview simulator with voice input, built with React (Vite) frontend and Django backend. Practice realistic interviews using your microphone.',
    problem:
      'Job seekers lack access to realistic interview practice, especially for specific roles. Traditional preparation methods don\'t provide real-time feedback or simulate actual interview dynamics.',
    solution:
      'Built a full-stack interview simulator that uses Google Gemini AI to generate role-specific interview questions, accepts voice input via microphone, and provides instant AI-powered feedback on responses.',
    features: [
      'Voice input for practicing interviews',
      'AI interviewer with role-specific questions',
      'Real-time feedback on responses',
      'Modern glassmorphic UI',
      'Easily deployable frontend and backend',
    ],
    techStack: ['React', 'Vite', 'Django', 'Python', 'Google Gemini API', 'Web Speech API'],
    architecture: 'React Frontend → Voice Input (Web Speech API) → Django API → Google Gemini → AI Response',
    challenges: [
      'Achieving reliable speech-to-text in browser',
      'Generating contextually relevant interview questions',
      'Maintaining conversation flow and follow-up questions',
    ],
    futureWork: [
      'Multi-language interview support',
      'Interview analytics dashboard',
      'Video interview mode',
      'Custom company-specific interview prep',
    ],
    media: [],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/voice-hr-bot', icon: 'github' },
    ],
  },
  {
    id: 'green-guard',
    name: 'Green Guard Chatbot',
    shortDescription: 'AI chatbot for environmental awareness & plant care.',
    category: 'AI / NLP',
    status: 'Completed',
    duration: '2024',
    overview:
      'An AI-powered chatbot designed to promote environmental awareness and assist users with plant identification, care tips, and sustainability practices.',
    problem:
      'People lack accessible, conversational tools to learn about plant care, environmental practices, and sustainability in an engaging way.',
    solution:
      'Built an intelligent chatbot that leverages NLP to provide contextual information about plants, environmental best practices, and sustainability tips through natural conversation.',
    features: [
      'Plant identification assistance',
      'Care tips and recommendations',
      'Environmental awareness information',
      'Natural language conversation',
      'Context-aware responses',
    ],
    techStack: ['Python', 'NLP', 'Flask', 'Machine Learning'],
    challenges: [
      'Building comprehensive plant knowledge base',
      'Maintaining conversational context',
    ],
    media: [
      { type: 'image', src: '/assets/projects/green_guard/Screenshot_2026-07-22-16-07-28-09_254de13a4bc8758c9908fff1f73e3725.jpg', alt: 'Green Guard chatbot interface' },
      { type: 'image', src: '/assets/projects/green_guard/Screenshot_2026-07-22-16-07-39-64_254de13a4bc8758c9908fff1f73e3725.jpg', alt: 'Green Guard conversation view' },
      { type: 'image', src: '/assets/projects/green_guard/Screenshot_2026-07-22-16-07-49-90_254de13a4bc8758c9908fff1f73e3725.jpg', alt: 'Green Guard plant info' },
      { type: 'image', src: '/assets/projects/green_guard/Screenshot_2026-07-22-16-07-59-80_254de13a4bc8758c9908fff1f73e3725.jpg', alt: 'Green Guard response display' },
      { type: 'image', src: '/assets/projects/green_guard/Screenshot_2026-07-22-16-08-10-51_254de13a4bc8758c9908fff1f73e3725.jpg', alt: 'Green Guard plant care tips' },
      { type: 'image', src: '/assets/projects/green_guard/Screenshot_2026-07-22-16-08-22-14_254de13a4bc8758c9908fff1f73e3725.jpg', alt: 'Green Guard sustainability info' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/green-guard-chatbot', icon: 'github' },
    ],
  },
  {
    id: 'cuckoo-sandbox',
    name: 'Cuckoo Sandbox',
    shortDescription: 'Dynamic malware analysis environment.',
    category: 'Cybersecurity',
    status: 'Completed',
    overview:
      'A secure sandbox environment built for automated dynamic malware analysis. Detects malicious software behaviors by running suspicious files in an isolated VM.',
    problem:
      'Static malware analysis is insufficient for detecting sophisticated malware that uses obfuscation and runtime evasion techniques.',
    solution:
      'Built a sandboxed environment using Cuckoo Sandbox that executes suspicious files in isolated virtual machines, monitors behavior, and generates detailed reports.',
    features: [
      'Automated file execution in isolated VM',
      'Behavior monitoring and logging',
      'Network traffic analysis',
      'Report generation',
      'API call tracking',
    ],
    techStack: ['Python', 'Cuckoo', 'VirtualBox', 'Yara', 'Linux'],
    challenges: [
      'VM detection evasion by malware',
      'Resource-intensive analysis',
      'Keeping signatures up-to-date',
    ],
    media: [],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
    ],
  },
  {
    id: 'image-classification',
    name: 'Image Classification Model',
    shortDescription: 'CNN for multi-category image classification.',
    category: 'Deep Learning',
    status: 'Completed',
    overview:
      'Designed and trained a convolutional neural network to accurately classify images into multiple categories using TensorFlow and Keras.',
    problem:
      'Manual image categorization is time-consuming and error-prone, especially at scale.',
    solution:
      'Built a CNN architecture with data augmentation, batch normalization, and dropout for robust multi-class image classification.',
    features: [
      'Multi-category classification',
      'Data augmentation pipeline',
      'Model evaluation metrics',
      'Transfer learning support',
    ],
    techStack: ['Python', 'TensorFlow', 'Keras', 'NumPy', 'Matplotlib'],
    challenges: [
      'Dataset imbalance across categories',
      'Preventing overfitting on small datasets',
    ],
    media: [],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
    ],
  },
  {
    id: 'chatbot-image',
    name: 'Chatbot with Image Classification',
    shortDescription: 'NLP + computer vision interactive chatbot.',
    category: 'AI / NLP',
    status: 'Completed',
    overview:
      'Combined natural language processing and computer vision to create an interactive chatbot that interprets image inputs and responds intelligently.',
    problem:
      'Standard chatbots are text-only and cannot understand visual context from image inputs.',
    solution:
      'Integrated an image classification model with NLP capabilities to build a chatbot that can analyze uploaded images and provide contextual responses.',
    features: [
      'Image analysis via uploaded photos',
      'Natural language conversation',
      'Context-aware responses',
      'Multi-modal interaction',
    ],
    techStack: ['Python', 'TensorFlow', 'NLP', 'OpenCV', 'Flask'],
    media: [],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
    ],
  },
  {
    id: 'sign-detection',
    name: 'Sign Detection Model',
    shortDescription: 'Real-time hand sign language recognition.',
    category: 'Computer Vision',
    status: 'Completed',
    overview:
      'Real-time hand sign detection system using OpenCV and deep learning to support sign language recognition and improve accessibility.',
    problem:
      'Communication barriers for the deaf and hearing-impaired community can be partially addressed through automated sign language recognition.',
    solution:
      'Developed a real-time hand gesture detection pipeline using OpenCV for preprocessing and a deep learning model for sign classification.',
    features: [
      'Real-time hand detection',
      'Sign language alphabet recognition',
      'Live webcam support',
      'High accuracy classification',
    ],
    techStack: ['Python', 'OpenCV', 'TensorFlow', 'MediaPipe', 'Deep Learning'],
    media: [],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
    ],
  },
  {
    id: 'e-grievance',
    name: 'E-Grievance System',
    shortDescription: 'Full-stack student grievance platform.',
    category: 'Full-Stack / Web',
    status: 'Completed',
    overview:
      'A full-stack platform allowing students to report grievances with multi-level workflows for admin and teacher review and resolution.',
    problem:
      'Student grievances were handled through manual processes, leading to slow resolution and lack of transparency.',
    solution:
      'Built a web platform with role-based access for students, teachers, and administrators, enabling streamlined grievance submission, tracking, and resolution.',
    features: [
      'Role-based access (Student, Teacher, Admin)',
      'Grievance submission and tracking',
      'Status notifications',
      'Dashboard analytics',
      'Resolution workflows',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'Flask', 'SQLite'],
    media: [],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
    ],
  },
  {
    id: 'food-nutrition',
    name: 'Food Nutrition Estimator',
    shortDescription: 'AI calorie estimation from food images.',
    category: 'AI / Health Tech',
    status: 'Completed',
    overview:
      'An AI system that estimates calorie and nutrient content from food images, helping users track their dietary intake effortlessly.',
    problem:
      'Manual calorie tracking is tedious and inaccurate, leading to poor dietary awareness.',
    solution:
      'Built an image-based food recognition system that identifies food items and estimates nutritional content using deep learning models.',
    features: [
      'Food image recognition',
      'Calorie estimation',
      'Nutrient breakdown',
      'Multi-food detection',
    ],
    techStack: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'REST API'],
    media: [],
    links: [
      { label: 'GitHub', href: '#', icon: 'github' },
    ],
  },
];
