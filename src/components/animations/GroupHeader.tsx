import { motion } from 'framer-motion';
import { Brain, Briefcase, GraduationCap, Shield } from 'lucide-react';

interface GroupHeaderProps {
  title: string;
  description: string;
  type: 'research' | 'industry' | 'internship' | 'responsibility';
}

const GroupHeader = ({ title, description, type }: GroupHeaderProps) => {
  // Icon mapping based on type
  const icons = {
    research: Brain,
    industry: Briefcase,
    internship: GraduationCap,
    responsibility: Shield 
  };

  const Icon = icons[type];

  // Background patterns based on type
  const patterns = {
    research: (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 border border-blue-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
    ),
    industry: (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 border-2 border-emerald-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 45}deg)`,
              animation: `spin ${Math.random() * 10 + 10}s linear infinite`
            }}
          />
        ))}
      </div>
    ),
    internship: (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-purple-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
    ),
    responsibility: (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-red-500/20" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-yellow-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <div className="relative mb-16">
      {/* Background Pattern */}
      {patterns[type]}

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl
                   border border-white/10 bg-white/5"
      >
        <div className="p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mb-6"
          >
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 blur-lg opacity-50" />
              <div className="relative flex items-center justify-center w-full h-full rounded-xl bg-gray-900/50 border border-white/10">
                <Icon className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-center mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {title}
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-center max-w-2xl mx-auto"
          >
            {description}
          </motion.p>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
        </div>

        {/* Bottom Border Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </motion.div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default GroupHeader;