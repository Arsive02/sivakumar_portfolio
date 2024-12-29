import { X, ExternalLink, Github, Calendar, Building, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import PDFViewer from '../shared/PDFViewer';

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    longDescription?: string;
    tags: string[];
    githubUrl?: string;
    demoUrl?: string;
    image?: string;
    organization?: string;
    date?: string;
    challenges?: string[];
    techStack?: string[];
    features?: string[];
    report?: string;
  };
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Trigger animation after mount
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPDFOpen) {
          setIsPDFOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isPDFOpen]);

  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 
                    overflow-y-auto bg-black/0 backdrop-blur-none transition-all duration-500
                    ${isVisible ? 'bg-black/80 backdrop-blur-sm' : ''}`}>
        <div 
          className="fixed inset-0"
          onClick={onClose}
        />
        
        <div className={`relative w-full max-w-4xl mx-auto transform transition-all duration-500
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-gray-900/95 
                        rounded-2xl shadow-2xl overflow-hidden border border-blue-500/20
                        backdrop-blur-xl">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white 
                       bg-gray-800/50 rounded-full backdrop-blur-sm
                       transition-all duration-300 hover:bg-gray-700/50 z-10
                       hover:scale-110 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Project Image */}
            <div className="relative h-72 overflow-hidden">
              <img 
                src={project.image || "/api/placeholder/800/400"} 
                alt={project.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 
                           bg-clip-text text-transparent">{project.title}</h2>
                
                {/* Organization & Date */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  {project.organization && (
                    <div className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-300">
                      <Building className="w-4 h-4" />
                      <span>{project.organization}</span>
                    </div>
                  )}
                  {project.date && (
                    <div className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-300">
                      <Calendar className="w-4 h-4" />
                      <span>{project.date}</span>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.report && (
                    <button
                      onClick={() => setIsPDFOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500/10 
                               border border-blue-500/20 rounded-lg text-blue-300
                               hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-200
                               transition-all duration-300 hover:-translate-y-1 hover:shadow-lg 
                               hover:shadow-blue-500/20 group"
                    >
                      <FileText className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Research Paper</span>
                    </button>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-500/10 
                               border border-emerald-500/20 rounded-lg text-emerald-300
                               hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-200
                               transition-all duration-300 hover:-translate-y-1 hover:shadow-lg 
                               hover:shadow-emerald-500/20 group"
                    >
                      <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Source</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-500/10 
                               border border-purple-500/20 rounded-lg text-purple-300
                               hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-200
                               transition-all duration-300 hover:-translate-y-1 hover:shadow-lg 
                               hover:shadow-purple-500/20 group"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Key Features</h3>
                  <ul className="space-y-3 text-gray-300">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <span className="text-blue-500 transform group-hover:scale-125 
                                     transition-transform duration-300">•</span>
                        <span className="group-hover:text-blue-300 transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Challenges */}
              {project.challenges && project.challenges.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Technical Challenges</h3>
                  <ul className="space-y-3 text-gray-300">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <span className="text-blue-500 transform group-hover:scale-125 
                                     transition-transform duration-300">•</span>
                        <span className="group-hover:text-blue-300 transition-colors duration-300">
                          {challenge}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-sm rounded-full bg-blue-500/10 text-blue-300 
                                 border border-blue-500/20 hover:border-blue-500/40 
                                 transition-all duration-300 hover:scale-105 hover:-translate-y-1
                                 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-800/50">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-gray-800/50 text-gray-300
                             hover:bg-gray-700/50 transition-all duration-300 hover:scale-105
                             backdrop-blur-sm border border-gray-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Background Gradient Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      {project.report && (
        <PDFViewer
          isOpen={isPDFOpen}
          onClose={() => setIsPDFOpen(false)}
          pdfUrl={project.report}
          title={`${project.title} - Research Paper`}
        />
      )}
    </>
  );
};

export default ProjectModal;