import { useState, useEffect, useRef } from 'react';

interface SkillsAnimationProps {
  skills: string[];
}

const SkillsAnimation = ({ skills }: SkillsAnimationProps) => {
  const [activeSkill, setActiveSkill] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Neural network canvas effect
  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    containerRef.current.appendChild(canvas);

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const numNodes = 50;
    const nodeRadius = 1;
    const maxDistance = 100;

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    function resizeCanvas() {
      canvas.width = containerRef.current?.offsetWidth || 0;
      canvas.height = containerRef.current?.offsetHeight || 0;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let time = 0;

    function animate() {
      if (!ctx) return;
      time += 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.fill();
      });

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);

            // Create wave effect in connections
            const midX = (node.x + otherNode.x) / 2;
            const midY = (node.y + otherNode.y) / 2;
            const waveOffset = Math.sin(time * 5 + i) * 5;
            
            ctx.quadraticCurveTo(
              midX + waveOffset,
              midY + waveOffset,
              otherNode.x,
              otherNode.y
            );

            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(147, 51, 234, ${opacity})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-lg font-light tracking-wide text-gray-400/80">
        Specializing in:
      </p>
      
      <div ref={containerRef} className="relative min-h-[120px] p-4">
        <div className="relative z-10 flex flex-wrap gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill}
              onMouseEnter={() => setActiveSkill(index)}
              onMouseLeave={() => setActiveSkill(-1)}
              className={`
                group relative
                transition-all duration-500 ease-out
                cursor-pointer overflow-hidden
              `}
            >
              {/* Main container with pseudo-3D effect */}
              <div className={`
                relative px-5 py-2 rounded-lg
                bg-gradient-to-br from-gray-900/80 to-gray-800/80
                backdrop-blur-md
                transform perspective-1000
                transition-all duration-500
                border border-white/[0.08]
                ${activeSkill === index ? 'scale-110 -translate-y-1' : 'hover:scale-105'}
              `}>
                {/* Data flow animation */}
                <div className={`
                  absolute inset-0 overflow-hidden rounded-lg
                  ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
                  transition-opacity duration-500
                `}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
                  <div className="absolute h-[600%] w-4 bg-white/[0.02] -skew-x-[45deg] 
                                animate-[dataflow_2s_linear_infinite]" />
                </div>

                {/* Neural pulse effect */}
                <div className={`
                  absolute inset-0 rounded-lg
                  transition-opacity duration-300 ease-in-out
                  bg-gradient-to-r from-blue-600/0 via-purple-600/10 to-blue-600/0
                  ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
                `} />

                {/* Text content */}
                <span className={`
                  relative z-10 text-sm font-medium tracking-wide
                  transition-colors duration-300
                  ${activeSkill === index ? 'text-white' : 'text-white/80'}
                `}>
                  {skill}
                </span>

                {/* Bottom highlight */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-[1px]
                  bg-gradient-to-r from-transparent via-blue-500/50 to-transparent
                  transition-opacity duration-300
                  ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
                `} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsAnimation;