import { useState, useEffect } from 'react';
import {Mail, Menu, X, LineChart, Brain, Terminal } from 'lucide-react';
import MobiusStrip from './animations/MobiusStrip';
import "../../styles/home/components/nav.css";
import "../../styles/home/components/mobius.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const navItems = [
    { id: 'about', label: 'About', icon: Brain },
    { id: 'experience', label: 'Experience', icon: LineChart },
    { id: 'projects', label: 'Projects', icon: Terminal },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Name with neural animation */}
            <div className="flex items-center gap-8">
              {/* Mobius Strip Container */}
                <MobiusStrip />

              {/* Name Container */}
              <div className="group cursor-pointer">
                <div className="relative">
                  <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Sivakumar
                  </span>
                  <div className="absolute -bottom-5 left-0 right-0 flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-xs text-gray-400">[</span>
                    <span className="text-xs text-blue-400 whitespace-nowrap">data_scientist</span>
                    <span className="text-xs text-gray-400">]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isHovered = hoverIndex === index;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => {
                      setActiveSection(item.id);
                      scrollToSection(item.id);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden
                      ${isActive 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'hover:text-blue-400 text-gray-400'
                      }`}
                  >
                    {/* Background animation */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform transition-transform duration-500 rounded-lg
                        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    />
                    
                    {/* Icon with animations */}
                    <Icon 
                      className={`w-4 h-4 relative transition-all duration-300 transform
                        ${isHovered ? 'scale-110 rotate-12' : ''} 
                        ${isActive ? 'text-blue-300' : 'text-gray-500'}`} 
                    />
                    
                    {/* Text with slide-up animation */}
                    <div className="relative overflow-hidden">
                      <span className={`block transition-transform duration-600
                        ${isHovered ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                        {item.label}
                      </span>
                      <span className={`absolute top-0 left-0 transition-transform duration-300
                        ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        {item.label}
                      </span>
                    </div>

                    {/* Pulsing dot for active state */}
                    {isActive && (
                      <div className="absolute -right-1 -top-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden relative p-2 rounded-lg group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative z-10 transition-transform duration-300">
                {isMenuOpen ? <X className="text-blue-400" /> : <Menu />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105" />
            </button>
          </div>
        </div>

        {/* Neural network animation lines */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/20">
          <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-neural-pulse" />
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 md:hidden pt-20">
          <div className="flex flex-col items-center space-y-4 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 py-4 rounded-lg 
                           relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gray-800/30 -z-10" />
                  <Icon className="w-5 h-5 text-blue-400 transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-110 relative z-10" />
                  <span className="text-gray-300 relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;