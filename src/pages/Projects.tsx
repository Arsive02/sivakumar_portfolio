import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Float, Stars } from '@react-three/drei';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import MobiusStrip from '../components/home/animations/MobiusStrip';


function TelescopeModel() {
  const { scene } = useGLTF("/models/the_james_webb_space_telescope/scene.gltf");

  return (
    <Float 
      speed={0.75} // Animation speed
      rotationIntensity={0.5} // Rotation intensity
      floatIntensity={0.4} // Float animation intensity
    >
      <primitive 
        object={scene} 
        scale={1.5}
        position={[12, 12, 10]}
      />
    </Float>
  );
}

const Title3D = () => {
  return (
    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-left z-20 pointer-events-none">
      <h1 className="relative perspective-[1000px] group">
        <span className="text-4xl md:text-6xl font-bold block transform-gpu 
                 transition-all duration-500 ease-out
                 hover:transform hover:translate-z-10 group-hover:skew-x-6
                 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          {/* Split text into individual characters for 3D effect */}
          {"Projects & Research".split('').map((char, i) => (
            <span 
              key={i}
              className="inline-block hover:animate-float-text"
              style={{
              textShadow: `
              0 1px 0 #ccc,
              0 2px 0 #c9c9c9,
              0 3px 0 #bbb,
              0 4px 0 #b9b9b9,
              0 5px 0 #aaa,
              0 6px 1px rgba(0,0,0,.1),
              0 0 5px rgba(0,0,0,.1),
              0 1px 3px rgba(0,0,0,.3),
              0 3px 5px rgba(0,0,0,.2),
              0 5px 10px rgba(0,0,0,.25),
              0 10px 10px rgba(0,0,0,.2),
              0 20px 20px rgba(0,0,0,.15)
              `,
              animation: `float-text 8s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              color: 'white'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </h1>
      <p className="text-yellow-300 text-lg max-w-2xl mt-8 opacity-90 transform-gpu
            transition-all duration-500 ease-out relative
            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-r before:from-transparent before:via-yellow-500/5 before:to-transparent
            before:animate-shine">
        Exploring the frontiers of AI and Machine Learning
      </p>

      {/* Add custom keyframes for animations */}
      <style>{`
        @keyframes float-text {
          0%, 100% {
            transform: translateY(0) translateZ(0) rotateX(0);
          }
          25% {
            transform: translateY(-4px) translateZ(20px) rotateX(10deg);
          }
          75% {
            transform: translateY(4px) translateZ(-20px) rotateX(-10deg);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};


const TelescopeScene = () => {
  return (
    <div className="h-[50vh] w-full rounded-xl overflow-hidden relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />
      
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        className="bg-black"
      >
        <Stage
          preset="rembrandt"
          intensity={0.5}
          environment="city"
        >
          <TelescopeModel />
        </Stage>
        
        {/* Add stars in the background */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      <Title3D />
    </div>
  );
};

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const allProjects = [
    {
      title: "RAG Architecture",
      description: "Advanced Retrieval-Augmented Generation system using VLLM, supporting millions of users with multi-modal input processing and reduced hallucinations.",
      longDescription: `An advanced RAG system that processes multi-modal inputs and provides accurate responses with minimal hallucinations. The system was designed to handle millions of users efficiently using VLLM for optimized inference.`,
      organization: "Zoho",
      date: "2023 - 2024",
      tags: ["LLM", "VLLM", "RAG", "Python"],
      techStack: ["Python", "VLLM", "PyTorch", "FastAPI", "Redis", "PostgreSQL"],
      features: [
        "Multi-modal input processing supporting text, images, and structured data",
        "Advanced retrieval mechanism with hybrid search",
        "Real-time response generation with minimal latency",
        "Scalable architecture supporting millions of concurrent users"
      ],
      challenges: [
        "Optimizing inference speed while maintaining response quality",
        "Implementing efficient caching mechanisms for frequent queries",
        "Designing a scalable architecture for handling concurrent requests",
        "Reducing hallucinations through context-aware filtering"
      ],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Aerial Depth Mapping",
      description: "Deep learning models architecturally optimized for edge devices, enabling drones to estimate depth more efficiently.",
      longDescription: `A cutting-edge computer vision system designed specifically for drones, implementing efficient depth estimation algorithms optimized for edge devices. The system enables real-time depth mapping with minimal computational overhead.`,
      organization: "University of Colorado Boulder",
      date: "Sep 2024 - Current",
      tags: ["Deep Learning", "Computer Vision", "Edge Computing"],
      techStack: ["Python", "PyTorch", "OpenCV", "TensorRT", "Docker"],
      features: [
        "Real-time depth estimation on edge devices",
        "Optimized neural network architecture for mobile GPUs",
        "Custom data pipeline for drone imagery",
        "Automated calibration system"
      ],
      challenges: [
        "Optimizing model size while maintaining accuracy",
        "Implementing efficient data processing pipeline",
        "Handling various lighting conditions and environments",
        "Reducing power consumption for extended flight time"
      ],
      githubUrl: "https://github.com/yourusername/aerial-depth",
      demoUrl: "https://praisecu.github.io/research-areas",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Edge AIoT for Product Inspection",
      description: "CNN and SVM models for defective microchip identification with 98% accuracy using AWS DynamoDB, Flask, and Raspberry Pi.",
      longDescription: `An automated quality control system using computer vision and machine learning to detect defective microchips. The system achieves 98% accuracy and is deployed on edge devices for real-time inspection.`,
      organization: "Sri Sai Ram Engineering College",
      date: "Feb 2021 – May 2021",
      tags: ["IoT", "Machine Learning", "AWS", "Flask"],
      techStack: ["Python", "TensorFlow", "AWS DynamoDB", "Flask", "Raspberry Pi", "OpenCV"],
      features: [
        "Real-time defect detection with 98% accuracy",
        "Cloud-based data storage and analysis",
        "Web interface for monitoring and control",
        "Automated reporting system"
      ],
      challenges: [
        "Training models with limited labeled data",
        "Optimizing inference on resource-constrained devices",
        "Implementing reliable error handling",
        "Ensuring consistent performance across different lighting conditions"
      ],
      githubUrl: "https://github.com/yourusername/edge-aiot",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Autonomous Ground Vehicle",
      description: "AGV bot with lane & object detection, and navigation using Raspberry Pi, Jetson Nano, and YOLOv4.",
      longDescription: `An autonomous ground vehicle system implementing advanced computer vision techniques for lane detection, object recognition, and path planning. The system uses YOLOv4 for real-time object detection and custom algorithms for navigation.`,
      organization: "Sri Sai Ram Engineering College",
      date: "November 2019 - February 2022",
      tags: ["Computer Vision", "Robotics", "YOLO"],
      techStack: ["Python", "YOLOv4", "ROS", "OpenCV", "Raspberry Pi", "Jetson Nano"],
      features: [
        "Real-time lane detection and tracking",
        "Object detection and avoidance",
        "Autonomous navigation system",
        "Remote monitoring interface"
      ],
      challenges: [
        "Implementing robust lane detection in varying conditions",
        "Optimizing YOLOv4 for edge devices",
        "Developing reliable path planning algorithms",
        "Integration of multiple sensor systems"
      ],
      githubUrl: "https://github.com/yourusername/agv",
      image: "/api/placeholder/400/200"
    }
  ];

// Get all unique tags
  const allTags = Array.from(
    new Set(allProjects.flatMap(project => project.tags))
  ).sort();

  // Filter projects based on search and tag
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            to="/home" 
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <MobiusStrip />
          </div>
        </div>
      </header>

      {/* Telescope Scene */}
      <div className="pt-20">
        <TelescopeScene />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Tags Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              !selectedTag 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-900/50 text-gray-300 hover:bg-gray-900'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedTag === tag 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.title} 
              {...project} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No projects found matching your criteria.</p>
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400">
          © {new Date().getFullYear()} Sivakumar Ramakrishnan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProjectsPage;