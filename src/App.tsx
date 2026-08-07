import React, { useState, useRef, useEffect, useCallback } from 'react';
import AnimatedBackground from './components/background/AnimatedBackground';
import Navbar from './components/navbar/Navbar';
import PanelLayout from './components/PanelLayout';
import Home from './pages/Home/Home';
import Education from './pages/Education/Education';
import Experience from './pages/Experience/Experience';
import Projects from './pages/Projects/Projects';
import Contact from './pages/Contact/Contact';

// Preserve Konami Code easter egg
import Crosshair from './components/Crosshair';
import { useKonamiCode } from './hooks/useKonamiCode';
import hitSoundUrl from './assets/sounds/hit.mp3';
import startSoundUrl from './assets/sounds/start.mp3';
import missSoundUrl from './assets/sounds/miss.mp3';

const hitSound = new Audio(hitSoundUrl);
const startSound = new Audio(startSoundUrl);
const missSound = new Audio(missSoundUrl);

function App() {
  const [activePanel, setActivePanel] = useState(0);

  // ─── Konami Code Easter Egg ──────────────────
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [pop, setPop] = useState(false);

  useKonamiCode(() => setShowCrosshair((v) => !v));

  const spawnTarget = useCallback(() => {
    const padding = 60;
    setTarget({
      x: Math.random() * (window.innerWidth - padding * 2) + padding,
      y: Math.random() * (window.innerHeight - padding * 2) + padding,
    });
  }, []);

  useEffect(() => {
    if (showCrosshair) {
      setGameActive(true);
      setScore(0);
      spawnTarget();
      startSound.currentTime = 0;
      startSound.play();
    } else {
      setGameActive(false);
      setTarget(null);
    }
  }, [showCrosshair, spawnTarget]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!target || !gameActive) return;
    const dx = e.clientX - target.x;
    const dy = e.clientY - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 32) {
      hitSound.currentTime = 0;
      hitSound.play();
      setPop(true);
      setTimeout(() => setPop(false), 200);
      setScore((s) => s + 1);
      spawnTarget();
    } else {
      missSound.currentTime = 0;
      missSound.play();
    }
  };

  const resetGame = () => {
    setScore(0);
    spawnTarget();
  };

  // ─── Navigation ─────────────────────────────
  const handleNavigate = useCallback((index: number) => {
    setActivePanel(index);
  }, []);

  return (
    <>
      {/* Universal animated background */}
      <AnimatedBackground />

      {/* Fixed glassmorphism navbar */}
      <Navbar activePanel={activePanel} onNavigate={handleNavigate} />

      {/* Horizontal panel system */}
      <PanelLayout
        activePanel={activePanel}
        onPanelChange={handleNavigate}
      >
        <Home onNavigate={handleNavigate} />
        <Education isActive={activePanel === 1} />
        <Experience isActive={activePanel === 2} />
        <Projects isActive={activePanel === 3} />
        <Contact />
      </PanelLayout>

      {/* Konami Code Crosshair Easter Egg */}
      {showCrosshair && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'auto',
            zIndex: 9999,
            cursor: 'none',
          }}
          onClick={handleShoot}
        >
          <Crosshair color="#22d3ee" />
          {/* Score */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              color: '#fff',
              fontWeight: 'bold',
              zIndex: 1,
              pointerEvents: 'none',
              opacity: 0.9,
              fontSize: '1.2rem',
              fontFamily: '"Space Grotesk", sans-serif',
              transition: 'transform 0.2s',
              transform: pop ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            🎮 Crosshair Minigame
            <br />
            Score: {score}
          </div>
          {/* Target */}
          {gameActive && target && (
            <div
              style={{
                position: 'absolute',
                left: target.x - 32,
                top: target.y - 32,
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 60% 40%, #22d3ee 60%, #a855f7 100%)',
                border: '3px solid rgba(255,255,255,0.6)',
                boxShadow: '0 0 24px rgba(34, 211, 238, 0.5)',
                pointerEvents: 'none',
                zIndex: 2,
                transition: 'transform 0.2s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.2s',
                transform: pop ? 'scale(1.4)' : 'scale(1)',
                opacity: pop ? 0.2 : 1,
              }}
            />
          )}
          {/* Reset / Exit buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); resetGame(); }}
            style={{
              position: 'absolute',
              top: 20,
              right: 40,
              zIndex: 3,
              background: 'rgba(17, 24, 39, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              cursor: 'pointer',
              pointerEvents: 'auto',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            Reset
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowCrosshair(false); }}
            style={{
              position: 'absolute',
              top: 20,
              right: 140,
              zIndex: 3,
              background: 'rgba(185, 28, 28, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              cursor: 'pointer',
              pointerEvents: 'auto',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            Exit
          </button>
        </div>
      )}
    </>
  );
}

export default App;