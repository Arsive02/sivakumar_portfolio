import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './styles/index.css';
import './styles/components/animations.css';

const Intro = lazy(() => import('./pages/Intro'));
const HomePage = lazy(() => import('./pages/HomePage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;