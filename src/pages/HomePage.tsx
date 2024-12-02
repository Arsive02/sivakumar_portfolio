import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookIcon, Cpu, Gamepad2Icon, GraduationCapIcon, Medal, Terminal } from 'lucide-react';
import TextSection from '../components/home/About';
import Navigation from '../components/home/Navigation';
import ExperienceSection from '../components/home/ExperienceSection';
import EducationSection from '../components/home/Education';
import SkillsOrbit from '../components/skills/SkillsGraph';
import FeaturedProjects from '../components/projects/FeaturedProjects';
import AchievementsSection from '../components/home/AchievementsSection';
import "../styles/home/homepage.css";
import "../styles/home/education.css";
import "../styles/home/components/nav.css";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const achievementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we should scroll to achievements section
    const section = searchParams.get('section');
    if (section === 'achievements' && achievementsRef.current) {
      // Add a small delay to ensure the page is fully loaded
      setTimeout(() => {
        if (achievementsRef.current) {
          achievementsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);
  
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
        <section id="experience" className="relative min-h-[70vh] py-2 bg-gradient-to-b from-black via-gray-900 to-black">
          <ExperienceSection />
        </section>

        {/* Projects Section */}
        <section id="projects" className="section bg-gradient-to-b from-black via-gray-900/50 to-black py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading mb-8">
              <Terminal className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Projects</h2>
            </div>
            <FeaturedProjects />
          </div>
          
          <div className="decorative-blur w-80 h-80 bg-purple-500/5 absolute left-0 top-1/2" />
        </section>

        {/* Skills Section */}
        <section id="skills" className="relative min-h-[70vh] py-2 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading mb-8">
              <Cpu className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Skills</h2>
            </div>
            <SkillsOrbit />
          </div>
          
          <div className="decorative-blur w-96 h-96 bg-purple-500/5 absolute bottom-0 left-0" />
          <div className="decorative-blur w-64 h-64 bg-blue-500/5 absolute top-1/4 right-1/4" />
        </section>

        {/* Education Section */}
        <section id="education" className="section bg-gradient-to-b from-black via-gray-900 to-black py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading mb-8">
              <GraduationCapIcon className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Education</h2>
            </div>
            <EducationSection />
          </div>
        </section>

        {/* Achievements Section */}
        <section 
        ref={achievementsRef}
        id="achievements" 
        className="section bg-gradient-to-b from-black to-gray-900 py-12"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading mb-8">
            <Medal className="w-8 h-8 text-blue-500" />
            <h2 className="section-title">Achievements</h2>
          </div>
          <AchievementsSection />
        </div>
        
        <div className="decorative-blur w-80 h-80 bg-blue-500/5 absolute right-0 bottom-0" />
      </section>

        {/* Personal */}
        <section id="hobbies" className="section bg-gradient-to-b from-black via-gray-900 to-black py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="section-heading mb-8">
                <Gamepad2Icon className="w-8 h-8 text-blue-500" />
                <h2 className="section-title"></h2>
            </div>
            {/* Hobbies content will go here */}
            <div className="hobbies-content">
              <p>Lectures, Japanese, Gym, Chess, Flute, social links</p>
            </div>
          </div>
          
          <div className="decorative-blur w-80 h-80 bg-purple-500/5 absolute left-0 bottom-0" />
        </section>

        {/* Resources Section */}
        <section id="resources" className="section bg-gradient-to-b from-black to-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading mb-8">
              <BookIcon className="w-8 h-8 text-blue-500" />
              <h2 className="section-title">Resources</h2>
            </div>
            {/* Resources content will go here */}
            <div className="resources-content">
              <p>Quantum Computing, Math reading</p>
            </div>
          </div>
          
          <div className="decorative-blur w-96 h-96 bg-blue-500/5 absolute bottom-0 right-0" />
          <div className="decorative-blur w-64 h-64 bg-purple-500/5 absolute bottom-1/4 left-1/4" />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center py-6">
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