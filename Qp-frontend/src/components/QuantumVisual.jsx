import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useRef, useMemo, Component } from 'react';
import * as THREE from 'three';

/* ----------------------------------------------------------------
   Error boundary — if WebGL fails, we show a graceful fallback
----------------------------------------------------------------- */
class GLBoundary extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.warn('[QuantumComputer3D]', err?.message); }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

/* ----------------------------------------------------------------
   Shared materials
----------------------------------------------------------------- */
const goldMat = {
  color: '#D4AF37',
  metalness: 1,
  roughness: 0.22,
  envMapIntensity: 1.4,
};
const goldBrightMat = {
  color: '#F2D28A',
  metalness: 1,
  roughness: 0.15,
  envMapIntensity: 1.6,
};
const steelMat = {
  color: '#B7C1D3',
  metalness: 0.95,
  roughness: 0.28,
  envMapIntensity: 1.4,
};
const darkSteelMat = {
  color: '#5B6577',
  metalness: 0.9,
  roughness: 0.4,
};

/* ----------------------------------------------------------------
   A single gold plate (disc) with engraved rings
----------------------------------------------------------------- */
function GoldPlate({ y, radius, thickness = 0.07 }) {
  return (
    <group position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, thickness, 96]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      <mesh position={[0, thickness / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.52, radius * 0.55, 96]} />
        <meshStandardMaterial {...goldBrightMat} />
      </mesh>
      <mesh position={[0, thickness / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.76, radius * 0.78, 96]} />
        <meshStandardMaterial {...goldBrightMat} />
      </mesh>
      <mesh position={[0, thickness / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.30, radius * 0.32, 96]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      <mesh position={[0, -thickness / 2 - 0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.6, radius * 0.62, 96]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------
   Vertical support rod
----------------------------------------------------------------- */
function Rod({ x, z, yTop, yBottom }) {
  const h = yBottom - yTop;
  return (
    <mesh position={[x, yTop + h / 2, z]} castShadow>
      <cylinderGeometry args={[0.028, 0.028, h, 16]} />
      <meshStandardMaterial {...steelMat} />
    </mesh>
  );
}

/* ----------------------------------------------------------------
   Wiring harness
----------------------------------------------------------------- */
function Wire({ start, mid, end }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.022, 8, false);
  }, [start, mid, end]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#E8B85A"
        metalness={0.9}
        roughness={0.3}
        emissive="#3a2605"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

/* ----------------------------------------------------------------
   Glowing plasma core
----------------------------------------------------------------- */
function PlasmaCore() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.1);
      ref.current.material.emissiveIntensity = 2 + Math.sin(t * 2.4) * 0.8;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.26, 32, 32]} />
      <meshStandardMaterial
        color="#BFE2FF"
        emissive="#4F7FFF"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ----------------------------------------------------------------
   Bottom processor unit
----------------------------------------------------------------- */
function ProcessorUnit({ y }) {
  const chipRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (chipRef.current) {
      chipRef.current.material.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.9;
    }
  });

  return (
    <group position={[0, y, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.8, 64]} />
        <meshStandardMaterial {...steelMat} />
      </mesh>

      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.05, 64]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      <mesh position={[0, -0.05, 0.56]}>
        <planeGeometry args={[0.72, 0.72]} />
        <meshBasicMaterial color="#4F7FFF" toneMapped={false} />
      </mesh>

      {[
        [0, 0.18, 0.57, 0.5, 0.006],
        [0, -0.18, 0.57, 0.5, 0.006],
        [0.18, 0, 0.57, 0.006, 0.5],
        [-0.18, 0, 0.57, 0.006, 0.5],
      ].map(([x, yy, z, w, h], i) => (
        <mesh key={i} position={[x, yy, z]}>
          <boxGeometry args={[w, h, 0.006]} />
          <meshStandardMaterial color="#7FC6FF" emissive="#7FC6FF" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}

      <mesh ref={chipRef} position={[0, 0, 0.6]}>
        <boxGeometry args={[0.26, 0.26, 0.06]} />
        <meshStandardMaterial
          color="#0B1630"
          emissive="#D4AF37"
          emissiveIntensity={1.8}
          metalness={0.9}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.635]}>
        <boxGeometry args={[0.12, 0.12, 0.03]} />
        <meshStandardMaterial color="#4F7FFF" emissive="#4F7FFF" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>

      <mesh position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 64]} />
        <meshStandardMaterial {...darkSteelMat} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------
   Orbiting qubit
----------------------------------------------------------------- */
function Qubit({ angle, radius, y, color, speed = 1, size = 0.055 }) {
  const ref = useRef();
  const t0 = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + t0.current + angle;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        y + Math.sin(t * 2) * 0.04,
        Math.sin(t) * radius
      );
      const s = 1 + Math.sin(t * 3) * 0.15;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.4}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ----------------------------------------------------------------
   Full chandelier
----------------------------------------------------------------- */
function Chandelier() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  const wires = useMemo(() => {
    const arr = [];
    const N = 8;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      arr.push({
        start: [Math.cos(a) * 1.0, 0.92, Math.sin(a) * 1.0],
        mid:   [Math.cos(a + 0.4) * 1.12, 0, Math.sin(a + 0.4) * 1.12],
        end:   [Math.cos(a + 0.8) * 0.96, -0.92, Math.sin(a + 0.8) * 0.96],
      });
    }
    return arr;
  }, []);

  return (
    <group ref={ref} position={[0, 0.2, 0]}>
      <mesh position={[0, 1.68, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.22, 1.22, 0.24, 96]} />
        <meshStandardMaterial color="#C8D2E2" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.56, 0]}>
        <cylinderGeometry args={[1.18, 1.18, 0.02, 96]} />
        <meshStandardMaterial color="#4F7FFF" emissive="#4F7FFF" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>

      <GoldPlate y={0.95}  radius={1.02} />
      <GoldPlate y={0}     radius={1.14} />
      <GoldPlate y={-0.95} radius={1.02} />

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        return (
          <Rod
            key={i}
            x={Math.cos(a) * 1.18}
            z={Math.sin(a) * 1.18}
            yTop={-0.95}
            yBottom={0.95}
          />
        );
      })}

      {wires.map((w, i) => <Wire key={i} {...w} />)}

      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 2.0, 24]} />
        <meshStandardMaterial
          color="#9FD5FF"
          emissive="#4F7FFF"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      <PlasmaCore />

      <ProcessorUnit y={-1.72} />

      <Qubit angle={0}            radius={1.62} y={0}     color="#D4AF37" speed={0.9} />
      <Qubit angle={Math.PI / 2}  radius={1.62} y={0}     color="#4F7FFF" speed={0.9} />
      <Qubit angle={Math.PI}      radius={1.62} y={0}     color="#D4AF37" speed={0.9} />
      <Qubit angle={1.5 * Math.PI}radius={1.62} y={0}     color="#4F7FFF" speed={0.9} />
      <Qubit angle={0.4}          radius={2.0}  y={0.95}  color="#8FB4FF" speed={0.6} size={0.045} />
      <Qubit angle={2.5}          radius={2.0}  y={-0.95} color="#E8C766" speed={0.6} size={0.045} />
    </group>
  );
}

/* ----------------------------------------------------------------
   Fallback
----------------------------------------------------------------- */
function Fallback() {
  return (
    <div className="qc-fallback">
      <div className="qc-dots">
        <span /><span /><span />
      </div>
      <p>3D viewer unavailable</p>
    </div>
  );
}

/* ----------------------------------------------------------------
   Public component
----------------------------------------------------------------- */
export default function QuantumComputer3D() {
  return (
    <div className="qc-wrap">
      <GLBoundary fallback={<Fallback />}>
        <Canvas
          camera={{ position: [3.4, 1.2, 4.6], fov: 45 }}
          dpr={[1, 1.75]}
          shadows
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            premultipliedAlpha: false,
          }}
          style={{ background: 'transparent' }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);
            scene.background = null;
            gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
          }}
        >
          {/* NO <color attach="background" /> — keep transparent */}
          {/* NO <fog /> — fog needs an opaque background */}

          <ambientLight intensity={0.35} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.5}
            color="#FFE9B0"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-4, 1, 3]} intensity={2.2} color="#4F7FFF" distance={14} />
          <pointLight position={[4, -2, -3]} intensity={1.4} color="#641E35" distance={14} />
          <spotLight
            position={[0, 6, 0]}
            angle={0.7}
            penumbra={1}
            intensity={1.8}
            color="#D4AF37"
            distance={12}
          />

          <Suspense fallback={null}>
            <Environment preset="night" background={false} />
            <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.18}>
              <Chandelier />
            </Float>
            <ContactShadows
              position={[0, -2.6, 0]}
              opacity={0.45}
              scale={8}
              blur={2.4}
              far={4}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3.4}
            maxPolarAngle={Math.PI / 1.75}
            rotateSpeed={0.6}
          />
        </Canvas>
      </GLBoundary>

      <style>{`
        .qc-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 560px;
          margin-inline: auto;
          background: transparent !important;
        }
        .qc-fallback {
          width: 100%; height: 100%;
          display: grid; place-items: center;
          color: #7A8499;
          font-size: 0.85rem;
          text-align: center;
          gap: 10px;
        }
        .qc-dots { display: flex; gap: 8px; justify-content: center; }
        .qc-dots span {
          width: 8px; height: 8px; border-radius: 50%;
          background: #D4AF37;
          animation: qcBlink 1.4s ease-in-out infinite;
        }
        .qc-dots span:nth-child(2) { animation-delay: 0.2s; }
        .qc-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes qcBlink {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .qc-dots span { animation: none; }
        }
      `}</style>
    </div>
  );
}