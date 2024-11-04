import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/components/animations.css'
import './styles/pages/home.css'
import './styles/pages/home-text.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)