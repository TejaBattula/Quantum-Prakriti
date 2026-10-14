import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './QuantumCore.css';

/* ============================================================
   QUANTUM CORE — interactive hero computer
   Hover off: zoomed-in, auto-rotating computer
   Hover on : disassembles part by part with labels
   ============================================================ */

const GOLD = '#e2b650';
const GOLD_L = '#ffdf8a';
const GOLD_D = '#b98a2c';
const ORANGE = '#d9672a';
const SILVER = '#e1e5ea';
const STEEL = '#9aa3af';
const STEEL_D = '#59616c';
const WHITE = '#f1f2f0';
const DARK = '#15171c';
const CREAM = '#efeadb';
const CYAN = '#40dfff';

const MODEL_S = 0.8;
const REST_SCALE = 1.3;  // hover off: zoomed in
const OPEN_SCALE = 0.9; // hover on: space for labels

/* ---- labelled parts (L/R = which side the callout sits on) ---- */
const PARTS = [
  { id: 'top', side: 'L', row: 0, name: 'Cryostat Plate', desc: 'White top plate and gold flange seal the fridge' },
  { id: 'plates', side: 'L', row: 1, name: 'Gold Stage Plates', desc: 'Each plate is a colder temperature stage' },
  { id: 'cables', side: 'L', row: 2, name: 'Coax Wiring & Loops', desc: 'Thin lines carry control and readout signals' },
  { id: 'base', side: 'L', row: 3, name: 'Flexible Coax Cables', desc: 'White and spiral cables reach the chip' },
  { id: 'column', side: 'R', row: 0, name: 'Copper Coils & Column', desc: 'Orange coils and threaded column carry heat away' },
  { id: 'rods', side: 'R', row: 1, name: 'Support Rods & Collars', desc: 'Rigid frame and thermal path between stages' },
  { id: 'conn', side: 'R', row: 2, name: 'Gold Filter Blocks', desc: 'Filtering blocks for readout and control lines' },
  { id: 'core', side: 'R', row: 3, name: 'Quantum Processor', desc: 'Where superposition and entanglement happen' },
];
const ROW_PCT = [15, 38, 62, 85];

/* ---- chandelier layout (model units, before MODEL_S) ---- */
const PLATE_Y = [0.7, -0.4, -0.86, -1.59];
const PLATE_R = [1.0, 0.82, 0.82, 0.82];
const ROD_R = [0.8, 0.7, 0.75];
const GAP_H = [PLATE_Y[0] - PLATE_Y[1], PLATE_Y[1] - PLATE_Y[2], PLATE_Y[2] - PLATE_Y[3]];
const CY = (PLATE_Y[0] + PLATE_Y[3]) / 2;
const TOP_Y = 2.35;
const COPPER_Y = 1.35;
const BASE_Y = -1.95;
const CONN_Y = -2.1;
const CORE_Y = -2.35;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const stage = (ex, delay) => easeInOut(clamp((ex - delay) / (1 - delay), 0, 1));

/* ---- shared materials ---- */
const mat = (color, metalness, roughness, extra) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
const warm = { emissive: new THREE.Color('#6b3f08'), emissiveIntensity: 0.45 };
const M = {
  gold: mat(GOLD, 1, 0.25, warm),
  goldL: mat(GOLD_L, 1, 0.2, warm),
  goldD: mat(GOLD_D, 1, 0.32, warm),
  orange: mat(ORANGE, 0.5, 0.4, { emissive: new THREE.Color('#5a1c05'), emissiveIntensity: 0.4 }),
  silver: mat(SILVER, 1, 0.2),
  steel: mat(STEEL, 1, 0.28),
  steelD: mat(STEEL_D, 1, 0.32),
  white: mat(WHITE, 0.15, 0.32),
  dark: mat(DARK, 0.9, 0.35),
  hole: mat('#2c220c', 0.4, 0.7),
  cream: mat(CREAM, 0.1, 0.55),
  chip: mat('#dff8ff', 0.2, 0.2, { emissive: new THREE.Color(CYAN), emissiveIntensity: 2.4 }),
};

/* ============================================================
   SCENE
   ============================================================ */
function Scene({ hoverRef, ui, reduce }) {
  const { camera, size, gl, scene } = useThree();

  /* soft studio reflections so the gold and steel read as real metal */
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => { scene.environment = null; env.dispose(); pm.dispose(); };
  }, [gl, scene]);

  /* ---------- procedural geometry ---------- */

  // gold coil spring (helix) used between the plates
  const coilGeo = useMemo(() => {
    const pts = [];
    const turns = 4.5;
    const n = 90;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const a = f * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.17, (f - 0.5) * 0.42, Math.sin(a) * 0.17));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.022, 8, false);
  }, []);

  // orange wires between the copper coils and the white attenuators
  const orangeGeos = useMemo(() => {
    const mk = (pts) => new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z))), 24, 0.012, 6, false);
    return [
      mk([[-0.43, 0.3, 0], [-0.38, 0.12, 0.06], [-0.52, -0.05, 0.02], [-0.5, -0.2, 0]]),
      mk([[0.35, 0.3, 0], [0.3, 0.12, 0.06], [0.42, -0.05, 0.02], [0.38, -0.22, 0]]),
      mk([[-0.4, 0.2, 0.04], [-0.1, 0.22, 0.12], [0.15, 0.2, 0.1], [0.33, 0.1, 0.05]]),
    ];
  }, []);

  // white coax cables hanging from the last plate over the gold blocks
  const fanGeos = useMemo(() => Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2 + (i % 3) * 0.07;
    const r0 = 0.55 + (i % 4) * 0.06;
    const r1 = 0.8 + ((i * 7) % 5) * 0.03;
    const r2 = 0.45 + (i % 5) * 0.07;
    const jit = (i * 0.37) % 1;
    const a1 = a + 0.2 * (jit - 0.5);
    const a2 = a + 0.4 * (jit - 0.5);
    const pts = [
      new THREE.Vector3(Math.cos(a) * r0, 0.35, Math.sin(a) * r0),
      new THREE.Vector3(Math.cos(a1) * r1, -0.1 - jit * 0.1, Math.sin(a1) * r1),
      new THREE.Vector3(Math.cos(a2) * r2, -0.85 - jit * 0.1, Math.sin(a2) * r2),
    ];
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.012, 6, false);
  }), []);

  // spiral (coil) cables running down beside the gold blocks
  const spiralGeos = useMemo(() => Array.from({ length: 6 }, (_, k) => {
    const s = k % 2 ? 1 : -1;
    const cx = s * (0.62 + Math.floor(k / 2) * 0.06);
    const cz = (Math.floor(k / 2) - 1) * 0.16;
    const pts = [];
    const n = 160;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const a = f * 16 * Math.PI * 2;
      pts.push(new THREE.Vector3(cx + Math.cos(a) * 0.035, 0.2 - f * 0.8, cz + Math.sin(a) * 0.035));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 320, 0.008, 5, false);
  }), []);

  // the many thin vertical wires between the gold plates (instanced)
  const wires = useMemo(() => {
    const N = 170;
    const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5), M.silver, N);
    const d = new THREE.Object3D();
    const segs = [[0.66, -1.55], [0.66, -0.37], [-0.43, -0.83], [-0.89, -1.56]];
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.55;
      const sg = segs[Math.random() < 0.4 ? 0 : 1 + Math.floor(Math.random() * 3)];
      const w = 0.005 + Math.random() * 0.005;
      d.position.set(Math.cos(a) * r, (sg[0] + sg[1]) / 2 - CY, Math.sin(a) * r);
      d.scale.set(w, sg[0] - sg[1], w);
      d.rotation.set(0, 0, 0);
      d.updateMatrix();
      im.setMatrixAt(i, d.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
    im.frustumCulled = false;
    return im;
  }, []);

  // small silver coax loops (instanced)
  const loops = useMemo(() => {
    const N = 44;
    const im = new THREE.InstancedMesh(new THREE.TorusGeometry(0.055, 0.005, 6, 20), M.silver, N);
    const d = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const lvl = i < 22 ? 0.15 : -1.2;
      const a = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 0.35;
      d.position.set(Math.cos(a) * r, lvl + (Math.random() - 0.5) * 0.14 - CY, Math.sin(a) * r);
      d.rotation.set((Math.random() - 0.5) * 0.5, Math.random() * Math.PI, 0);
      d.scale.setScalar(0.8 + Math.random() * 0.6);
      d.updateMatrix();
      im.setMatrixAt(i, d.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
    im.frustumCulled = false;
    return im;
  }, []);

  const rootRef = useRef();
  const g = useRef({
    top: null, copper: null, base: null, core: null, glow: null, cables: null, conn: null,
    plates: [], rods: [],
  }).current;

  const S = useRef({ ex: 0, yaw: 0.35, t: 0 }).current;

  const tmp = useMemo(() => ({ v2: new THREE.Vector3(), q: new THREE.Vector3() }), []);
  const pt = useMemo(() => ({ x: 0, y: 0 }), []);

  const project = (v, out) => {
    tmp.q.copy(v).project(camera);
    out.x = ((tmp.q.x + 1) / 2) * size.width;
    out.y = ((1 - tmp.q.y) / 2) * size.height;
    return out;
  };

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    S.t += dt;
    const t = S.t;
    const target = hoverRef.current;

    /* ----- explode amount ----- */
    S.ex += (target - S.ex) * (1 - Math.exp(-dt * (target ? 3.4 : 5.2)));
    if (Math.abs(S.ex - target) < 0.0008) S.ex = target;
    const ex = S.ex;

    /* ----- rotation (auto-rotate when not hovered) ----- */
    if (!reduce && !target) S.yaw += dt * 0.42 * (1 - clamp(ex * 3, 0, 1));
    if (target || ex > 0.02) {
      const tgt = Math.round((S.yaw - 0.35) / (Math.PI * 2)) * Math.PI * 2 + 0.35;
      S.yaw += (tgt - S.yaw) * (1 - Math.exp(-dt * (target ? 3.2 : 1.2)));
    }
    const root = rootRef.current;
    if (root) {
      root.rotation.y = S.yaw;
      root.scale.setScalar(REST_SCALE - (REST_SCALE - OPEN_SCALE) * easeInOut(ex));
      root.position.y = Math.sin(t * 0.9) * 0.05 * (1 - ex);
    }

    /* ----- part transforms ----- */
    const eTop = stage(ex, 0);
    const eBase = stage(ex, 0);
    const ePlate = stage(ex, 0.05);
    const eCab = stage(ex, 0.1);
    const eRod = stage(ex, 0.12);
    const eCol = stage(ex, 0.06);
    const K = 0.5 * ePlate;

    if (g.top) g.top.position.set(0, TOP_Y + 1.6 * eTop, 0);
    if (g.copper) g.copper.position.y = COPPER_Y + 0.9 * eCol;
    g.plates.forEach((o, j) => { if (o) o.position.y = PLATE_Y[j] + (PLATE_Y[j] - CY) * K; });
    g.rods.forEach((o, j) => {
      if (!o) return;
      const mid = (PLATE_Y[j] + PLATE_Y[j + 1]) / 2;
      o.position.y = mid + (mid - CY) * K;
      const r = 1 + 0.15 * eRod;
      o.scale.set(r, 1 + K, r);
    });
    if (g.cables) {
      const r = 1 + 0.25 * eCab;
      g.cables.scale.set(r, 1 + K, r);
    }
    if (g.base) {
      g.base.position.y = BASE_Y - 1.5 * eBase;
      g.base.scale.set(1 + 0.3 * eBase, 1, 1 + 0.3 * eBase);
    }
    if (g.conn) {
      g.conn.position.y = CONN_Y - 1.75 * eBase;
      g.conn.scale.set(1 + 0.5 * eBase, 1, 1 + 0.5 * eBase);
    }
    if (g.core) {
      const pulse = 1 + Math.sin(t * 3.2) * 0.07;
      g.core.position.y = CORE_Y - 2.4 * eCol;
      g.core.scale.setScalar(pulse * (1 + 0.35 * ex));
    }
    if (g.glow) g.glow.material.opacity = 0.16 + 0.1 * Math.sin(t * 2.4) + 0.12 * ex;

    /* ----- labels + connector lines ----- */
    const labelA = clamp((ex - 0.55) / 0.4, 0, 1);
    const pxPerUnit = size.height / (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360));
    const sc2 = root ? root.scale.x : 1;
    const boxEl = ui.box;
    const bw = boxEl ? boxEl.clientWidth : size.width;
    const bh = boxEl ? boxEl.clientHeight : size.height;
    const offX = (size.width - bw) / 2; // canvas box kante pedda
    const offY = (size.height - bh) / 2;
    const labelW = clamp(bw * 0.22, 104, 160);
    const anchors = {
      top: [g.top, 1.1],
      plates: [g.plates[1], 0.85],
      cables: [g.cables, 0.8 * (1 + 0.25 * eCab)],
      base: [g.base, 0.9 * (1 + 0.3 * eBase)],
      column: [g.copper, 0.9],
      rods: [g.rods[0], 0.85 * (1 + 0.15 * eRod)],
      conn: [g.conn, 0.6 * (1 + 0.5 * eBase)],
      core: [g.core, 0.17],
    };
    PARTS.forEach((p, i) => {
      const lab = ui.labels[i];
      const line = ui.lines[i];
      const dot = ui.dots[i];
      if (!lab || !line || !dot) return;
      const [obj, rad] = anchors[p.id];
      const a = labelA;
      lab.style.opacity = a.toFixed(3);
      lab.style.transform = `translate(${(1 - a) * (p.side === 'L' ? -14 : 14)}px, -50%)`;
      line.style.opacity = a.toFixed(3);
      dot.style.opacity = a.toFixed(3);
      if (a <= 0 || !obj) return;
      obj.getWorldPosition(tmp.v2);
      project(tmp.v2, pt);
      const sideSign = p.side === 'L' ? -1 : 1;
      const ax = pt.x - offX + sideSign * rad * MODEL_S * pxPerUnit * sc2;
        const ay = pt.y - offY;
        const ly = (ROW_PCT[p.row] / 100) * bh;
        const lx = p.side === 'L' ? labelW + 6 : bw - labelW - 6;
      lab.style.top = `${ly}px`;
      line.setAttribute('x1', lx.toFixed(1));
      line.setAttribute('y1', ly.toFixed(1));
      line.setAttribute('x2', ax.toFixed(1));
      line.setAttribute('y2', ay.toFixed(1));
      dot.setAttribute('cx', ax.toFixed(1));
      dot.setAttribute('cy', ay.toFixed(1));
    });
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff0d0" />
      <directionalLight position={[-5, -1, -3]} intensity={0.6} color="#3fd8ff" />
      <pointLight position={[-3, 0.5, 3]} intensity={14} color="#3fd8ff" distance={14} />
      <pointLight position={[3, -1.5, 3]} intensity={16} color="#ffc979" distance={14} />

      <group ref={rootRef} position={[0, 0, 0]}>
        <group scale={MODEL_S}>

          {/* ===== cryostat plate: white double slab + gold flange ===== */}
          <group ref={(o) => (g.top = o)} position={[0, TOP_Y, 0]}>
            <mesh material={M.white} position-y={0.32}><cylinderGeometry args={[1.17, 1.17, 0.13, 96]} /></mesh>
            <mesh material={M.steel} position-y={0.23}><cylinderGeometry args={[1.1, 1.1, 0.06, 96]} /></mesh>
            <mesh material={M.white} position-y={0.14}><cylinderGeometry args={[1.14, 1.14, 0.13, 96]} /></mesh>
            <mesh material={M.gold} position-y={-0.08}><cylinderGeometry args={[1.08, 1.08, 0.2, 96]} /></mesh>
            <mesh material={M.goldL} rotation-x={Math.PI / 2} position-y={0.02}><torusGeometry args={[1.08, 0.022, 8, 120]} /></mesh>
            <mesh material={M.goldD} position-y={-0.22}><cylinderGeometry args={[1.0, 0.95, 0.12, 96]} /></mesh>
            <mesh material={M.gold} position-y={-0.34}><cylinderGeometry args={[0.9, 0.8, 0.14, 72]} /></mesh>
            {[0, 2.1, 4.2].map((a) => (
              <mesh key={a} material={M.silver} position={[Math.cos(a) * 1.0, 0.0, Math.sin(a) * 1.0]}>
                <sphereGeometry args={[0.045, 12, 12]} />
              </mesh>
            ))}
          </group>

          {/* ===== copper stage: threaded column, orange coils, white attenuators, tall rods ===== */}
          <group ref={(o) => (g.copper = o)} position={[0, COPPER_Y, 0]}>
            <mesh material={M.steel} position-y={0.08}><cylinderGeometry args={[0.1, 0.1, 1.05, 24]} /></mesh>
            {Array.from({ length: 22 }, (_, k) => (
              <mesh key={k} material={M.steelD} rotation-x={Math.PI / 2} position-y={-0.42 + k * 0.045}>
                <torusGeometry args={[0.15, 0.012, 6, 28]} />
              </mesh>
            ))}
            <mesh material={M.gold} position-y={0.55}><cylinderGeometry args={[0.2, 0.2, 0.04, 28]} /></mesh>
            <mesh material={M.gold} position-y={-0.45}><cylinderGeometry args={[0.2, 0.2, 0.04, 28]} /></mesh>
            {[[-0.43, 0.35], [0.35, 0.35]].map(([x, y]) => (
              <mesh key={x} material={M.orange} rotation-x={Math.PI / 2} position={[x, y, 0]}>
                <torusGeometry args={[0.17, 0.07, 12, 28]} />
              </mesh>
            ))}
            {orangeGeos.map((geo, i) => <mesh key={i} geometry={geo} material={M.orange} />)}
            {[[-0.5, -0.33], [0.38, -0.38]].map(([x, y]) => (
              <group key={x} position={[x, y, 0]}>
                <mesh material={M.white}><cylinderGeometry args={[0.1, 0.1, 0.3, 24]} /></mesh>
                <mesh material={M.gold} position-y={0.16}><cylinderGeometry args={[0.11, 0.11, 0.03, 24]} /></mesh>
                <mesh material={M.gold} position-y={-0.16}><cylinderGeometry args={[0.11, 0.11, 0.03, 24]} /></mesh>
              </group>
            ))}
            {Array.from({ length: 7 }, (_, k) => {
              const a = (k / 7) * Math.PI * 2 + 0.2;
              return (
                <mesh key={`r${k}`} material={M.silver} position={[Math.cos(a) * 0.92, 0.08, Math.sin(a) * 0.92]}>
                  <cylinderGeometry args={[0.025, 0.025, 1.05, 12]} />
                </mesh>
              );
            })}
            <mesh material={M.silver} position={[0.62, 0.1, 0.3]} rotation-z={-0.5}><cylinderGeometry args={[0.018, 0.018, 0.75, 10]} /></mesh>
            {Array.from({ length: 8 }, (_, k) => {
              const a = (k / 8) * Math.PI * 2;
              return (
                <mesh key={`gb${k}`} material={M.gold} position={[Math.cos(a) * 0.8, 0.5, Math.sin(a) * 0.8]} rotation-y={-a}>
                  <boxGeometry args={[0.06, 0.1, 0.06]} />
                </mesh>
              );
            })}
          </group>

          {/* ===== four gold stage plates ===== */}
          {PLATE_Y.map((y, j) => {
            const R = PLATE_R[j];
            return (
              <group key={j} ref={(o) => (g.plates[j] = o)} position={[0, y, 0]}>
                <mesh material={M.gold}><cylinderGeometry args={[R, R, 0.06, 72]} /></mesh>
                <mesh material={M.goldL} rotation-x={Math.PI / 2} position-y={0.03}><torusGeometry args={[R, 0.012, 8, 96]} /></mesh>
                <mesh material={M.goldD} position-y={-0.04}><cylinderGeometry args={[R * 0.96, R * 0.96, 0.02, 72]} /></mesh>
                {j === 0 && <mesh material={M.goldL} position-y={0.05}><cylinderGeometry args={[R * 0.9, R * 0.9, 0.03, 72]} /></mesh>}
                {Array.from({ length: 8 }, (_, k) => {
                  const a = (k / 8) * Math.PI * 2 + j * 0.3;
                  return (
                    <mesh key={`h${k}`} material={M.hole} position={[Math.cos(a) * R * 0.72, 0.033, Math.sin(a) * R * 0.72]}>
                      <cylinderGeometry args={[R * 0.05, R * 0.05, 0.006, 16]} />
                    </mesh>
                  );
                })}
                {Array.from({ length: 12 }, (_, k) => {
                  const a = (k / 12) * Math.PI * 2 + 0.13;
                  return (
                    <mesh key={`b${k}`} material={M.goldD} position={[Math.cos(a) * R * 0.92, 0.05, Math.sin(a) * R * 0.92]}>
                      <cylinderGeometry args={[0.022, 0.022, 0.04, 10]} />
                    </mesh>
                  );
                })}
              </group>
            );
          })}

          {/* ===== support rods + collars + centre hardware (one group per gap) ===== */}
          {GAP_H.map((H, j) => {
            const rr = ROD_R[j];
            const nR = j === 1 ? 4 : 6;
            return (
              <group key={j} ref={(o) => (g.rods[j] = o)} position={[0, (PLATE_Y[j] + PLATE_Y[j + 1]) / 2, 0]}>
                {Array.from({ length: nR }, (_, k) => {
                  const a = (k / nR) * Math.PI * 2 + j * 0.5;
                  const x = Math.cos(a) * rr;
                  const z = Math.sin(a) * rr;
                  return (
                    <group key={k} position={[x, 0, z]}>
                      <mesh material={M.silver}><cylinderGeometry args={[j === 1 ? 0.028 : 0.035, j === 1 ? 0.028 : 0.035, H - 0.06, 12]} /></mesh>
                      <mesh material={M.gold} position-y={H / 2 - 0.08}><cylinderGeometry args={[0.055, 0.055, 0.1, 14]} /></mesh>
                      {j !== 1 && <mesh material={M.gold} position-y={-H / 2 + 0.08}><cylinderGeometry args={[0.055, 0.055, 0.1, 14]} /></mesh>}
                    </group>
                  );
                })}
                {j === 0 && (
                  <>
                    <mesh material={M.steel}><cylinderGeometry args={[0.07, 0.07, H - 0.06, 20]} /></mesh>
                    {[0.38, 0.45].map((y) => (
                      <mesh key={y} material={M.goldL} position-y={y}><cylinderGeometry args={[0.22, 0.22, 0.025, 28]} /></mesh>
                    ))}
                    <mesh geometry={coilGeo} material={M.gold} position-y={0.1} />
                    <mesh material={M.silver} position-y={-0.25}><cylinderGeometry args={[0.18, 0.18, 0.2, 28]} /></mesh>
                    <mesh material={M.steelD} position-y={-0.45}><cylinderGeometry args={[0.26, 0.26, 0.1, 28]} /></mesh>
                  </>
                )}
                {j === 1 && (
                  <>
                    <mesh geometry={coilGeo} material={M.gold} scale={[0.8, 0.9, 0.8]} />
                    <mesh material={M.silver} position={[0.45, 0, 0]} rotation-z={0.55}><cylinderGeometry args={[0.015, 0.015, 0.5, 10]} /></mesh>
                    {[-0.3, 0.3].map((x) => (
                      <mesh key={x} material={M.steel} position={[x, -0.08, 0.1]}><cylinderGeometry args={[0.04, 0.04, 0.16, 14]} /></mesh>
                    ))}
                  </>
                )}
                {j === 2 && (
                  <>
                    <mesh material={M.steel}><cylinderGeometry args={[0.22, 0.22, 0.55, 36]} /></mesh>
                    {[-0.2, -0.07, 0.07, 0.2].map((y) => (
                      <mesh key={y} material={M.gold} rotation-x={Math.PI / 2} position-y={y}><torusGeometry args={[0.225, 0.012, 6, 36]} /></mesh>
                    ))}
                    {[-0.45, 0.45].map((x) => (
                      <group key={x} position={[x, -H / 2 + 0.17, 0]}>
                        <mesh material={M.white}><cylinderGeometry args={[0.09, 0.09, 0.22, 20]} /></mesh>
                        <mesh material={M.gold} position-y={0.12}><cylinderGeometry args={[0.1, 0.1, 0.025, 20]} /></mesh>
                      </group>
                    ))}
                  </>
                )}
              </group>
            );
          })}

          {/* ===== coax wiring + loops (instanced, spans the plate stack) ===== */}
          <group ref={(o) => (g.cables = o)} position={[0, CY, 0]}>
            <primitive object={wires} />
            <primitive object={loops} />
          </group>

          {/* ===== white coax cables + spiral cables ===== */}
          <group ref={(o) => (g.base = o)} position={[0, BASE_Y, 0]}>
            {fanGeos.map((geo, i) => <mesh key={i} geometry={geo} material={M.cream} />)}
            {spiralGeos.map((geo, i) => <mesh key={`s${i}`} geometry={geo} material={M.goldL} />)}
          </group>

          {/* ===== gold filter blocks (ribbed slabs) ===== */}
          <group ref={(o) => (g.conn = o)} position={[0, CONN_Y, 0]}>
            {[[-0.42, 0, 0, 0.26, 0.85, 0.5], [0.42, 0, 0, 0.26, 0.85, 0.5], [0, -0.05, 0.2, 0.3, 0.7, 0.34]].map(([x, y, z, w, h, d], i) => (
              <group key={i} position={[x, y, z]}>
                <mesh material={M.gold}><boxGeometry args={[w, h, d]} /></mesh>
                {Array.from({ length: 9 }, (_, k) => (
                  <mesh key={k} material={M.goldL} position-y={-h / 2 + 0.06 + (k * (h - 0.12)) / 8}>
                    <boxGeometry args={[w + 0.02, 0.018, d + 0.02]} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>

          {/* ===== quantum processor: silver tube with glowing end cap ===== */}
          <group ref={(o) => (g.core = o)} position={[0, CORE_Y, 0]}>
            <mesh material={M.silver}><cylinderGeometry args={[0.16, 0.16, 0.7, 40]} /></mesh>
            <mesh material={M.goldL} rotation-x={Math.PI / 2} position-y={-0.2}><torusGeometry args={[0.165, 0.012, 8, 40]} /></mesh>
            <mesh material={M.chip} position-y={-0.355}><cylinderGeometry args={[0.12, 0.12, 0.02, 24]} /></mesh>
            <mesh ref={(o) => (g.glow = o)} position-y={-0.34}>
              <sphereGeometry args={[0.26, 24, 24]} />
              <meshBasicMaterial color={CYAN} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
            <pointLight color={CYAN} intensity={4} distance={4} position-y={-0.4} />
          </group>
        </group>
      </group>
    </>
  );
}

/* ============================================================
   WRAPPER (DOM overlays + hover handling)
   ============================================================ */
export default function QuantumCore() {
  const rootRef = useRef(null);
  const hoverRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const reduce = useMemo(
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
    []
  );
  const touch = useMemo(
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(hover: none)').matches : false),
    []
  );

  const ui = useRef({ labels: [], lines: [], dots: [], box: null }).current;

    useEffect(() => { ui.box = rootRef.current; }, [ui]);

  const set = useCallback((v) => {
    hoverRef.current = v ? 1 : 0;
    setOpen(!!v);
  }, []);

  /* pause rendering while off screen */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`qcore${open ? ' is-open' : ''}`}
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') set(true); }}
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') set(false); }}
      onClick={() => { if (touch) set(!hoverRef.current); }}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      tabIndex={0}
      role="img"
      aria-label="Interactive quantum computer. Hover to see its parts, move away to reassemble."
    >
      <Canvas
        className="qcore__canvas"
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0.56, 15.04], fov: 38, near: 0.1, far: 80 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.15, 0)}
      >
        <Scene hoverRef={hoverRef} ui={ui} reduce={reduce} />
      </Canvas>

      {/* connector lines */}
      <svg className="qcore__lines" aria-hidden="true">
        {PARTS.map((p, i) => (
          <g key={p.id}>
            <line ref={(o) => (ui.lines[i] = o)} className="qcore__line" x1="0" y1="0" x2="0" y2="0" style={{ opacity: 0 }} />
            <circle ref={(o) => (ui.dots[i] = o)} className="qcore__dot" r="3.5" cx="0" cy="0" style={{ opacity: 0 }} />
          </g>
        ))}
      </svg>

      {/* part labels */}
      {PARTS.map((p, i) => (
        <div
          key={p.id}
          ref={(o) => (ui.labels[i] = o)}
          className={`qcore__label qcore__label--${p.side}`}
          style={{ opacity: 0, top: `${ROW_PCT[p.row]}%` }}
          aria-hidden="true"
        >
          <strong>{p.name}</strong>
          <span>{p.desc}</span>
        </div>
      ))}

      <div className="qcore__hint" aria-hidden="true">
        {open ? (touch ? 'Tap to reassemble' : 'Move away to reassemble') : (touch ? 'Tap to take it apart' : 'Hover to take it apart')}
      </div>
    </div>
  );
}