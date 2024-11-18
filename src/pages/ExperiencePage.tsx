import { Brain, Network, Cpu } from 'lucide-react';
import { DataScientistCard, TraineeCard, InternCard } from './ExperienceCards';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function RoverModel() {
  const { scene } = useGLTF('./assets/models/Rover.glb');
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

const ExperienceHeader = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <div className="relative min-h-[60vh] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/home"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-gray-900/50 
                   backdrop-blur-sm border border-blue-500/20 rounded-lg text-gray-300 
                   hover:text-white hover:bg-gray-900/80 hover:border-blue-500/40 
                   transition-all duration-300 group"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span>Back to Home</span>
      </Link>

      {/* Content Container */}
      <div className="absolute inset-0 flex">
        {/* Text Section */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl py-2 font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Journey Through Time
          </h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed text-justify">
            Exploring the landscape of AI and Machine Learning, one milestone at a time. 
            Like a rover traversing uncharted territory, each experience has been a step 
            into new frontiers of technology and innovation.
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-400">3+</span>
              <span className="text-sm text-gray-400">Years Experience</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-purple-400">10+</span>
              <span className="text-sm text-gray-400">Projects Completed</span>
            </div>
          </div>
        </div>

        {/* 3D Model Section */}
        <div className="w-1/2 relative">
          <div className="absolute inset-0">
            <Canvas
              ref={canvasRef}
              camera={{ position: [5, 2, 5], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              
              <Stage environment="city" intensity={0.6}>
                <RoverModel />
              </Stage>
              
              <OrbitControls 
                enableZoom={false}
                autoRotate
                autoRotateSpeed={1.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  );
};

const TimelineNode = ({ role }: { role: string }) => {
  // Return different icons based on the role
  const getIcon = () => {
    switch (role) {
      case "Data Scientist":
        return (
          <Brain 
            className="w-5 h-5 text-blue-400" 
            aria-label="Advanced AI Research"
          />
        );
      case "Trainee":
        return (
          <Network 
            className="w-5 h-5 text-purple-400" 
            aria-label="Neural Networks"
          />
        );
      case "Intern":
        return (
          <Cpu 
            className="w-5 h-5 text-green-400" 
            aria-label="Machine Learning Systems"
          />
        );
      default:
        return <Brain className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="timeline-node group">
      {getIcon()}
      
      {/* Ripple effect */}
      <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-700" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-sm scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-700" />
    </div>
  );
};

const ExperiencePage = () => {
  const allExperiences = [
    {
      title: "Data Scientist",
      company: "ZOHO",
      period: "May 2022 – July 2024",
      photo: "/src/assets/images/zoho_ds.jpg",
      certificate: "/src/assets/certificates/zoho_ds_certificate.pdf",
      highlights: [
        "Advanced RAG Architecture: Developed and scaled an advanced Retrieval-Augmented Generation (RAG) system using VLLM, supporting millions of users with multi-modal input processing and reduced hallucinations.",
        "Implemented diverse AI solutions, including customer assistance prediction, phishing detection with 90% accuracy, generative AI tasks like FAQ Generation, reply mail generation, and summary generation.",
        "Multimodality Research: Engaged in foundational work on multimodal AI systems.",
        "Mentorship: Guided, and mentored interns to full-time employees."
      ]
    },
    {
      title: "Trainee",
      company: "ZOHO",
      period: "Sep 2021 – Apr 2022",
      photo: "/api/placeholder/400/400",
      certificate: "/src/assets/certificates/zoho_trainee_certificate.pdf", // Add certificate path
      highlights: [
        "Foundational NLP research ranging from rule-based methodologies to implementation of seq-to-seq architectures.",
        "Developed a Java-based e-commerce web application with RESTful APIs using JAX-RS."
      ]
    },
    {
      title: "Intern",
      company: "SIEMENS",
      period: "Apr 2021",
      photo: "/api/placeholder/400/400",
      certificate: "/src/assets/certificates/siemens_certificate.pdf", // Add certificate path
      report: "src/assets/certificates/SIEMENS_INTERNSHIP_REPORT.pdf", // Add report path
      highlights: [
        "Gained hands-on experience with advanced medical imaging systems, principle components of PET-CT, MRI, and CT."
      ]
    }
  ];

  interface PhotoContainerProps {
    photo: string;
    company: string;
  }

  const PhotoContainer = ({ photo, company }: PhotoContainerProps) => (
    <div className="photo-container">
      <div className="relative group">
        <img 
          src={photo}
          alt={`${company} period`}
          className="w-96 h-96 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );

  const renderExperienceCard = (exp: typeof allExperiences[0]) => {
    switch (exp.title) {
      case "Data Scientist":
        return <DataScientistCard experience={exp} />;
      case "Trainee":
        return <TraineeCard experience={exp} />;
      case "Intern":
        return <InternCard experience={exp} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ExperienceHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="timeline-container relative">
            <div className="timeline-line" />

            {allExperiences.map((exp, index) => (
              <div key={index} className="timeline-item">
                <TimelineNode role={exp.title} />

                <div className="timeline-sides">
                  <div className="timeline-side timeline-side-left">
                    {index % 2 === 0 ? (
                      renderExperienceCard(exp)
                    ) : (
                      <PhotoContainer 
                        photo={exp.photo}
                        company={exp.company}
                      />
                    )}
                  </div>

                  <div className="timeline-side timeline-side-right">
                    {index % 2 === 0 ? (
                      <PhotoContainer 
                        photo={exp.photo}
                        company={exp.company}
                      />
                    ) : (
                      renderExperienceCard(exp)
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperiencePage;