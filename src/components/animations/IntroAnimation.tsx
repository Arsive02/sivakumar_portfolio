import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroAnimation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add render class after a delay (from intro.js)
    setTimeout(() => document.body.classList.add('render'), 60);

    // Navigation handler
    const handleNavigation = (linkHref: string) => {
      document.body.classList.remove('render');
      const handleTransitionEnd = () => {
        navigate(linkHref);
        document.body.removeEventListener('transitionend', handleTransitionEnd);
      };
      document.body.addEventListener('transitionend', handleTransitionEnd);
    };

    // Keyboard navigation
    const handleKeydown = (ev: KeyboardEvent) => {
      const keyCode = ev.keyCode || ev.which;
      let targetRoute = '';

      if (keyCode === 37) { // Left arrow
        targetRoute = '/previous-route'; // Update with your routes
      } else if (keyCode === 39) { // Right arrow
        targetRoute = '/next-route'; // Update with your routes
      } else {
        return false;
      }

      handleNavigation(targetRoute);
    };

    document.addEventListener('keydown', handleKeydown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [navigate]);

  return null; // This component only handles animations and navigation
};

export default IntroAnimation;