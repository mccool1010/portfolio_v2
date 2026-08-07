import Particles from './Particles';

/**
 * Universal animated background — interactive OGL particle cosmos background.
 * Responsive to mouse and touch interactions across all panels.
 */
export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0a0e1a]"
      aria-hidden="true"
    >
      <Particles
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleColors={['#ffffff', '#22d3ee', '#a855f7']}
        moveParticlesOnHover={true}
        particleHoverFactor={1.5}
        alphaParticles={false}
        particleBaseSize={100}
        sizeRandomness={1}
        cameraDistance={20}
        disableRotation={false}
        className="w-full h-full"
      />
    </div>
  );
}
