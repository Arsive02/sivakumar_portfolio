import { useState, useEffect } from 'react';
import { Github, Linkedin } from 'lucide-react';
import LossLandscapeGame from './animations/LossLandscape';

const TextSection = () => {
  const skills = [
    'Deep Learning', 
    'Natural Language Processing', 
    'Computer Vision', 
    'Multimodal AI'
  ];

  return (
    <div className="text-section max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Introduction */}
        <div className="lg:col-span-7 space-y-12">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text block">Decoding chaos</span>
              <span className="block mt-2">
                <span className="gradient-text">into elegant </span>
                <span className="equations-text">equations</span>
                <span className="gradient-text">.</span>
              </span>
            </h1>
            
            <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-expand" />
          </div>

          {/* Role & Skills */}
          <div className="space-y-6">
            <p className="text-xl text-gray-300">
              <span className="text-blue-400 font-semibold">
                Data Scientist
                <svg className="inline-block ml-2 w-6 h-6" viewBox="0 0 24 24">
                  <path 
                    className="stroke-current"
                    fill="none" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M3 12h4l3-9 4 18 3-9h4"
                  />
                </svg>
              </span>
            </p>
            
            <div className="space-y-4">
              <p className="text-lg text-gray-400">Specializing in:</p>
              <div className="skills-container">
                {skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="skill-tag"
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <a
              href="https://github.com/Arsive02"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gray-800/50 rounded-lg
                       hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/siva-kumar-5b2527190/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-blue-600/20 rounded-lg
                       hover:bg-blue-600/30 transition-all duration-300 hover:scale-105"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right Column - Loss Landscape */}
        <div className="lg:col-span-5">
          <div className="loss-landscape-container">
            <LossLandscapeGame />
          </div>
          
          <div className="mt-6 bg-gray-900/80 p-6 rounded-lg border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold text-lg mb-3">
              Find the Global Minimum!
            </h3>
            <p className="text-gray-300">
              Guide the ball to the lowest point of the loss landscape.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
              <li>• Use arrow keys or WASD to move the ball</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSection;