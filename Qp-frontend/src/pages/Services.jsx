import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ArrowUpRight, ArrowRight, Download, Lock, CheckCircle2,
  Cpu, Atom, ShieldCheck, Zap, Network, FlaskConical, Microscope,
} from 'lucide-react';
import '../styles/services.css';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const filters = ['All Solutions', 'Quantum Computing', 'Bio-Informatics', 'Post-Quantum Security', 'High-Performance Cloud'];

const primaryServices = [
  {
    icon: Atom,
    badge: 'SPEEDUP · 100x',
    badgeTone: 'blue',
    title: 'Quantum Optimization Engine',
    desc: 'Combinatorial optimization, dynamic logistics orchestration, and supply chain topological routing solving multi-million-variable NP-hard challenges in milliseconds.',
    meta: [
      { k: 'ALGORITHM', v: 'QAOA / Hybrid' },
      { k: 'EXECUTION', v: 'Real-time' },
    ],
  },
  {
    icon: Lock,
    badge: 'NIST STANDARDIZED',
    badgeTone: 'red',
    title: 'Post-Quantum Cryptography (PQC)',
    desc: 'Lattice-based encryption and zero-knowledge sovereign defense designed to neutralize Harvest-Now-Decrypt-Later threats and quantum decoherence vectoring.',
    meta: [
      { k: 'CRYPTO', v: 'Kyber-1024' },
      { k: 'SECURE VECTOR', v: '~' },
    ],
  },
  {
    icon: FlaskConical,
    badge: 'AB INITIO ACCURACY',
    badgeTone: 'gold',
    title: 'Bio-Molecular Simulation & Discovery',
    desc: 'Accelerated quantum chemistry modeling for drug discovery, active-site protein folding, and catalyst-reaction kinetics beyond classical DFT capacities.',
    meta: [
      { k: 'MODELS', v: 'VQE / RBM' },
      { k: 'ELECTRONIC', v: '~' },
    ],
  },
];

const secondaryServices = [
  {
    icon: Cpu,
    badge: 'HYBRID GPU',
    title: 'Quantum-Resilient Neural Architectures',
    desc: 'Parameterized quantum circuits interwoven with high-parameter LLMs and classical convolutional frameworks for hyper-dimensional pattern recognition.',
    meta: [{ k: 'HYBRID', v: 'QNN + LLM' }],
  },
  {
    icon: Network,
    badge: 'CRYOGENIC BUS',
    title: 'Enterprise Quantum Cloud (QaaS)',
    desc: 'Low-latency direct gRPC/REST endpoints into Dilution Refrigerator arrays, coupled with error mitigation pipelines and qubit scheduling.',
    meta: [{ k: 'LATENCY', v: 'Sub-10ms' }],
  },
  {
    icon: ShieldCheck,
    badge: 'TIER-1 ADVISORY',
    title: 'Specialized Quantum Advisory & Architecture',
    desc: 'Enterprise transformation roadmaps, proof-of-concept synthesis, patent IP defensibility, and algorithmic transition for executive leadership teams.',
    meta: [{ k: 'DELIVERY', v: 'Executive' }],
  },
];

const framework = [
  {
    step: '01',
    title: 'Exploration & Feasibility',
    desc: 'Comprehensive quantum readiness audit, business case mathematical abstraction, and identification of high-ROI operational advantages.',
    time: 'Hamiltonian Mapping',
  },
  {
    step: '02',
    title: 'Algorithm Co-design',
    desc: 'Proprietary algorithmic engineering: quantum circuit synthesis, noise suppression protocol structuring, and simulator validation.',
    time: 'Custom Qubit Routing',
  },
  {
    step: '03',
    title: 'Hybrid Benchmarking',
    desc: 'Side-by-side verification comparing top-tier classical HPC clusters against our accelerated quantum runtimes for statistical parity.',
    time: 'Parity Certification',
  },
  {
    step: '04',
    title: 'Production Deployment',
    desc: 'Zero-friction containerized orchestration, cryptographic key migration, real-time pulse correction, and SLA-backed maintenance.',
    time: 'Continuous Telemetry',
  },
];

const benchmarks = [
  {
    icon: Network,
    domain: 'Global Supply Routing (3.2M Combinations)',
    classical: '48.4 Hours (Approximation)',
    quantum: '142 Milliseconds (Exact)',
    advantage: '1,230x Speedup',
    tone: 'gold',
  },
  {
    icon: Lock,
    domain: 'Multi-Party Key Synthesis Vulnerability',
    classical: 'RSA-4096 (Deprecated by Shor)',
    quantum: 'Kyber Modulo-LWE (Immune)',
    advantage: '≈ Mathematical Ceiling',
    tone: 'blue',
  },
  {
    icon: FlaskConical,
    domain: 'Nitrogenase FeMo-Cofactor Simulation',
    classical: 'Infeasible (> 12,000 Years)',
    quantum: '18.4 Minutes (Ground State)',
    advantage: 'Definitive Supremacy',
    tone: 'gold',
  },
  {
    icon: Zap,
    domain: 'Aggregate Energy Consumption Per Run',
    classical: '3.81 Megawatt Hours',
    quantum: '12.5 Kilowatt Hours',
    advantage: '99.3% Reduction',
    tone: 'blue',
  },
];

export default function Services() {
  const [active, setActive] = useState('All Solutions');

  return (
    <div className="svc-dash">

      {/* ============ HERO ============ */}
      <section className="shero">
        <div className="shero__bg" aria-hidden="true">
          <div className="shero__grid" />
          <div className="shero__glow shero__glow--blue" />
          <div className="shero__glow shero__glow--gold" />
        </div>

        <div className="container shero__inner">
          <motion.span
            className="shero__pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="shero__pill-dot" />
            STATE-OF-THE-ART QUANTUM RUNTIME · v4.2
          </motion.span>

          <motion.h1
            className="shero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Next-Generation <span className="text-gradient-gold">Deep-Tech</span><br />
            &amp; Quantum Engineering<br />
            Services
          </motion.h1>

          <motion.p
            className="shero__lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Empowering tier-1 enterprises, aerospace, biomedical, and fintech institutions
            with fault-tolerant quantum algorithms and distributed neural networks.
          </motion.p>

          <motion.div
            className="shero__filters"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`chip ${active === f ? 'chip--active' : ''}`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SECTION 01 — ARCHITECTED FOR SUPREMACY ============ */}
      <section className="dash-sec">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="dash-eyebrow">
                <span className="dash-eyebrow__dot" /> SOVEREIGN CAPABILITIES
              </span>
              <h2 className="dash-title">Architected for Supremacy</h2>
            </div>
            <p className="dash-note">
              Engineered to withstand geopolitical disruption, cryptographic degradation,
              and classical computational ceilings.
            </p>
          </div>

          <div className="svc-grid">
            {primaryServices.map((s, i) => (
              <motion.article
                key={s.title}
                className={`svc-tile svc-tile--${s.badgeTone}`}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <div className="svc-tile__top">
                  <div className="svc-tile__icon"><s.icon size={18} strokeWidth={1.8} /></div>
                  <span className={`svc-badge svc-badge--${s.badgeTone}`}>{s.badge}</span>
                </div>
                <h3 className="svc-tile__title">{s.title}</h3>
                <p className="svc-tile__desc">{s.desc}</p>
                <div className="svc-tile__meta">
                  {s.meta.map((m) => (
                    <span key={m.k}>
                      <em>{m.k}</em>
                      <strong>{m.v}</strong>
                    </span>
                  ))}
                </div>
                <div className="svc-tile__foot">
                  <button className="svc-tile__cta">
                    Explore Route <ChevronRight size={12} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="svc-grid svc-grid--sub">
            {secondaryServices.map((s, i) => (
              <motion.article
                key={s.title}
                className="svc-tile svc-tile--plain"
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <div className="svc-tile__top">
                  <div className="svc-tile__icon"><s.icon size={18} strokeWidth={1.8} /></div>
                  <span className="svc-badge svc-badge--plain">{s.badge}</span>
                </div>
                <h3 className="svc-tile__title">{s.title}</h3>
                <p className="svc-tile__desc">{s.desc}</p>
                <div className="svc-tile__meta">
                  {s.meta.map((m) => (
                    <span key={m.k}>
                      <em>{m.k}</em>
                      <strong>{m.v}</strong>
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 02 — DELIVERY FRAMEWORK ============ */}
      <section className="dash-sec dash-sec--alt">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="dash-eyebrow">
                <span className="dash-eyebrow__dot" /> DELIVERY DISCIPLINE
              </span>
              <h2 className="dash-title">Precision Operational Framework</h2>
            </div>
            <p className="dash-note dash-note--left">
              From theoretical Hamiltonian mapping to cryogenic hardware compilation and
              production pipeline deployment.
            </p>
          </div>

          <div className="frame-grid">
            {framework.map((f, i) => (
              <motion.div
                key={f.step}
                className="frame-card"
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <div className="frame-card__top">
                  <span className="frame-card__step">{f.step}</span>
                  <ArrowRight size={14} />
                </div>
                <h4 className="frame-card__title">{f.title}</h4>
                <p className="frame-card__desc">{f.desc}</p>
                <div className="frame-card__time">
                  <CheckCircle2 size={11} /> {f.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 03 — TELEMETRY BENCHMARK ============ */}
      <section className="dash-sec">
        <div className="container">
          <motion.div className="bench" {...fadeUp}>
            <header className="bench__head">
              <div>
                <span className="dash-eyebrow">
                  <span className="dash-eyebrow__dot" /> QUANTUM TELEMETRY BENCHMARK
                </span>
                <h2 className="bench__title">
                  Classical Supercomputing vs. Q-Prakrithi<br />Supremacy
                </h2>
              </div>
              <div className="bench__live">
                <span className="bench__live-dot" />
                <span>LIVE VERIFICATION: GPU-<br />A100-80</span>
              </div>
            </header>

            <div className="bench__table">
              <div className="bench__row bench__row--head">
                <span>DOMAIN CHALLENGE</span>
                <span>CLASSICAL HPC (50K+ NODES)</span>
                <span>Q-PRAKRITHI QUANTUM CORE</span>
                <span>ADVANTAGE MULTIPLIER</span>
              </div>

              {benchmarks.map((b) => (
                <div className="bench__row" key={b.domain}>
                  <span className="bench__domain">
                    <span className="bench__domain-ico"><b.icon size={13} /></span>
                    {b.domain}
                  </span>
                  <span className="bench__classical">{b.classical}</span>
                  <span className="bench__quantum">{b.quantum}</span>
                  <span className={`bench__adv bench__adv--${b.tone}`}>{b.advantage}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ SECTION — ENCRYPTED ADVISORY ============ */}
      <section className="dash-sec dash-sec--advisory">
        <div className="container">
          <motion.div className="advisory" {...fadeUp}>
            <span className="advisory__pill">
              <Lock size={11} /> ENCRYPTED ADVISORY PORTAL
            </span>
            <h2 className="advisory__title">
              Prepare Your Sovereign<br />Infrastructure For The Post-Classical<br />Era
            </h2>
            <p className="advisory__lead">
              Schedule a confidential technical audit and algorithmic alignment session
              with our principal quantum scientists and systems architects.
            </p>

            <div className="advisory__actions">
              <Link to="/contact" className="advisory__btn advisory__btn--gold">
                Initiate Sovereign Consultation <ArrowRight size={14} />
              </Link>
              <a href="#" className="advisory__btn advisory__btn--ghost">
                Download Whitepaper <Download size={14} />
              </a>
            </div>

            <div className="advisory__trust">
              <span><ShieldCheck size={12} /> Zero-Knowledge Verification</span>
              <span><Lock size={12} /> Strict NDA Protection</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}