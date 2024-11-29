import { useState, } from 'react';
import { Menu, X, User, BriefcaseIcon } from 'lucide-react';
import MobiusStrip from './animations/MobiusStrip';
import GraphNodeNav from './navigation/GeometricNav';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Main nav items
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
          <div className="hidden md:flex items-center space-x-8">
            {/* Main nav items */}
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                          hover:text-blue-400 text-gray-400 hover:bg-blue-500/10"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}

            {/* Graph Node Navigation */}
            <div className="relative flex items-center">
              <GraphNodeNav onSelect={scrollToSection} />
            </div>
          </div>

          {/* Mobile Menu Button */}
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