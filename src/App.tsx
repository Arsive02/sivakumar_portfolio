import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import HomePage from './pages/HomePage';
import './styles/index.css';
import './styles/components/animations.css';
import './styles/pages/home.css';
import './styles/pages/home-text.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;