import { ChevronLeft, Award, Star, Code, ExternalLink, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AchievementItem {
  title: string;
  description: string;
  issuer: string;
  date: string;
}

interface AchievementGroupProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: AchievementItem[];
  linkTo: string;
}

const AchievementGroup: React.FC<AchievementGroupProps> = ({ title, icon: Icon, color, items, linkTo }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-500/10`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <Link 
        to={linkTo}
        className={`flex items-center gap-2 text-${color}-400 hover:text-${color}-300 transition-colors`}
      >
        View All
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.slice(0, 3).map((item, index) => (
        <div 
          key={index}
          className={`p-6 rounded-xl border bg-gray-900/50 
                     border-${color}-500/20 hover:border-${color}-500/40 
                     transition-all duration-300`}
        >
          <h3 className={`text-lg font-semibold text-${color}-400 mb-2`}>{item.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{item.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{item.issuer}</span>
            <span>{item.date}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AchievementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const certifications = [
    {
      title: "Deep Learning Specialization",
      description: "Comprehensive specialization covering neural networks, CNN, RNN, and more",
      issuer: "DeepLearning.AI",
      date: "2023"
    },
    // Add more certifications
  ];

  const awards = [
    {
      title: "Kaggle Competition - Top 5%",
      description: "Achieved top 5% ranking in Kaggle's Natural Language Processing competition",
      issuer: "Kaggle",
      date: "2023"
    },
    // Add more awards
  ];

  const contributions = [
    {
      title: "TensorFlow",
      description: "Contributed to documentation improvements and bug fixes",
      issuer: "Google",
      date: "2023"
    },
    // Add more contributions
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            to="/home" 
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Achievements & Recognition
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A showcase of certifications, awards, and contributions to the tech community
          </p>
        </div>

        {/* Achievement Groups */}
        <div className="space-y-16">
          <AchievementGroup 
            title="Certifications"
            icon={Award}
            color="blue"
            items={certifications}
            linkTo="/achievements/certifications"
          />

          <AchievementGroup 
            title="Awards & Recognition"
            icon={Star}
            color="purple"
            items={awards}
            linkTo="/achievements/awards"
          />

          <AchievementGroup 
            title="Open Source Contributions"
            icon={Code}
            color="emerald"
            items={contributions}
            linkTo="/achievements/opensource"
          />
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AchievementsPage;