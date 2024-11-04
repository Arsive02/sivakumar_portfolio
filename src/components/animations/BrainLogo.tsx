import React, { useState } from 'react';
import { Brain } from 'lucide-react';

const BrainLogo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      {/* Neural connection dots */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute h-2 w-2 bg-blue-400 rounded-full animate-ping" 
             style={{ left: '15%', top: '25%', animationDelay: '0ms' }} />
        <div className="absolute h-2 w-2 bg-purple-400 rounded-full animate-ping"
             style={{ left: '75%', top: '15%', animationDelay: '100ms' }} />
        <div className="absolute h-2 w-2 bg-cyan-400 rounded-full animate-ping"
             style={{ left: '65%', top: '75%', animationDelay: '200ms' }} />
        <div className="absolute h-1.5 w-1.5 bg-indigo-400 rounded-full animate-ping"
             style={{ left: '25%', top: '65%', animationDelay: '300ms' }} />
      </div>

      {/* Pulse ring */}
      <div className={`absolute inset-0 transition-all duration-500 ease-out
                      ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}>
        <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-ping" />
        <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full animate-ping"
             style={{ animationDelay: '200ms' }} />
      </div>

      {/* Neural connection lines */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
          <path 
            d="M8 8 L24 24 M24 8 L8 24 M16 4 L16 28 M4 16 L28 16" 
            stroke="url(#neuron-gradient)"
            strokeWidth="0.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: isHovered ? 0 : 100,
              transition: 'stroke-dashoffset 1000ms ease-out'
            }}
          />
          <defs>
            <linearGradient id="neuron-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.5)" />
              <stop offset="50%" stopColor="rgba(167, 139, 250, 0.5)" />
              <stop offset="100%" stopColor="rgba(96, 165, 250, 0.5)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main brain icon */}
      <div className={`transform transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
        <Brain 
          className={`w-8 h-8 transition-all duration-500 ${isHovered ? 'text-blue-400' : 'text-blue-500'}`}
          style={{
            filter: isHovered ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))' : 'none'
          }}
        />
      </div>

      {/* Glowing background */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md
                      transition-opacity duration-500 -z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default BrainLogo;