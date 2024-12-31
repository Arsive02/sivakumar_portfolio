import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

// Preload the model
useGLTF.preload('/models/the_library_gltf/scene.gltf');

// Main Model Component
function Model() {
  const gltf = useGLTF('/models/the_library_gltf/scene.gltf');
  
  return (
    <primitive 
      object={gltf.scene} 
      scale={1.3}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

function LibraryEntrance() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/resources/sections');
  };

  const handleBackToHome = () => {
    navigate('/home?section=resources')
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5e6d3]">
      {/* Welcome Text Header */}
      <div className="w-full bg-[#8b4513] py-8 text-center transform -skew-y-3 shadow-lg">
        <h1 className="text-[#f5e6d3] font-serif text-4xl tracking-wider transform skew-y-3">
          Welcome to
          <br />
          the Digital Library
        </h1>
      </div>

      {/* 3D Model Section */}
      <div className="w-full h-[60vh] bg-gray-900 relative">
        <Canvas
          camera={{ position: [3, 3, 3], fov: 50 }}
          shadows
        >
          <color attach="background" args={['#1a1a1a']} />
          
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={1.5} />
          <directionalLight 
            position={[0, 5, 5]} 
            intensity={2} 
            castShadow
          />
          <pointLight position={[5, 2, 0]} intensity={1} />
          <pointLight position={[-5, 2, 0]} intensity={1} />
          <pointLight position={[0, 3, -5]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <Environment preset="sunset" />
            <Model />
            <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
            <OrbitControls 
              minDistance={2}
              maxDistance={10}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Button Section */}
      <div className="flex flex-col items-center justify-center py-8 w-full bg-[#f5e6d3]">
        <button
          onClick={handleEnter}
          className="group relative px-12 py-6 bg-[#8b4513] text-[#f5e6d3] 
                   font-serif text-2xl tracking-wider
                   border-2 border-[#654321]
                   hover:bg-[#654321] transition-colors duration-300
                   shadow-lg hover:shadow-xl
                   before:content-[''] before:absolute before:inset-0
                   before:border-2 before:border-[#654321] before:scale-105
                   before:opacity-0 hover:before:opacity-100
                   before:transition-all before:duration-300"
        >
          <span className="relative z-10">Enter the Library</span>
        </button>
        <button
          onClick={handleBackToHome}
          className="group relative mt-4 px-12 py-6 bg-[#8b4513] text-[#f5e6d3] 
                   font-serif text-2xl tracking-wider
                   border-2 border-[#654321]
                   hover:bg-[#654321] transition-colors duration-300
                   shadow-lg hover:shadow-xl
                   before:content-[''] before:absolute before:inset-0
                   before:border-2 before:border-[#654321] before:scale-105
                   before:opacity-0 hover:before:opacity-100
                   before:transition-all before:duration-300"
        >
          <span className="relative z-10">Back to Home</span>
        </button>
        <div className="mt-4 text-[#8b4513] font-serif italic text-lg">
          "Mathematics - the language of the universe"
        </div>
      </div>
    </div>
  );
}

export default LibraryEntrance;