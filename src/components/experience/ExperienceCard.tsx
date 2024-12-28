import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from './ExperienceData';
import { MapPin, Calendar, ExternalLink, FileText, Github} from 'lucide-react';
import PDFViewer from '@/components/shared/PDFViewer';

interface ExperienceCardProps {
  experience: Experience;
  alignment: 'left' | 'right';
}

export const ExperienceCard = ({ experience, alignment }: ExperienceCardProps) => {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  const handleViewDocument = (url: string, title: string) => {
    setPdfUrl(url);
    setPdfTitle(title);
    setShowPDF(true);
  };

  return (
    <>
      <Card className="bg-gray-900/50 border-blue-500/20 hover:border-blue-500/40 
                    transition-all duration-300 backdrop-blur-sm max-w-xl">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle className="text-xl text-blue-400">{experience.title}</CardTitle>
              <CardDescription className="text-gray-400">{experience.company}</CardDescription>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{`${experience.period.start} - ${experience.period.end}`}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{experience.location}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Highlights */}
          <ul className="space-y-2">
            {experience.highlights.map((highlight, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: alignment === 'left' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-300 text-sm"
              >
                {highlight}
              </motion.li>
            ))}
          </ul>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          {/* Documents */}
          {experience.documents?.certificate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDocument(
                experience.documents!.certificate!,
                'Certificate'
              )}
              className="text-blue-400 border-blue-500/20 hover:border-blue-500/40"
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
              className="text-purple-400 border-purple-500/20 hover:border-purple-500/40"
            >
              <FileText className="w-4 h-4 mr-2" />
              Report
            </Button>
          )}

          {/* External Links */}
          {experience.links?.github && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-gray-400 border-gray-500/20 hover:border-gray-500/40"
            >
              <a href={experience.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {experience.links?.publication && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-gray-400 border-gray-500/20 hover:border-gray-500/40"
            >
              <a href={experience.links.publication} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Publication
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* PDF Viewer */}
      <PDFViewer 
        isOpen={showPDF}
        onClose={() => setShowPDF(false)}
        pdfUrl={pdfUrl}
        title={pdfTitle}
      />
    </>
  );
};