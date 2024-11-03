import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const createMobiusStripGeometry = (width = 0.1, segments = 100) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = -1; j <= 1; j += 2) {
      const v = j * width / 2;
      const r = 2 + v * Math.cos(u / 2);
      const x = r * Math.cos(u);
      const y = r * Math.sin(u);
      const z = v * Math.sin(u / 2);
      vertices.push(x, y, z);
    }
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;

    indices.push(a, b, d);
    indices.push(a, d, c);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
};

const MobiusStrip = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = createMobiusStripGeometry();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} attach="geometry" />
      <meshPhongMaterial 
        color="#4d1f96"
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        wireframe
      />
    </mesh>
  );
};

const MobiusAnimation = () => {
  return (
    <div className="w-full h-full absolute">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <MobiusStrip />
      </Canvas>
    </div>
  );
};

export default MobiusAnimation;
