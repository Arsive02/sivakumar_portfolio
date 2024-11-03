// Handle fade-in animations for sections
document.addEventListener('DOMContentLoaded', () => {
    // Initial page load animation
    setTimeout(() => {
      document.querySelector('.page-content')?.classList.add('visible');
    }, 100);
  
    // Setup fade-in sections
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });
  
    // Neural network hover effects
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('mousemove', (e: Event) => {
        if (e instanceof MouseEvent && item instanceof HTMLElement) {
          const rect = item.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          const pulse = item.querySelector('.pulse');
          if (pulse instanceof HTMLElement) {
            pulse.style.setProperty('--x', `${x}%`);
            pulse.style.setProperty('--y', `${y}%`);
          }
        }
      });
    });
  });
  
  // Optional: Add smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });