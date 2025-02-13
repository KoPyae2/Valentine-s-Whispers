import { useEffect, useState, useRef } from 'react';

interface Heart {
  id: string;
  left: number;
  bottom: number;
  animationDuration: number;
  delay: number;
  size: number;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const heartCounter = useRef(0);

  useEffect(() => {
    const createHeart = () => {
      const id = `heart-${Date.now()}-${heartCounter.current++}`;
      const left = Math.random() * 100; // Random horizontal position (0-100%)
      const bottom = -10 - Math.random() * 90; // Start below screen (-10% to -100%)
      const size = 10 + Math.random() * 15; // Random size between 10-25px
      const animationDuration = 4 + Math.random() * 4; // 4-8s
      const delay = Math.random() * 2; // 0-2s delay

      setHearts(prev => [...prev, { id, left, bottom, size, animationDuration, delay }]);

      // Remove heart after animation completes
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== id));
      }, (animationDuration + delay) * 1000);
    };

    // Create initial hearts
    for (let i = 0; i < 15; i++) {
      createHeart();
    }

    // Create new hearts periodically
    const interval = setInterval(createHeart, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-hearts">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            bottom: `${heart.bottom}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animation: `float ${heart.animationDuration}s ease-in ${heart.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
} 