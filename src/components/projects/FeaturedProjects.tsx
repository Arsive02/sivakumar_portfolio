import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

const FeaturedProjects = () => {
  const featuredProjects = [
    {
      title: "RAG Architecture",
      description: "Advanced Retrieval-Augmented Generation system using VLLM, supporting millions of users with multi-modal input processing and reduced hallucinations.",
      tags: ["LLM", "VLLM", "RAG", "Python"],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Aerial Depth Mapping",
      description: "Deep learning models architecturally optimized for edge devices, enabling drones to estimate depth more efficiently.",
      tags: ["Deep Learning", "Computer Vision", "Edge Computing"],
      githubUrl: "https://github.com/yourusername/aerial-depth",
      demoUrl: "https://praisecu.github.io/research-areas",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Edge AIoT for Product Inspection",
      description: "CNN and SVM models for defective microchip identification with 98% accuracy using AWS DynamoDB, Flask, and Raspberry Pi.",
      tags: ["IoT", "Machine Learning", "AWS", "Flask"],
      githubUrl: "https://github.com/yourusername/edge-aiot",
      image: "/api/placeholder/400/200"
    }
  ];

  return (
    <div>
      {/* Grid of Featured Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link 
          to="/projects"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 
                  border border-blue-500/20 hover:border-blue-500/40 rounded-lg transition-all duration-300
                  text-blue-400 hover:text-blue-300"
        >
          <span>View All Projects</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProjects;