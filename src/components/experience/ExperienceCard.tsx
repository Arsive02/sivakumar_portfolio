import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from './ExperienceData';
import { MapPin, Calendar, ExternalLink, FileText, Github, ArrowRight } from 'lucide-react';
import PDFViewer from '@/components/shared/PDFViewer';

interface ExperienceCardProps {
  experience: Experience;
}

const BulletPoint = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
  <motion.div 
    className="flex items-start gap-3 group"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      duration: 0.5,
      delay,
      ease: [0.23, 1, 0.32, 1]
    }}
  >
    <div className="flex-shrink-0 mt-1.5 flex items-center">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 
                    group-hover:scale-150 transition-transform duration-300" />
      <motion.div 
        className="h-px w-4 bg-gradient-to-r from-blue-500/50 to-transparent
                   transform origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      />
      <ArrowRight className="w-4 h-4 text-blue-500/70 transform 
                            group-hover:translate-x-1 transition-transform duration-300" />
    </div>
    <div className="flex-1 text-gray-300 text-sm leading-relaxed">{children}</div>
  </motion.div>
);

const getTypeStyles = (type: Experience['type']) => {
  switch (type) {
    case 'industry':
      return {
        borderColor: 'border-blue-500',
        hoverBorderColor: 'hover:border-blue-400',
        textColor: 'text-blue-400',
        hoverTextColor: 'group-hover:text-blue-300',
        bgColor: 'bg-blue-500/10',
        hoverBgColor: 'hover:bg-blue-500/20'
      };
    case 'research':
      return {
        borderColor: 'border-purple-500',
        hoverBorderColor: 'hover:border-purple-400',
        textColor: 'text-purple-400',
        hoverTextColor: 'group-hover:text-purple-300',
        bgColor: 'bg-purple-500/10',
        hoverBgColor: 'hover:bg-purple-500/20'
      };
    case 'internship':
      return {
        borderColor: 'border-emerald-500',
        hoverBorderColor: 'hover:border-emerald-400',
        textColor: 'text-emerald-400',
        hoverTextColor: 'group-hover:text-emerald-300',
        bgColor: 'bg-emerald-500/10',
        hoverBgColor: 'hover:bg-emerald-500/20'
      };
  }
};

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const styles = getTypeStyles(experience.type);

  const handleViewDocument = (url: string, title: string) => {
    setPdfUrl(url);
    setPdfTitle(title);
    setShowPDF(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`bg-gray-900/50 border-2 ${styles.borderColor} ${styles.hoverBorderColor} 
                      transition-all duration-300 backdrop-blur-sm max-w-xl
                      hover:shadow-lg hover:shadow-${styles.borderColor}/10 group
                      bg-gradient-to-br from-gray-900/60 to-gray-800/60`}>
          <CardHeader>
            {/* Company Logo/Image */}
            {experience.photo?.src && (
              <div className="mb-4 relative w-16 h-16">
                <img 
                  src={experience.photo.src} 
                  alt={experience.photo.alt}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <div>
                <CardTitle className={`text-xl ${styles.textColor} ${styles.hoverTextColor}
                                    transition-colors duration-300`}>
                  {experience.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {experience.company}
                  {experience.companyType === 'university' && ' - University'}
                  {experience.companyType === 'research-lab' && ' - Research Lab'}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1 group/date">
                <Calendar className={`w-4 h-4 group-hover/date:${styles.textColor} transition-colors`} />
                <span className={`group-hover/date:${styles.textColor} transition-colors`}>
                  {`${experience.period.start} - ${experience.period.end}`}
                </span>
              </div>
              <div className="flex items-center gap-1 group/location">
                <MapPin className={`w-4 h-4 group-hover/location:${styles.textColor} transition-colors`} />
                <span className={`group-hover/location:${styles.textColor} transition-colors`}>
                  {experience.location}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              {experience.highlights.map((highlight, index) => (
                <BulletPoint key={index} delay={index * 0.1}>
                  {highlight}
                </BulletPoint>
              ))}
            </div>

            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {experience.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Badge 
                    variant="secondary"
                    className={`${styles.bgColor} ${styles.hoverBgColor} ${styles.textColor}
                             transform hover:scale-110 transition-all duration-300`}
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2">
            {experience.documents?.certificate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(
                  experience.documents!.certificate!,
                  'Certificate'
                )}
                className={`${styles.textColor} border-${styles.borderColor}/20 hover:border-${styles.borderColor}/40
                         transform hover:scale-105 transition-all duration-300`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Certificate
              </Button>
            )}
            {experience.documents?.report && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(
                  experience.documents!.report!,
                  'Report'
                )}
                className={`${styles.textColor} border-${styles.borderColor}/20 hover:border-${styles.borderColor}/40
                         transform hover:scale-105 transition-all duration-300`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Report
              </Button>
            )}
            {experience.documents?.paper && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(
                  experience.documents!.paper!,
                  'Paper'
                )}
                className={`${styles.textColor} border-${styles.borderColor}/20 hover:border-${styles.borderColor}/40
                         transform hover:scale-105 transition-all duration-300`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Paper
              </Button>
            )}

            {experience.links?.github && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-gray-400 border-gray-500/20 hover:border-gray-500/40
                         transform hover:scale-105 transition-all duration-300"
              >
                <a href={experience.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {experience.links?.project && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-gray-400 border-gray-500/20 hover:border-gray-500/40
                         transform hover:scale-105 transition-all duration-300"
              >
                <a href={experience.links.project} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Project
                </a>
              </Button>
            )}
            {experience.links?.publication && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-gray-400 border-gray-500/20 hover:border-gray-500/40
                         transform hover:scale-105 transition-all duration-300"
              >
                <a href={experience.links.publication} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Publication
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <PDFViewer 
        isOpen={showPDF}
        onClose={() => setShowPDF(false)}
        pdfUrl={pdfUrl}
        title={pdfTitle}
      />
    </>
  );
};