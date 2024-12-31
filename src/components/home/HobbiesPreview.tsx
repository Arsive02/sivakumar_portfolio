import { useState } from 'react';
import { Music2, ArrowUpRight, Check, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HobbiesPreview = () => {
  const navigate = useNavigate();
  const [activeHobby, setActiveHobby] = useState<null | typeof hobbies[0]>(null);

  const hobbies = [
    {
      title: "Chess",
      icon: Check,
      color: "text-blue-400",
      backgroundEffect: "bg-blue-900/20",
      description: "Strategic play and tactical analysis",
      detailedDescription: "A world of intricate strategies, where every move is a calculated risk. Chess transforms mental landscapes, challenging players to think multiple steps ahead.",
      skills: ["Strategic Thinking", "Pattern Recognition", "Patience"]
    },
    {
      title: "Flute",
      icon: Music2,
      color: "text-purple-400",
      backgroundEffect: "bg-purple-900/20",
      description: "Classical and contemporary melodies",
      detailedDescription: "Breathing life into musical narratives, the flute becomes an extension of creative expression. A journey through sound, emotion, and technical mastery.",
      skills: ["Musical Interpretation", "Breath Control", "Emotional Expression"]
    },
    {
      title: "Boxing",
      icon: Hand,
      color: "text-red-400",
      backgroundEffect: "bg-red-900/20",
      description: "Fitness and mental discipline",
      detailedDescription: "More than physical combat, boxing is a dance of discipline, strategy, and inner strength. Each punch tells a story of dedication and self-improvement.",
      skills: ["Physical Conditioning", "Mental Resilience", "Tactical Awareness"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Cosmic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-[1fr_2fr] gap-12 items-center">
        {/* Header Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-5xl font-black mb-4 
              bg-clip-text text-transparent bg-gradient-to-r 
              from-green-400 via-blue-500 to-indigo-500">
              Personal Horizons
            </h2>
            <p className="text-xl text-gray-300 max-w-md">
              Beyond professional boundaries, exploring passion and maintaining balance
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/hobbies')}
            className="group relative overflow-hidden px-6 py-3 
              border border-gray-700 rounded-xl 
              bg-gray-900 hover:bg-gray-800 
              transition-all duration-300 flex items-center gap-2"
          >
            <span className="relative z-10 text-gray-300 group-hover:text-white">
              Explore Fully
            </span>
            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white 
              transform group-hover:translate-x-1 group-hover:-translate-y-1 
              transition-transform" />
          </motion.button>
        </div>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {hobbies.map((hobby, index) => (
              <motion.div
                key={hobby.title}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                onHoverStart={() => setActiveHobby(hobby)}
                onHoverEnd={() => setActiveHobby(null)}
                className={`relative group cursor-pointer
                  border border-gray-800 rounded-2xl p-6 
                  transition-all duration-500 
                  ${activeHobby === hobby 
                    ? 'bg-gray-800/50 backdrop-blur-sm scale-105' 
                    : 'bg-gray-900/30 hover:bg-gray-800/30'}
                  ${hobby.backgroundEffect}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center 
                      bg-gray-800/50 ${hobby.color}`}>
                      <hobby.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${hobby.color}`}>
                        {hobby.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {hobby.description}
                      </p>
                    </div>
                  </div>
                </div>

                {activeHobby === hobby && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 space-y-2"
                  >
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {hobby.detailedDescription}
                    </p>
                    <div className="flex space-x-2">
                      {hobby.skills.map((skill) => (
                        <span 
                          key={skill}
                          className={`px-2 py-1 text-xs rounded-full 
                            ${hobby.color.replace('text', 'bg')} 
                            bg-opacity-20 text-white`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 
        bg-gradient-to-bl from-purple-900/20 to-transparent 
        rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 
        bg-gradient-to-tr from-blue-900/20 to-transparent 
        rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default HobbiesPreview;