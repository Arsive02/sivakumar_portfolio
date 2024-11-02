import { Link } from 'react-router-dom';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

const featuredProjects: Project[] = [
  {
    title: "AI-Powered Visual Analysis",
    description: "Deep learning model for real-time visual analysis with edge computing capabilities",
    image: "/path-to-image1.jpg",
    tags: ["Python", "TensorFlow", "Computer Vision"]
  },
  {
    title: "NLP Research Project",
    description: "Advanced language processing system using transformer architecture",
    image: "/path-to-image2.jpg",
    tags: ["Python", "PyTorch", "NLP"]
  }
];

const ProjectCard: React.FC<Project> = ({ title, description, image, tags }) => {
  return (
    <div className="card rounded-lg overflow-hidden">
      <div 
        className="h-48 bg-gray-800"
        style={{ 
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          {title}
        </h3>
        <p>{description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-600/20 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedProjects = () => {
  return (
    <section className="section py-20 bg-gray-900/50 fade-in-section">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold gradient-text">
            Featured Projects
          </h2>
          <Link 
            to="/projects" 
            className="text-blue-500 hover:text-blue-400"
          >
            View All Projects →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;