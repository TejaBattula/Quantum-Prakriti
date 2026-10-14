import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Cylinder, Box, Torus } from '@react-three/drei';

// --- MATERIALS ---
const GoldMat = () => <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} envMapIntensity={1.5} />;
const SilverMat = () => <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} envMapIntensity={1.2} />;
const CopperMat = () => <meshStandardMaterial color="#B87333" metalness={0.8} roughness={0.3} envMapIntensity={1.5} />;
const WhiteMat = () => <meshStandardMaterial color="#F5F5F5" metalness={0.1} roughness={0.6} />;

// --- HELPER COMPONENTS ---

const TopCap = () => (
  <group position={[0, 14, 0]}>
    <Cylinder args={[5.2, 5.2, 1.5, 64]}><WhiteMat /></Cylinder>
    <Cylinder args={[5.0, 5.0, 0.2, 64]} position={[0, 0.85, 0]}><WhiteMat /></Cylinder>
    <Cylinder args={[5.0, 5.0, 0.5, 64]} position={[0, -1, 0]}><GoldMat /></Cylinder>
    <Cylinder args={[1.5, 1.5, 2.5, 64]} position={[0, 0.5, 0]}><SilverMat /></Cylinder>
  </group>
);

const StagePlate = ({ y, radius, thickness = 0.3 }) => (
  <group position={[0, y, 0]}>
    <Cylinder args={[radius, radius, thickness, 64]}><GoldMat /></Cylinder>
    <Cylinder args={[radius * 0.75, radius * 0.75, thickness + 0.1, 64]} position={[0, 0.05, 0]}><GoldMat /></Cylinder>
    <Torus args={[radius, 0.05, 16, 64]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><GoldMat /></Torus>
    
    {[...Array(12)].map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return (
        <Cylinder key={i} args={[0.08, 0.08, thickness + 0.2, 16]} position={[Math.cos(angle) * (radius - 0.3), 0, Math.sin(angle) * (radius - 0.3)]}>
          <GoldMat />
        </Cylinder>
      );
    })}
  </group>
);

const CentralColumn = () => (
  <group position={[0, 0, 0]}>
    <Cylinder args={[0.9, 0.9, 4, 64]} position={[0, 10.5, 0]}><SilverMat /></Cylinder>
    <group position={[0, 8, 0]}>
      {[...Array(8)].map((_, i) => (
        <Torus key={i} args={[0.9, 0.12, 16, 64]} position={[0, -i * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}><GoldMat /></Torus>
      ))}
    </group>
    <Cylinder args={[1.2, 1.2, 2.5, 64]} position={[0, 5.5, 0]}><SilverMat /></Cylinder>
    <group position={[0, 3.5, 0]}>
      {[...Array(10)].map((_, i) => (
        <Torus key={i} args={[0.9, 0.12, 16, 64]} position={[0, -i * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}><GoldMat /></Torus>
      ))}
    </group>
    <Cylinder args={[1.4, 1.4, 2, 64]} position={[0, 0, 0]}><SilverMat /></Cylinder>
    <Cylinder args={[0.5, 0.5, 3.5, 32]} position={[0, -2.75, 0]}><SilverMat /></Cylinder>
  </group>
);

const CopperCoils = () => (
  <group position={[0, 11.5, 0]}>
    {[...Array(2)].map((_, i) => {
      const xPos = i === 0 ? -2.2 : 2.2;
      return (
        <group key={i} position={[xPos, 0, 0]}>
          {[...Array(4)].map((_, j) => (
            <Torus key={j} args={[0.6, 0.15, 16, 64]} position={[0, -j * 0.35, 0]} rotation={[0, 0, Math.PI / 2]}><CopperMat /></Torus>
          ))}
          <Cylinder args={[0.08, 0.08, 2.2, 16]} position={[i === 0 ? 1.1 : -1.1, -0.5, 0]} rotation={[0, 0, i === 0 ? -Math.PI / 4 : Math.PI / 4]}><CopperMat /></Cylinder>
          <Cylinder args={[0.06, 0.06, 3, 16]} position={[0, -2, 0]}><CopperMat /></Cylinder>
        </group>
      );
    })}
  </group>
);

const WiringHarness = ({ levelY, count, radius }) => {
  return (
    <group position={[0, levelY, 0]}>
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const wireType = i % 4; 
        
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <Cylinder args={[0.03, 0.03, 4.5, 16]} position={[0, -2.25, 0]}><SilverMat /></Cylinder>
            <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0, 0, 0]}><GoldMat /></Cylinder>
            <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0, -4.5, 0]}><GoldMat /></Cylinder>
            {wireType === 1 && (
              <>
                <Torus args={[0.35, 0.03, 16, 64]} position={[0.35, -2, 0]} rotation={[0, Math.PI / 2, 0]}><SilverMat /></Torus>
                <Torus args={[0.35, 0.03, 16, 64]} position={[0.7, -2, 0]} rotation={[0, Math.PI / 2, 0]}><SilverMat /></Torus>
              </>
            )}
            {wireType === 2 && (
              <Cylinder args={[0.02, 0.02, 2, 16]} position={[-0.3, -2.25, 0]} rotation={[0, 0, 0.3]}><SilverMat /></Cylinder>
            )}
          </group>
        );
      })}
    </group>
  );
};

const LargePipes = () => {
  const pipePositions = [{ x: -3.8, z: 0 }, { x: 3.8, z: 0 }];
  return (
    <group>
      {pipePositions.map((pos, i) => (
        <group key={i} position={[pos.x, 0, pos.z]}>
          <Cylinder args={[0.2, 0.2, 12, 32]} position={[0, 1, 0]}><SilverMat /></Cylinder>
          <group position={[0, 4, 0]}>
            <Box args={[0.6, 0.3, 0.6]} position={[0, 0, 0]}><GoldMat /></Box>
            <Cylinder args={[0.1, 0.1, 1, 16]} position={[i === 0 ? 0.5 : -0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}><GoldMat /></Cylinder>
          </group>
          <group position={[0, -2, 0]}>
            <Box args={[0.6, 0.3, 0.6]} position={[0, 0, 0]}><GoldMat /></Box>
          </group>
        </group>
      ))}
    </group>
  );
};

const FinalBottomStage = () => {
  return (
    <group position={[0, -4.5, 0]}>
      <group position={[0, 0, 0]}>
        <Box args={[1.6, 2.5, 0.9]}><SilverMat /></Box>
        <Box args={[1.2, 2.0, 1.0]} position={[0, 0, 0.05]}><GoldMat /></Box>
        <Box args={[0.7, 0.7, 1.1]} position={[0, 0, 0.1]}><SilverMat /></Box>
        <Box args={[0.4, 0.4, 1.2]} position={[0, 0, 0.15]}><GoldMat /></Box>

        {[...Array(6)].map((_, i) => (
          <group key={i} position={[(i - 2.5) * 0.25, -1.5, 0]}>
            <Cylinder args={[0.04, 0.04, 1.0, 16]} position={[0, -0.5, 0]}><SilverMat /></Cylinder>
            <Cylinder args={[0.06, 0.06, 0.3, 16]} position={[0, -1.0, 0]}><WhiteMat /></Cylinder>
          </group>
        ))}
      </group>

      {[-1.8, 1.8].map((xPos, i) => (
        <group key={i} position={[xPos, 0, 0]}>
          <Cylinder args={[0.4, 0.4, 3.5, 32]} position={[0, 0, 0]}><SilverMat /></Cylinder>
          <Cylinder args={[0.45, 0.45, 0.3, 32]} position={[0, 1.75, 0]}><GoldMat /></Cylinder>
          <Cylinder args={[0.45, 0.45, 0.3, 32]} position={[0, -1.75, 0]}><GoldMat /></Cylinder>

          {[...Array(8)].map((_, j) => (
            <Torus key={j} args={[0.45, 0.03, 8, 32]} position={[0, -1.5 + (j * 0.4), 0]} rotation={[Math.PI / 2, 0, 0]}><SilverMat /></Torus>
          ))}

          {[...Array(3)].map((_, j) => (
            <group key={`conn-${j}`} position={[0, 0.5 - (j * 0.5), 0]}>
              <Cylinder args={[0.03, 0.03, 1.4, 16]} position={[i === 0 ? 0.7 : -0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}><SilverMat /></Cylinder>
              <Box args={[0.15, 0.15, 0.15]} position={[i === 0 ? 1.4 : -1.4, 0, 0]}><GoldMat /></Box>
            </group>
          ))}

          {[...Array(4)].map((_, j) => (
            <Cylinder key={`down-${j}`} args={[0.02, 0.02, 1.5, 16]} position={[(j - 1.5) * 0.15, -2.5, 0]} rotation={[0, 0, (j - 1.5) * 0.1]}><SilverMat /></Cylinder>
          ))}
        </group>
      ))}
    </group>
  );
};

const CeramicInsulators = () => (
  <group position={[0, 2, 0]}>
    {[...Array(2)].map((_, i) => {
      const xPos = i === 0 ? -0.9 : 0.9;
      return (
        <group key={i} position={[xPos, 0, 0]}>
          <Cylinder args={[0.25, 0.25, 1.0, 32]}><WhiteMat /></Cylinder>
          <Cylinder args={[0.2, 0.2, 0.3, 32]} position={[0, 0.65, 0]}><SilverMat /></Cylinder>
          <Cylinder args={[0.2, 0.2, 0.3, 32]} position={[0, -0.65, 0]}><SilverMat /></Cylinder>
          <group position={[i === 0 ? 0.4 : -0.4, 0.8, 0]}>
            <Cylinder args={[0.06, 0.06, 0.8, 16]} rotation={[0, 0, Math.PI / 2]}><CopperMat /></Cylinder>
            <Cylinder args={[0.06, 0.06, 0.6, 16]} position={[i === 0 ? 0.4 : -0.4, -0.3, 0]}><CopperMat /></Cylinder>
          </group>
        </group>
      );
    })}
  </group>
);

const DiagonalStruts = () => (
  <group position={[0, 1, 0]}>
    {[...Array(4)].map((_, i) => {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(angle) * 2.5;
      const z = Math.sin(angle) * 2.5;
      return (
        <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
          <Cylinder args={[0.08, 0.08, 3.5, 16]} position={[0.5, -1, 0]} rotation={[0, 0, 0.4]}><SilverMat /></Cylinder>
          <Cylinder args={[0.15, 0.15, 0.4, 16]} position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}><GoldMat /></Cylinder>
          <Cylinder args={[0.15, 0.15, 0.4, 16]} position={[1.2, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]}><GoldMat /></Cylinder>
        </group>
      );
    })}
  </group>
);

const QuantumComputerModel = () => {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const levels = [
    { y: 12, radius: 5.0, wireCount: 32 },
    { y: 8, radius: 4.6, wireCount: 28 },
    { y: 4, radius: 4.2, wireCount: 28 },
    { y: 0, radius: 3.8, wireCount: 24 }
  ];

  return (
    <group ref={groupRef} position={[0, -5, 0]}>
      <TopCap />
      {levels.map((level, index) => (
        <group key={index}>
          <StagePlate y={level.y} radius={level.radius} />
          <WiringHarness levelY={level.y} count={level.wireCount} radius={level.radius - 0.2} />
        </group>
      ))}
      <CopperCoils />
      <CentralColumn />
      <CeramicInsulators />
      <DiagonalStruts />
      <LargePipes />
      <FinalBottomStage />
    </group>
  );
};

const QuantumVisual = () => {
  return (
    // FIXED: Removed absolute positioning and hardcoded left/top offsets.
    // It now fills the parent container (hero__visual) naturally.
    <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
      <Canvas 
        camera={{ position: [10, -2, 24], fov: 55 }}
        gl={{ alpha: true, antialias: true }} 
        style={{ background: 'transparent' }} 
      >
        <ambientLight intensity={0.6} />
        <spotLight position={[15, 25, 15]} angle={0.2} penumbra={1} intensity={3} castShadow />
        <spotLight position={[-15, 25, -15]} angle={0.2} penumbra={1} intensity={2} />
        <pointLight position={[0, -15, 0]} intensity={1.5} color="#D4AF37" />
        
        <Environment preset="city" />
        <QuantumComputerModel />
        <ContactShadows position={[0, -11, 0]} opacity={0.4} scale={25} blur={2.5} far={15} color="#000000" />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={10} 
          maxDistance={45}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};

export default QuantumVisual;