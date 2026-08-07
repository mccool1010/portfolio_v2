import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Duration per character (seconds) */
  charDuration?: number;
  /** Stagger between characters (seconds) */
  stagger?: number;
}

/**
 * Text reveal animation — letters animate in once when visible.
 * Uses IntersectionObserver so it only plays when scrolled into view.
 */
export default function TextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  charDuration = 0.4,
  stagger = 0.03,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (hasPlayed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasPlayed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasPlayed]);

  // Split text into words, then characters within words
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <div ref={ref} aria-label={text}>
      <Tag className={className}>
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split('').map((char) => {
              const idx = charIndex++;
              return (
                <motion.span
                  key={`${wordIdx}-${idx}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={
                    isVisible
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : {}
                  }
                  transition={{
                    duration: charDuration,
                    delay: delay / 1000 + idx * stagger,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {/* Add space between words */}
            {wordIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  );
}
