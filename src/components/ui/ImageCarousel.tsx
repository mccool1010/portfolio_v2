import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import type { ProjectMedia } from '../../data/projectData';

interface ImageCarouselProps {
  media: ProjectMedia[];
  projectName: string;
}

/**
 * Lightweight image/video carousel for the expanded project viewer.
 * Supports images, GIFs (autoplay), and videos (embedded player).
 */
export default function ImageCarousel({ media, projectName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Reset to the first slide whenever a different project's media is shown
  useEffect(() => {
    setCurrentIndex(0);
  }, [media]);

  // If no media, show placeholder
  if (media.length === 0) {
    return (
      <div className="relative aspect-[16/10] bg-gradient-to-br from-surface-200 to-surface-300 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="text-center text-gray-500 p-6">
          <Maximize2 size={40} className="mx-auto mb-3 text-gray-600" />
          <p className="text-sm font-medium">Project Screenshots</p>
          <p className="text-xs mt-1 text-gray-600">Add images to /assets/projects/{projectName}</p>
        </div>
      </div>
    );
  }

  const current = media[currentIndex];
  const hasMultiple = media.length > 1;

  const goNext = () => setCurrentIndex((i) => (i + 1) % media.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + media.length) % media.length);

  // Swipe between slides on touch devices
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || !hasMultiple) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <div
      className="relative aspect-[16/10] bg-surface-200 rounded-xl overflow-hidden group select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${projectName} screenshots`}
    >
      {/* Current media item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {current.type === 'video' ? (
            <video
              src={current.src}
              controls
              className="w-full h-full object-contain bg-black"
              aria-label={current.alt}
            />
          ) : (
            <img
              src={current.src}
              alt={current.alt}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          {/* Always visible on touch (no hover to reveal them); fade-in on pointer devices */}
          <button
            onClick={goPrev}
            className="carousel-arrow absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="carousel-arrow absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide counter — orientation on a small screen */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm tabular-nums">
            {currentIndex + 1} / {media.length}
          </div>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center">
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              // Small dot, generous invisible tap target around it
              className="grid place-items-center w-6 h-9 group/dot"
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === currentIndex}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'bg-accent-cyan w-4'
                    : 'bg-white/40 w-1.5 group-hover/dot:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Media type indicator */}
      {current.type === 'gif' && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm">
          GIF
        </div>
      )}
      {current.type === 'video' && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm flex items-center gap-1">
          <Play size={10} /> VIDEO
        </div>
      )}
    </div>
  );
}
