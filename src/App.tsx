import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './styles/index.css';
import './styles/components/animations.css';
import { CertificationsPage, AwardsPage, OpenSourcePage } from './components/achievements/AchievementPageLayout';

const Intro = lazy(() => import('./pages/Intro'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));


function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/achievements/certifications" element={<CertificationsPage />} />
          <Route path="/achievements/awards" element={<AwardsPage />} />
          <Route path="/achievements/opensource" element={<OpenSourcePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;