import React, { useState, useEffect } from 'react';
import { 
  Brain, Database, Network, Mail, Github, Linkedin, Terminal,
  Award, BookOpen, Code2, Cpu, Microscope, GraduationCap,
  PenTool, Bot, Boxes, FileCode, BookOpenCheck, MessagesSquare,
  Star, Trophy, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BrainLogo from '../components/animations/BrainLogo';
import MobiusStrip from '../components/animations/MobiusStrip';
import TextSection from '../components/home/TextSection';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const textToType = 'Decoding Chaos into elegant equations';

  useEffect(() => {
    setIsVisible(true);
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < textToType.length) {
        setTypedText(prev => prev + textToType[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const navItems = [
    { id: 'about', icon: Brain, text: 'About Me' },
    { id: 'experience', icon: Database, text: 'Experience' },
    { id: 'projects', icon: Network, text: 'Projects' },
    { id: 'contact', icon: Mail, text: 'Contact Me' }
  ];

  const skills = [
    { name: 'Deep Learning', icon: Brain, color: 'text-purple-400' },
    { name: 'NLP', icon: Terminal, color: 'text-blue-400' },
    { name: 'Python', icon: Code2, color: 'text-green-400' },
    { name: 'PyTorch', icon: Cpu, color: 'text-orange-400' },
    { name: 'Research', icon: Microscope, color: 'text-pink-400' },
    { name: 'Machine Learning', icon: Database, color: 'text-yellow-400' }
  ];

  const certifications = [
    "Machine Learning Specialization",
    "Deep Learning Specialization",
    "Natural Language Processing Specialization"
  ];

  const openSourceWork = [
    {
      title: "Mistral Optimization",
      description: "Contributed to Look Ahead Decoder Mechanism for Mistral Architecture",
      icon: Bot
    },
    {
      title: "Toxicity Model",
      description: "Open-sourced RoBERTa base model for toxicity classification on HuggingFace",
      icon: FileCode
    },
    {
      title: "Rating Prediction Model",
      description: "Open sourced winning Kaggle Goodreads Finetuned T5-Base model",
      icon: Star
    }
  ];

  const expertise = [
    {
      category: "Core Skills",
      items: ["Deep Learning", "Natural Language Processing", "Machine Learning", "PyTorch"]
    },
    {
      category: "Programming",
      items: ["Python", "Java", "R", "SQL", "Git", "Alembic"]
    },
    {
      category: "Areas of Focus",
      items: ["RAG Systems", "Multimodal AI", "Edge Computing", "MLOps"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-x-hidden">
      {/* Background Matrix Animation Container */}
      <div className="matrix-background absolute inset-0" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-gray-800/90 backdrop-blur-sm z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Brand with Mobius Strip */}
            <Link to="/" className="flex items-center">
              <BrainLogo />
              <MobiusStrip />
            </Link>

            {/* Right side - Nav Items */}
            <div className="flex space-x-8">
              {navItems.map(({ id, icon: Icon, text }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg
                    transition-all duration-300 hover:scale-105
                    ${activeSection === id 
                      ? 'text-blue-400 bg-blue-500/10' 
                      : 'text-gray-300 hover:bg-blue-500/20'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 px-4">
        <TextSection />

        {/* Experience Highlights */}
        <section className="max-w-7xl mx-auto mt-24">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Award className="w-8 h-8 mr-3 text-blue-400" />
            Experience Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Zoho</h3>
              <p className="text-sm text-gray-400 mb-4">Data Scientist | May 2022 – July 2024</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Developed advanced RAG Architecture supporting millions of users
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Implemented AI solutions with 90% accuracy in phishing detection
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Led research in multimodal AI systems
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Education</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">University of Colorado Boulder</p>
                  <p className="text-sm text-gray-400">MS in Data Science | Current</p>
                </div>
                <div>
                  <p className="font-medium">Sri Sai Ram Engineering College</p>
                  <p className="text-sm text-gray-400">B.E. in Electronics and Communication | 2022</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Preview */}
        <section className="max-w-7xl mx-auto mt-24 mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Aerial Depth Mapping</h3>
              <p className="text-gray-300 mb-4">Deep learning models optimized for edge devices, enabling efficient drone depth estimation.</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Learn more →</a>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Edge AIoT</h3>
              <p className="text-gray-300 mb-4">Defective microchip identification system with 98% accuracy using CNN and SVM models.</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Learn more →</a>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-green-400 mb-2">Autonomous Ground Vehicle</h3>
              <p className="text-gray-300 mb-4">AGV bot with lane & object detection using Raspberry Pi and YOLOv4.</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Learn more →</a>
            </div>
          </div>
        </section>
        {/* Open Source Contributions */}
      <section className="max-w-7xl mx-auto mt-24">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <Code2 className="w-8 h-8 mr-3 text-blue-400" />
          Open Source Contributions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {openSourceWork.map((work, index) => (
            <div 
              key={work.title}
              className="group bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm
                        hover:bg-gray-800/70 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <work.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                <h3 className="text-xl font-semibold">{work.title}</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{work.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="max-w-7xl mx-auto mt-24">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-blue-400" />
          Technical Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertise.map((category) => (
            <div 
              key={category.category}
              className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-400">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span 
                    key={item}
                    className="px-3 py-1 bg-blue-500/10 rounded-full text-sm
                             hover:bg-blue-500/20 transition-colors duration-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto mt-24">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <BookOpenCheck className="w-8 h-8 mr-3 text-blue-400" />
          Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div 
              key={cert}
              className="group bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm
                        hover:bg-gray-800/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-300">{cert}</span>
                <ArrowUpRight className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto mt-24 mb-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <MessagesSquare className="w-8 h-8 mr-3 text-blue-400" />
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-xl border border-blue-500/20 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Let's Connect</h3>
            <p className="text-gray-300 mb-6">
              Whether you want to discuss AI, collaborate on projects, or just chat about data science,
              I'm always open to connecting with fellow tech enthusiasts.
            </p>
            <div className="space-y-4">
              <a 
                href="mailto:sivakumar.ramakrishnan@colorado.edu"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>sivakumar.ramakrishnan@colorado.edu</span>
              </a>
              <a 
                href="tel:+13035208588"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Terminal className="w-5 h-5" />
                <span>+1 (303) 520-8588</span>
              </a>
              <p className="flex items-center space-x-3 text-gray-300">
                <PenTool className="w-5 h-5" />
                <span>Boulder, Colorado</span>
              </p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-8 rounded-xl border border-blue-500/20 backdrop-blur-sm">
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-blue-500/20
                         focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input 
                type="email" 
                placeholder="Your Email"
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-blue-500/20
                         focus:outline-none focus:border-blue-500 transition-colors"
              />
              <textarea 
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-blue-500/20
                         focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg
                               transition-all duration-300 hover:-translate-y-1">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 mt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-xl">SR.ai</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
  
  
};

export default HomePage;