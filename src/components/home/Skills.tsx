const Skills = () => {
    return (
      <section id="skills" className="section py-20 fade-in-section">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 gradient-text">Technical Skills</h2>
  
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Machine Learning</h3>
              <ul>
                <li>Deep Learning</li>
                <li>Natural Language Processing</li>
                <li>Computer Vision</li>
                <li>Statistical Modeling</li>
              </ul>
            </div>
  
            <div className="card p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Programming</h3>
              <ul>
                <li>Python</li>
                <li>R</li>
                <li>SQL</li>
                <li>TensorFlow/PyTorch</li>
              </ul>
            </div>
  
            <div className="card p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Tools & Technologies</h3>
              <ul>
                <li>AWS/Azure/GCP</li>
                <li>Docker</li>
                <li>Git</li>
                <li>Kubernetes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Skills;