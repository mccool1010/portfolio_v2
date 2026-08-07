import { useState } from 'react';
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

  return (
    <div className="relative aspect-[16/10] bg-surface-200 rounded-xl overflow-hidden group">
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
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? 'bg-accent-cyan w-4'
                  : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
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
