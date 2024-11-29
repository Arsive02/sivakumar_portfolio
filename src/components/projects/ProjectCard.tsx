import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
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
  onClick?: () => void;
}

const ProjectCard = ({ 
  title, 
  description, 
  tags, 
  githubUrl, 
  demoUrl,
  image,
  onClick 
}: ProjectCardProps) => {
  return (
    <div 
      className="group relative bg-gray-900/50 rounded-xl overflow-hidden border border-blue-500/20 
                hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || "/api/placeholder/400/200"} 
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          <div className="flex space-x-3">
            {githubUrl && (
              <a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {demoUrl && (
              <a 
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ProjectCard;