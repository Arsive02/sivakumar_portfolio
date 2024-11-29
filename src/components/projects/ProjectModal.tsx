import { X, ExternalLink, Github, Calendar, Building } from 'lucide-react';
import { useEffect } from 'react';

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
  };
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl p-6 mx-auto bg-gray-900/95 border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Project Image */}
        <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
          <img 
            src={project.image || "/api/placeholder/800/400"} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-400">{project.title}</h2>
            
            {/* Organization & Date */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {project.organization && (
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{project.organization}</span>
                </div>
              )}
              {project.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{project.date}</span>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Key Features</h3>
              <ul className="space-y-2 text-gray-300">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Technical Challenges</h3>
              <ul className="space-y-2 text-gray-300">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;