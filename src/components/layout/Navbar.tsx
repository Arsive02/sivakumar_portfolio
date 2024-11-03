import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, GraduationCap, Briefcase, Code, Mail } from 'lucide-react';
import '../../styles/components/navbar.css';
const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About Me' },
    { id: 'education', icon: GraduationCap, label: 'Education' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: Code, label: 'Projects' },
    { id: 'contact', icon: Mail, label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveItem(id);
    if (id === 'experience') {
      navigate('/xp');
    } else if (id === 'projects') {
      navigate('/projects');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list">
          {navItems.map(({ id, icon: Icon, label }) => (
            <li key={id} className="nav-list-item">
              <button
                className={`nav-item ${activeItem === id ? 'active' : ''}`}
                onClick={() => handleNavClick(id)}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;