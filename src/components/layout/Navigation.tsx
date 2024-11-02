import { Link } from 'react-router-dom';

const NeuralContainer = () => (
  <div className="neural-container">
    <div className="neuron"></div>
    <div className="neuron"></div>
    <div className="neuron"></div>
    <div className="synapse"></div>
    <div className="synapse"></div>
    <div className="pulse"></div>
  </div>
);

const Navigation = () => {
  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/intro" className="home-icon-wrapper group">
            <div className="relative w-8 h-8">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyNCAyNCIgY2xhc3M9InctOCBoLTggdGV4dC1ibHVlLTUwMCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgdHJhbnNmb3JtIGdyb3VwLWhvdmVyOnNjYWxlLTExMCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9ImhvbWUtcGF0aCBmaWxsLWN1cnJlbnQiIGQ9Ik0xMiA1LjY5bDUgNC41VjE4aC0ydi02SDl2Nkg3di03LjgxbDUtNC41TTEyIDNMMiAxMmgzdjhoNnYtNmgydjZoNnYtOGgzTDEyIDN6IiAvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gQW5pbWF0ZWQgcGFydGljbGVzIC0tPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY2xhc3M9InBhcnRpY2xlIiBjeD0iMTIiIGN5PSIxMiIgcj0iMC41IiBmaWxsPSJ3aGl0ZSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjbGFzcz0icGFydGljbGUiIGN4PSIxMiIgY3k9IjEyIiByPSIwLjUiIGZpbGw9IndoaXRlIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGNsYXNzPSJwYXJ0aWNsZSIgY3g9IjEyIiBjeT0iMTIiIHI9IjAuNSIgZmlsbD0id2hpdGUiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+" 
                alt="Home"
                className="w-8 h-8 text-blue-500 transition-all duration-300 transform group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 filter blur-xl transition-opacity duration-300"></div>
            </div>
          </Link>
          <div id="topology-root"></div>
        </div>

        <div className="flex space-x-8">
          <Link to="#about" className="nav-item">
            <span className="nav-text">About</span>
            <NeuralContainer />
          </Link>

          <Link to="#skills" className="nav-item">
            <span className="nav-text">Skills</span>
            <NeuralContainer />
          </Link>

          <Link to="/projects" className="nav-item">
            <span className="nav-text">Projects</span>
            <NeuralContainer />
          </Link>

          <Link to="#contact" className="nav-item">
            <span className="nav-text">Contact</span>
            <NeuralContainer />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;