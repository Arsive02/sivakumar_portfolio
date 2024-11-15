import { Code, Mail, LineChart, Brain } from 'lucide-react';
import LossLandscapeGame from '../components/home/animations/LossLandscape';
import Navigation from '../components/home/Navigation';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content */}
      <main className="pt-20 pb-12">
        {/* About Section */}
        <section id="about" className="min-h-screen py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-blue-500" />
              About Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column - Profile Content */}
              <div className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  Mathematics-driven deep learning developer with a passion for applying AI to real-world problems.
                </p>
                
                {/* Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Specializations</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Multimodal AI'].map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-gray-800/50 border border-blue-500/20 rounded-full text-sm
                                hover:bg-gray-800/80 hover:border-blue-500/40 transition-all duration-300
                                hover:scale-105 transform cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Game and Instructions */}
              <div className="relative min-h-[700px]">
                <div className="sticky top-24 space-y-4">
                  {/* Game Instructions */}
                  <div className="bg-gray-800/50 border border-blue-500/20 rounded-xl p-2 space-y-3">
                    <h3 className="text-lg font-semibold text-blue-400">Interactive Challenge</h3>
                    <p className="text-sm text-gray-300">
                      Navigate the ball to the global minimum using movement controls to reveal a surprise!
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <kbd className="px-2 py-1 bg-gray-700 rounded-md">WASD</kbd>
                      <span>or</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-700 rounded-md">←↑↓→</kbd>
                      </div>
                    </div>
                  </div>

                  {/* Loss Landscape Game */}
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-blue-500/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
                    <div className="relative h-600px rounded-2xl overflow-hidden">
                      <LossLandscapeGame />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="min-h-screen py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <LineChart className="w-8 h-8 mr-3 text-blue-500" />
              Experience
            </h2>
            {/* Add timeline or cards for experience */}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <Code className="w-8 h-8 mr-3 text-blue-500" />
              Projects
            </h2>
            {/* Add project grid or cards */}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <Mail className="w-8 h-8 mr-3 text-blue-500" />
              Contact
            </h2>
            {/* Add contact form or links */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Sivakumar Ramakrishnan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;