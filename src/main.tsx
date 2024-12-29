import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/components/animations.css';

// Add error handling for better debugging
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

// Preload critical resources
const preloadResources = async () => {
  // Add any critical resources that need to be preloaded
  await Promise.all([
    import('./pages/Intro'),
    import('./pages/HomePage')
  ]);
};

// Initialize app with error handling
const initApp = async () => {
  try {
    await preloadResources();
    
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    root.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; color: white; background: black;">
        <div style="text-align: center;">
          <h1>Failed to load application</h1>
          <button onclick="window.location.reload()" style="padding: 8px 16px; background: blue; border-radius: 4px; margin-top: 16px;">
            Reload page
          </button>
        </div>
      </div>
    `;
  }
};

initApp();