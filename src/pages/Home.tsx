import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Network, Database, Cpu, ChevronRight } from 'lucide-react';
import MobiusAnimation from '../components/animations/MobiusAnimation';
import Navbar from '../components/layout/Navbar';
import '../styles/pages/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setIsAnimating(true);
    // Create floating data particles
    const createParticles = () => {
      const particlesContainer = document.querySelector('.data-particles');
      if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'data-particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 20}s`;
          particlesContainer.appendChild(particle);
        }
      }
    };

    createParticles();
  }, []);

  const skills = [
    { 
      icon: Brain, 
      title: 'Deep Learning',
      description: 'Advanced neural architectures and training methodologies'
    },
    { 
      icon: Network, 
      title: 'Neural Networks',
      description: 'Custom architecture design and optimization'
    },
    { 
      icon: Cpu, 
      title: 'Machine Learning',
      description: 'Statistical modeling and algorithmic solutions'
    },
    { 
      icon: Database, 
      title: 'Big Data',
      description: 'Large-scale data processing and analytics'
    }
  ];

  const experiences = [
    {
      company: 'ZOHO',
      role: 'Data Scientist',
      period: 'May 2022 – July 2024',
      highlights: [
        'Advanced RAG Architecture Development',
        'AI Solutions Implementation',
        'Multimodality Research',
        'Team Mentorship'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Neural network background effect */}
      <div className="neural-bg"></div>
      <div className="gradient-overlay"></div>
      <div className="data-particles"></div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Mobius Animation */}
      <section className="hero-section">
        <div className="absolute inset-0 z-0 opacity-50">
          <MobiusAnimation />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Sivakumar Ramakrishnan
          </h1>
          <h2 className="hero-subtitle">
            Applied Deep Learning / NLP Specialist
          </h2>
          <p className="mt-6 text-xl max-w-2xl mx-auto text-gray-400">
            Mathematics-driven deep learning developer with a passion for applying AI to real-world problems.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Core Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map(({ icon: Icon, title, description }) => (
              <div key={title} className="skill-card">
                <Icon className="skill-icon" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="experience-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Experience</h2>
            <button 
              onClick={() => navigate('/xp')}
              className="contact-link flex items-center space-x-2"
            >
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="experience-card">
                <h3 className="text-xl font-bold mb-2">{exp.company}</h3>
                <h4 className="text-accent mb-2">{exp.role}</h4>
                <p className="text-gray-400 mb-4">{exp.period}</p>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      <span className="text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-xl text-gray-300 mb-8">
            Located in Boulder, Colorado
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:sivakumar.ramakrishnan@colorado.edu"
              className="contact-link"
            >
              Email
            </a>
            <a 
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;