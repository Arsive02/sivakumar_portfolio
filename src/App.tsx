import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import './styles/index.css';
import './styles/components/animations.css';
import React from 'react';

// Preload the components
const Intro = lazy(() => import('./pages/Intro').then(module => {
  return new Promise<{ default: React.ComponentType }>(resolve => {
    setTimeout(() => {
      resolve({ default: module.default });
    }, 0);
  });
}));

const HomePage = lazy(() => import('./pages/HomePage').then(module => {
  return new Promise<{ default: React.ComponentType }>(resolve => {
    setTimeout(() => {
      resolve({ default: module.default });
    }, 0);
  });
}));

const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const LibraryEntrance = lazy(() => import('./components/library/LibraryEntrance'));
const ResourcePage = lazy(() => import('./pages/ResourcePage'));

// Enhanced loading component
const LoadingFallback = () => (
  <div className="fixed inset-0 bg-black flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-xl text-blue-500 font-semibold animate-pulse">
        Loading...
      </div>
    </div>
  </div>
);

// Scroll handler component
const ScrollToSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          navigate(location.pathname, { replace: true });
        }
      }, 100);
    }
  }, [location, navigate]);

  return null;
};

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToSection />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/achievements/*" element={<AchievementsPage />} />
            <Route path="/resources" element={<LibraryEntrance />} />
            <Route path="/resources/sections" element={<ResourcePage />} />
            <Route path="*" element={<Intro />} /> {/* Fallback route */}
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;