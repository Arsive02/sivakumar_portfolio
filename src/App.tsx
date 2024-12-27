import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import './styles/index.css';
import './styles/components/animations.css';

const Intro = lazy(() => import('./pages/Intro'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));

// Scroll handler component
const ScrollToSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up the URL after scrolling
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToSection />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/achievements/*" element={<AchievementsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;