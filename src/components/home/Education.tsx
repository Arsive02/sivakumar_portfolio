import { useState, useRef, useEffect } from 'react';
import { GraduationCap, Award, Calendar, Navigation2 } from 'lucide-react';

import { ReactNode } from 'react';

interface Card3DProps {
  children: ReactNode;
  isActive: boolean;
}

const Card3D = ({ children, isActive }: Card3DProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -10;
    const rotateY = (mouseX / (rect.width / 2)) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      className={`transform-gpu transition-all duration-200 ease-out 
                ${isActive ? 'z-10' : 'z-0'}`}
      style={{ 
        transform: `
          perspective(1000px) 
          rotateX(${rotation.x}deg) 
          rotateY(${rotation.y}deg)
          ${isHovered ? 'translateZ(20px)' : ''}
          scale(${isHovered ? 1.02 : 1})
        `,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Subtle highlight effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at 
            ${50 + (rotation.y / 10) * 50}% 
            ${50 + (rotation.x / 10) * 50}%, 
            rgba(255, 255, 255, 0.1) 0%,
            transparent 60%
          )`,
          opacity: isHovered ? 0.3 : 0
        }}
      />
      
      {/* Very subtle shadow */}
      <div 
        className="absolute -inset-2 rounded-xl transition-opacity duration-300 pointer-events-none"
        style={{
          transform: 'translateZ(-20px)',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
          opacity: isHovered ? 0.3 : 0
        }}
      />
    </div>
  );
};

const EducationSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const educationData = [
    {
      degree: "Master of Science in Data Science",
      institution: "University of Colorado Boulder",
      period: "Aug 2024 - Current",
      location: "Boulder, Colorado",
      gpa: "In Progress",
      courses: [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Big Data Analytics",
        "Statistical Methods"
      ]
    },
    {
      degree: "Bachelor of Engineering",
      institution: "Sri Sai Ram Engineering College",
      period: "Aug 2018 – Jun 2022",
      location: "Chennai, India",
      gpa: "3.65/4.00",
      courses: [
        "Artificial Intelligence",
        "Digital Signal Processing",
        "Data Structures",
        "Computer Networks",
        "Digital Electronics",
        "Embedded Systems"
      ]
    }
  ];

  return (
    <div className="relative max-w-6xl mx-auto px-4" ref={timelineRef}>

      {/* Education Cards */}
      <div className="space-y-16">
        {educationData.map((edu, index) => (
          <div
            key={index}
            className={`relative transition-all duration-500 ease-out
              ${index === activeIndex ? 'z-10' : 'z-0'}`}
            onClick={() => setActiveIndex(index)}
          >
            <Card3D isActive={index === activeIndex}>
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Institution Details */}
                <div className="lg:w-1/2 p-8 rounded-xl backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <GraduationCap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400 mb-1">{edu.degree}</h3>
                      <p className="text-gray-300">{edu.institution}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-400 hover:text-blue-300 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 hover:text-blue-300 transition-colors">
                      <Navigation2 className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                    {edu.gpa && (
                      <div className="flex items-center gap-3 text-gray-400 hover:text-blue-300 transition-colors">
                        <Award className="w-4 h-4" />
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Courses */}
                <div className="lg:w-1/2 p-8 rounded-xl backdrop-blur-sm">
                  <h4 className="text-lg font-medium text-purple-400 mb-4">Key Courses</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {edu.courses.map((course, courseIndex) => (
                      <div
                        key={courseIndex}
                        className="group flex items-center gap-2 text-gray-300 
                                 hover:text-purple-300 transition-all duration-300 
                                 transform hover:translate-x-1"
                      >
                        <div className="w-1 h-1 rounded-full bg-purple-500/50 
                                      group-hover:bg-purple-400 transition-colors" />
                        <span className="text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card highlight effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(
                    120deg,
                    rgba(59, 130, 246, 0.03) 0%,
                    rgba(139, 92, 246, 0.03) 100%
                  )`,
                  opacity: index === activeIndex ? 0.5 : 0
                }}
              />
            </Card3D>
          </div>
        ))}
      </div>

      {/* Background decorations */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, rgba(59, 130, 246, ${0.02 + scrollProgress * 0.05}) 0%, transparent 70%)`,
          transform: `translateY(${scrollProgress * 50}px) rotate(${scrollProgress * 180}deg)`
        }}
      />
      <div 
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, rgba(139, 92, 246, ${0.02 + scrollProgress * 0.05}) 0%, transparent 70%)`,
          transform: `translateY(${-scrollProgress * 50}px) rotate(${-scrollProgress * 180}deg)`
        }}
      />
    </div>
  );
};

export default EducationSection;