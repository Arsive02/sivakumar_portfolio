import { motion } from 'framer-motion';
import { ExperienceGroup } from './ExperienceData';
import { ExperienceCard } from './ExperienceCard';
import GroupHeader from '../animations/GroupHeader';

interface ExperienceGroupSectionProps {
  group: ExperienceGroup;
}

export const ExperienceGroupSection = ({ group }: ExperienceGroupSectionProps) => {
  return (
    <div className="space-y-12">
      {/* Group Header */}
      <GroupHeader
        title={group.title}
        description={group.description}
        type={group.type}
      />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2
                       bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent" />

        {/* Experience Cards */}
        <div className="space-y-24">
          {group.experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Timeline Node */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                             w-4 h-4 bg-blue-500 rounded-full z-10">
                <div className="absolute inset-0 rounded-full animate-ping
                               bg-blue-500 opacity-75" />
                <div className="absolute inset-0 rounded-full animate-pulse
                               bg-blue-400 opacity-75" />
              </div>

              {/* Card and Photo Container */}
              <div className="grid grid-cols-2 gap-16 items-center">
                {/* Left Side */}
                <div className={index % 2 === 0 ? "" : "order-2"}>
                  <ExperienceCard 
                    experience={experience} 
                    alignment={index % 2 === 0 ? "left" : "right"} 
                  />
                </div>

                {/* Right Side */}
                <div className={`${index % 2 === 0 ? "order-2" : ""}`}>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden group">
                    <img 
                      src={experience.photo.src} 
                      alt={experience.photo.alt}
                      className="w-full h-full object-cover transition-transform duration-500
                               group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceGroupSection;