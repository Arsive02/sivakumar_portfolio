import { Music2, ArrowUpRight, Check, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HobbiesPreview = () => {
  const navigate = useNavigate();
  const hobbies = [
    {
      title: "Chess",
      icon: Check,
      color: "from-blue-500 to-cyan-500",
      description: "Strategic play and tactical analysis",
      imageUrl: "/assets/imgs/chess.jpg"
    },
    {
      title: "Flute",
      icon: Music2,
      color: "from-purple-500 to-pink-500",
      description: "Classical and contemporary melodies",
      imageUrl: "/assets/imgs/flute.jpg"
    },
    {
      title: "Boxing",
      icon: Hand,
      color: "from-amber-500 to-red-500",
      description: "Fitness and mental discipline",
      imageUrl: "/assets/imgs/boxing.jpg"
    }
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Hobbies & Interests
          </h2>
          <p className="text-gray-400 mt-2">
            Beyond the code: exploring passions and maintaining balance
          </p>
        </div>
        <button
          onClick={() => navigate('/hobbies')}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg 
                   bg-neutral-900 hover:bg-neutral-800 transition-all duration-300
                   border border-neutral-800 hover:border-neutral-700 z-10"
        >
          <span className="text-gray-300 group-hover:text-white">View All</span>
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-white 
                                transform group-hover:translate-x-1 group-hover:-translate-y-1 
                                transition-transform duration-300" />
        </button>
      </div>

      {/* Hobbies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hobbies.map((hobby, index) => (
          <motion.div
            key={hobby.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-xl bg-neutral-900/80 
                     border border-neutral-800 hover:border-neutral-700
                     transition-all duration-500"
          >
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 relative z-10">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center
                          bg-neutral-800 group-hover:bg-neutral-700
                          transition-all duration-500">
                <hobby.icon className="w-6 h-6 text-white 
                                   group-hover:scale-110 transition-transform duration-500" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2 
                         group-hover:translate-x-2 transition-transform duration-500">
                {hobby.title}
              </h3>
              <p className="text-gray-400 group-hover:translate-x-2 
                         transition-transform duration-500 delay-75">
                {hobby.description}
              </p>
              
              {/* Subtle Line Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800
                           transform origin-left scale-x-0 group-hover:scale-x-100
                           transition-transform duration-500" />
            </div>

            {/* Corner Accent */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-neutral-800
                         rotate-45 transform translate-x-full group-hover:translate-x-0
                         transition-transform duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-900/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-800/50 rounded-full blur-3xl" />
    </div>
  );
};

export default HobbiesPreview;