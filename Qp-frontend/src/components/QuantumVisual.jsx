import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense, useRef, useMemo, Component } from 'react';
import * as THREE from 'three';

/* ---------------- Error boundary ---------------- */
class GLBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.warn('[QuantumComputer3D] fell back:', err?.message); }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

/* ---------------- Chandelier parts ---------------- */

function GoldPlate({ y, radius, thickness = 0.06 }) {
  return (
    <group position={[0, y, 0]}>
      {/* main disc */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, thickness, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.22}
          emissive="#3a2c05"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* engraved inner ring */}
      <mesh position={[0, thickness / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.55, radius * 0.58, 64]} />
        <meshStandardMaterial color="#8C6B1F" metalness={1} roughness={0.35} />
      </mesh>
      <mesh position={[0, thickness / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.78, radius * 0.8, 64]} />
        <meshStandardMaterial color="#F5E1A1" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Rod({ x, z = 0, yTop, yBottom }) {
  const height = yBottom - yTop;
  return (
    <mesh position={[x, yTop + height / 2, z]} castShadow>
      <cylinderGeometry args={[0.03, 0.03, height, 16]} />
      <meshStandardMaterial color="#B7C1D3" metalness={0.9} roughness={0.35} />
    </mesh>
  );
}

function Wire({ start, mid, end }) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
  }, [start, mid, end]);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 32, 0.025, 8, false), [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#E8B85A"
        metalness={0.85}
        roughness={0.3}
        emissive="#3a2605"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

function GlowColumn({ height, y }) {
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={[0.055, 0.055, height, 24]} />
      <meshStandardMaterial
        color="#9FD5FF"
        emissive="#4F7FFF"
        emissiveIntensity={2.2}
        metalness={0.1}
        roughness={0.2}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function ProcessorUnit({ y }) {
  return (
    <group position={[0, y, 0]}>
      {/* silver cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.75, 48]} />
        <meshStandardMaterial color="#9AA6BC" metalness={0.9} roughness={0.28} />
      </mesh>
      {/* top gold rim */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.05, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>
      {/* inner blue glow disc */}
      <mesh position={[0, 0, 0.56]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color="#4F7FFF" transparent opacity={0.9} />
      </mesh>
      {/* chip */}
      <mesh position={[0, 0, 0.58]}>
        <boxGeometry args={[0.25, 0.25, 0.05]} />
        <meshStandardMaterial
          color="#0B1630"
          emissive="#D4AF37"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <pointLight position={[0, 0, 0.9]} color="#4F7FFF" intensity={3} distance={3} />
    </group>
  );
}

function Qubit({ angle, radius, y, color, speed = 1 }) {
  const ref = useRef();
  const t0 = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + t0.current;
    if (ref.current) {
      ref.current.position.x = Math.cos(t + angle) * radius;
      ref.current.position.z = Math.sin(t + angle) * radius;
      ref.current.position.y = y;
      ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={1.2} distance={1.2} />
    </group>
  );
}

/* ---------------- The whole assembly, rotating in 3D ---------------- */

function Chandelier() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.45; // true 3D spin
  });

  // 8 wires: from top plate edge → middle plate edge → bottom plate edge
  const wires = useMemo(() => {
    const arr = [];
    const N = 8;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const topX = Math.cos(a) * 1.05, topZ = Math.sin(a) * 1.05;
      const midX = Math.cos(a + 0.4) * 1.15, midZ = Math.sin(a + 0.4) * 1.15;
      const botX = Math.cos(a + 0.8) * 1.0,  botZ = Math.sin(a + 0.8) * 1.0;
      arr.push({
        start: [topX, 0.9, topZ],
        mid:   [midX, 0,   midZ],
        end:   [botX, -0.9, botZ],
      });
    }
    return arr;
  }, []);

  return (
    <group ref={ref} position={[0, 0.1, 0]}>
      {/* top cap (anchored look) */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.22, 64]} />
        <meshStandardMaterial color="#C4CEDE" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.68, 0]}>
        <cylinderGeometry args={[1.28, 1.28, 0.03, 64]} />
        <meshStandardMaterial
          color="#7FC6FF"
          emissive="#7FC6FF"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      {/* three gold plates */}
      <GoldPlate y={0.95}  radius={1.05} />
      <GoldPlate y={0}     radius={1.15} />
      <GoldPlate y={-0.95} radius={1.05} />

      {/* vertical support rods */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        const x = Math.cos(a) * 1.18;
        const z = Math.sin(a) * 1.18;
        return <Rod key={i} x={x} z={z} yTop={-0.95} yBottom={0.95} />;
      })}

      {/* wires */}
      {wires.map((w, i) => <Wire key={i} {...w} />)}

      {/* central column glow */}
      <GlowColumn height={2.0} y={0} />

      {/* pulsing core orb */}
      <CorePulse />

      {/* bottom processor */}
      <ProcessorUnit y={-1.7} />

      {/* orbiting qubits (real 3D) */}
      <Qubit angle={0}          radius={1.6} y={0}    color="#D4AF37" speed={0.9} />
      <Qubit angle={Math.PI/2}  radius={1.6} y={0}    color="#4F7FFF" speed={0.9} />
      <Qubit angle={Math.PI}    radius={1.6} y={0}    color="#D4AF37" speed={0.9} />
      <Qubit angle={1.5*Math.PI}radius={1.6} y={0}    color="#4F7FFF" speed={0.9} />
      <Qubit angle={0.3}        radius={2.0} y={0.95} color="#8FB4FF" speed={0.6} />
      <Qubit angle={2.4}        radius={2.0} y={-0.95}color="#E8C766" speed={0.6} />
    </group>
  );
}

function CorePulse() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const s = 1 + Math.sin(t * 2.4) * 0.12;
      ref.current.scale.setScalar(s);
      ref.current.material.emissiveIntensity = 1.6 + Math.sin(t * 2.4) * 0.9;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#9FD5FF"
        emissive="#4F7FFF"
        emissiveIntensity={2}
        toneMapped={false}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

/* ---------------- Public component ---------------- */

function Fallback() {
  return (
    <div className="qv3d-fallback">
      <div className="qv3d-fallback-inner">
        <div className="qv3d-dot" />
        <div className="qv3d-dot" />
        <div className="qv3d-dot" />
      </div>
      <p>Quantum visual unavailable</p>
    </div>
  );
}

export default function QuantumComputer3D() {
  return (
    <div className="qv3d-wrap">
      <GLBoundary fallback={<Fallback />}>
        <Canvas
          camera={{ position: [3.4, 1.4, 4.6], fov: 40 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
          }}
        >
          <color attach="background" args={['#04060B']} />
          <fog attach="fog" args={['#04060B', 8, 16]} />

          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 8, 4]} intensity={1.4} color="#FFE9B0" castShadow />
          <pointLight position={[-4, 1, 3]} intensity={2.2} color="#4F7FFF" distance={12} />
          <pointLight position={[4, -2, -3]} intensity={1.4} color="#641E35" distance={12} />

          <Suspense fallback={null}>
            <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.15}>
              <Chandelier />
            </Float>
            <Environment preset="night" />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate={false}
          />
        </Canvas>
      </GLBoundary>

      <style>{`
        .qv3d-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 560px;
          margin-inline: auto;
          border-radius: 24px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 55%, rgba(22,38,78,0.55), rgba(4,6,11,0.95));
          box-shadow:
            0 60px 120px -40px rgba(0,0,0,1),
            0 0 0 1px rgba(212,175,55,0.15) inset,
            0 0 90px -20px rgba(79,127,255,0.35);
        }
        .qv3d-fallback {
          width: 100%; height: 100%;
          display: grid; place-items: center;
          color: #7A8499;
          font-size: 0.85rem;
          text-align: center;
        }
        .qv3d-fallback-inner {
          display: flex; gap: 8px; justify-content: center; margin-bottom: 10px;
        }
        .qv3d-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #D4AF37;
          animation: qv3dBlink 1.4s ease-in-out infinite;
        }
        .qv3d-dot:nth-child(2) { animation-delay: 0.2s; }
        .qv3d-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes qv3dBlink {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}