import React from 'react';

interface TooltipProps {
  isVisible: boolean;
}

const MobiusTooltip: React.FC<TooltipProps> = ({ isVisible }) => {
  return (
    <div 
      className={`
        absolute left-1/2 -translate-x-1/2 top-full mt-4
        w-64 bg-gray-900 border border-blue-500/20 rounded-lg p-4 
        transform transition-all duration-300 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        z-50 pointer-events-none
      `}
    >
      {/* Arrow pointing up */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1">
        <div className="w-2 h-2 bg-gray-900 border-t border-l border-blue-500/20 -rotate-45" />
      </div>
      
      <h3 className="text-sm font-semibold text-blue-400 mb-2">
        Topology in Manifold Learning
      </h3>
      
      <p className="text-xs text-gray-300 leading-relaxed">
        Like a Möbius strip's continuous surface, manifold learning reveals how high-dimensional data lies on curved geometric structures.
      </p>
      
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-lg opacity-50 animate-gradient" />
    </div>
  );
};

export default MobiusTooltip;