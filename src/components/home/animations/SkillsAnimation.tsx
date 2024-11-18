import { useState, useEffect, useRef } from 'react';

interface SkillsAnimationProps {
  skills: string[];
}

const SkillsAnimation = ({ skills }: SkillsAnimationProps) => {
  const [activeSkill, setActiveSkill] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }
  
  const [particles, setParticles] = useState<Particle[]>([]);

  // Neural connection effect
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;
    
    const points = skills.map((_) => ({
      x: 0,
      y: 0,
      connections: []
    }));

    const updateConnections = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const elements = containerRef.current.querySelectorAll('.skill-tag');
      
      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        // Calculate positions relative to container
        points[i].x = rect.left - containerRect.left + rect.width / 2;
        points[i].y = rect.top - containerRect.top + rect.height / 2;
      });

      // Update canvas size and position
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.pointerEvents = 'none';
      
      if (!containerRef.current.contains(canvas)) {
        containerRef.current.appendChild(canvas);
      }

      // Clear canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        points.forEach((point, i) => {
          points.forEach((otherPoint, j) => {
            if (i !== j) {
              const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
              if (distance < 200) {
                const opacity = (1 - distance / 200) * 0.2;
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(otherPoint.x, otherPoint.y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });
        });
      }

      animationFrameId = requestAnimationFrame(updateConnections);
    };

    updateConnections();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    };
  }, [skills]);

  const createParticle = (x: number, y: number): Particle => {
    return {
      id: Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.02
          }))
          .filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    setActiveSkill(index);
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = (e.target as HTMLDivElement).getBoundingClientRect();
    
    // Calculate position relative to container
    const relativeX = targetRect.left - containerRect.left;
    const relativeY = targetRect.top - containerRect.top;
    
    const newParticles = Array.from({ length: 5 }, () => 
      createParticle(
        relativeX + targetRect.width * Math.random(),
        relativeY + targetRect.height * Math.random()
      )
    );
    setParticles(prev => [...prev, ...newParticles]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-lg text-gray-400">
        <p>Specializing in:</p>
      </div>
      
      <div ref={containerRef} className="skills-container relative">
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-blue-500"
            style={{
              left: particle.x + 'px',
              top: particle.y + 'px',
              opacity: particle.life,
              transform: `scale(${particle.life})`,
              transition: 'transform 0.16s linear'
            }}
          />
        ))}

        {/* Skills */}
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={skill}
              className={`
                skill-tag relative px-4 py-2 bg-gray-800/50 
                border border-blue-500/20 rounded-full text-sm
                transition-all duration-300 cursor-pointer
                hover:border-blue-500/40 hover:bg-gray-800/80
                ${activeSkill === index ? 'scale-110' : 'scale-100'}
              `}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={() => setActiveSkill(-1)}
            >

              {/* Neural network effect */}
              <div className={`
                absolute inset-0 rounded-full bg-gradient-to-r 
                from-blue-500/0 via-blue-500/30 to-purple-500/0
                transition-opacity duration-500
                ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
              `} />

              {/* Text content */}
              <span className="relative z-10 font-medium">
                {skill}
              </span>

              {/* Data stream effect */}
              <div className={`
                absolute inset-0 overflow-hidden rounded-full
                ${activeSkill === index ? 'before:animate-neural-pulse' : ''}
                before:absolute before:inset-0 before:bg-gradient-to-r
                before:from-transparent before:via-blue-500/20 before:to-transparent
                before:skew-x-12 before:-translate-x-full
              `} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsAnimation;