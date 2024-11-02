import Navigation from '../components/layout/Navigation';
import ProjectCard from '../components/projects/ProjectCard';

const Projects = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Navigation />
      </div>

      <div className="section pt-20 pb-12 fade-in-section">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">Featured Projects</h1>
          <p>Exploring the intersection of AI, Deep Learning, and Real-world Applications</p>
        </div>
      </div>

      <div className="section pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <ProjectCard 
              title="Aerial Depth Mapping"
              description="Deep learning models architecturally optimized for edge devices, enabling drones to estimate depth more efficiently."
              image="/img/placeholder.jpg"
              projectLink="https://praisecu.github.io/research-areas"
              tags={["Deep Learning", "Computer Vision", "Edge Computing"]}
            />

            <ProjectCard 
              title="Autonomous Ground Vehicle"
              description="Developed AGV bot with lane & object detection, and navigation using Raspberry Pi, Jetson Nano, and YOLOv4."
              image="/img/placeholder.jpg"
              tags={["YOLOv4", "Raspberry Pi", "Jetson Nano"]}
            />

            <ProjectCard 
              title="Edge AIoT for Product Inspection"
              description="Developed CNN and SVM models for defective microchip identification (98% accuracy) using AWS DynamoDB, Heroku, Flask, and Raspberry Pi 4."
              image="/img/placeholder.jpg"
              projectLink="Project Link"
              tags={["CNN", "AWS", "IoT"]}
            />

            <ProjectCard 
              title="Open Source Contributions"
              description="Contributing to various open-source projects including Mistral Optimization, Toxicity Model, and Rating Prediction Model."
              image="/img/placeholder.jpg"
              projectLink="https://github.com/yourusername"
              tags={["Mistral", "RoBERTa", "T5-Base"]}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 text-center text-gray-400">
        © 2024 Sivakumar. All rights reserved.
      </div>
    </>
  );
};

export default Projects;