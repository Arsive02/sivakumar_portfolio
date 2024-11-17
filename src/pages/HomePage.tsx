import { Code, Mail, LineChart } from 'lucide-react';
import TextSection from '../components/home/About';
import Navigation from '../components/home/Navigation';
import "../styles/home/homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Fixed Navigation Bar */}
      <div className="nav-wrapper">
        <Navigation />
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero/About Section */}
        <section id="about" className="section about-section">
          <div className="about-content">
            <TextSection />
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute inset-0">
            <div className="decorative-blur blur-1" />
            <div className="decorative-blur blur-2" />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section bg-gradient-to-b from-black via-gray-900/50 to-black py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading">
              <LineChart className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Experience</h2>
            </div>
            {/* Experience content will go here */}
          </div>
          
          <div className="decorative-blur w-72 h-72 bg-blue-500/5 absolute right-0 top-1/4" />
        </section>

        {/* Projects Section */}
        <section id="projects" className="section bg-gradient-to-b from-black via-gray-900/50 to-black py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading">
              <Code className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Projects</h2>
            </div>
            {/* Projects content will go here */}
          </div>
          
          <div className="decorative-blur w-80 h-80 bg-purple-500/5 absolute left-0 top-1/2" />
        </section>

        {/* Contact Section */}
        <section id="contact" className="section bg-gradient-to-b from-black to-gray-900 py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading">
              <Mail className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Contact</h2>
            </div>
            {/* Contact content will go here */}
          </div>
          
          <div className="decorative-blur w-96 h-96 bg-blue-500/5 absolute bottom-0 right-0" />
          <div className="decorative-blur w-64 h-64 bg-purple-500/5 absolute bottom-1/4 left-1/4" />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Sivakumar Ramakrishnan. All rights reserved.
          </p>
        </div>
        <div className="footer-gradient" />
      </footer>
    </div>
  );
};

export default HomePage;