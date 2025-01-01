import { useState, useCallback } from 'react';
import { Menu, X, User, BriefcaseIcon } from 'lucide-react';
import MobiusStrip from './animations/MobiusStrip';
import GraphNodeNav from './navigation/GeometricNav';

const GlitchText = ({ text }: { text: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleHover = useCallback(() => {
    if (!isGlitching) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 1000);
    }
  }, [isGlitching]);

  return (
    <div 
      className="inline-block relative"
      onMouseEnter={handleHover}
    >
      <style >{`
        .char {
          display: inline-block;
          position: relative;
        }

        .glitching .char {
          animation: glitch-float 1s ease-out forwards;
        }

        .glitching .char:before,
        .glitching .char:after {
          content: attr(data-char);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, #60A5FA, #A78BFA);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0;
          animation: glitch-split 1s ease-out forwards;
        }

        .glitching .char:before {
          animation-name: glitch-left;
        }

        .glitching .char:after {
          animation-name: glitch-right;
        }

        @keyframes glitch-float {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-1px); }
          40% { transform: translateY(1px); }
          60% { transform: translateY(-0.5px); }
          80% { transform: translateY(0.5px); }
        }

        @keyframes glitch-left {
          0%, 100% { 
            transform: translateX(0);
            opacity: 0;
          }
          20%, 80% {
            transform: translateX(-2px);
            opacity: 0.7;
          }
          40% {
            transform: translateX(-1px);
            opacity: 0.5;
          }
          60% {
            transform: translateX(-3px);
            opacity: 0.3;
          }
        }

        @keyframes glitch-right {
          0%, 100% { 
            transform: translateX(0);
            opacity: 0;
          }
          20%, 80% {
            transform: translateX(2px);
            opacity: 0.7;
          }
          40% {
            transform: translateX(3px);
            opacity: 0.5;
          }
          60% {
            transform: translateX(1px);
            opacity: 0.3;
          }
        }
      `}</style>

      <span className={`text-xl font-semibold base-text ${isGlitching ? 'glitching' : ''}`} style={{ color: '#60A5FA' }}>
        {text.split('').map((char, index) => (
          <span 
            key={index} 
            className="char base-text" 
            data-char={char}
            style={{ 
              animationDelay: `${index * 0.05}s`,
              '--index': index
            } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: BriefcaseIcon }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Name */}
          <div className="flex items-center gap-8">
            <MobiusStrip />
            <div className="group">
                <div className="relative flex gap-2">
                  <GlitchText text="Sivakumar" />
                  <GlitchText text="Ramakrishnan" />
                </div>
            </div>
          </div>

          {/* Rest of the navigation remains the same */}
          <div className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
                <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                      hover:text-blue-400 text-gray-400 hover:bg-blue-500/10 font-sans"
                >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                </button>
            ))}

            <div className="relative flex items-center">
              <GraphNodeNav onSelect={scrollToSection} />
            </div>
          </div>

          <button 
            className="md:hidden relative p-2 rounded-lg group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative z-10 transition-transform duration-300">
              {isMenuOpen ? <X className="text-blue-400" /> : <Menu />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg 
                          opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;