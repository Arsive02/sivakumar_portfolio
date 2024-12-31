import { Github, Linkedin } from 'lucide-react';
import LossLandscapeGame from './animations/LossLandscape';
import SkillsAnimation from './animations/SkillsAnimation';

const DataScientistTitle = () => {
  return (
    <div className="space-y-6">
      <div className="relative inline-block">
        <p className="text-xl relative group">
          {/* Main text with modern gradient and animation */}
          <span className="relative inline-block font-bold tracking-wide cursor-default">
            {/* Glowing background that appears on hover */}
            <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-blue-600/20 to-indigo-500/20 group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
            
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-400 
                           group-hover:w-full transition-all duration-700 ease-in-out" />
            
            {/* Text with gradient */}
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 
                           hover:from-blue-300 hover:to-indigo-300 transition-all duration-500">
              DATA SCIENTIST
            </span>
          </span>
        </p>
      </div>
    </div>
  );
};

const TextSection = () => {
  const skills = [
    'Deep Learning', 
    'Natural Language Processing', 
    'Computer Vision', 
    'Multimodal AI',
    'Quantum Computing',
  ];

  return (
    <div className="text-section max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Introduction */}
        <div className="lg:col-span-7 space-y-12">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text">Decoding chaos</span>
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
            {/* Data Scientist Title */}
            <DataScientistTitle />
            
            {/* Integrated SkillsAnimation component */}
            <SkillsAnimation skills={skills} />
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
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
              href="https://www.linkedin.com/in/siva-kumar-5b2527190/"
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

            <a
              href="https://www.kaggle.com/arsiveai"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-gray-800/50 rounded-lg overflow-hidden
                       hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zM10.5 6.75h3v10.5h-3V6.75zm-3 3h3v7.5h-3v-7.5zm6 0h3v7.5h-3v-7.5z" />
                </svg>
                <span className="relative overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    Kaggle
                  </span>
                  <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
                    Kaggle
                  </span>
                </span>
              </div>
              <div className="absolute inset-0 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>

            <a
              href="mailto:sivakumar2ramakrishnan@gmail.com?subject=Inquiry%20from%20Portfolio%20Site"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-gray-800/50 rounded-lg overflow-hidden
                       hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12.713l11.985-8.713H.015L12 12.713zm0 2.574L.015 6.287V18h23.97V6.287L12 15.287z" />
                </svg>
                <span className="relative overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    Email
                  </span>
                  <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
                    Email
                  </span>
                </span>
              </div>
              <div className="absolute inset-0 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>

          </div>
        </div>

        {/* Right Column - Loss Landscape */}
        <div className="lg:col-span-5">
          <div className="bg-gray-900/50 p-6 rounded-lg border border-blue-500/20">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <LossLandscapeGame />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSection;