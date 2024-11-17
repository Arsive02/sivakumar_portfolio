import React from 'react';

interface TooltipProps {
  isVisible: boolean;
}

const MobiusTooltip: React.FC<TooltipProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div 
      className={`
        absolute left-1/2 top-full mt-2
        w-64 bg-gray-900/95 backdrop-blur-sm
        border border-blue-500/20 rounded-lg p-4 
        transform transition-all duration-200 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 -translate-x-1/2' : 'opacity-0 -translate-y-1 -translate-x-1/2 pointer-events-none'}
        z-[100]
      `}
      role="tooltip"
    >
      {/* Arrow */}
      <div 
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2"
        aria-hidden="true"
      >
        <div 
          className="w-4 h-4 bg-gray-900/95 border-t border-l border-blue-500/20 
                     rotate-45 transform-gpu"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">
          Topology in Manifold Learning
        </h3>
        
        <p className="text-xs text-gray-300 leading-relaxed">
          Like a Möbius strip's continuous surface, manifold learning reveals how high-dimensional data lies on curved geometric structures.
        </p>
      </div>
      
      {/* Gradient border */}
      <div 
        className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-500/10 
                   via-purple-500/10 to-blue-500/10 opacity-50 animate-gradient"
        aria-hidden="true"
      />
    </div>
  );
};

export default MobiusTooltip;