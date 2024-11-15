import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import MobiusTooltip from './MobiusToolTip';

const MobiusStrip = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTimeTravel, setIsTimeTravel] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    renderer.setSize(32, 32);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create a Mobius strip using TorusKnotGeometry
    const geometry = new THREE.TorusKnotGeometry(3, 0.4, 128, 16, 2, 3);

    // Material with gradient and hover effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        hover: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float hover;
        varying vec2 vUv;
        
        void main() {
          vec3 color1 = vec3(0.23, 0.51, 0.96); // Blue
          vec3 color2 = vec3(0.54, 0.23, 0.96); // Purple
          vec3 hoverColor = vec3(0.7, 0.7, 1.0); // Bright blue-white
          
          float t = vUv.x + time * 0.1;
          vec3 baseColor = mix(color1, color2, smoothstep(0.0, 1.0, fract(t)));
          vec3 finalColor = mix(baseColor, hoverColor, hover * 0.5);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    const mobiusStrip = new THREE.Mesh(geometry, material);
    scene.add(mobiusStrip);

    // Position camera
    camera.position.z = 8;

    // Animation
    let frameId: number;
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      
      mobiusStrip.rotation.x += 0.01;
      mobiusStrip.rotation.y += 0.02;
      
      material.uniforms.time.value = time * 0.001;
      
      // Smooth hover transition
      material.uniforms.hover.value += (isHovered ? 1 : -1) * 0.1;
      material.uniforms.hover.value = Math.max(0, Math.min(1, material.uniforms.hover.value));
      
      renderer.render(scene, camera);
    };
    animate(0);

    // Handle resize
    const handleResize = () => {
      renderer.setSize(32, 32);
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isHovered]);

  const handleTimeTravelClick = () => {
    setIsTimeTravel(true);
    
    // Navigate after rocket launch animation
    setTimeout(() => {
      navigate('/');
    }, 2000); // 2 seconds for the rocket launch
  };

  return (
    <div className="relative">
      <div 
        ref={mountRef}
        className="w-8 h-8 cursor-pointer transition-transform duration-300 hover:scale-110" 
        style={{ 
          filter: `drop-shadow(0 0 8px rgba(59, 130, 246, ${isHovered ? '0.8' : '0.5'}))`
        }}
        onClick={handleTimeTravelClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
      />
      <MobiusTooltip isVisible={showTooltip} />
    </div>
  );
};

export default MobiusStrip;