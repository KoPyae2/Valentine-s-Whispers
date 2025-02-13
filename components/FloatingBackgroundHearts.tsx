'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FloatingHeart {
  id: number;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  rotation: number;
  color: string;
}

const colors = [
  'text-pink-400/50',
  'text-pink-300/50',
  'text-rose-400/50',
  'text-purple-400/50',
  'text-red-400/50'
];

export default function FloatingBackgroundHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // Create initial hearts
    const initialHearts = Array.from({ length: 20 }, (_, i) => createHeart(i));
    setHearts(initialHearts);

    // Add new hearts periodically
    const interval = setInterval(() => {
      setHearts(prev => {
        // Remove hearts that have completed their animation
        const activeHearts = prev.filter(heart => 
          Date.now() - heart.id < (heart.duration + heart.delay) * 1000
        );
        
        // Add a new heart
        return [...activeHearts, createHeart(Date.now())];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  function createHeart(id: number): FloatingHeart {
    const startX = Math.random() * 100; // Random horizontal position (0-100%)
    const startY = Math.random() * 100; // Random vertical position (0-100%)

    return {
      id,
      startX,
      endX: startX + (Math.random() * 40 - 20), // Drift left or right by up to 20%
      startY,
      endY: startY - (Math.random() * 50 + 50), // Move upward by 50-100% of screen
      size: Math.random() * 30 + 15, // Random size (15-45px)
      delay: Math.random() * 3, // Random delay (0-3s)
      duration: Math.random() * 6 + 8, // Random duration (8-14s)
      opacity: Math.random() * 0.5 + 0.2, // Random opacity (0.2-0.7)
      rotation: Math.random() * 360, // Random rotation (0-360deg)
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{
              opacity: 0,
              left: `${heart.startX}%`,
              top: `${heart.startY}%`,
              rotate: heart.rotation,
              scale: 0
            }}
            animate={{
              opacity: heart.opacity,
              left: `${heart.endX}%`,
              top: `${heart.endY}%`,
              rotate: heart.rotation + (Math.random() > 0.5 ? 360 : -360),
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              top: '-10%'
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: [0.21, 0.53, 0.29, 0.8]
            }}
            className={`absolute ${heart.color}`}
            style={{
              width: heart.size,
              height: heart.size
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Heart className="w-full h-full drop-shadow-lg" fill="currentColor" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
