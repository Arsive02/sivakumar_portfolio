import { ExternalLink, Github, FileText } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  report?: string;
  image?: string;
  organization?: string;
  date?: string;
  challenges?: string[];
  techStack?: string[];
  features?: string[];
  onClick?: () => void;
  onReportClick?: () => void;
}

const ProjectCard = ({ 
  title, 
  description, 
  tags, 
  githubUrl, 
  demoUrl,
  report,
  image,
  onClick,
  onReportClick
}: ProjectCardProps) => {
  return (
    <div 
      className="group relative bg-gradient-to-br from-gray-900/80 via-gray-900/90 to-gray-900/80 rounded-xl 
                overflow-hidden border border-blue-500/20 backdrop-blur-sm
                hover:border-blue-400/50 transition-all duration-700 cursor-pointer
                hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-2
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-blue-500/10 before:to-transparent before:translate-x-[-200%] 
                before:transition-transform before:duration-[1.5s] before:group-hover:translate-x-[200%]
                after:absolute after:inset-0 after:bg-gradient-to-b after:from-blue-500/0 
                after:via-blue-500/5 after:to-blue-500/0 after:opacity-0 
                after:group-hover:opacity-100 after:transition-opacity after:duration-700"
      onClick={onClick}
    >
      {/* Project Image with Enhanced Hover Effect */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={image || "/api/placeholder/400/200"} 
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 
                   transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent 
                      opacity-70 group-hover:opacity-50 transition-all duration-700" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute h-2 w-2 bg-blue-400/20 rounded-full top-1/4 left-1/4 
                       animate-ping [animation-duration:3s]" />
          <div className="absolute h-2 w-2 bg-blue-400/20 rounded-full top-3/4 left-3/4 
                       animate-ping [animation-duration:2s]" />
          <div className="absolute h-2 w-2 bg-blue-400/20 rounded-full top-1/2 right-1/4 
                       animate-ping [animation-duration:2.5s]" />
        </div>
      </div>

      {/* Content Section with Enhanced Animation */}
      <div className="p-6 space-y-4 relative">
        {/* Header with Glowing Effect */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r 
                       from-blue-400 to-blue-300 group-hover:from-blue-300 group-hover:to-cyan-200 
                       transition-all duration-700 group-hover:scale-105 transform origin-left">
            {title}
          </h3>
          <div className="flex space-x-4">
            {report && (
              <button
                className="text-gray-400 hover:text-blue-400 transition-all duration-300
                          transform hover:scale-110 hover:-translate-y-1 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onReportClick?.();
                }}
                title="View Research Paper"
              >
                <FileText className="w-5 h-5" />
              </button>
            )}
            {githubUrl && (
              <a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-all duration-300
                         transform hover:scale-110 hover:-translate-y-1 active:scale-95"
                onClick={(e) => e.stopPropagation()}
                title="View Source Code"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {demoUrl && (
              <a 
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-all duration-300
                         transform hover:scale-110 hover:-translate-y-1 active:scale-95"
                onClick={(e) => e.stopPropagation()}
                title="View Demo"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Description with Fade-in Effect */}
        <p className="text-gray-300 text-sm leading-relaxed opacity-90 group-hover:opacity-100 
                   transition-all duration-700 transform group-hover:translate-x-1">
          {description}
        </p>

        {/* Tags with Enhanced Hover Effect */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 
                       border border-blue-500/20 hover:border-blue-400/50 
                       transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                       hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Enhanced Corner Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 
                    opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 
                    transform rotate-180" />
    </div>
  );
};

export default ProjectCard;