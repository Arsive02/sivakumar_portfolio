import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Sparkles } from 'lucide-react';

const TextSection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const skills = ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Multimodal AI'];
  interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
  }

  const [particles, setParticles] = useState<Particle[]>([]);

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
    <section className="max-w-7xl mx-auto mt-12 relative overflow-hidden">
      {/* Particle Effect */}
      <div className="particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Introduction */}
        <div className="space-y-12 relative">
          {/* Main Heading */}
          <div className="relative mb-12">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <div className="mb-2">
                <span className="gradient-text">
                  Decoding chaos
                </span>
              </div>
              <div>
                <span className="gradient-text">into elegant </span>
                <span className="equations-text inline-block">equations</span>
                <span className="gradient-text">.</span>
              </div>
            </h1>
            
            {/* Simple gradient underline */}
            <div className="gradient-underline mt-4 w-full rounded-full" />
          </div>

          {/* Expertise Section */}
          <div className="space-y-6 slide-left opacity-0 delay-2 relative">
            <p className="text-xl text-gray-300">
              <span className="text-blue-400 font-semibold glow">Expertise</span> in Machine Learning
            </p>
            <div className="space-y-2">
              <p className="text-lg text-gray-400">Specializing in:</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="float px-4 py-2 bg-gray-800/50 border border-blue-500/20 rounded-full text-sm
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

          {/* Social Links */}
          <div className="flex space-x-4 slide-up opacity-0 delay-4">
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
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                    GitHub
                  </span>
                  <span className="absolute top-full left-0 inline-block transition-transform duration-300 group-hover:-translate-y-full">
                    GitHub
                  </span>
                </span>
              </div>
              <div className="absolute inset-0 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>

            <a
              href="https://www.linkedin.com/in/siva-kumar-5b2527190/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-blue-600/20 rounded-lg overflow-hidden
                         hover:bg-blue-600/30 transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center space-x-2">
                <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                    LinkedIn
                  </span>
                  <span className="absolute top-full left-0 inline-block transition-transform duration-300 group-hover:-translate-y-full">
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

        {/* Right Column */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default TextSection;