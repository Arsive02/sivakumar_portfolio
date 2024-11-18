import { ArrowRight, Download, X, ExternalLink, Maximize2, Minimize2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

// Types
interface BaseExperience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
  certificate: string;
}

interface Experience extends BaseExperience {
  report?: string;
}

// PDF Viewer Component
interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const PDFViewer = ({ isOpen, onClose, pdfUrl, title = "Document" }: PDFViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mouseIdle, setMouseIdle] = useState(false);
  let mouseTimer: number | null = null;

  useEffect(() => {
    const handleMouseMove = () => {
      setMouseIdle(false);
      if (mouseTimer) {
        window.clearTimeout(mouseTimer);
      }
      mouseTimer = window.setTimeout(() => {
        setMouseIdle(true);
      }, 2000);
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimer) {
        window.clearTimeout(mouseTimer);
      }
    };
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div 
        className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300 ${mouseIdle ? 'opacity-0' : 'opacity-100'}`}
        onMouseEnter={() => setMouseIdle(false)}
      >
        <h2 className="text-white font-medium truncate flex-1">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download = title;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-5 h-5" />
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full h-full p-4">
        <iframe
          src={`${pdfUrl}#view=FitH`}
          className="w-full h-full rounded-lg border border-white/10 bg-white"
          title={title}
        />
      </div>
    </div>
  );
};

// View/Download Button Component
const DocumentButton = ({ 
  href, 
  filename, 
  label, 
  colorClass = "blue",
  onView
}: { 
  href: string; 
  filename: string; 
  label: string;
  colorClass?: "blue" | "purple";
  onView: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer select-none";
  const colorVariants = {
    blue: "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300",
    purple: "bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:text-purple-300"
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={onView}
        className={`${baseClasses} ${colorVariants[colorClass]} hover:scale-105`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`View ${label}`}
      >
        <Eye className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
        <span className="text-sm font-medium">View</span>
      </button>

      <button
        onClick={() => {
          const link = document.createElement('a');
          link.href = href;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        className={`${baseClasses} ${colorVariants[colorClass]} hover:scale-105`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Download ${label}`}
      >
        <Download 
          className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-y-0.5' : ''}`} 
        />
        <span className="text-sm font-medium">Download</span>
      </button>
    </div>
  );
};

// Experience Card Components
export const DataScientistCard = ({ experience }: { experience: Experience }) => {
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState({ url: '', title: '' });
  
    return (
      <>
        <div className="relative p-6 rounded-xl bg-gray-900/50 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/40 group">
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-1">{experience.title}</h3>
              <p className="text-gray-400">{experience.company}</p>
            </div>
            <span className="text-sm text-gray-500">{experience.period}</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            {experience.highlights.map((highlight, i) => (
              <li key={i} className="flex gap-3 text-gray-300 group/item">
                <ArrowRight className="w-5 h-5 text-blue-500/70 shrink-0 mt-1 transition-transform duration-300 group-hover/item:translate-x-1" />
                <span className="text-sm leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 flex justify-end">
            <DocumentButton 
              href={experience.certificate}
              filename={`${experience.company}_DS_Certificate.pdf`}
              label="Certificate"
              onView={() => {
                setSelectedPdf({
                  url: experience.certificate,
                  title: `${experience.company} Data Scientist Certificate`
                });
                setPdfViewerOpen(true);
              }}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
        </div>
  
        <PDFViewer
          isOpen={pdfViewerOpen}
          onClose={() => setPdfViewerOpen(false)}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
        />
      </>
    );
  };

  export const TraineeCard = ({ experience }: { experience: Experience }) => {
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: '', title: '' });

  return (
    <>
  <div className="relative p-6 rounded-xl bg-gray-900/50 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/40 group">
    <div className="mb-4 flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-blue-400 mb-1">{experience.title}</h3>
        <p className="text-gray-400">{experience.company}</p>
      </div>
      <span className="text-sm text-gray-500">{experience.period}</span>
    </div>
    
    <ul className="space-y-3 mb-6">
      {experience.highlights.map((highlight, i) => (
        <li key={i} className="flex gap-3 text-gray-300 group/item">
          <ArrowRight className="w-5 h-5 text-blue-500/70 shrink-0 mt-1 transition-transform duration-300 group-hover/item:translate-x-1" />
          <span className="text-sm leading-relaxed">{highlight}</span>
        </li>
      ))}
    </ul>
    
    <div className="mt-4 flex justify-end">
          <DocumentButton 
            href={experience.certificate}
            filename={`${experience.company}_Trainee_Certificate.pdf`}
            label="Certificate"
            onView={() => {
              setSelectedPdf({
                url: experience.certificate,
                title: `${experience.company} Trainee Certificate`
              });
              setPdfViewerOpen(true);
            }}
          />
        </div>
    </div>
    
    <PDFViewer
        isOpen={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        pdfUrl={selectedPdf.url}
        title={selectedPdf.title}
      />
    </>
    );
}
    
export const InternCard = ({ experience }: { experience: Experience }) => {
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState({ url: '', title: '' });
    return (
        <>
        <div className="relative p-6 rounded-xl bg-gray-900/50 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/40 group">
            <div className="mb-4 flex justify-between items-start">
            <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-1">{experience.title}</h3>
                <p className="text-gray-400">{experience.company}</p>
            </div>
            <span className="text-sm text-gray-500">{experience.period}</span>
            </div>
            
            <ul className="space-y-3 mb-6">
            {experience.highlights.map((highlight, i) => (
                <li key={i} className="flex gap-3 text-gray-300 group/item">
                <ArrowRight className="w-5 h-5 text-blue-500/70 shrink-0 mt-1 transition-transform duration-300 group-hover/item:translate-x-1" />
                <span className="text-sm leading-relaxed">{highlight}</span>
                </li>
            ))}
            </ul>
            
            <div className="mt-4 flex justify-end gap-2">
            <DocumentButton 
            href={experience.certificate}
            filename={`${experience.company}_Intern_Certificate.pdf`}
            label="Certificate"
            onView={() => {
                setSelectedPdf({
                url: experience.certificate,
                title: `${experience.company} Internship Certificate`
                });
                setPdfViewerOpen(true);
            }}
            />
            {experience.report && (
            <DocumentButton 
                href={experience.report}
                filename={`${experience.company}_Internship_Report.pdf`}
                label="Report"
                colorClass="purple"
                onView={() => {
                setSelectedPdf({
                    url: experience.report!,
                    title: `${experience.company} Internship Report`
                });
                setPdfViewerOpen(true);
                }}
            />
            )}
        </div>
        </div>

        <PDFViewer
        isOpen={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        pdfUrl={selectedPdf.url}
        title={selectedPdf.title}
        />
    </>
    );
}

const ExperienceCardsDemo = () => {
    const sampleExperience = {
        title: "Data Scientist",
        company: "ZOHO",
        period: "May 2022 – July 2024",
        certificate: "/path/to/certificate.pdf",
        report: "/path/to/report.pdf",
        highlights: [
        "Advanced RAG Architecture: Developed and scaled an advanced Retrieval-Augmented Generation (RAG) system",
        "Implemented diverse AI solutions, including customer assistance prediction",
        "Multimodality Research: Engaged in foundational work on multimodal AI systems"
        ]
    };
    
    return (
        <div className="space-y-8 p-8 max-w-2xl mx-auto bg-black">
        <DataScientistCard experience={sampleExperience} />
        <TraineeCard experience={sampleExperience} />
        <InternCard experience={sampleExperience} />
        </div>
    );
    };
export default ExperienceCardsDemo;