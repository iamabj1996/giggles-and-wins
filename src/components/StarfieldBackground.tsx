import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Stars = () => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // Create a sphere distribution of stars
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      positions.set([x, y, z], i * 3);
      
      // Romantic pink/purple color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors.set([1, 0.7, 0.9], i * 3); // Pink
      } else if (colorChoice < 0.6) {
        colors.set([0.9, 0.6, 1], i * 3); // Purple
      } else {
        colors.set([1, 1, 1], i * 3); // White
      }
    }
    
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Add subtle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const FloatingHearts = () => {
  const heartsRef = useRef<THREE.Group>(null);
  
  const heartPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 15; i++) {
      positions.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 15,
        speed: Math.random() * 0.02 + 0.01,
      });
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (heartsRef.current) {
      heartsRef.current.children.forEach((heart, index) => {
        const pos = heartPositions[index];
        heart.position.y = pos.y + Math.sin(state.clock.elapsedTime * pos.speed) * 2;
        heart.rotation.y = state.clock.elapsedTime * pos.speed;
        heart.rotation.z = Math.sin(state.clock.elapsedTime * pos.speed * 0.5) * 0.3;
      });
    }
  });

  return (
    <group ref={heartsRef}>
      {heartPositions.map((pos, index) => (
        <mesh key={index} position={[pos.x, pos.y, pos.z]} scale={0.3}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const StarfieldBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 0, 1], 
          fov: 75,
          near: 0.1,
          far: 1000 
        }}
        style={{ 
          background: 'linear-gradient(180deg, hsl(340 15% 8%), hsl(340 25% 15%))'
        }}
      >
        <fog attach="fog" args={['#1a0d1a', 5, 25]} />
        <Stars />
        <FloatingHearts />
      </Canvas>
    </div>
  );
};

export default StarfieldBackground;