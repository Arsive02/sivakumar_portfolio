import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import profilePic from "/img/ProfilePic_6-Photoroom.png";

const LossLandscape = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [resetKey, setResetKey] = useState(0); // Added for forcing re-render
  const [, setIsSkipped] = useState(false);
  const [isMinimumReached, setIsMinimumReached] = useState(false);
  const [currentLoss, setCurrentLoss] = useState(0);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef({
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    cameraRotation: 0,
    cameraHeight: 15
  });

  const handleSkip = () => {
    setIsMinimumReached(true);
    setIsSkipped(true);
  };

  const handleReset = () => {
    // Reset all game state
    setIsMinimumReached(false);
    setCurrentLoss(0);
    setIsSkipped(false);
    velocityRef.current.set(0, 0, 0);
    
    // Reset ball position if it exists
    if (ballRef.current) {
      const startX = (Math.random() - 0.5) * 10;
      const startZ = (Math.random() - 0.5) * 10;
      const startY = computeHeight(startX, startZ) + 0.5;
      ballRef.current.position.set(startX, startY, startZ);
    }

    // Reset camera position
    if (cameraRef.current) {
      controlsRef.current.cameraRotation = 0;
      controlsRef.current.cameraHeight = 15;
      const radius = 20;
      cameraRef.current.position.set(
        Math.cos(controlsRef.current.cameraRotation) * radius,
        controlsRef.current.cameraHeight,
        Math.sin(controlsRef.current.cameraRotation) * radius
      );
      cameraRef.current.lookAt(0, 0, 0);
    }

    // Force re-render
    setResetKey(prev => prev + 1);
  };

    // Helper function for height computation
    const computeHeight = (x: number, z: number): number => {
      const gaussian = -2 * Math.exp(-(x*x + z*z) * 0.1);
      const periodic = Math.sin(x * 0.5) * Math.cos(z * 0.5);
      const radial = Math.cos(Math.sqrt(x*x + z*z)) * 0.5;
      return gaussian + periodic + radial;
    };

    useEffect(() => {
      if (!canvasRef.current) return;
  
      // Scene Setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x000000);
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
  
      // Camera Setup
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(15, 15, 15);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;
  
      // Renderer Setup
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

    // Loss Function with more defined minimum
    const computeHeight = (x: number, z: number): number => {
      const gaussian = -2 * Math.exp(-(x*x + z*z) * 0.1);
      const periodic = Math.sin(x * 0.5) * Math.cos(z * 0.5);
      const radial = Math.cos(Math.sqrt(x*x + z*z)) * 0.5;
      return gaussian + periodic + radial;
    };

    // Landscape Creation
    const size = 20;
    const segments = 128;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 1];
      vertices[i + 2] = computeHeight(x, z);
    }
    geometry.computeVertexNormals();

    // Add border for landscape
    const borderGeometry = new THREE.BoxGeometry(size, 4, size);
    const borderMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.3
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.y = -2;
    scene.add(border);

    // Landscape Material
    const material = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      shininess: 100,
      flatShading: false,
      side: THREE.DoubleSide
    });

    const landscape = new THREE.Mesh(geometry, material);
    landscape.rotation.x = -Math.PI / 2;
    scene.add(landscape);

     // Ball Setup with outline
     const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
     const ballMaterial = new THREE.MeshStandardMaterial({
       color: 0xf59e0b,
       metalness: 0.7,
       roughness: 0.3,
       emissive: 0x666666,
       emissiveIntensity: 0.2
     });
     const ball = new THREE.Mesh(ballGeometry, ballMaterial);
     ballRef.current = ball;

    // Ball outline
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide
    });
    const outlineMesh = new THREE.Mesh(ballGeometry, outlineMaterial);
    outlineMesh.scale.multiplyScalar(1.1);
    ball.add(outlineMesh);

    // Starting position for ball
    const startX = (Math.random() - 0.5) * 10;
    const startZ = (Math.random() - 0.5) * 10;
    const startY = computeHeight(startX, startZ) + 0.5;
    ball.position.set(startX, startY, startZ);
    scene.add(ball);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 15, 5);
    scene.add(dirLight);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(size, 40, 0x2a4365, 0x2a4365);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Ball Movement
    const velocity = new THREE.Vector3();
    const speed = 0.1;
    const damping = 0.75;

    // Movement and Camera Controls
    const moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    // Keyboard Control Handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          moveState.forward = true;
          break;
        case 's':
        case 'arrowdown':
          moveState.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          moveState.left = true;
          break;
        case 'd':
        case 'arrowright':
          moveState.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          moveState.forward = false;
          break;
        case 's':
        case 'arrowdown':
          moveState.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          moveState.left = false;
          break;
        case 'd':
        case 'arrowright':
          moveState.right = false;
          break;
      }
    };

    // Camera Control Handlers
    const handleMouseDown = (e: MouseEvent) => {
      controlsRef.current.isMouseDown = true;
      controlsRef.current.mouseX = e.clientX;
      controlsRef.current.mouseY = e.clientY;
    };

    const handleMouseUp = () => {
      controlsRef.current.isMouseDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!controlsRef.current.isMouseDown) return;

      const deltaX = e.clientX - controlsRef.current.mouseX;
      const deltaY = e.clientY - controlsRef.current.mouseY;

      controlsRef.current.mouseX = e.clientX;
      controlsRef.current.mouseY = e.clientY;

      controlsRef.current.cameraRotation += deltaX * 0.01;
      controlsRef.current.cameraHeight = Math.max(5, Math.min(30, 
        controlsRef.current.cameraHeight - deltaY * 0.1
      ));

      const radius = 20;
      camera.position.x = Math.cos(controlsRef.current.cameraRotation) * radius;
      camera.position.z = Math.sin(controlsRef.current.cameraRotation) * radius;
      camera.position.y = controlsRef.current.cameraHeight;
      camera.lookAt(0, 0, 0);
    };

    // Animation Loop
    const animate = () => {
      const moveDirection = new THREE.Vector3();
      
      if (moveState.forward) moveDirection.z -= 1;
      if (moveState.backward) moveDirection.z += 1;
      if (moveState.left) moveDirection.x -= 1;
      if (moveState.right) moveDirection.x += 1;

      if (moveDirection.length() > 0) {
        moveDirection.normalize();
        
        const cameraAngle = controlsRef.current.cameraRotation;
        const rotatedX = moveDirection.x * Math.cos(cameraAngle) - moveDirection.z * Math.sin(cameraAngle);
        const rotatedZ = moveDirection.x * Math.sin(cameraAngle) + moveDirection.z * Math.cos(cameraAngle);
        
        velocity.x += rotatedX * speed;
        velocity.z += rotatedZ * speed;
      }

      // Update ball position with border constraints
      velocity.multiplyScalar(damping);
      const newX = ball.position.x + velocity.x;
      const newZ = ball.position.z + velocity.z;

      // Border constraints
      if (Math.abs(newX) < size/2 - 0.5) ball.position.x = newX;
      if (Math.abs(newZ) < size/2 - 0.5) ball.position.z = newZ;

      // Keep ball on surface
      const surfaceHeight = computeHeight(ball.position.x, ball.position.z);
      ball.position.y = surfaceHeight + 0.5;

      // Update loss value display
      setCurrentLoss(surfaceHeight + 2);

      // Check for minimum (within proximity)
      const proximityThreshold = 0.4;
      if (Math.abs(surfaceHeight + 2) < proximityThreshold && velocity.length() < 0.01) {
        setIsMinimumReached(true);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    
    // Event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [resetKey])

  
  return (
    <div className="relative w-full h-full bg-black overflow-hidden" key={resetKey}>
    {/* Instructions Panel */}
    {!isMinimumReached && (
      <div className="absolute z-10 top-5 left-1/2 -translate-x-1/2 bg-black/80 
                    text-white p-4 rounded-lg font-sans text-sm border border-blue-500/20
                    backdrop-blur-sm shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <h4 className="text-blue-400 font-semibold">Controls</h4>
          <p className="text-center">
            Arrow keys or WASD to move • Click and drag to rotate camera
          </p>
          <div className="text-blue-500 font-medium">
            Current Loss: {currentLoss.toFixed(3)}
          </div>
        </div>
      </div>
    )}

    {/* Skip Game Button - Only show when game is active */}
    {!isMinimumReached && (
      <button
        onClick={handleSkip}
        className="absolute top-5 right-1 bg-black/80 text-white px-2 py-2 rounded-lg
                 border border-purple-500/30 cursor-pointer flex items-center justify-center
                 transition-all duration-300 hover:bg-purple-500/20 hover:scale-105
                 backdrop-blur-sm shadow-lg"
      >
        Skip Game
      </button>
    )}

    {/* Game Canvas */}
    {!isMinimumReached ? (
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab"
      />
    ) : (
      /* Profile Display when minimum is reached or game is skipped */
      <div className="w-full h-full flex items-center justify-center bg-black p-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 
                       rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
          <div className="relative bg-black p-1 rounded-lg">
            <img 
              src={profilePic}
              alt="Profile"
              className="w-[400px] h-[400px] object-cover rounded-lg
                       transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg" />
        </div>
      </div>
    )}

    {/* Reset Button - Only show when game is complete or skipped */}
    {isMinimumReached && (
      <button
        onClick={handleReset}
        className="absolute bottom-5 right-5 bg-black/80 text-white p-3 rounded-lg
                 border border-blue-500/30 cursor-pointer flex items-center justify-center
                 transition-all duration-300 hover:bg-blue-500/20 hover:scale-105
                 backdrop-blur-sm shadow-lg"
        aria-label="Reset Game"
      >
        <RotateCcw className="mr-2" size={20} />
        <span>Reset</span>
      </button>
    )}
  </div>
  );
};

export default LossLandscape;