import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isActive, onTransitionComplete }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        onTransitionComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onTransitionComplete]);

  if (!isActive && !isTransitioning) return null;

  return (
    <div className="transition-container">
      {/* Star field */}
      <div className="star-field">
        {Array.from({ length: 300 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Vignette overlay for depth effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black to-black opacity-70" />
    </div>
  );
};

export default PageTransition;