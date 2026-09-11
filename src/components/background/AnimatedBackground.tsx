import { useEffect, useState } from 'react';
import Particles from './Particles';

/**
 * Universal animated background — interactive OGL particle cosmos.
 *
 * Scales itself down on phones (fewer particles, no pointer tracking) and
 * drops out entirely when the visitor asks for reduced motion, leaving the
 * flat surface colour behind it.
 */
export default function AnimatedBackground() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncSmall = () => setIsSmallScreen(smallQuery.matches);
    const syncMotion = () => setReduceMotion(motionQuery.matches);

    syncSmall();
    syncMotion();

    smallQuery.addEventListener('change', syncSmall);
    motionQuery.addEventListener('change', syncMotion);
    return () => {
      smallQuery.removeEventListener('change', syncSmall);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0a0e1a]"
      aria-hidden="true"
    >
      {!reduceMotion && (
        <Particles
          // A phone GPU does not need 200 points behind the content
          particleCount={isSmallScreen ? 70 : 200}
          particleSpread={10}
          speed={0.1}
          particleColors={['#ffffff', '#22d3ee', '#a855f7']}
          // Pointer tracking on touch just reacts to scrolling — skip it
          moveParticlesOnHover={!isSmallScreen}
          particleHoverFactor={1.5}
          alphaParticles={false}
          particleBaseSize={isSmallScreen ? 70 : 100}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
