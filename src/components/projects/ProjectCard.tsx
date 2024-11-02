interface ProjectCardProps {
    title: string;
    description: string;
    image: string;
    projectLink?: string;
    tags: string[];
  }
  
  const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    description,
    image,
    projectLink,
    tags
  }) => {
    return (
      <div className="project-card">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-64 object-cover"
          />
          <div className="project-overlay">
            {projectLink ? (
              <a 
                href={projectLink} 
                className="project-link" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Project
              </a>
            ) : (
              <span className="project-link">View Details</span>
            )}
          </div>
        </div>
  
        <div className="p-6 bg-gray-800 rounded-b-lg">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p>{description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="tech-tag"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;