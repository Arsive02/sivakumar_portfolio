import { useState, useEffect } from 'react';
import { Github, Linkedin } from 'lucide-react';
import LossLandscapeGame from './animations/LossLandscape';
import "../../styles/home/components/lossfunction.css";

const TextSection = () => {
  const skills = [
    'Deep Learning', 
    'Natural Language Processing', 
    'Computer Vision', 
    'Multimodal AI'
  ];
  
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; }[]>([]);

  particles.forEach(particle => {
    const particleEl = document.createElement('div');
    particleEl.className = 'particle';
    particleEl.style.left = `${particle.x}%`;
    particleEl.style.top = `${particle.y}%`;
    particleEl.style.width = `${particle.size}px`;
    particleEl.style.height = `${particle.size}px`;
    particleEl.style.animationDuration = `${particle.duration}s`;
    document.body.appendChild(particleEl);
    setTimeout(() => {
      particleEl.remove();
    }, particle.duration * 1000);
  });

  // Particle effect
  useEffect(() => {
    const createParticle = () => {
      const particle = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        duration: Math.random() * 2 + 2
      };
      setParticles(prev => [...prev, particle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }, particle.duration * 1000);
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto mt-12 relative overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
      
      <div className="grid grid-cols-12 gap-12 items-start relative">
        {/* Left Column - Introduction */}
        <div className="col-span-12 lg:col-span-7 space-y-12 relative z-10">
          {/* Main Heading with Animation */}
          <div className="relative">
            <h1 className="text-2xl md:text-6xl font-bold leading-tight">
              <div className="overflow-hidden">
                <span className="block transform transition-transform duration-1000 translate-y-0 opacity-100">
                  <span className="gradient-text">Decoding chaos</span>
                </span>
              </div>
              <div className="overflow-hidden mt-2">
                <span className="block transform transition-transform duration-1000 delay-300 translate-y-0 opacity-100">
                  <span className="gradient-text">into elegant </span>
                  <span className="equations-text inline-block">equations</span>
                  <span className="gradient-text">.</span>
                </span>
              </div>
            </h1>
            
            {/* Animated underline */}
            <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-500 mt-4 animate-expand" />
          </div>

          {/* Expertise Section with Fade-in Animation */}
          <div className="space-y-6 opacity-0 animate-fadeIn animation-delay-500">
            <p className="text-xl text-gray-300">
              <span className="neural-text text-blue-400 font-semibold group">
                Data Scientist
                <svg className="inline-block ml-2 w-6 h-6" viewBox="0 0 24 24">
                  <path 
                    className="stroke-current animate-draw"
                    fill="none" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M3 12h4l3-9 4 18 3-9h4"
                  />
                </svg>
              </span>
            </p>
            
            {/* Skills with Floating Animation */}
            <div className="space-y-2">
              <p className="text-lg text-gray-400">Specializing in:</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-gray-800/50 border border-blue-500/20 rounded-full text-sm
                             hover:bg-gray-800/80 hover:border-blue-500/40 transition-all duration-300
                             hover:scale-105 transform cursor-default group"
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: `${3 + index * 0.5}s`
                    }}
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-purple-500/0 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links with Hover Effects */}
          <div className="flex space-x-4 opacity-0 animate-fadeIn animation-delay-700">
            <a
              href="https://github.com/Arsive02"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-gray-800/50 rounded-lg overflow-hidden
                       hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center space-x-2">
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    GitHub
                  </span>
                  <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
                    GitHub
                  </span>
                </span>
              </div>
              <div className="absolute inset-0 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>

            <a
              href="https://www.linkedin.com/in/sivakumar-ramakrishnan"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-blue-600/20 rounded-lg overflow-hidden
                       hover:bg-blue-600/30 transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center space-x-2">
                <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    LinkedIn
                  </span>
                  <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
                    LinkedIn
                  </span>
                </span>
              </div>
              <div className="absolute inset-0 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </div>
        </div>

        {/* Right Column - Loss Landscape Game */}
        <div className="col-span-12 lg:col-span-5 relative min-h-[500px] opacity-0 animate-fadeIn animation-delay-1000">
          <div className="sticky top-24">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <LossLandscapeGame />
              </div>
              {/* Game Instructions */}
              <div className="absolute top-4 right-4 bg-gray-900/80 p-4 rounded-lg border border-blue-500/20">
                <h3 className="text-blue-400 font-semibold mb-2">Find the Global Minimum!</h3>
                <p className="text-gray-300 text-sm">Guide the ball to the lowest point of the loss landscape.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextSection;