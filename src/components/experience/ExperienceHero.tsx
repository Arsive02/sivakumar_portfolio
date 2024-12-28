import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

// Bloch Sphere Component
function BlochSphere() {
  const { scene } = useGLTF("/models/bloch_sphere.glb");
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

// Scene Component
function Scene() {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <BlochSphere />
      <Environment preset="city" />
      
      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
    </Suspense>
  );
}

const ExperienceHero = () => {
  const canvasRef = useRef(null);

  return (
    <div className="relative min-h-[60vh] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Content Container */}
      <div className="absolute inset-0 flex">
        {/* Text Section */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl py-2 font-bold mb-6 bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Journey Through Time
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 mb-6 leading-relaxed text-justify"
          >
            Navigating through the complexity of data like qubits in superposition, 
            each analysis unveils new dimensions of insight. As a data scientist, 
            my journey transforms the uncertainty of raw information into meaningful 
            patterns, collapsing possibilities into clarity through the power of 
            artificial intelligence and machine learning.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-400">3+</span>
              <span className="text-sm text-gray-400">Years Experience</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-purple-400">10+</span>
              <span className="text-sm text-gray-400">Projects Completed</span>
            </div>
          </motion.div>
        </div>

        {/* 3D Model Section */}
        <div className="w-1/2 relative">
          <Canvas
            ref={canvasRef}
            camera={{ position: [5, 2, 5], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <Scene />
          </Canvas>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  );
};

export default ExperienceHero;