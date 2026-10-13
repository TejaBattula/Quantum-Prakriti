import { motion } from 'framer-motion';

export default function QuantumVisual() {
  const qubits = [
    { cx: 90, cy: 90, delay: 0 },
    { cx: 210, cy: 60, delay: 0.3 },
    { cx: 300, cy: 140, delay: 0.6 },
    { cx: 150, cy: 200, delay: 0.9 },
    { cx: 260, cy: 260, delay: 1.2 },
    { cx: 70, cy: 280, delay: 1.5 },
    { cx: 190, cy: 340, delay: 1.8 },
    { cx: 320, cy: 300, delay: 2.1 },
  ];

  const connections = [
    [0,1],[1,2],[0,3],[3,4],[4,2],[3,5],[5,6],[6,4],[6,7],[4,7]
  ];

  return (
    <div className="qv-wrap" aria-hidden="true">
      <div className="qv-glow" />
      <svg viewBox="0 0 400 400" className="qv-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="qg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="qb" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#4F7Fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F7Fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F7Fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer rings */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(79,127,255,0.08)" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(212,175,55,0.1)" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(79,127,255,0.12)" />

        {/* Connections */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={qubits[a].cx} y1={qubits[a].cy}
            x2={qubits[b].cx} y2={qubits[b].cy}
            stroke="url(#line)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.4, delay: i * 0.12 }}
          />
        ))}

        {/* Qubits */}
        {qubits.map((q, i) => (
          <g key={i}>
            <motion.circle
              cx={q.cx} cy={q.cy} r="16"
              fill="url(#qb)"
              animate={{ r: [14, 20, 14], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, delay: q.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx={q.cx} cy={q.cy} r="6"
              fill={i % 3 === 0 ? '#D4AF37' : '#4F7Fff'}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.4, delay: q.delay, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: `${q.cx}px ${q.cy}px` }}
            />
          </g>
        ))}
      </svg>

      <style>{`
        .qv-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 560px;
          margin-inline: auto;
        }
        .qv-svg { width: 100%; height: 100%; filter: drop-shadow(0 0 30px rgba(79,127,255,0.25)); }
        .qv-glow {
          position: absolute; inset: 10%;
          background: radial-gradient(circle at 50% 50%, rgba(79,127,255,0.22), transparent 65%);
          filter: blur(40px);
          z-index: -1;
        }
      `}</style>
    </div>
  );
}