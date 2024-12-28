import { Link } from 'react-router-dom';
import { ChevronLeft, Brain, Briefcase, GraduationCap } from 'lucide-react';

interface ExperienceTabProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ExperienceTab = ({ icon: Icon, label, isActive, onClick }: ExperienceTabProps) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
    
    {/* Active indicator */}
    {isActive && (
      <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
    )}
  </button>
);

interface ExperienceHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ExperienceHeader = ({ activeTab, onTabChange }: ExperienceHeaderProps) => {
  const tabs = [
    { id: 'industry', label: 'Industry Experience', icon: Briefcase },
    { id: 'internship', label: 'Internships', icon: GraduationCap },
    { id: 'research', label: 'Research Experience', icon: Brain }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient line */}
      <div className="h-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />
      
      {/* Header content */}
      <div className="bg-black/80 backdrop-blur-md border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <Link 
              to="/home"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/20 
                       bg-gray-900/50 text-gray-300 hover:text-white hover:bg-gray-900/80 
                       hover:border-blue-500/40 transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            {/* Navigation Tabs */}
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <ExperienceTab
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => onTabChange(tab.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom shadow */}
      <div className="h-[1px] bg-gradient-to-b from-black/20 to-transparent" />
    </div>
  );
};

export default ExperienceHeader;