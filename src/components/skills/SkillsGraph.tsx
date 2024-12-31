import React, { useState } from 'react';
import { Brain, Code2, Wrench, CircuitBoardIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface SubSkill {
  name: string;
  iconPath: string;
  description?: string;
}

interface Skill {
  name: string;
  Icon: React.ElementType;
  subskills: SubSkill[];
  color: string;
  description: string;
}

const SkillsShowcase = () => {
  const [activeSkill, setActiveSkill] = useState<string>('AI & Machine Learning');

  const skills: Skill[] = [
    {
      name: 'AI & Machine Learning',
      Icon: Brain,
      color: 'from-blue-600 to-purple-600',
      description: 'Specialized in neural architectures and deep learning systems',
      subskills: [
        {
          name: 'Deep Learning', 
          iconPath: '/assets/icons/r-deep-learning.png',
          description: 'Specialized in neural architectures and deep learning systems',
        },
        { 
          name: 'Neural Networks', 
          iconPath: '/assets/icons/deep-learning.png',
          description: 'Deep understanding of neural network architectures' 
        },
        { 
          name: 'Computer Vision', 
          iconPath: '/assets/icons/vision.png',
          description: 'Expertise in image processing and analysis' 
        },
        { 
          name: 'NLP', 
          iconPath: '/assets/icons/nlp.png',
          description: 'Natural language processing and understanding' 
        },
        { 
          name: 'Multimodal AI', 
          iconPath: '/assets/icons/multi-channel.png',
          description: 'Integration of multiple data modalities' 
        },
        { 
          name: 'Supervised Learning', 
          iconPath: '/assets/icons/supervised.png',
          description: 'Classification and regression models' 
        },
        { 
          name: 'Unsupervised Learning', 
          iconPath: '/assets/icons/unsupervised.png',
          description: 'Clustering and dimensionality reduction' 
        },
        { 
          name: 'Reinforcement Learning', 
          iconPath: '/assets/icons/reinforcement_learning.png',
          description: 'Agent-based learning systems' 
        }
      ]
    },
    {
      name: 'Quantum Computing',
      Icon: CircuitBoardIcon,
      color: 'from-yellow-600 to-green-600',
      description: 'Fundamentals of quantum mechanics and quantum algorithms',
      subskills: [
        { 
          name: 'Qubits', 
          iconPath: '/assets/icons/qubit.png',
          description: 'Quantum bits and superposition' 
        },
        { 
          name: 'Quantum Algorithms', 
          iconPath: '/assets/icons/quantum.png',
          description: 'Exploration of quantum computing algorithms'
        }
      ]
    },
    {
      name: 'Programming',
      Icon: Code2,
      color: 'from-orange-600 to-red-600',
      description: 'Proficient in multiple programming languages',
      subskills: [
        { 
          name: 'Python', 
          iconPath: '/assets/icons/python.svg',
          description: 'Primary language for ML/DL development' 
        },
        { 
          name: 'Java', 
          iconPath: '/assets/icons/java.png',
          description: 'Backend development and Android apps' 
        },
        { 
          name: 'R', 
          iconPath: '/assets/icons/r.png',
          description: 'Statistical analysis and visualization' 
        },
        {
          name: 'SQL',
          iconPath: '/assets/icons/sql.png',
          description: 'Database querying and management'
        },
        {
          name: 'MATLAB',
          iconPath: '/assets/icons/matlab.png',
          description: 'Scientific computing and data analysis'
        },
        {
          name: 'C++',
          iconPath: '/assets/icons/cpp.png',
          description: 'High-performance computing and systems programming'
        },
        {
          name: 'C',
          iconPath: '/assets/icons/c.png',
          description: 'Low-level programming and embedded systems'
        }
      ]
    },
    {
      name: 'Tools & Frameworks',
      Icon: Wrench,
      color: 'from-purple-600 to-pink-600',
      description: 'Expertise in modern development tools',
      subskills: [
        { 
          name: 'PyTorch', 
          iconPath: '/assets/icons/pytorch.svg',
          description: 'Deep learning framework' 
        },
        { 
          name: 'TensorFlow', 
          iconPath: '/assets/icons/tensorflow.svg',
          description: 'Machine learning platform' 
        },
        { 
          name: 'Git', 
          iconPath: '/assets/icons/git.png',
          description: 'Version control system' 
        },
        { 
          name: 'AWS', 
          iconPath: '/assets/icons/aws.svg',
          description: 'Cloud computing platform' 
        },
        {
          name: 'Alembic',
          iconPath: '/assets/icons/alembic.png',
          description: 'Database migrations tool'
        },
        {
          name: 'Postman',
          iconPath: '/assets/icons/postman.svg',
          description: 'API development and testing tool'
        },
        {
          name: 'PostgreSQL',
          iconPath: '/assets/icons/postgresql.svg',
          description: 'Relational database management system'
        },
        {
          name: 'HTML/CSS',
          iconPath: '/assets/icons/html-css.png',
          description: 'Web development languages'
        },
        {
          name: "Streamlit",
          iconPath: '/assets/icons/streamlit.png',
          description: 'Data visualization and web app framework'
        },
        {
          name: 'Flask',
          iconPath: '/assets/icons/flask.png',
          description: 'Micro web framework for Python'
        },
        {
          name: 'FastAPI',
          iconPath: '/assets/icons/fastapi.png',
          description: 'Modern web framework for APIs'
        }
      ]
    }
  ];

  const activeSkillData = skills.find(s => s.name === activeSkill);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4">
      {/* Main heading with animated gradient */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        <h2 className="relative text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Technical Skills
        </h2>
        <p className="relative text-lg text-blue-200/80 font-light">
          Click on skills to explore more
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <ScrollArea className="h-[500px] rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm p-4">
            <div className="space-y-3">
              {skills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setActiveSkill(skill.name)}
                  className={`
                    w-full px-4 py-3 rounded-xl transition-all duration-500
                    flex items-center gap-3 group
                    ${activeSkill === skill.name 
                      ? 'bg-gradient-to-r ' + skill.color + ' shadow-lg shadow-' + skill.color.split('-')[1] + '/20'
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  <skill.Icon className={`w-5 h-5 transition-transform duration-500 ${
                    activeSkill === skill.name 
                      ? 'text-white scale-110' 
                      : 'text-gray-400 group-hover:scale-110'
                  }`} />
                  <span className="font-medium">{skill.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="lg:w-3/4">
          {activeSkillData && (
            <div className="space-y-6">
              {/* Skill description */}
              <Card className="border-0 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${activeSkillData.color}`}>
                      <activeSkillData.Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{activeSkillData.name}</h3>
                      <p className="text-gray-400">{activeSkillData.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subskills grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSkillData.subskills.map((subskill, index) => (
                  <motion.div
                    key={index}
                    layout
                    className={`
                      cursor-pointer rounded-2xl
                      bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm
                      hover:from-gray-900/70 hover:to-black/70
                      transition-all duration-500
                    `}
                  >
                    <motion.div layout className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={subskill.iconPath}
                          alt={subskill.name}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="font-medium text-white">{subskill.name}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(to bottom right, 
                ${Math.random() > 0.5 ? '#60A5FA' : '#818CF8'}, 
                ${Math.random() > 0.5 ? '#C084FC' : '#F472B6'})`,
              opacity: 0.15,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SkillsShowcase;