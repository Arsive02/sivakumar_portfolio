import React, { useState, useEffect } from 'react';
import { 
  Layers, Cpu, GraduationCapIcon, Trophy, 
  Book, GamepadIcon
} from 'lucide-react';

interface TesseractProps {
  isOpen: boolean;
}

const Tesseract: React.FC<TesseractProps> = ({ isOpen }) => {
  const [rotation, setRotation] = useState({ x: 45, y: 45, z: 45 });
  
  // Animation loop for continuous rotation
  useEffect(() => {
    let frame: number;
    let startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const delta = (now - startTime) * 0.003; // seconds
      
      setRotation({
        x: 45 + Math.sin(delta * 0.5) * 15,
        y: 45 + Math.cos(delta * 0.5) * 15,
        z: 45 + Math.sin(delta * 0.3) * 10
      });

      frame = requestAnimationFrame(animate);
    };

    if (!isOpen) {
      frame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Generate tesseract vertices
  const size = 12;
  const innerSize = size * 0.6;
  
  // Outer cube vertices
  const outerCube = [
    [-size, -size, -size], // 0
    [size, -size, -size],  // 1
    [size, size, -size],   // 2
    [-size, size, -size],  // 3
    [-size, -size, size],  // 4
    [size, -size, size],   // 5
    [size, size, size],    // 6
    [-size, size, size],   // 7
  ];

  // Inner cube vertices
  const innerCube = [
    [-innerSize, -innerSize, -innerSize], // 8
    [innerSize, -innerSize, -innerSize],  // 9
    [innerSize, innerSize, -innerSize],   // 10
    [-innerSize, innerSize, -innerSize],  // 11
    [-innerSize, -innerSize, innerSize],  // 12
    [innerSize, -innerSize, innerSize],   // 13
    [innerSize, innerSize, innerSize],    // 14
    [-innerSize, innerSize, innerSize],   // 15
  ];

  // Project 3D point to 2D
  const project = (point: number[]): [number, number] => {
    const [x, y, z] = point;
    
    // Apply rotation
    const rx = rotation.x * Math.PI / 180;
    const ry = rotation.y * Math.PI / 180;
    const rz = rotation.z * Math.PI / 180;
    
    // Rotate around X
    let x1 = x;
    let y1 = y * Math.cos(rx) - z * Math.sin(rx);
    let z1 = y * Math.sin(rx) + z * Math.cos(rx);
    
    // Rotate around Y
    let x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
    let y2 = y1;
    let z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
    
    // Rotate around Z
    let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
    
    const scale = 1000 / (1000 - z2);
    return [x3 * scale + 20, y3 * scale + 20];
  };

  // Define edges
  const edges = [
    // Outer cube edges
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
    // Inner cube edges
    [8, 9], [9, 10], [10, 11], [11, 8],
    [12, 13], [13, 14], [14, 15], [15, 12],
    [8, 12], [9, 13], [10, 14], [11, 15],
    // Connections between cubes
    [0, 8], [1, 9], [2, 10], [3, 11],
    [4, 12], [5, 13], [6, 14], [7, 15]
  ];

  return (
    <svg 
      viewBox="0 0 40 40"
      className={`w-full h-full transition-transform duration-500
                 ${isOpen ? 'rotate-180' : 'hover:scale-110'}`}
    >
      <defs>
        <linearGradient id="tesseractGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Draw edges */}
      {edges.map(([i, j], index) => {
        const start = project(i < 8 ? outerCube[i] : innerCube[i - 8]);
        const end = project(j < 8 ? outerCube[j] : innerCube[j - 8]);
        
        return (
          <line
            key={index}
            x1={start[0]}
            y1={start[1]}
            x2={end[0]}
            y2={end[1]}
            stroke="url(#tesseractGradient)"
            strokeWidth="0.5"
            className="transition-all duration-300"
            style={{
              opacity: isOpen ? (1 - index / edges.length) : 1
            }}
          />
        );
      })}

      {/* Draw vertices */}
      {[...outerCube, ...innerCube].map((vertex, index) => {
        const [x, y] = project(vertex);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="0.8"
            fill="#8B5CF6"
            className="transition-all duration-300"
            style={{
              opacity: isOpen ? 0.5 : 0.8
            }}
          />
        );
      })}
    </svg>
  );
};


interface GraphNodeNavProps {
  onSelect: (id: string) => void;
}

const GraphNodeNav: React.FC<GraphNodeNavProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setActiveNode] = useState('');

  const navItems = [
    {
      id: 'projects',
      label: 'Projects',
      icon: Layers,
      color: 'from-blue-500 to-indigo-500'  // Deep blue to rich indigo
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Cpu,
      color: 'from-indigo-500 to-purple-500'  // Rich indigo to deep purple
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCapIcon,
      color: 'from-purple-500 to-violet-500'  // Deep purple to vibrant violet
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      color: 'from-violet-500 to-fuchsia-500'  // Vibrant violet to bright fuchsia
    },
    {
      id: 'hobbies',
      label: 'Hobbies',
      icon: GamepadIcon,
      color: 'from-fuchsia-500 to-blue-500'  // Bright fuchsia back to deep blue
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Book,
      color: 'from-blue-500 to-indigo-500'  // Completing the cycle
    }
  ];
  
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-lg
                 bg-gray-900/90 border border-blue-500/20 
                 hover:bg-blue-500/10 flex items-center justify-center group
                 transition-all duration-300"
      >
        <Tesseract isOpen={isOpen} />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-full right-0 mt-2 w-56
                   bg-gray-900/95 backdrop-blur-xl rounded-lg
                   border border-blue-500/20 shadow-xl
                   transition-all duration-300 origin-top
                   ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
      >
        <div className="relative py-2">
          {/* Connection Lines */}
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ height: `${navItems.length * 48}px` }}
          >
            <defs>
              <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2DD4BF" />
              </linearGradient>
            </defs>
            {/* Main vertical line */}
            <line
              x1="24"
              y1="0"
              x2="24"
              y2={navItems.length * 48}
              stroke="url(#nodeGradient)"
              strokeWidth="2"
              strokeDasharray="4,4"
              className={`transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
              style={{
                animation: isOpen ? 'expandLine 0.5s ease-out forwards' : 'none'
              }}
            />
          </svg>

          {/* Menu Items */}
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNode(item.id);
                  onSelect(item.id);
                  setIsOpen(false);
                }}
                className="relative w-full px-3 py-0 flex items-center space-x-3
                         hover:bg-blue-500/5 group perspective-1000
                         transition-all duration-300"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {/* 3D Container */}
                <div className="flex items-center space-x-3 w-full p-2 rounded-lg
                              transform-gpu transition-all duration-300 group-hover:shadow-lg
                              bg-gradient-to-r from-transparent to-transparent
                              group-hover:from-blue-500/5 group-hover:to-purple-500/5">
                  {/* Item Icon with 3D effect */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                  bg-gradient-to-r ${item.color} shadow-lg
                                   duration-300
                                  group-hover:[transform:rotateX(-10deg)_rotateY(10deg)]`}>
                    <Icon className="w-4 h-4 text-white transform-gpu transition-transform duration-300
                                   group-hover:[transform:translateZ(10px)]" />
                  </div>

                  {/* Label with 3D effect */}
                  <span className="text-sm text-gray-300 transition-all duration-300
                                 group-hover:text-white transform-gpu
                                 group-hover:[transform:translateZ(10px)]">
                    {item.label}
                  </span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                                bg-gradient-to-r from-blue-500/10 to-purple-500/10
                                blur-xl transition-opacity duration-300 -z-10" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes dropThread {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
          }
          @keyframes expandLine {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
          }
        `}
      </style>
    </div>
  );
};

export default GraphNodeNav;