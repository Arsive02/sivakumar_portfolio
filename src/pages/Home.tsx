import Navigation from '../components/layout/Navigation';
import MathEquations from '../components/shared/MathEquations';
import HomeHero from '../components/home/HomeHero';
import About from '../components/home/About';
import Skills from '../components/home/Skills';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Contact from '../components/home/Contact';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div>
      <Navigation />
      <MathEquations />
      
      <div className="page-content">
        <HomeHero />
        <About />
        <Skills />
        <FeaturedProjects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Home;