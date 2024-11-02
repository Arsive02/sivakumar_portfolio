import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GalaxyAnimation from '../components/animations/GalaxyAnimation';

const Intro = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const spaceWarpRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add render class after a delay
    setTimeout(() => document.body.classList.add('render'), 60);

    // Initialize mouse follow effect
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    // Activate space warp and flash effects
    if (spaceWarpRef.current) spaceWarpRef.current.classList.add('active');
    if (flashRef.current) flashRef.current.classList.add('active');
    if (contentRef.current) {
      contentRef.current.classList.add('transitioning');
      contentRef.current.querySelector('.content__title')?.classList.add('transitioning');
      contentRef.current.querySelector('.content__subtitle')?.classList.add('transitioning');
    }

    // Navigate after animations
    setTimeout(() => {
      ripple.remove();
      navigate('/home');
    }, 800);
  };

  return (
    <main className="intro-container">
      <div className="galaxy-container">
        <GalaxyAnimation />
      </div>

      <div ref={contentRef} className="content">
        <div id="clickable-area" className="clickable-content" onClick={handleClick}>
          <div className="content__inner">
            <h2 className="content__title">Sivakumar's Voyage</h2>
            <h3 className="content__subtitle">Data Scientist</h3>
          </div>
        </div>
      </div>

      {/* Transition Effects */}
      <div ref={spaceWarpRef} className="space-warp">
        <div className="warp-tunnel"></div>
        <div className="stars"></div>
      </div>
      <div ref={flashRef} className="flash"></div>
    </main>
  );
};

export default Intro;