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
    shortDescription: 'Landslide susceptibility & runout prediction system for Kerala.',
    category: 'AI / ML / Geospatial',
    status: 'Completed',
    duration: '2025 – 2026',
    overview:
      'A pixel-level landslide susceptibility and runout prediction system for Kerala, combining a two-stage Random Forest + U-Net pipeline over DEM-derived terrain features with a React GIS dashboard for 2D mapping, 3D terrain inspection, and district-level SMS alerting.',
    problem:
      'Kerala loses lives and infrastructure to landslides every monsoon. Existing hazard maps are static, coarse, and disconnected from live rainfall, so district authorities have no way to tell which slopes are dangerous right now — or where the debris from a failure would actually travel.',
    solution:
      'Engineered a pixel-level susceptibility pipeline over 9 DEM-derived terrain features, refined it spatially with a U-Net, added D8 flow-based runout modelling to trace debris transit and deposition, and served the whole thing through a FastAPI/rio-tiler tile backend behind an interactive GIS dashboard that fuses susceptibility with live OpenWeather rainfall into a combined risk score.',
    features: [
      '9 DEM-derived terrain features — slope, aspect, flow accumulation, TWI, SPI, relief, drainage density, river proximity',
      'Two-stage Random Forest + U-Net workflow producing and spatially refining susceptibility rasters',
      'D8 flow-based runout modelling tracing debris transit and deposition zones',
      '4-tier hazard classification (Safe, Deposition, Transit, Failure) with custom raster colorization',
      'LeafletJS 2D map plus CesiumJS 3D terrain viewer with per-pixel inspection',
      'Weather-based risk scoring combining susceptibility with live rainfall',
      'Twilio/Fast2SMS alerts fired when susceptibility, rainfall, and hazard-zone thresholds are jointly exceeded',
      '9 REST endpoints — tile serving, pixel inspection, weather proxy, district alert management',
      'Layer toggles, opacity sliders, and a per-district filter over historical susceptibility data',
    ],
    techStack: [
      'Python', 'Machine Learning', 'U-Net', 'Random Forest', 'PyTorch', 'FastAPI',
      'rio-tiler', 'Rasterio', 'GDAL', 'React', 'LeafletJS', 'CesiumJS', 'Twilio', 'GIS',
    ],
    architecture:
      'CartoDEM/SRTM + GSI/KSDMA records → terrain feature extraction → Random Forest → U-Net refinement → D8 runout model → FastAPI/rio-tiler tile server → React GIS dashboard (Leaflet 2D + Cesium 3D) → SMS alerting',
    challenges: [
      'Sourcing and aligning CartoDEM/SRTM elevation data with GSI/KSDMA historical landslide records',
      'Training a pixel-level model on sparse, spatially clustered landslide labels',
      'Serving large susceptibility rasters interactively without pre-rendering every zoom level',
      'Tuning joint susceptibility + rainfall thresholds so district alerts stay actionable rather than constant',
    ],
    futureWork: [
      'Automated retraining as new GSI/KSDMA landslide records are published',
      'Expansion beyond Kerala to the wider Western Ghats',
      'Mobile app for district officers receiving alerts',
    ],
    media: [
      { type: 'image', src: '/assets/projects/slipsense/susceptibility_statewide.jpg', alt: 'Statewide historical susceptibility layer (GSI) across Kerala' },
      { type: 'image', src: '/assets/projects/slipsense/hazard_map_runout_paths.jpg', alt: 'Final hazard map overlaid with D8 runout paths' },
      { type: 'image', src: '/assets/projects/slipsense/district_filter_kasaragod.jpg', alt: 'Susceptibility filtered to Kasaragod district' },
      { type: 'image', src: '/assets/projects/slipsense/pixel_inspection_safe_zone.jpg', alt: 'Per-pixel inspection showing zone, susceptibility score, and rainfall' },
      { type: 'image', src: '/assets/projects/slipsense/street_layer_pixel_inspect.jpg', alt: 'Street basemap layer with pixel inspection tooltip' },
      { type: 'image', src: '/assets/projects/slipsense/location_detail_panel.jpg', alt: 'Selected-location panel with coordinates, risk, and 3D terrain link' },
      { type: 'image', src: '/assets/projects/slipsense/cesium_3d_terrain.jpg', alt: 'CesiumJS 3D terrain viewer over Western Ghats slopes' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/Slipsense', icon: 'github' },
      { label: 'Live Demo', href: 'https://slipsense-sage.vercel.app', icon: 'external' },
    ],
  },
  {
    id: 'securevision-ai',
    name: 'SecureVision AI',
    shortDescription: 'Real-time AI surveillance platform running 5 deep-learning models.',
    category: 'Computer Vision / Full-Stack',
    status: 'Completed',
    duration: '2026',
    overview:
      'A real-time surveillance platform that replaces passive camera monitoring with automated risk scoring. Five deep-learning models run over the live feed for activity recognition, pose estimation, depth-based height estimation, and face identification, streamed to an operator dashboard over WebSockets and MJPEG.',
    problem:
      'Conventional CCTV requires a human watching every feed, and generates alerts nobody can triage. Operators have no automated read on what a person is actually doing, and no way to audit past incidents from the same place they monitor live.',
    solution:
      'Architected a Flask/React pipeline integrating YOLOv8 Pose, MiDaS, SlowFast R50, DeepFace, and RetinaFace, fusing posture and activity into a risk score. Annotated video, live events, and metrics stream to a React dashboard, while REST endpoints expose persisted security events so operators can monitor and audit from one place.',
    features: [
      'Real-time activity recognition — walking, running, falling, loitering',
      'Pose estimation via YOLOv8 Pose with depth-based height measurement (MiDaS)',
      'Face identification and enrolment using DeepFace and RetinaFace',
      'Automated risk scoring derived from posture and activity',
      'MJPEG annotated video streaming alongside Socket.IO event push',
      'Live metrics panel — persons, activity, pose, height, distance, risk level',
      'Persistent security-event log with historical metrics REST endpoints',
      'Multi-camera layouts: focus, grid, and stack views',
    ],
    techStack: [
      'Python', 'Flask', 'Flask-SocketIO', 'Waitress', 'PyTorch', 'YOLOv8', 'MiDaS v3',
      'SlowFast R50', 'DeepFace', 'RetinaFace', 'React 18', 'Vite', 'Recharts',
      'Framer Motion', 'MongoDB', 'WebSockets',
    ],
    architecture:
      'Camera feed → YOLOv8 Pose + MiDaS + SlowFast + DeepFace/RetinaFace → risk scoring → Flask-SocketIO (events) + MJPEG (video) → React dashboard; REST endpoints over persisted events for audit',
    challenges: [
      'Running five deep-learning models concurrently at interactive frame rates',
      'Keeping the annotated MJPEG stream in sync with the Socket.IO event channel',
      'Deriving reliable height estimates from monocular depth maps',
      'Turning raw posture and activity signals into a risk score operators would trust',
    ],
    futureWork: [
      'Multi-camera cross-feed identity tracking',
      'Edge deployment on low-power hardware',
      'Configurable alerting rules per camera',
    ],
    media: [
      { type: 'gif', src: '/assets/projects/ai_security/live_detection_demo.gif', alt: 'SecureVision AI live detection demo' },
      { type: 'image', src: '/assets/projects/ai_security/dashboard_live_monitoring.jpg', alt: 'Live monitoring dashboard with detection panel and recent events' },
      { type: 'image', src: '/assets/projects/ai_security/events_analytics.jpg', alt: 'SecureVision AI events and analytics view' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/AI_security_system', icon: 'github' },
      { label: 'Live Demo', href: 'https://dist-alpha-ten-64.vercel.app', icon: 'external' },
    ],
  },
  {
    id: 'talking-tom',
    name: 'AI Talking Tom',
    shortDescription: 'Fully offline AI virtual companion with a Godot 3D avatar.',
    category: 'AI / NLP / Computer Vision',
    status: 'Completed',
    duration: '2026',
    overview:
      'A local AI companion built across 20+ Python service modules, combining fully offline LLM inference, speech recognition, text-to-speech, emotion analysis, and conversational memory — driving a Godot 4.6 avatar with 62 animations over a TCP/JSON bridge.',
    problem:
      'Most AI companions depend on cloud APIs, so every conversation leaves the device and every response pays network latency. There was no privacy-first companion that ran end-to-end on consumer hardware and still had memory and personality.',
    solution:
      'Integrated Qwen 2.5 3B via llama.cpp with Faster Whisper, Piper TTS, DeepFace, YOLOv8, and wav2vec2-based emotion analysis, fusing face and voice signals for multimodal interaction. A memory system retains user facts across sessions and a personality layer evolves with conversation history — all packaged to run offline, with models fetched and cached on first run.',
    features: [
      'Real-time speech recognition with Faster Whisper',
      'Fully offline LLM inference — Qwen 2.5 3B via llama.cpp',
      'Natural text-to-speech with Piper TTS',
      'Multimodal emotion detection fusing DeepFace (face) and wav2vec2 (voice)',
      'Persistent memory system retaining user facts and preferences across sessions',
      'Dynamic personality layer that evolves with conversation history',
      'Godot 4.6 3D avatar with 62 animations, driven over TCP/JSON on port 9090',
      'React/Vite monitoring dashboard exposing Tom’s internal state, memories, and logs',
      'Runs offline on consumer hardware; models auto-download and cache on first run',
    ],
    techStack: [
      'Python', 'Godot 4.6', 'llama.cpp', 'Qwen 2.5 3B', 'Faster Whisper', 'Piper TTS',
      'DeepFace', 'YOLOv8', 'wav2vec2', 'MongoDB', 'React', 'Vite', 'TCP/JSON',
    ],
    architecture:
      'Godot 4.6 avatar ←TCP/JSON (port 9090)→ Python brain (20+ services) → Faster Whisper (STT) + llama.cpp/Qwen 2.5 (LLM) + Piper (TTS) + DeepFace/wav2vec2 (emotion); MongoDB memory; React dashboard',
    challenges: [
      'Running a 3B-parameter LLM locally at conversational latency',
      'Fusing face and voice emotion signals into one reliable read',
      'Synchronizing 62 avatar animations with generated speech',
      'Building persistent memory with no cloud storage to fall back on',
    ],
    futureWork: [
      'Multi-language support',
      'Improved emotion model accuracy',
      'Plugin system for custom personality modules',
    ],
    media: [
      { type: 'gif', src: '/assets/projects/talking_tom/avatar_demo.gif', alt: 'AI Talking Tom avatar responding in real time' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_avatar.png', alt: 'Godot 4.6 Talking Tom 3D avatar scene' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_dashboard.png', alt: 'Web dashboard showing Tom’s internal vitals' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_login.png', alt: 'Monitoring dashboard login screen' },
      { type: 'image', src: '/assets/projects/talking_tom/screenshot_memory.png', alt: 'Stored memories and conversation logs' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/AI_talking_tom_V1', icon: 'github' },
    ],
  },
  {
    id: 'orbitguard',
    name: 'OrbitGuard',
    shortDescription: 'AI mission control detecting and diagnosing spacecraft anomalies.',
    category: 'AI / ML / Backend',
    status: 'Completed',
    duration: '2026',
    overview:
      'An AI-powered mission control system that monitors spacecraft telemetry in real time, detects anomalies with unsupervised machine learning, and explains them in natural language using IBM Granite via watsonx.ai.',
    problem:
      'Satellite operators watch four telemetry channels at once and have to spot a developing fault before it becomes a mission-ending failure. Threshold alarms fire too late, and raw anomaly scores tell an operator that something is wrong without telling them what or why.',
    solution:
      'Built a FastAPI service that runs Isolation Forest anomaly detection across power, thermal, comms, and attitude telemetry, then passes flagged windows to IBM Granite for root-cause analysis with severity ratings and recommended actions — surfaced on an SVG mission-control dashboard with orbital tracking and sparklines.',
    features: [
      'Real-time anomaly detection across power, thermal, comms, and attitude channels',
      'Unsupervised Isolation Forest detection — no labelled fault data required',
      'Natural-language root-cause analysis via IBM Granite on watsonx.ai',
      'Severity ratings and recommended operator actions per anomaly',
      'Mission-control dashboard with orbital tracking and SVG sparkline charts',
      'Live sensor feed simulation with anomaly injection for demos',
      'CSV export and keyboard shortcuts for rapid operations',
      'Dockerised for reproducible deployment',
    ],
    techStack: [
      'Python', 'FastAPI', 'Scikit-learn', 'Isolation Forest', 'IBM Granite',
      'watsonx.ai', 'JavaScript', 'SVG', 'Docker',
    ],
    architecture:
      'Telemetry feed (4 channels) → FastAPI ingest → Isolation Forest anomaly detection → IBM Granite (watsonx.ai) diagnosis → REST API → vanilla JS/SVG mission-control dashboard',
    challenges: [
      'Tuning Isolation Forest contamination so real faults surface without alarm fatigue',
      'Prompting an LLM to produce diagnoses precise enough for an operator to act on',
      'Rendering live multi-channel telemetry smoothly without a charting library',
    ],
    futureWork: [
      'Multi-satellite constellation view',
      'Historical anomaly replay and post-mortem mode',
      'Supervised fine-tuning once labelled fault data accumulates',
    ],
    media: [],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/orbitguard', icon: 'github' },
    ],
  },
  {
    id: 'voice-hr-bot',
    name: 'Voice HR Bot',
    shortDescription: 'AI interview simulator with browser-based voice interaction.',
    category: 'AI / Full-Stack',
    status: 'Completed',
    duration: '2025',
    overview:
      'An AI interview simulator combining Gemini 2.5 Flash with role-aware prompting, conversational context, and browser-based voice interaction — a React/Vite frontend over a Django REST backend.',
    problem:
      'Job seekers have no realistic way to rehearse a role-specific interview out loud. Reading sample questions off a page trains nothing about answering under conversational pressure, and generic question banks ignore the role being interviewed for.',
    solution:
      'Built a React/Vite frontend that captures answers through the Web Speech API and speaks questions back, talking to a Django REST `/api/chat/` endpoint that drives Gemini 2.5 Flash with role-aware prompting and running conversational context.',
    features: [
      'Voice input via the browser Web Speech API — practise out loud',
      'Role-aware prompting so questions match the target position',
      'Conversational context carried across turns for realistic follow-ups',
      'Speech synthesis so the interviewer talks back',
      'Single `/api/chat/` REST endpoint bridging frontend and AI service',
      'Responsive glassmorphic UI',
      'Deployed frontend on Netlify, backend on Render with Gunicorn',
    ],
    techStack: [
      'React', 'Vite', 'Django', 'Django REST Framework', 'Python',
      'Gemini 2.5 Flash', 'Web Speech API', 'Netlify', 'Render', 'Gunicorn',
    ],
    architecture:
      'React/Vite frontend → Web Speech API (STT/TTS) → Django REST `/api/chat/` → Gemini 2.5 Flash (role-aware prompt + context) → spoken reply',
    challenges: [
      'Getting reliable browser speech recognition across devices',
      'Keeping conversational context coherent without exhausting the prompt window',
      'CORS and environment configuration across a split Netlify/Render deployment',
    ],
    futureWork: [
      'Multi-language interview support',
      'Answer scoring and analytics dashboard',
      'Company-specific interview preparation modes',
    ],
    media: [],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/voice-hr-bot', icon: 'github' },
    ],
  },
  {
    id: 'green-guard',
    name: 'Green Guard — Okra Disease Chatbot',
    shortDescription: 'Domain-scoped agricultural chatbot for okra cultivation and disease.',
    category: 'AI / NLP',
    status: 'Completed',
    duration: '2025',
    overview:
      'A conversational assistant ("OkraBot") scoped to okra cultivation — diagnosing common diseases, advising on companion planting and growing conditions, and answering climate-suitability questions for a grower’s specific region.',
    problem:
      'Smallholder okra growers get generic agricultural advice that ignores their crop and climate. A general-purpose chatbot will confidently answer questions far outside what it can actually be trusted on, which is worse than not answering.',
    solution:
      'Built a chatbot with an explicitly bounded domain: it answers okra cultivation, disease, and companion-planting questions in depth, and openly redirects users when a question falls outside its expertise instead of improvising.',
    features: [
      'Okra disease identification and treatment guidance',
      'Companion planting and growing-condition recommendations',
      'Region-specific climate suitability answers',
      'Explicit scope boundaries — redirects off-domain questions instead of guessing',
      'Multi-turn conversational context',
      'Clean web chat interface',
    ],
    techStack: ['Python', 'NLP', 'Flask', 'Machine Learning'],
    challenges: [
      'Keeping the assistant honest about the edge of its domain',
      'Building a usable okra disease knowledge base',
      'Maintaining conversational context across follow-up questions',
    ],
    media: [
      { type: 'image', src: '/assets/projects/green_guard/chat_01.jpg', alt: 'OkraBot redirecting an out-of-domain wheat question' },
      { type: 'image', src: '/assets/projects/green_guard/chat_02.jpg', alt: 'OkraBot conversation view' },
      { type: 'image', src: '/assets/projects/green_guard/chat_03.jpg', alt: 'OkraBot answering an okra cultivation question' },
      { type: 'image', src: '/assets/projects/green_guard/chat_04.jpg', alt: 'OkraBot disease guidance response' },
      { type: 'image', src: '/assets/projects/green_guard/chat_05.jpg', alt: 'OkraBot growing-conditions advice' },
      { type: 'image', src: '/assets/projects/green_guard/chat_06.jpg', alt: 'OkraBot climate suitability and companion planting answer' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/mccool1010/green-guard-chatbot', icon: 'github' },
    ],
  },
  {
    id: 'image-classification',
    name: 'Image Classification Model',
    shortDescription: 'CNN for multi-category image classification.',
    category: 'Deep Learning / Coursework',
    status: 'Completed',
    overview:
      'Designed and trained a convolutional neural network to classify images into multiple categories using TensorFlow and Keras.',
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
    links: [],
  },
  {
    id: 'sign-detection',
    name: 'Sign Detection Model',
    shortDescription: 'Real-time hand sign language recognition.',
    category: 'Computer Vision / Coursework',
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
    links: [],
  },
  {
    id: 'e-grievance',
    name: 'E-Grievance System',
    shortDescription: 'Full-stack student grievance platform.',
    category: 'Full-Stack / Coursework',
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
    links: [],
  },
  {
    id: 'food-nutrition',
    name: 'Food Nutrition Estimator',
    shortDescription: 'AI calorie estimation from food images.',
    category: 'AI / Coursework',
    status: 'Completed',
    overview:
      'An AI system that estimates calorie and nutrient content from food images, helping users track dietary intake.',
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
    links: [],
  },
];
