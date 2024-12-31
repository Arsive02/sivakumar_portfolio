import React, { useState } from 'react';
import { Book, ChevronLeft, ArrowUpRight, Brain, Pi, Grid, CpuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Type definitions
interface Resource {
  title: string;
  author: string;
  description: string;
  link: string;
  type: 'course' | 'book' | 'article' | 'website' | 'playlist';
  color: string;
}

interface CategoryType {
  id: 'all' | 'quantum' | 'ai' | 'linear_algebra' | 'statistics';
  label: string;
  icon: React.ElementType;
}

type ResourcesMap = {
  [K in Exclude<CategoryType['id'], 'all'>]: Resource[];
};

const ResourcesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType['id']>('all');
  const [, setHoveredBook] = useState<string | null>(null);

  const resources: ResourcesMap = {
    quantum: [
      {
        title: "Dancing with Qubits",
        author: "Robert Sutor",
        description: "How quantum computing works and how it can change the world of computing",
        link: "https://learning.oreilly.com/library/view/dancing-with-qubits",
        type: "book",
        color: "from-blue-600 to-purple-600"
      },
      {
        title: "Q-CTRL Open Controls",
        author: "Q-CTRL",
        description: "Open-source quantum control software",
        link: "https://q-ctrl.com/products/open-controls/",
        type: "article",
        color: "from-purple-600 to-pink-600"
      },
      {
        title: "Learn with Azure Quantum katas",
        author: "Microsoft",
        description: "Interactive tutorials for quantum computing",
        link: "https://learn.microsoft.com/en-us/azure/quantum/",
        type: "course",
        color: "from-cyan-600 to-blue-600"
      }
    ],
    linear_algebra: [
      {
        title: "3Blue1Brown: Linear Algebra",
        author: "Grant Sanderson",
        description: "Visual and intuitive understanding of linear algebra",
        link: "https://www.3blue1brown.com/topics/linear-algebra",
        type: "playlist",
        color: "from-green-600 to-teal-600"
      },
      {
        title: "Interactive Linear Algebra",
        author: "Immersive Math",
        description: "Interactive tutorials for linear algebra",
        link: "https://immersivemath.com/ila/index.html",
        type: "website",
        color: "from-yellow-600 to-orange-600"
      },
      {
        title: "MIT Gilbert Strang Linear Algebra",
        author: "Gilbert Strang",
        description: "Comprehensive video lectures on linear algebra",
        link: "https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8",
        type: "playlist",
        color: "from-red-600 to-pink-600"
      },
      {
        title: "Linear Algebra and its Applications (6th Edition)",
        author: "David C. Lay",
        description: "Textbook for linear algebra",
        link: "https://a.co/d/2E6nM30",
        type: "book",
        color: "from-purple-600 to-indigo-600"
      }
    ],
    ai: [
      {
        title: "Neural Networks: Zero to Hero",
        author: "Andrej Karpathy",
        description: "Building neural networks from scratch",
        link: "https://karpathy.ai/zero-to-hero.html",
        type: "course",
        color: "from-blue-600 to-cyan-600"
      },
      {
        title: "Transformers from Scratch",
        author: "Brandon Rohrer",
        description: "Deep dive into transformer architecture",
        link: "https://e2eml.school/transformers.html",
        type: "article",
        color: "from-violet-600 to-purple-600"
      },
      {
        title: "Speech and Language Processing",
        author: "Dan Jurafsky & James H. Martin",
        description: "Textbook for natural language processing",
        link: "https://web.stanford.edu/~jurafsky/slp3/",
        type: "book",
        color: "from-green-600 to-teal-600"
      },
      {
        title: "Deep learning book",
        author: "Ian Goodfellow et al.",
        description: "Textbook for deep learning",
        link: "https://www.deeplearningbook.org/",
        type: "book",
        color: "from-red-600 to-pink-600"
      }
    ],
    statistics: [
      {
        title: "Introduction to Statistical Learning",
        author: "Gareth James et al.",
        description: "Textbook for statistical learning",
        link: "https://www.statlearning.com/",
        type: "book",
        color: "from-green-600 to-teal-600"
      },
      {
        title: "StatQuest",
        author: "Josh Starmer",
        description: "YouTube channel for statistics",
        link: "https://www.youtube.com/user/joshstarmer",
        type: "playlist",
        color: "from-blue-600 to-indigo-600"
      }
    ]
  };

  const getAllResources = (): Resource[] => {
    return Object.values(resources).flat();
  };

  const currentResources = activeCategory === 'all' ? 
    getAllResources() : 
    resources[activeCategory] || [];

  const categories: CategoryType[] = [
    { id: 'all', label: 'All Resources', icon: Book },
    { id: 'quantum', label: 'Quantum Computing', icon: CpuIcon },
    { id: 'linear_algebra', label: 'Linear Algebra', icon: Grid },
    { id: 'ai', label: 'AI & ML', icon: Brain },
    { id: 'statistics', label: 'Statistics', icon: Pi }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to="/home?section=resources" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <motion.div 
            className="text-center mb-16 relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.pink.500/0.2)_0%,transparent_70%)]" />
            <motion.div
              className="relative z-10 text-4xl md:text-6xl font-bold"
              variants={itemVariants}
              animate={{
                textShadow: [
                  '0 0 10px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.7)',
                  '0 0 10px rgba(255,255,255,0.5)'
                ],
              }}
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text inline-block"
                    style={{ 
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      WebkitTextStroke: '1px rgba(255,255,255,0.1)'
                    }}>
                Digital Library
              </span>
            </motion.div>
            <motion.p 
              className="mt-4 text-pink-300 text-lg font-mono tracking-widest"
              variants={itemVariants}
            >
              &lt;/&gt; NEURAL.NET_ACCESS v2.0
            </motion.p>
          </motion.div>
          {/* Categories */}
          <motion.div 
            className="flex flex-wrap gap-4 mb-12 justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300
                    ${activeCategory === category.id 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-gray-900/50 text-gray-400 hover:bg-gray-900'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Resources Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentResources.map((resource, ) => (
              <motion.div
                key={resource.title}
                variants={itemVariants}
                onHoverStart={() => setHoveredBook(resource.title)}
                onHoverEnd={() => setHoveredBook(null)}
                className="relative group"
                layout
              >
                <motion.a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block relative p-6 rounded-xl overflow-hidden
                            border border-white/10 backdrop-blur-sm
                            transition-all duration-500 transform
                            hover:-translate-y-2 hover:shadow-xl
                            bg-gradient-to-br ${resource.color}`}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Book spine effect */}
                  <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/20" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-white/90">
                        {resource.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white 
                                             transform group-hover:translate-x-1 group-hover:-translate-y-1 
                                             transition-transform duration-300" />
                    </div>
                    <p className="text-sm text-white/70 mb-2">{resource.author}</p>
                    <p className="text-sm text-white/60">{resource.description}</p>
                    
                    {/* Type badge */}
                    <span className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full 
                                   bg-white/10 text-white/90 backdrop-blur-sm">
                      {resource.type}
                    </span>
                  </div>

                  {/* Hover effects */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                    initial={{ opacity: 0, x: '-100%' }}
                    whileHover={{ opacity: 1, x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </div>
  );
};

export default ResourcesPage;