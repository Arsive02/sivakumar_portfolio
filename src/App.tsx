import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Home from './pages/Home';
// import Projects from './pages/Projects';
// import Experience from './pages/Experience';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/xp" element={<Experience />} /> */}
        {/* <Route path="/projects" element={<Projects />} /> */}
      </Routes>
    </Router>
  );
}

export default App;