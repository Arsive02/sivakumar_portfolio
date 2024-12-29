import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Image as ImageIcon, X } from 'lucide-react';
import React from 'react';
import PDFViewer from '../shared/PDFViewer';

type AchievementCarouselProps = {
  data: Array<{
    title: string;
    description: string;
    longDescription: string;
    issuer: string;
    date: string;
    credentialId?: string;
    skills: string[];
    category?: string;
    verificationLink?: string;
    highlights: string[];
    certificateImage?: string;
    certificatePDF?: string;
  }>;
};

interface CardProps {
  data: {
    title: string;
    issuer: string;
    date: string;
    verificationLink?: string;
    certificateImage?: string;
    certificatePDF?: string;
    longDescription: string;
    skills?: (string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined)[];
    highlights?: (string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined)[];
    credentialId?: string;
  };
  position: number;
  direction: number;
  onClick: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ data, position, onClick }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!data) {
    return null;
  }

  const cardVariants = {
    previousSlide: {
      x: '-130%',
      scale: 0.85,
      opacity: 0.5,
      zIndex: 0,
      transition: { duration: 0.4 }
    },
    currentSlide: {
      x: '-50%',
      scale: 1,
      opacity: 1,
      zIndex: 2,
      transition: { duration: 0.4 }
    },
    nextSlide: {
      x: '30%',
      scale: 0.85,
      opacity: 0.5,
      zIndex: 0,
      transition: { duration: 0.4 }
    }
  };

  const getCardState = () => {
    switch (position) {
      case -1: return 'previousSlide';
      case 0: return 'currentSlide';
      case 1: return 'nextSlide';
      default: return 'currentSlide';
    }
  };

  const handleCertificateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.certificatePDF) {
      setIsPDFOpen(true);
    } else if (data.certificateImage) {
      setIsImageOpen(true);
    }
  };

  const handleImageClose = () => {
    setIsImageOpen(false);
  };

  return (
    <>
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial={false}
        animate={getCardState()}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="absolute top-0 left-1/2 w-full max-w-3xl cursor-pointer"
      >
        <motion.div 
          className="rounded-2xl overflow-hidden"
          animate={{
            y: isHovered && position === 0 ? -8 : 0,
            boxShadow: isHovered && position === 0 
              ? '0 20px 40px rgba(255, 215, 0, 0.15)' 
              : '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="relative bg-[#121212] p-8 border border-[#2a2a2a]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <motion.h2 
                  className="text-2xl font-bold text-white mb-2"
                  animate={{ scale: isHovered && position === 0 ? 1.02 : 1 }}
                >
                  {data.title}
                </motion.h2>
                <div className="flex items-center gap-4 text-[#B8860B]">
                  <span>{data.issuer}</span>
                  <span>•</span>
                  <span>{data.date}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {(data.certificatePDF || data.certificateImage) && (
                  <motion.button
                    onClick={handleCertificateClick}
                    className="p-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333333] transition-colors group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {data.certificatePDF ? (
                      <FileText className="w-5 h-5 text-[#FFD700] group-hover:text-white" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#FFD700] group-hover:text-white" />
                    )}
                  </motion.button>
                )}
                {data.verificationLink && (
                  <motion.a
                    href={data.verificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333333] transition-colors group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink className="w-5 h-5 text-[#FFD700] group-hover:text-white" />
                  </motion.a>
                )}
              </div>
            </div>

            {/* Rest of the card content remains the same */}
            <motion.p 
              className="text-gray-300 leading-relaxed mb-6"
              animate={{ opacity: position === 0 ? 1 : 0.7 }}
            >
              {data.longDescription}
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={false}
              animate="visible"
            >
              {data.skills?.map((skill, idx) => (
                <motion.span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm bg-[#2a2a2a] text-[#FFD700] border border-[#333333]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: position === 0 ? 1 : 0.7, y: 0 }}
                  transition={{ 
                    delay: (typeof idx === 'number' ? idx : 0) * 0.1,
                    duration: 0.3
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>

            {data.highlights && (
              <motion.div 
                className="space-y-4"
                initial={false}
                animate="visible"
              >
                <h3 className="text-lg font-semibold text-white">Key Highlights</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: position === 0 ? 1 : 0.7, x: 0 }}
                      transition={{ 
                        delay: (typeof idx === 'number' ? idx : 0) * 0.1,
                        duration: 0.3
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                      <span className="text-sm">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* PDF Viewer */}
      {data.certificatePDF && (
        <PDFViewer
          isOpen={isPDFOpen}
          onClose={() => setIsPDFOpen(false)}
          pdfUrl={data.certificatePDF}
          title={`${data.title} - Certificate`}
        />
      )}

      {/* Image Viewer Modal */}
      {isImageOpen && data.certificateImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={handleImageClose}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img 
              src={data.certificateImage} 
              alt={`${data.title} Certificate`}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={handleImageClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
});

const EnhancedAchievementCarousel = ({ data = [] }: AchievementCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Reset index when data changes
  useEffect(() => {
    setActiveIndex(0);
    setDirection(0);
  }, [data]);

  // Add safety check for empty data
  if (!data || data.length === 0) {
    return null;
  }

  const navigate = (newDirection: number) => {
    const newIndex = activeIndex + newDirection;
    if (newIndex >= 0 && newIndex < data.length) {
      setDirection(newDirection);
      setActiveIndex(newIndex);
    }
  };

  const getVisibleCards = () => {
    const cards = [];
    
    // Add safety checks for array bounds
    if (activeIndex > 0 && data[activeIndex - 1]) {
      cards.push({ index: activeIndex - 1, position: -1 });
    }
    
    if (data[activeIndex]) {
      cards.push({ index: activeIndex, position: 0 });
    }
    
    if (activeIndex < data.length - 1 && data[activeIndex + 1]) {
      cards.push({ index: activeIndex + 1, position: 1 });
    }
    
    return cards;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto px-4">
        {/* Navigation buttons */}
        {activeIndex > 0 && (
          <motion.button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#2a2a2a] hover:bg-[#333333] border border-[#404040]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 text-[#FFD700]" />
          </motion.button>
        )}
        
        {activeIndex < data.length - 1 && (
          <motion.button
            onClick={() => navigate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#2a2a2a] hover:bg-[#333333] border border-[#404040]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 text-[#FFD700]" />
          </motion.button>
        )}

        {/* Cards container */}
        <div className="relative w-full h-[700px]">
          <AnimatePresence initial={false} mode="popLayout">
            {getVisibleCards().map(({ index, position }) => (
              <Card
                key={index}
                data={data[index]}
                position={position}
                direction={direction}
                onClick={() => position !== 0 && navigate(position)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Progress indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {data.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                const newDirection = idx > activeIndex ? 1 : -1;
                setDirection(newDirection);
                setActiveIndex(idx);
              }}
              className={`transition-all duration-300 ${
                idx === activeIndex 
                  ? 'w-8 h-2 bg-[#FFD700]' 
                  : 'w-2 h-2 bg-[#2a2a2a] hover:bg-[#404040]'
              } rounded-full`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAchievementCarousel;