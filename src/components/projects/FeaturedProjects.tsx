import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

const FeaturedProjects = () => {
  const featuredProjects = [
    {
      title: "RAG Architecture",
      description: "Advanced Retrieval-Augmented Generation system using VLLM, supporting millions of users with multi-modal input processing and reduced hallucinations.",
      tags: ["LLM", "VLLM", "RAG", "Python"],
      image: "/assets/imgs/zoho.png"
    },
    {
      title: "Edge AIoT for Product Inspection",
      description: "CNN and SVM models for defective microchip identification with 98% accuracy using AWS DynamoDB, Flask, and Raspberry Pi.",
      tags: ["IoT", "Machine Learning", "AWS", "Flask"],
      image: "/assets/imgs/edge.png"
    },
    {
      title: "Autonomous Ground Vehicle",
      description: "Developed AGV bot with lane & object detection. Implemented navigation using Raspberry Pi, Jetson Nano, and YOLOv4.",
      tags: ["Computer Vision", "Robotics", "YOLO", "Python", "Raspberry Pi", "Jetson Nano"],
      image: "/assets/imgs/agv.png",
      githubUrl: "https://github.com/Balaji-th/Autonomous_Vehicle",
      projectUrl: "https://youtu.be/48irckF3vA0?feature=shared"
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