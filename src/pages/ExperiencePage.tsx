import { useState } from 'react';
import { experienceGroups } from '@/components/experience/ExperienceData';
import { ExperienceGroupSection } from '@/components/experience/ExperienceGroupSection';
import ExperienceHeader from '@/components/experience/ExperienceHeader';
import ExperienceHero from '@/components/experience/ExperienceHero';

const ExperiencePage = () => {
  const [activeGroup, setActiveGroup] = useState<string>(experienceGroups[0].type);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ExperienceHeader 
          activeTab={activeGroup}
          onTabChange={setActiveGroup}
        />
      </div>

      {/* Hero Section */}
      <ExperienceHero />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-4">
          {experienceGroups.map((group) => (
            <div
              key={group.type}
              className={activeGroup === group.type ? 'block' : 'hidden'}
            >
              <ExperienceGroupSection group={group} />
            </div>
          ))}
        </div>
      </main>

      {/* Simple Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default ExperiencePage;