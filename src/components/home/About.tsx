import { useEffect, useRef } from 'react';

const EducationCard = () => {
  const educationCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize education card animations here
    // This will be implemented later with the animations
  }, []);

  return (
    <div id="education-card-root" ref={educationCardRef}>
      {/* Education card content will be added */}
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="section py-20 bg-gray-900/50 fade-in-section">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 gradient-text">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p>
              [Your experience and achievements]
            </p>
          </div>

          <div className="space-y-6">
            <EducationCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;