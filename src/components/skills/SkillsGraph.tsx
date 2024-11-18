import React, { useState } from 'react';
import { Code2, Brain, Database, Wrench } from 'lucide-react';

interface SubSkill {
  name: string;
  icon?: string; // URL to the icon image
}

interface Skill {
  name: string;
  Icon: React.ElementType;
  subskills: SubSkill[];
  color: string;
  description: string;
}

const SkillsShowcase = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const skills: Skill[] = [
    {
      name: 'Deep Learning',
      Icon: Brain,
      color: 'from-blue-600 to-purple-600',
      description: 'Specialized in neural architectures and deep learning systems',
      subskills: [
        { name: 'Neural Networks', icon: '/api/placeholder/24/24' },
        { name: 'Computer Vision', icon: '/api/placeholder/24/24' },
        { name: 'NLP', icon: '/api/placeholder/24/24' },
        { name: 'Multimodal AI', icon: '/api/placeholder/24/24' }
      ]
    },
    {
      name: 'Machine Learning',
      Icon: Database,
      color: 'from-green-600 to-teal-600',
      description: 'Experience with various ML paradigms and algorithms',
      subskills: [
        { name: 'Supervised Learning', icon: '/api/placeholder/24/24' },
        { name: 'Unsupervised Learning', icon: '/api/placeholder/24/24' },
        { name: 'Reinforcement Learning', icon: '/api/placeholder/24/24' }
      ]
    },
    {
      name: 'Programming',
      Icon: Code2,
      color: 'from-orange-600 to-red-600',
      description: 'Proficient in multiple programming languages',
      subskills: [
        { name: 'Python', icon: '/api/placeholder/24/24' },
        { name: 'Java', icon: '/api/placeholder/24/24' },
        { name: 'R', icon: '/api/placeholder/24/24' },
        { name: 'TypeScript', icon: '/api/placeholder/24/24' }
      ]
    },
    {
      name: 'Tools & Frameworks',
      Icon: Wrench,
      color: 'from-purple-600 to-pink-600',
      description: 'Expertise in modern development tools',
      subskills: [
        { name: 'PyTorch', icon: '/api/placeholder/24/24' },
        { name: 'TensorFlow', icon: '/api/placeholder/24/24' },
        { name: 'Git', icon: '/api/placeholder/24/24' },
        { name: 'AWS', icon: '/api/placeholder/24/24' }
      ]
    }
  ];

  const handleSkillClick = (skillName: string) => {
    setActiveSkill(activeSkill === skillName ? null : skillName);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4">
      {/* Main heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Technical Skills
        </h2>
        <p className="text-gray-400">Click on a skill to explore more</p>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.name}
            onClick={() => handleSkillClick(skill.name)}
            className={`
              relative overflow-hidden rounded-xl
              transition-all duration-500 ease-out cursor-pointer
              border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm
              hover:shadow-xl hover:shadow-blue-500/10
              ${activeSkill === skill.name ? 
                'lg:col-span-2 lg:row-span-2 scale-100 h-[400px]' : 
                'h-[140px] hover:scale-105'
              }
              group
            `}
          >
            {/* Background gradient */}
            <div className={`
              absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity
              bg-gradient-to-br ${skill.color}
            `} />

            {/* Content */}
            <div className="relative h-full flex flex-col p-6">
              {/* Icon and title - fixed height */}
              <div className="flex items-center space-x-4 mb-3">
                <div className={`
                  p-2 rounded-lg bg-gradient-to-br ${skill.color}
                  bg-opacity-20 group-hover:bg-opacity-30 transition-all
                `}>
                  <skill.Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
              </div>

              {/* Description - fixed height */}
              <p className="text-gray-400 text-sm flex-grow line-clamp-2">
                {skill.description}
              </p>

              {/* Expanded content */}
              {activeSkill === skill.name && (
                <div className="mt-6 opacity-0 animate-fadeIn">
                  <div className="border-t border-gray-800/50 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Related Technologies</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {skill.subskills.map((subskill, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-3 p-3 rounded-lg
                                   bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                        >
                          {subskill.icon && (
                            <img 
                              src={subskill.icon} 
                              alt={subskill.name}
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <span className="text-gray-300">{subskill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom border - consistent positioning */}
              <div className={`
                absolute bottom-0 left-0 right-0 h-1
                bg-gradient-to-r ${skill.color} opacity-0
                group-hover:opacity-50 transition-opacity
              `} />
            </div>

            {/* Corner decoration */}
            <div className={`
              absolute -top-8 -right-8 w-16 h-16
              bg-gradient-to-br ${skill.color}
              transform rotate-45
              opacity-20 group-hover:opacity-30 transition-opacity
            `} />
          </div>
        ))}
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(to bottom right, 
                ${Math.random() > 0.5 ? '#60A5FA' : '#818CF8'}, 
                ${Math.random() > 0.5 ? '#C084FC' : '#F472B6'})`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillsShowcase;