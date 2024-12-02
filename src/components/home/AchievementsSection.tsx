import { Award, Star, Code, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AchievementCard from '../achievements/AchievementCard';

// Achievement Section Component for HomePage
export default function AchievementsSection() {

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Certifications Column */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Certifications</h2>
          </div>
          <Link 
            to="/achievements/certifications"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <AchievementCard
            title="Deep Learning Specialization"
            description="Mastery in neural networks and deep learning concepts"
            icon={Award}
            issuer="DeepLearning.AI"
            date="2023"
            color="blue"
          />
        </div>
      </div>

      {/* Awards Column */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold">Awards</h2>
          </div>
          <Link 
            to="/achievements/awards"
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <AchievementCard
            title="Kaggle Competition"
            description="Top 5% in NLP competition"
            icon={Star}
            issuer="Kaggle"
            date="2023"
            color="purple"
          />
        </div>
      </div>

      {/* Open Source Column */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-semibold">Open Source</h2>
          </div>
          <Link 
            to="/achievements/opensource"
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <AchievementCard
            title="TensorFlow"
            description="Documentation improvements and bug fixes"
            icon={Code}
            issuer="Google"
            date="2023"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}