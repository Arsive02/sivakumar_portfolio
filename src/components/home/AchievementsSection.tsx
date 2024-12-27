import { Award, Star, Code, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type CategoryColor = 'blue' | 'purple' | 'emerald';

const categories: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: CategoryColor;
  route: string;
  items: {
    title: string;
    issuer: string;
    date: string;
    highlight: string;
  }[];
}[] = [
  {
    title: "Certifications",
    icon: Award,
    color: "blue",
    route: "/achievements?category=certifications",
    items: [
      {
        title: "Deep Learning Specialization",
        issuer: "DeepLearning.AI",
        date: "2023",
        highlight: "Neural Networks & Deep Learning"
      },
      {
        title: "Natural Language Processing",
        issuer: "Coursera",
        date: "2022",
        highlight: "Advanced NLP Architectures"
      },
      {
        title: "Machine Learning",
        issuer: "Coursera",
        date: "2022",
        highlight: "ML Fundamentals & Applications"
      }
    ]
  },
  {
    title: "Awards & Recognition",
    icon: Star,
    color: "purple",
    route: "/achievements?category=awards",
    items: [
      {
        title: "Kaggle Competition",
        issuer: "Kaggle",
        date: "2023",
        highlight: "Top 5% in NLP Competition"
      }
    ]
  },
  {
    title: "Open Source",
    icon: Code,
    color: "emerald",
    route: "/achievements?category=contributions",
    items: [
      {
        title: "TensorFlow",
        issuer: "Google",
        date: "2023",
        highlight: "Documentation & Bug Fixes"
      }
    ]
  }
];

const AchievementsSection = () => {
  return (
    <section id="achievements" className="relative w-full max-w-7xl mx-auto py-16">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          const colorClasses = {
            blue: "from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-500/20",
            purple: "from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 border-purple-500/20",
            emerald: "from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10 border-emerald-500/20"
          };

          return (
            <div key={idx} className="flex flex-col group">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[category.color]}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                </div>
              </div>

              {/* Items Container */}
              <div className="flex-1 space-y-4 mb-6">
                {category.items.slice(0, 3).map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[category.color]} 
                              border backdrop-blur-sm transition-all duration-300 
                              hover:scale-[1.02] group`}
                  >
                    <h4 className="text-white font-medium mb-1">{item.title}</h4>
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                      <span>{item.issuer}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-300">{item.highlight}</p>
                  </div>
                ))}
              </div>

              {/* Enhanced View All Link */}
              <Link
                to={category.route}
                className="relative block"
              >
                <div className={`relative flex items-center justify-between p-4 rounded-xl
                              border backdrop-blur-sm overflow-hidden
                              bg-gradient-to-r ${colorClasses[category.color]}
                              transition-all duration-500 ease-out
                              hover:shadow-lg hover:shadow-white/10 group`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-base font-medium text-white">
                      Explore All {category.title}
                    </span>
                  </div>
                  
                  <ArrowUpRight className="w-5 h-5 text-white transform transition-all duration-500 
                                        group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                                        group-hover:scale-110" />

                  {/* Animated highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                -translate-x-full group-hover:translate-x-full transform
                                pointer-events-none" 
                       style={{ 
                         transition: "transform 1s ease-in-out, opacity 0.5s ease-out",
                       }} />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AchievementsSection;