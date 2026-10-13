import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown, Clock, MapPin, Zap, ArrowUpRight, ArrowDown, Filter
} from 'lucide-react';
import '../styles/careers.css';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const positions = [
  {
    dept: 'Quantum Research',
    level: 'Principal Level',
    urgent: true,
    location: 'Bengaluru',
    type: 'Hybrid',
    title: 'Principal Quantum Algorithms Engineer',
    desc: 'Architect breakthrough variational quantum eigensolvers (VQE) and adiabatic optimization schemes targeted for fault-tolerant physical topologies.',
    salary: '₹75L — ₹1.1Cr + Equity',
  },
  {
    dept: 'Quantum Research',
    level: 'Senior Staff',
    urgent: false,
    location: 'Zurich',
    type: 'Remote',
    title: 'Post-Quantum Cryptography Researcher',
    desc: "Conduct security proofs and implement lattice-based cryptographic protocols resistant to Shor's algorithm for sovereign defense and banking ecosystems.",
    salary: '180K — 230K CHF + Equity',
  },
  {
    dept: 'Software Engineering',
    level: 'Staff Architect',
    urgent: false,
    location: 'San Francisco',
    type: 'Hybrid',
    title: 'Staff Full-Stack Quantum Cloud Architect',
    desc: 'Construct high-throughput quantum execution gateways bridging cloud orchestration layers with heterogeneous physical quantum hardware processors.',
    salary: '$240K — $310K + Equity',
  },
  {
    dept: 'AI & Bio-tech',
    level: 'Senior Scientist',
    urgent: true,
    location: 'Bengaluru',
    type: 'On-site',
    title: 'Bio-Molecular Simulation Scientist',
    desc: 'Model complex enzyme catalytic mechanisms utilizing hybrid quantum–classical Hamiltonians to expedite synthetic pharmacology and targeted genomics.',
    salary: '₹55L — ₹85L + Equity',
  },
  {
    dept: 'Software Engineering',
    level: 'Senior / Lead',
    urgent: false,
    location: 'Global',
    type: 'Remote',
    title: 'Quantum Compiler & LLVM Specialist',
    desc: 'Develop intermediate representation (IR) optimizations, pulse-level instruction translators, and automated quantum circuit depth synthesizers.',
    salary: '$190K — $260K + Equity',
  },
];

const journey = [
  {
    step: '01', icon: 'λ', title: 'Technical Screen',
    desc: '45-minute asynchronous or live deep-dive on core mathematical principles, computational complexity, and prior projects.',
    time: '~48 HOURS SLA', featured: false,
  },
  {
    step: '02', icon: '⚛', title: 'Research Defense / Code Collab',
    desc: 'Present your sovereign research portfolio or pair directly with our principal staff on simulated quantum instruction sets.',
    time: '2 HOURS', featured: false,
  },
  {
    step: '03', icon: '✓', title: 'Cultural Coherence',
    desc: 'A mutual alignment session focusing on ethical frontiers, interdisciplinary team dynamics, and radical intellectual autonomy.',
    time: '60 MINUTES', featured: false,
  },
  {
    step: '04', icon: '★', title: 'Sovereign Offer',
    desc: 'Comprehensive offer letter detailing base, founder-level equity terms, computational hardware allowances, and patent rights.',
    time: 'COMPLETION → 5 WORKING DAYS', featured: true,
  },
];

const departments = ['All', 'Quantum Research', 'Software Engineering', 'AI & Bio-tech', 'Product'];
const locations = ['All Global Hubs'];

const telemetry = [
  { label: 'Active Qubit Coherence',        value: '99.987%' },
  { label: 'Post-Quantum Fault Latency',    value: '8.42 µs' },
  { label: 'Sovereign Research Grants',     value: '₹148M / Tier-1' },
];

export default function Careers() {
  const [activeDept, setActiveDept] = useState('All');
  const [activeLoc, setActiveLoc] = useState('All Global Hubs');
  const [deptOpen, setDeptOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);

  const filtered = activeDept === 'All'
    ? positions
    : positions.filter((p) => p.dept === activeDept);

  return (
    <div className="careers-dash">

      {/* ================= HERO ================= */}
      <section className="chero">
        <div className="chero__bg" aria-hidden="true">
          <div className="chero__grid" />
          <div className="chero__glow chero__glow--blue" />
          <div className="chero__glow chero__glow--gold" />
        </div>

        <div className="container chero__inner">
          {/* LEFT */}
          <motion.div
            className="chero__content"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chero__pill">
              <span className="chero__pill-dot" />
              SOVEREIGN INTEL &amp; QUANTUM LAB EXPANSION 2025
            </span>

            <h1 className="chero__title">
              Build the <span className="text-gradient-gold">Quantum</span><br />
              Era With Us.
            </h1>

            <p className="chero__lead">
              We are engineering the algorithms and architectures that will define the
              next century of computing. Discover your life&rsquo;s definitive work.
            </p>

            <div className="chero__actions">
              <a href="#open-positions" className="chero__btn chero__btn--gold">
                Explore Open Roles <ArrowDown size={14} />
              </a>
              <Link to="/about" className="chero__btn chero__btn--ghost">
                [ Institutional Manifesto ]
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — telemetry card */}
          <motion.aside
            className="chero__telemetry"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="tele__head">
              <span className="tele__head-left">
                <span className="tele__icon">⌬</span>
                SYS_TELEMETRY: LAB_NODE_09
              </span>
              <span className="tele__live">LIVE_STATE</span>
            </header>

            <div className="tele__rows">
              {telemetry.map((row) => (
                <div className="tele__row" key={row.label}>
                  <span className="tele__label">{row.label}</span>
                  <span className="tele__value">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="tele__footer">
              <span>GLOBAL SITES: BENGALURU · ZURICH · SF</span>
              <span className="tele__knot" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2"/>
                </svg>
              </span>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* ================= OPEN POSITIONS DIRECTORY ================= */}
      <section className="dash-section" id="open-positions">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="dash-eyebrow">
                <span className="dash-eyebrow__dot" /> CURRENT DEPLOYMENTS
              </span>
              <h2 className="dash-title">Open Positions Directory</h2>
            </div>
            <span className="dash-count">
              Showing {filtered.length} active engineering &amp; theoretical research vacancies.
            </span>
          </div>

          <div className="dash-filters">
            <div className="dash-filter">
              <span className="dash-filter__label">DEPARTMENT:</span>
              <button
                className="dash-filter__btn"
                onClick={() => { setDeptOpen((v) => !v); setLocOpen(false); }}
              >
                {activeDept} <ChevronDown size={12} />
              </button>
              {deptOpen && (
                <div className="dash-filter__menu">
                  {departments.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setActiveDept(d); setDeptOpen(false); }}
                      className={activeDept === d ? 'is-active' : ''}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dash-filter dash-filter--right">
              <span className="dash-filter__label">LOCATION:</span>
              <button
                className="dash-filter__btn"
                onClick={() => { setLocOpen((v) => !v); setDeptOpen(false); }}
              >
                {activeLoc} <ChevronDown size={12} />
              </button>
              {locOpen && (
                <div className="dash-filter__menu dash-filter__menu--right">
                  {locations.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setActiveLoc(l); setLocOpen(false); }}
                      className={activeLoc === l ? 'is-active' : ''}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="job-list">
            {filtered.map((p, i) => (
              <motion.article
                key={p.title}
                className="job-row"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <div className="job-row__main">
                  <div className="job-row__tags">
                    <span className="tag tag--dept">{p.dept}</span>
                    <span className="tag">{p.level}</span>
                    {p.urgent && <span className="tag tag--urgent"><Zap size={9} /> Immediate Hiring</span>}
                    <span className="tag tag--ghost"><MapPin size={10} /> {p.location} / {p.type}</span>
                  </div>

                  <h3 className="job-row__title">{p.title}</h3>
                  <p className="job-row__desc">{p.desc}</p>
                </div>

                <div className="job-row__side">
                  <span className="job-row__salary-label">ANNUAL BRACKET</span>
                  <span className="job-row__salary">{p.salary}</span>
                  <Link to="/contact" className="job-row__apply">
                    Apply Now <ArrowUpRight size={12} />
                  </Link>
                </div>
              </motion.article>
            ))}

            {filtered.length === 0 && (
              <div className="job-empty">
                <Filter size={20} />
                <p>No positions match the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= APPLICATION JOURNEY ================= */}
      <section className="dash-section dash-section--journey">
        <div className="container">
          <div className="journey-head">
            <span className="dash-eyebrow dash-eyebrow--center">
              <span className="dash-eyebrow__dot" /> PROTOCOL SPECIFICATION
            </span>
            <h2 className="journey-title">Application Journey &amp; Review Pipeline</h2>
            <p className="journey-lead">
              A respectful, transparent 4-stage evaluation designed by researchers for researchers.
              No algorithmic screening gates.
            </p>
          </div>

          <div className="journey-grid">
            {journey.map((s, i) => (
              <motion.div
                key={s.step}
                className={`journey-card ${s.featured ? 'is-featured' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="journey-card__top">
                  <span className="journey-card__step">{s.step}</span>
                  <span className="journey-card__icon">{s.icon}</span>
                </div>
                <h4 className="journey-card__title">{s.title}</h4>
                <p className="journey-card__desc">{s.desc}</p>
                <div className="journey-card__time">
                  <Clock size={10} /> {s.time}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="inquiry"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h3 className="inquiry__title">Don&rsquo;t see your specific quantum discipline?</h3>
              <p className="inquiry__desc">
                We regularly create custom sovereign chairs and research fellow positions
                for extraordinary theorists and systems engineers.
              </p>
            </div>
            <a href="mailto:careers@q-prakrithi.example" className="inquiry__cta">
              [ Initiate Speculative Inquiry ] <ArrowUpRight size={12} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}