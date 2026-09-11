# Hari Krishna — Portfolio

Personal portfolio of **Hari Krishna**, a Software Engineer working in AI/ML and full-stack
development. Built as a single-page app with a horizontal panel system, a glassmorphism UI,
and an animated WebGL background.

**Live:** https://portfolio-v2-seven-ruddy.vercel.app

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Motion (Framer Motion) · GSAP |
| Background | OGL (WebGL particle field) |
| Icons | Lucide React |
| Fonts | Space Grotesk · Inter · JetBrains Mono |

## Features

- **Horizontal panel navigation** — five full-viewport panels (Home, Education, Experience,
  Projects, Contact) with slide transitions; each scrolls vertically on its own.
- **Multiple ways to navigate** — navbar, arrow keys, and horizontal swipe on touch devices.
- **Expandable detail cards** — projects, certificates, and roles open in a modal with a
  focus trap, Escape-to-close, and background scroll lock.
- **Media carousel** — swipeable on touch, with keyboard-reachable controls.
- **Responsive from 320px up** — verified at 320 / 360 / 375 / 393 / 768 / 1440px.
- **Respects `prefers-reduced-motion`** — the particle background drops out entirely, and
  the count scales down on phones to save battery.
- There's a Konami code easter egg. ⏫⏫⏬⏬⬅️➡️⬅️➡️🅱️🅰️

## Getting Started

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # eslint
```

## Project Structure

```
src/
├── components/
│   ├── animations/    TextReveal, Timeline
│   ├── background/    AnimatedBackground, Particles (OGL)
│   ├── buttons/       MagneticButton
│   ├── cards/         GlassCard, ProjectTile, CertificationCard, ExperienceCard, StatCard
│   ├── modals/        ExpandableCard, ProjectViewer
│   ├── navbar/        Navbar
│   ├── ui/            Badge, ImageCarousel
│   └── PanelLayout.tsx
├── data/
│   └── projectData.ts   single source of truth for all project content
├── pages/             Home, Education, Experience, Projects, Contact
├── hooks/
└── index.css          design tokens, glassmorphism, panel system

public/assets/
├── achievements/      certificates
├── education/         degree records
├── projects/          project screenshots
├── profile/
└── resume/
```

Project content lives in [`src/data/projectData.ts`](src/data/projectData.ts). Certifications
and roles are defined at the top of their respective page components.

## Featured Projects

| Project | Description | Links |
| --- | --- | --- |
| **SlipSense** | Pixel-level landslide susceptibility and runout prediction for Kerala — Random Forest + U-Net over 9 DEM-derived terrain features, with a Leaflet/Cesium GIS dashboard and district SMS alerts | [Code](https://github.com/mccool1010/Slipsense) · [Demo](https://slipsense-ebon.vercel.app/) |
| **SecureVision AI** | Real-time surveillance platform running 5 deep-learning models (YOLOv8 Pose, MiDaS, SlowFast R50, DeepFace, RetinaFace) behind a Flask/React dashboard | [Code](https://github.com/mccool1010/AI_security_system) · [Demo](https://dist-alpha-ten-64.vercel.app) |
| **AI Talking Tom** | Fully offline AI companion — Qwen 2.5 3B via llama.cpp, Faster Whisper, Piper TTS, and multimodal emotion detection driving a Godot 4.6 avatar | [Code](https://github.com/mccool1010/AI_talking_tom_V1) |
| **OrbitGuard** | Spacecraft telemetry anomaly detection with Isolation Forest, diagnosed in natural language by IBM Granite on watsonx.ai | [Code](https://github.com/mccool1010/orbitguard) |
| **Voice HR Bot** | AI interview simulator with browser voice interaction — Gemini 2.5 Flash behind a Django REST backend | [Code](https://github.com/mccool1010/voice-hr-bot) |

## Contact

- **Email** — harikrishnaarun5@gmail.com
- **LinkedIn** — https://www.linkedin.com/in/hk7373/
- **GitHub** — https://github.com/mccool1010
