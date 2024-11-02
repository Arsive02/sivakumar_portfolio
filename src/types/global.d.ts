declare global {
    interface Window {
      THREE: typeof import('three');
      TweenMax: any; // Add proper types if available
    }
  }
  
  export {};