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
      title: "KL Divergence: A Statistical Bridge",
      description: "Empirical investigation of Kullback-Leibler divergence through binary classification using machine learning algorithms and deep learning models, with real-time visualization.",
      longDescription: `A comprehensive study examining the relationship between maximum likelihood estimation and KL divergence minimization across different model architectures. The project implements multiple model architectures including Logistic Regression, Random Forest, and Neural Networks to compare how different approaches affect the distribution matching process.
  
  The research provides both theoretical insights and practical implementations, demonstrating how finding maximum likelihood is equivalent to minimizing KL divergence loss. Additionally, it explores the application of KL divergence in Variational Autoencoders (VAEs), showing its crucial role in latent space regularization.`,
      organization: "University of Colorado",
      date: "December 2024",
      tags: ["Machine Learning", "Statistics", "Deep Learning", "Python", "VAE"],
      techStack: ["Python", "PyTorch", "Scikit-learn", "React", "TensorFlow"],
      features: [
        "Real-time visualization of KL divergence during model training",
        "Implementation of multiple model architectures for comparison",
        "Interactive visualization framework for probability distributions",
        "Comprehensive analysis tools for model performance evaluation",
        "Variational Autoencoder implementation with latent space visualization"
      ],
      challenges: [
        "Developing efficient visualization techniques for real-time training metrics",
        "Implementing robust probability distribution matching across different models",
        "Balancing computational efficiency with model performance",
        "Creating intuitive visualizations for complex statistical concepts"
      ],
      image: "/assets/imgs/KL.png",
      githubUrl: "https://github.com/Arsive02/KL_divergence_statistics",
      report: "/certificates/KL.pdf",
      demoUrl: "https://kl-divergence-statistics.vercel.app"
    },
    {
      title: "Stellar Mapping",
      description: "Deep learning system for automated constellation detection using CNN, Vision Transformer & EfficientNet architectures.",
      longDescription: `An advanced constellation detection system that leverages deep learning and computer vision to automatically identify constellations in astronomical images. The system uses an ensemble of models including CNNs, Vision Transformers, and EfficientNet to achieve robust recognition under varying observational conditions.`,
      organization: "University of Colorado",
      date: "Sep 2024 - Dec 2024",
      tags: ["Deep Learning", "Computer Vision", "Astronomy", "PyTorch"],
      techStack: ["Python", "PyTorch", "CNNs", "Vision Transformers", "EfficientNet"],
      features: [
        "Multi-model ensemble combining CNN, ViT and EfficientNet",
        "Robust performance across varying lighting conditions",
        "Advanced data augmentation pipeline for astronomical imagery",
        "Real-time constellation detection capabilities"
      ],
      challenges: [
        "Handling varying star brightness and atmospheric conditions",
        "Developing rotation-invariant pattern recognition",
        "Processing multi-scale constellation patterns",
        "Maintaining performance under light pollution"
      ],
      image: "/assets/imgs/stellar.png",
      demoUrl: "https://stellarmapping.vercel.app/",
      githubUrl: "https://github.com/rahul7310/stellar_mapping",
      report: "/certificates/Stellar_Mapping_Report.pdf"
    },
    {
      title: "Mamba-Transformer Hybrid Architecture",
      description: "Novel neural architecture combining Mamba's selective state space models with Transformer's attention mechanisms for enhanced sequence modeling performance.",
      longDescription: `An experimental architecture that innovatively combines Mamba's selective state space sequences with Transformer's attention mechanisms to create a hybrid model that leverages the strengths of both approaches. The research explores the complementary nature of these architectures, with Mamba handling long-range dependencies efficiently through state space modeling while Transformers provide focused attention on crucial sequence elements.
  
  The project implements several architectural variations, comparing different integration strategies such as parallel processing, cascaded connections, and adaptive switching between mechanisms. Extensive experimentation was conducted to analyze the trade-offs between computational efficiency, memory usage, and model performance across various sequence lengths and tasks.`,
      organization: "Zoho",
      date: "2024",
      tags: ["Deep Learning", "Mamba", "Transformers", "Neural Architecture", "State Space Models"],
      techStack: ["Python", "PyTorch", "Mamba SSM", "Transformer", "Wandb", "JAX"],
      features: [
        "Novel hybrid architecture combining Mamba and Transformer components",
        "Adaptive mechanism for switching between state space and attention processing",
        "Efficient parallel processing of long sequences",
        "Comprehensive ablation studies and architecture analysis",
      ],
      challenges: [
        "Balancing computational complexity between Mamba and Transformer components",
        "Implementing efficient integration of different architectural paradigms",
        "Optimizing memory usage for long sequence processing",
        "Developing effective training strategies for the hybrid architecture",
        "Creating reliable evaluation methodologies for architectural components"
      ],
      image: "/assets/imgs/mamba.png",
    },
    {
      title: "Invoice Image to JSON using Fine-Tuned PaLiGemma",
      description: "Fine-tuned PaLiGemma model for extracting structured data from invoice images, achieving 88% accuracy in field extraction and JSON conversion.",
      longDescription: `A comprehensive document understanding system that leverages PaLiGemma's multimodal capabilities to convert invoice images into structured JSON data. The system incorporates advanced pre-processing techniques, custom fine-tuning strategies, and post-processing validation to ensure high accuracy and reliability in data extraction.
  
  The model was fine-tuned on a diverse dataset of invoice formats, enabling robust performance across different layouts and styles. The system implements a novel approach to handle edge cases and complex document structures while maintaining high accuracy in field extraction.`,
      organization: "Zoho",
      date: "2024",
      tags: ["Computer Vision", "LLM", "Fine-tuning", "Document AI", "JSON"],
      techStack: ["Python", "PaLiGemma", "PyTorch", "Transformers", "FastAPI"],
      features: [
        "Custom fine-tuning methodology for invoice understanding",
        "Intelligent field extraction with contextual understanding",
        "Automatic JSON schema validation and correction",
      ],
      challenges: [
        "Handling diverse invoice formats and layouts",
        "Implementing efficient fine-tuning strategies for PaLiGemma",
        "Developing robust error handling for various document qualities",
        "Optimizing model performance for production deployment"
      ],
      image: "/assets/imgs/PaliGemma.png",
      githubUrl: "https://huggingface.co/Arsive/paligemma-img-to-json/tree/main",
      demoUrl: "https://huggingface.co/Arsive/paligemma-img-to-json"
    },
    {
      title: "Resume Parser with OCR and Date Extraction",
      description: "Advanced resume parsing system combining OCR, machine learning, and NLP techniques for accurate information and date extraction from various resume formats.",
      longDescription: `An intelligent resume parsing system that combines state-of-the-art OCR technology (used Surya-ocr with GPL Licensing) with specialized NLP models for extracting and standardizing information from resumes. The system features advanced date extraction capabilities, handling multiple formats and contextual date references while maintaining high accuracy.
  
  The solution implements a multi-stage pipeline that includes document preprocessing, OCR optimization, entity recognition, and post-processing validation. Special attention is given to handling ambiguous dates and temporal references commonly found in resumes.`,
      organization: "Zoho",
      date: "2024",
      tags: ["NLP", "OCR", "Information Extraction", "Machine Learning"],
      techStack: ["Python", "Tesseract", "spaCy", "TensorFlow", "Flask"],
      features: [
        "Multi-format resume support (PDF, DOC, DOCX, Images)",
        "Advanced date normalization and standardization",
        "Intelligent section recognition and categorization",
        "Contextual entity extraction and validation"
      ],
      challenges: [
        "Handling various resume formats and structures",
        "Implementing accurate date extraction across different formats",
        "Developing robust section classification"
      ],
      image: "/assets/imgs/resume_parsing.png",
      githubUrl: "https://github.com/VikParuchuri/surya"
    },
    {
      title: "Multimodal AI System",
      description: "Comprehensive multimodal AI system integrating speech, text, image, and video processing for advanced content understanding and generation.",
      longDescription: `A sophisticated multimodal AI system that unifies speech recognition, natural language processing, computer vision, and video analysis into a cohesive framework. The system enables complex interactions across modalities, supporting advanced use cases like video content analysis, multimodal search, and cross-modal generation.
  
  The architecture implements state-of-the-art models for each modality while maintaining efficient cross-modal attention mechanisms and fusion strategies. Special focus is placed on temporal alignment and synchronization across different input types.`,
      organization: "Zoho",
      date: "2023 - 2024",
      tags: ["Multimodal AI", "Deep Learning", "Video Processing", "Speech Recognition"],
      techStack: ["Python", "PyTorch", "OpenAI Whisper", "CLIP", "TimeSformer"],
      features: [
        "Speech-to-text with meeting summarization",
        "Advanced video scene understanding and segmentation with topic detection",
        "Cross-modal search and retrieval capabilities",
        "Text content generation from multimodal inputs",
        "Temporal alignment across modalities"
      ],
      challenges: [
        "Implementing efficient cross-modal attention mechanisms",
        "Handling temporal synchronization across modalities",
        "Developing scalable architecture for real-time processing",
        "Optimizing memory usage for multiple concurrent models",
        "Average performance across different modalities :( But learnt a lot from this project"
      ],
      image: "/assets/imgs/multi.png"
    }, 
    {
      title: "RoBERTa Toxicity Classifier",
      description: "Advanced toxicity detection model based on RoBERTa, fine-tuned for identifying multiple categories of toxic content with high precision and recall.",
      longDescription: `A sophisticated content moderation system built on the RoBERTa architecture, specifically fine-tuned to detect and classify various forms of toxic content. The model has been trained to identify multiple categories of toxicity including hate speech, obscenity, threats, and insults, while maintaining high accuracy and minimizing false positives.
  
  The system employs advanced fine-tuning techniques on RoBERTa to achieve robust performance across different content types and contexts. Special attention was given to handling edge cases and ambiguous content, making it suitable for real-world content moderation applications.`,
      organization: "Personal Project",
      date: "2024",
      tags: ["NLP", "Content Moderation", "RoBERTa", "Machine Learning", "Text Classification"],
      techStack: ["Python", "PyTorch", "Transformers", "HuggingFace", "Datasets"],
      features: [
        "Multi-label toxicity classification across different categories",
        "High precision and recall balancing for practical deployment",
        "Efficient processing of text content in real-time",
        "Comprehensive evaluation across multiple toxicity datasets"
      ],
      challenges: [
        "Balancing model sensitivity to avoid false positives",
        "Handling contextual and cultural nuances in toxic content",
        "Optimizing model size while maintaining performance",
        "Developing robust evaluation metrics for different toxicity types"
      ],
      image: "/assets/imgs/roberta.png",
      demoUrl: "https://huggingface.co/Arsive/roberta-toxicity-classifier",
      githubUrl: "https://huggingface.co/Arsive/roberta-toxicity-classifier/tree/main"
    },
    {
      title: "RLHF with DPO Experimentation",
      description: "Research project exploring Direct Preference Optimization (DPO) for Reinforcement Learning from Human Feedback (RLHF) implementation and analysis.",
      longDescription: `A comprehensive research implementation of Direct Preference Optimization (DPO) for RLHF, focusing on efficient training methodologies and performance analysis. The project explores various aspects of human feedback incorporation and preference learning, with extensive experimentation on different model architectures and training strategies.
  
  The implementation includes detailed comparisons between traditional RLHF approaches and DPO, analyzing aspects such as training stability, convergence rates, and output quality. Experimented this with the RAG architecture.`,
      organization: "Zoho",
      date: "2024",
      tags: ["Reinforcement Learning", "RLHF", "DPO", "Machine Learning"],
      techStack: ["Python", "PyTorch", "Transformers", "Weights & Biases", "Ray"],
      features: [
        "Comprehensive DPO implementation for RLHF",
        "Advanced preference learning mechanisms",
        "Comparative study with traditional RLHF approaches",
      ],
      challenges: [
        "Implementing efficient preference learning algorithms",
        "Optimizing computational resources for large-scale training",
        "Creating reliable evaluation metrics"
      ],
      image: "/assets/imgs/rlhf.png"
    },
    {
      title: "Goodreads Rating Prediction - Kaggle Competition Winner",
      description: "First place solution in Kaggle competition using fine-tuned T5 generative model for book review rating prediction, achieving state-of-the-art accuracy on the Goodreads dataset.",
      longDescription: `An innovative approach to book review rating prediction that challenged traditional classification methods by utilizing T5, a generative language model. The project achieved first place in a Kaggle competition by implementing a novel fine-tuning strategy that enabled the model to accurately predict ratings on a scale of 0 to 5 based on review text and book metadata.
  
  The solution demonstrated that generative models can outperform traditional classification approaches for nuanced tasks like review rating prediction. The model effectively learned to understand complex relationships between review content, book attributes, and user ratings, while maintaining robust performance across different book genres and review styles.`,
      organization: "Kaggle Competition",
      date: "2022 - 2023",
      tags: ["NLP", "T5", "Fine-tuning", "Text Classification", "Kaggle"],
      techStack: ["Python", "PyTorch", "Transformers", "T5", "Pandas", "Scikit-learn"],
      features: [
        "Novel application of T5 generative model for classification task",
        "Comprehensive review text and metadata processing pipeline",
        "Advanced fine-tuning strategy for rating prediction",
        "State-of-the-art accuracy on Goodreads dataset",
        "Efficient processing of large-scale review data",
        "First Place in Kaggle Competition",
        "Innovative use of generative model for classification"
      ],
      challenges: [
        "Adapting a generative model for classification tasks",
        "Handling large-scale book review dataset efficiently",
        "Developing effective fine-tuning strategies for T5",
        "Balancing model complexity with competition constraints"
      ],
      image: "/assets/imgs/goodreads.png",
      githubUrl: "https://github.com/Arsive02/Goodreads_Books_Review_Rating_Prediction",
      demoUrl: "https://www.kaggle.com/competitions/goodreads-books-reviews-290312/leaderboard?"

    },
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
        "Advanced retrieval mechanism with hybrid search results in 5ms",
        "Real-time response generation with minimal latency",
        "Scalable architecture supporting millions of concurrent users"
      ],
      challenges: [
        "Optimizing inference speed while maintaining response quality",
        "Implementing efficient caching mechanisms for frequent queries",
        "Designing a scalable architecture for handling concurrent requests",
        "Reducing hallucinations through context-aware filtering"
      ],
      image: "/assets/imgs/rag.png"
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
        "Ensuring consistent performance across different lighting conditions using several augmentation techniques",
      ],
      demoUrl: "https://www.youtube.com/watch?v=mOJEEJ-eYmM",
      image: "/assets/imgs/edge.png"
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
      githubUrl: "https://github.com/Balaji-th/Autonomous_Vehicle",
      image: "/assets/imgs/agv.png",
      demoUrl: "https://youtu.be/48irckF3vA0?feature=shared"
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
            to="/home#projects" 
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