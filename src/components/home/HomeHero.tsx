const HomeHero = () => {
    return (
      <section className="section min-h-screen flex items-center pt-20 fade-in-section">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Modeling data with Mathematics and Decoding Chaos into
                <span className="gradient-text"> Elegant Equations</span>
              </h1>
  
              <p>
                Data Scientist having expertise in Machine learning and specializing in
                Deep learning, Natural Language Processing, Computer Vision and
                Multimodal AI.
              </p>
  
              <div className="flex space-x-4">
                <a
                  href="projects.html"
                  className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 border border-blue-600 rounded-lg hover:bg-blue-600/10 transition"
                >
                  Contact Me
                </a>
              </div>
            </div>
  
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div
                id="loss-viz-container"
                className="w-full h-[600px] rounded-lg overflow-hidden"
              ></div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default HomeHero;