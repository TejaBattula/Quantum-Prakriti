import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Clock,
  MapPin,
  Zap,
  ArrowUpRight,
  ArrowDown,
  Filter,
  X,
  BriefcaseBusiness,
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
function ExpandablePositions({ positions }) {
  const [activePosition, setActivePosition] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActivePosition(null);
      }
    };

    if (activePosition) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activePosition]);

  useEffect(() => {
    if (!activePosition) return;

    const handleOutsideClick = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setActivePosition(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [activePosition]);

  return (
    <div className="expandable-jobs">
      {/* Expanded modal backdrop */}
      <AnimatePresence>
        {activePosition && (
          <motion.div
            className="expandable-jobs__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setActivePosition(null)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Expanded job modal */}
      <AnimatePresence>
        {activePosition && (
          <div className="expandable-jobs__modal-layer">
            <motion.article
              ref={modalRef}
              layoutId={`job-card-${activePosition.title}`}
              className="expanded-job"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="expanded-job-title"
            >
              <div className="expanded-job__top">
                <div className="expanded-job__symbol">
                  <BriefcaseBusiness size={22} />
                </div>

                <span className="expanded-job__status">
                  <span />
                  OPEN POSITION
                </span>

                <button
                  type="button"
                  className="expanded-job__close"
                  onClick={() => setActivePosition(null)}
                  aria-label="Close job details"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="expanded-job__content">
                <div className="expanded-job__tags">
                  <span className="tag tag--dept">
                    {activePosition.dept}
                  </span>

                  <span className="tag">
                    {activePosition.level}
                  </span>

                  {activePosition.urgent && (
                    <span className="tag tag--urgent">
                      <Zap size={10} />
                      Immediate Hiring
                    </span>
                  )}
                </div>

                <motion.h2
                  layoutId={`job-title-${activePosition.title}`}
                  id="expanded-job-title"
                  className="expanded-job__title"
                >
                  {activePosition.title}
                </motion.h2>

                <p className="expanded-job__description">
                  {activePosition.desc}
                </p>

                <div className="expanded-job__details">
                  <div className="expanded-job__detail">
                    <span className="expanded-job__detail-label">
                      DEPARTMENT
                    </span>
                    <span>{activePosition.dept}</span>
                  </div>

                  <div className="expanded-job__detail">
                    <span className="expanded-job__detail-label">
                      EXPERIENCE LEVEL
                    </span>
                    <span>{activePosition.level}</span>
                  </div>

                  <div className="expanded-job__detail">
                    <span className="expanded-job__detail-label">
                      LOCATION
                    </span>
                    <span>
                      <MapPin size={13} />
                      {activePosition.location} · {activePosition.type}
                    </span>
                  </div>

                  <div className="expanded-job__detail">
                    <span className="expanded-job__detail-label">
                      ANNUAL COMPENSATION
                    </span>
                    <span className="expanded-job__salary">
                      {activePosition.salary}
                    </span>
                  </div>
                </div>

                <div className="expanded-job__footer">
                  <div>
                    <span className="expanded-job__footer-label">
                      Q-PRAKRITI CAREERS
                    </span>
                    <p>Help shape the next era of quantum computing.</p>
                  </div>

                  <Link
                    to="/contact"
                    className="expanded-job__apply"
                    onClick={() => setActivePosition(null)}
                  >
                    Apply Now
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.article>
          </div>
        )}
      </AnimatePresence>

      {/* Compact job cards */}
      <div className="expandable-jobs__list">
        {positions.map((position, index) => (
          <motion.article
            key={position.title}
            layoutId={`job-card-${position.title}`}
            className="expandable-job-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-35px' }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
            }}
            whileHover={{ y: -3 }}
            onClick={() => setActivePosition(position)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActivePosition(position);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${position.title}`}
          >
            <div className="expandable-job-card__icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div className="expandable-job-card__main">
              <div className="job-row__tags">
                <span className="tag tag--dept">
                  {position.dept}
                </span>

                <span className="tag">
                  {position.level}
                </span>

                {position.urgent && (
                  <span className="tag tag--urgent">
                    <Zap size={9} />
                    Immediate Hiring
                  </span>
                )}
              </div>

              <motion.h3
                layoutId={`job-title-${position.title}`}
                className="job-row__title"
              >
                {position.title}
              </motion.h3>

              <p className="job-row__desc">
                {position.desc}
              </p>

              <div className="expandable-job-card__meta">
                <span>
                  <MapPin size={12} />
                  {position.location}
                </span>

                <span>{position.type}</span>
              </div>
            </div>

            <div className="expandable-job-card__side">
              <span className="job-row__salary-label">
                ANNUAL BRACKET
              </span>

              <span className="job-row__salary">
                {position.salary}
              </span>

              <span className="expandable-job-card__open">
                Explore role
                <ArrowUpRight size={14} />
              </span>
            </div>
          </motion.article>
        ))}

        {positions.length === 0 && (
          <div className="job-empty">
            <Filter size={20} />
            <p>No positions match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
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

          <ExpandablePositions positions={filtered} />
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