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
      
      <div ref={containerRef} className="relative min-h-[120px] p-4 perspective-1000">
        <div className="relative z-10 flex flex-wrap gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill}
              onMouseEnter={() => setActiveSkill(index)}
              onMouseLeave={() => setActiveSkill(-1)}
              className="group relative transition-all duration-500 ease-out cursor-pointer preserve-3d"
            >
              {/* Main container with enhanced 3D effect */}
              <div className={`
                relative px-5 py-2 rounded-lg
                backdrop-blur-xl
                transform-gpu preserve-3d
                transition-all duration-500 ease-out
                border border-zinc-800/10
                shadow-lg shadow-black/20
                ${activeSkill === index ? 
                  'scale-110 rotate-y-12 translate-z-8 bg-gradient-to-br from-blue-900/90 to-indigo-500/90 border-blue-600/20' : 
                  'hover:scale-105 hover:rotate-y-6 hover:translate-z-4 bg-gradient-to-br from-zinc-900/90 to-neutral-900/90 hover:from-blue-600/80 hover:to-indigo-500/80 hover:border-blue-500/20'}
              `}>
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-zinc-500/5 to-neutral-500/5" />

                {/* Data flow animation */}
                <div className={`
                  absolute inset-0 overflow-hidden rounded-lg
                  ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
                  transition-opacity duration-500
                `}>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-400/5 via-zinc-400/5 to-neutral-400/5" />
                  <div className="absolute h-[600%] w-4 bg-white/[0.02] -skew-x-[45deg] 
                                animate-[dataflow_2s_linear_infinite]" />
                </div>

                {/* Neural pulse effect */}
                <div className={`
                  absolute inset-0 rounded-lg
                  transition-opacity duration-300 ease-in-out
                  bg-gradient-to-r from-zinc-400/0 via-neutral-400/5 to-zinc-400/0
                  ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
                `} />

                {/* Text content */}
                <span className={`
                  relative z-10 text-sm font-medium tracking-wide
                  transition-colors duration-300
                  ${activeSkill === index ? 'text-blue-100' : 'text-neutral-400 group-hover:text-blue-100'}
                `}>
                  {skill}
                </span>

                {/* Bottom highlight */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-[1px]
                  bg-gradient-to-r from-transparent via-blue-500/20 to-transparent
                  transition-opacity duration-300
                  ${activeSkill === index ? 'opacity-100' : 'opacity-0'}
                `} />

                {/* 3D lighting effect */}
                <div className={`
                  absolute inset-0 rounded-lg
                  bg-gradient-to-tr from-black/0 via-zinc-100/5 to-neutral-100/5
                  transition-opacity duration-500
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