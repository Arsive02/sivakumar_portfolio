import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalaxyAnimation from '../components/animations/GalaxyAnimation';
import PageTransition from '../components/animations/PageTransition';

const Intro = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setTimeout(() => document.body.classList.add('render'), 60);

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => {
    // Start the transition
    if (contentRef.current) {
      contentRef.current.classList.add('transitioning');
    }
    if (titleRef.current) {
      titleRef.current.classList.add('transitioning');
    }
    if (subtitleRef.current) {
      subtitleRef.current.classList.add('transitioning');
    }
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    navigate('/home');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleClick();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <main className="intro-container">
      <div className="galaxy-container">
        <GalaxyAnimation isTransitioning={isTransitioning} />
      </div>

      <div ref={contentRef} className="content">
        <div id="clickable-area" className="clickable-content" onClick={handleClick}>
          <div className="content__inner">
            <h2 ref={titleRef} className="content__title">
              Sivakumar's Voyage
            </h2>
            <h3 ref={subtitleRef} className="content__subtitle">
              Data Scientist
            </h3>
            <p className="hint">Click on the name or press enter to continue</p>
          
          </div>
        </div>
      </div>

      {isTransitioning && (
        <PageTransition 
          isActive={isTransitioning} 
          onTransitionComplete={handleTransitionComplete}
        />
      )}
    </main>
  );
};

export default Intro;