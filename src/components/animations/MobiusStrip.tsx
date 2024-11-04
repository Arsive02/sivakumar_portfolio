import React, { useState, useEffect } from 'react';

const MobiusStrip = () => {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.8) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate points for full surface with higher resolution
  const generateStripPoints = () => {
    const strips = [];
    const uSegments = 80; // doubled for smoother curve
    const vSegments = 20; // doubled for smoother surface
    
    for (let u = 0; u <= uSegments; u++) {
      const strip = [];
      const theta = (u / uSegments) * 2 * Math.PI;
      
      for (let v = 0; v <= vSegments; v++) {
        const t = (v / vSegments - 0.5) * 2;
        const r = 20;
        const w = 10;
        
        // Enhanced parametric equations for smoother surface
        const x = (r + w * t * Math.cos(theta/2)) * Math.cos(theta);
        const y = (r + w * t * Math.cos(theta/2)) * Math.sin(theta);
        const z = w * t * Math.sin(theta/2);
        
        strip.push({ x, y, z });
      }
      strips.push(strip);
    }
    return strips;
  };

  // Enhanced 3D projection with better perspective
  const projectPoint = (point: { x: any; y: any; z: any; }) => {
    const angle = (rotation * Math.PI) / 180;
    const angleY = (rotation * Math.PI) / 360;
    const tilt = Math.PI / 6; // Add slight tilt
    
    // Rotate around Y axis
    const y1 = point.y * Math.cos(angleY) - point.z * Math.sin(angleY);
    const z1 = point.y * Math.sin(angleY) + point.z * Math.cos(angleY);
    
    // Add tilt
    const x2 = point.x;
    const y2 = y1 * Math.cos(tilt) - z1 * Math.sin(tilt);
    const z2 = y1 * Math.sin(tilt) + z1 * Math.cos(tilt);
    
    // Rotate around Z axis
    const x3 = x2 * Math.cos(angle) - z2 * Math.sin(angle);
    const z3 = x2 * Math.sin(angle) + z2 * Math.cos(angle);
    
    // Enhanced perspective projection
    const scale = 1.8;
    const perspective = 500;
    const pScale = perspective / (perspective + z3);
    
    return {
      x: x3 * scale * pScale + 40,
      y: y2 * scale * pScale + 40,
      z: z3
    };
  };

  const strips = generateStripPoints();
  const projectedStrips = strips.map(strip => 
    strip.map(point => projectPoint(point))
  );

  // Generate path data with enhanced shading
  const pathsData = [];
  for (let i = 0; i < projectedStrips.length - 1; i++) {
    for (let j = 0; j < projectedStrips[i].length - 1; j++) {
      const p1 = projectedStrips[i][j];
      const p2 = projectedStrips[i + 1][j];
      const p3 = projectedStrips[i + 1][j + 1];
      const p4 = projectedStrips[i][j + 1];
      
      // Calculate surface normal
      const normal = {
        x: (p2.y - p1.y) * (p4.z - p1.z) - (p2.z - p1.z) * (p4.y - p1.y),
        y: (p2.z - p1.z) * (p4.x - p1.x) - (p2.x - p1.x) * (p4.z - p1.z),
        z: (p2.x - p1.x) * (p4.y - p1.y) - (p2.y - p1.y) * (p4.x - p1.x)
      };
      
      // Enhanced backface culling
      if (normal.z < 0) {
        // Calculate lighting with enhanced ambient and specular components
        const normalLength = Math.sqrt(
          normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
        );
        const lightDir = { x: 0.5, y: -0.5, z: -1 }; // Angled light source
        const lightLength = Math.sqrt(
          lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z
        );
        
        let lightIntensity = Math.abs(
          (normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z) /
          (normalLength * lightLength)
        );
        
        // Add ambient light
        lightIntensity = 0.3 + (lightIntensity * 0.7);
        
        // Dark golden color calculation
        const baseColor = Math.floor(lightIntensity * 100);
        const color = {
          r: Math.min(255, baseColor * 1.2),  // Enhanced red for gold
          g: Math.min(255, baseColor * 0.8),  // Moderate green for darker gold
          b: baseColor * 0.2   // Minimal blue for warm tone
        };
        
        pathsData.push({
          path: `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y}Z`,
          color: `rgb(${color.r},${color.g},${color.b})`,
          z: (p1.z + p2.z + p3.z + p4.z) / 4
        });
      }
    }
  }

  // Sort faces by z-index with enhanced precision
  pathsData.sort((a, b) => b.z - a.z);

  return (
    <div className="relative group ml-6" // Added margin-left for spacing
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      <svg 
        viewBox="0 0 80 80" 
        className="w-12 h-12"
      >
        <defs>
          <linearGradient id="strip-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(184, 134, 11, 0.1)" />
            <stop offset="100%" stopColor="rgba(184, 134, 11, 0.3)" />
          </linearGradient>
        </defs>
        {pathsData.map((data, i) => (
          <path
            key={i}
            d={data.path}
            fill={data.color}
            stroke="rgba(218, 165, 32, 0.5)"
            strokeWidth="0.15"
            className="transition-colors duration-300"
          />
        ))}
      </svg>
      
      {isHovered && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 p-4 w-72 bg-gray-800/95 text-white text-sm rounded-lg shadow-xl z-50 border border-blue-500/20 backdrop-blur-sm">
          <div className="text-blue-400 font-semibold mb-2">Manifolds in Deep Learning</div>
          <p className="text-gray-300 text-xs leading-relaxed">
            Neural networks learn to map data that lies on complex manifolds - curved surfaces in high-dimensional space. Like this Möbius strip, manifolds can have intricate topological properties. Understanding these manifolds helps us grasp how deep learning models transform and structure data through their layers.
          </p>
        </div>
      )}
    </div>
  );
};

export default MobiusStrip;