import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Atom, ShieldCheck, Network, FlaskConical, Cpu, Sparkles,
  ArrowRight, Lock, Fingerprint, FileSearch, GitBranch, ScanSearch,
  Puzzle, HeartHandshake, Lightbulb, ShieldAlert, Building2
} from 'lucide-react';
import QuantumVisual from '../components/QuantumCore.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import QTechModalCards from '../components/QTModalCards.jsx';
import StrokeText from '../components/StrokeText.jsx';
import DepthCarousel from '../components/DepthCarousel.jsx';
import '../styles/home.css';
import quantumComputing from '../assets/quantumsafe.jpeg';
import quantumSafe from '../assets/PQC.png';
import appliedResearch from '../assets/cryptography-photo.jpeg';
import QC from "../assets/QC.jpeg"
import CursorGrid from '../components/CursorGrid.jsx';
import BlochCursor from '../components/BlochCursor.jsx';
import StackingCards from '../components/StackingCards.jsx';

const carouselItems = [
  { image: quantumComputing, alt: 'Quantum Computing' },
  { image: quantumSafe, alt: 'Quantum-Safe Security' },
  { image: appliedResearch, alt: 'Applied Research' },
  { image: QC, alt: 'Quantum research' },
];

const partners = [
  { name: 'Partner One', logo: null },     // logo: '/logos/partner-one.png'
  { name: 'Partner Two', logo: null },
  { name: 'Partner Three', logo: null },
  { name: 'Partner Four', logo: null },
  { name: 'Partner Five', logo: null },
  { name: 'Partner Six', logo: null },
];

const customers = [
  { name: 'Customer One', logo: null },
  { name: 'Customer Two', logo: null },
  { name: 'Customer Three', logo: null },
  { name: 'Customer Four', logo: null },
  { name: 'Customer Five', logo: null },
  { name: 'Customer Six', logo: null },
];

/* Infinite scrolling row: list is rendered twice so the loop is seamless */
function Marquee({ items, reverse = false, duration = 30 }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee">
      <div
        className={`marquee__track${reverse ? ' marquee__track--reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <div
            className="marquee__item"
            key={`${item.name}-${i}`}
            aria-hidden={i >= items.length ? 'true' : undefined}
          >
            {item.logo ? (
              <img src={item.logo} alt={i < items.length ? item.name : ''} loading="lazy" />
            ) : (
              <Building2 size={28} strokeWidth={1.6} />
            )}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

/* 🎯 Quantum slot — its own QuantumVisual is hidden initially,
   fades in on the loader's handoff event. */
function QuantumSlot() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onHandoff = () => {
      setTimeout(() => setVisible(true), 800);
    };
    window.addEventListener('quantum-loader-handoff', onHandoff);

    // Fallback: no loader present (deep-link or refresh on other route)
    const fallback = setTimeout(() => {
      if (!document.querySelector('.quantum-loader')) setVisible(true);
    }, 200);

    return () => {
      window.removeEventListener('quantum-loader-handoff', onHandoff);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      id="quantum-slot"
      className="hero__visual"
      style={{ position: 'relative' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', height: '100%' }}
      >
        <QuantumVisual />
      </motion.div>
    </div>
  );
}
const qtechCards = [
  { id: 'computing', icon: Cpu, title: 'Quantum Computing',
    desc: 'Uses quantum bits (qubits) which can exist in superpositions, enabling new computational paradigms.',
    details: 'Qubits can exist in superpositions and become entangled, which lets certain algorithms approach problems differently from classical bit-based machines. Today’s devices are still limited by noise and scale.' },
  { id: 'qubits', icon: Atom, title: 'Qubits & Quantum Circuits',
    desc: 'Qubits are the fundamental units of quantum information; quantum circuits sequence quantum operations.',
    details: 'A quantum circuit applies gates to qubits in sequence and then measures them. Because measurement collapses the quantum state, algorithms are designed so the correct answer becomes highly probable at the end.' },
  { id: 'applications', icon: Sparkles, title: 'Applications',
    desc: 'Areas under active research include materials science, chemistry simulation, and optimisation problems.',
    details: 'Researchers are studying quantum methods for simulating molecules and materials, and for certain optimisation and sampling problems. Practical advantage remains an open, problem-specific question.' },
  { id: 'classical', icon: GitBranch, title: 'Classical vs Quantum',
    desc: 'Quantum computers are not universally faster — for many tasks classical computers remain more efficient.',
    details: 'Quantum machines are expected to help on specific problem classes, while everyday workloads such as databases, web serving and most analytics stay better suited to classical hardware. Hybrid approaches combine both.' },
  { id: 'future', icon: Lightbulb, title: 'The Future',
    desc: 'Continued advances in error correction and hardware will shape real-world quantum usefulness.',
    details: 'Quantum error correction, which protects fragile qubits by spreading information across many physical qubits, is central to building large, reliable machines. Progress here will determine how useful quantum computers become.' },
  { id: 'related', icon: Puzzle, title: 'Related Technologies',
    desc: 'Quantum sensing, communication, and networking extend the quantum technology landscape.',
    details: 'Quantum sensing targets highly precise measurements, quantum communication includes techniques such as quantum key distribution, and quantum networking explores linking quantum devices together.' },
];
/* Orbit tiles: themed placeholders (swap `src` for real photos any time) */
const orbitTile = (label, c1, c2) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
      </linearGradient></defs>
      <rect width='400' height='400' fill='url(#g)'/>
      <g fill='none' stroke='rgba(212,175,55,0.35)' stroke-width='2'>
        <circle cx='200' cy='170' r='50'/><circle cx='200' cy='170' r='90'/><circle cx='200' cy='170' r='130'/>
      </g>
      <text x='200' y='330' text-anchor='middle' fill='#D4AF37' font-family='sans-serif'
            font-size='26' font-weight='600' letter-spacing='1'>${label}</text>
    </svg>`
  )}`;


/* Gradient backgrounds for the panels (swap for real photos any time) */
const panelBg = (c1, c2) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1200' viewBox='0 0 900 1200'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
      </linearGradient></defs>
      <rect width='900' height='1200' fill='url(#g)'/>
      <g fill='none' stroke='rgba(212,175,55,0.22)' stroke-width='2'>
        <circle cx='450' cy='520' r='120'/><circle cx='450' cy='520' r='220'/><circle cx='450' cy='520' r='320'/>
      </g>
    </svg>`
  )}`;

  const ICON_COLOR = '#D4AF37';               // icon color
  const ICON_BG = 'rgba(212,175,55,0.15)';    // badge background
  const ICON_BORDER = 'rgba(212,175,55,0.4)'; // badge border
  
  const iconBadge = (Icon) => (
    <span className="service-icon">
      <Icon size={20} strokeWidth={1.8} />
    </span>
  );
  
  const serviceItems = [
    { icon: iconBadge(ShieldCheck), label: 'Quantum-Safe Security',
      description: 'Designing and evaluating systems for a post-quantum security posture.',
      image: panelBg('#0c1630', '#1b3a8a') },
    { icon: iconBadge(Lock), label: 'Post-Quantum Cryptography',
      description: 'Exploring PQC standards including ML-KEM, ML-DSA, and SLH-DSA.',
      image: panelBg('#101a3a', '#3b2f7a') },
    { icon: iconBadge(ScanSearch), label: 'Cryptographic Inventory & CBOM',
      description: 'Structured discovery and documentation of cryptographic assets.',
      image: panelBg('#0c1630', '#14607a') },
    { icon: iconBadge(ShieldAlert), label: 'Security Assessment',
      description: 'Reviewing systems for cryptographic risk and quantum-readiness.',
      image: panelBg('#1a1a2e', '#6b4f12') },
    { icon: iconBadge(Cpu), label: 'Software Development',
      description: 'Building secure, modern software with a future-ready mindset.',
      image: panelBg('#0c1630', '#2a4fb0') },
    { icon: iconBadge(Atom), label: 'Emerging Technologies',
      description: 'Investigating quantum and adjacent technologies for practical impact.',
      image: panelBg('#12102e', '#5a2f8a') },
  ];
export default function Home() {
  return (
    <>
      {/* HERO */}
      {/* HERO */}
<section className="hero">

  <div className="hero__bg" aria-hidden="true">
  <CursorGrid
  cellSize={60}
  color="#D4AF37"
  gridColor="#D4AF37"
  highlight="area"
  gridStyle="lines"
  radius={100}        // was 140: smaller area around the cursor
  holdTime={250}      // was 400: lit cells fade sooner
  fadeDuration={600}  // was 800
  fillOpacity={0.02}  // was 0.05: softer fill inside lit cells
  maxOpacity={1.5}    // was 1: dimmer outline on lit cells
  gridOpacity={0.07}
  spotlight={0.25}    // was 0.6: less brightening of lines near the cursor
  edgeFade={0.15}
  clickPulse
/>
    <div className="hero__glow hero__glow--blue" />
    <div className="hero__glow hero__glow--gold" />
  </div>

  <div className="container hero__inner">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
             <BlochCursor />
            <span className="eyebrow">Quantum · Security · Innovation</span>
            <h1 style={{lineHeight :"25px",marginTop : "20px"}}>
              Engineering a
              <StrokeText
                className="hero__stroke"
                text="Quantum-Ready"
                strokeColor="#D4AF37"
                fillColor="#D4AF37"
                strokeWidth={1.6}
                drawDuration={1.5}
                fillDelay={2}
                stagger={0.2}
                ease="power2.out"
                trigger="loop"
                fillMode="wipe"
                fontSize={128}
                fontWeight={800}
                letterSpacing={-3}
              />
              Future
            </h1>
            <p className="hero__lead">
              Exploring quantum technologies and advancing secure, resilient digital
              infrastructure for the next generation.
            </p>
            <div className="hero__actions">
              <Link to="/services" className="btn btn--gold btn--lg">
                Explore Our Services <ArrowRight size={18} className="btn__icon" />
              </Link>
              <Link to="/about" className="btn btn--ghost btn--lg">
                Discover Our Vision
              </Link>
            </div>

            <div className="hero__stats">
              <div><strong>Focus</strong><span>Quantum Technologies</span></div>
              <div><strong>Domain</strong><span>Quantum-Safe Security</span></div>
              <div><strong>Approach</strong><span>Research-Driven</span></div>
            </div>
          </motion.div>

          <QuantumSlot />
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="section section--blue">
        <div className="container intro">
          <motion.div className="intro__content" {...fadeUp}>
            <span className="eyebrow">Who We Are</span>
            <h2>A technology company built for the quantum era</h2>
            <p>
              Q-Prakriti Private Limited is a technology-focused company exploring
              quantum computing, emerging technologies, and quantum-safe cybersecurity.
              We are building capabilities to help organisations prepare for a future
              shaped by quantum innovation.
            </p>
            <p className="intro__note">
              <em>Content note: this section is placeholder copy and will be updated with the official company description.</em>
            </p>
            <Link to="/about" className="btn btn--blue btn--md">
              Learn More About Us <ArrowRight size={16} className="btn__icon" />
            </Link>
          </motion.div>

          <motion.div className="intro__orbit" {...fadeUp}>
  <div style={{ height: '500px', position: 'relative' }}>
    <DepthCarousel
      items={carouselItems}
      cardWidth={300}
      cardHeight={380}
      tint="#060b1c"
      depth={220}
      spread={90}
      tilt={22}
      tiltDirection="right"
      perspective={1400}
      visibleCards={4}
      falloff={0.2}
      blur={6}
      autoplay
      loop
    />
  </div>
</motion.div>
        </div>
      </section>

      {/* QUANTUM TECHNOLOGY */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading
            eyebrow="Quantum Technology"
            title="Understanding the quantum landscape"
            description="Quantum computing harnesses the principles of quantum mechanics — superposition and entanglement — to process information in fundamentally different ways from classical computers. It is a rapidly developing field, and its strengths vary by problem type."
            align="center"
          />

          <QTechModalCards cards={qtechCards} />
        </div>
      </section>

      {/* QUANTUM-SAFE CYBERSECURITY */}
     

      {/* SERVICES PREVIEW */}
      <section className="section section--blue">
        <div className="container">
          <SectionHeading
            eyebrow="Capabilities"
            title="Proposed service categories"
            description="Draft categories reflecting our technology direction. Confirm with Q-Prakriti for final service offerings."
          />
          <StackingCards items={serviceItems} />
          <div className="center-cta">
            <Link to="/services" className="btn btn--ghost btn--md">
              View All Services <ArrowRight size={16} className="btn__icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow="Why Q-Prakriti" title="Principles that guide our work" align="center" />
          <div className="grid grid-3 values">
            {[
              { icon: Lightbulb, title: 'Innovation', desc: 'Curiosity-driven exploration of emerging technologies.' },
              { icon: ShieldCheck, title: 'Security', desc: 'A security-first mindset across everything we design.' },
              { icon: FlaskConical, title: 'Research-Driven', desc: 'Grounding decisions in evidence and technical rigour.' },
              { icon: HeartHandshake, title: 'Responsible Technology', desc: 'Considering societal impact alongside capability.' },
              { icon: Network, title: 'Future-Ready Solutions', desc: 'Building with longevity and adaptability in mind.' },
              { icon: Sparkles, title: 'Craft & Quality', desc: 'Attention to detail in engineering and experience.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <v.icon size={22} strokeWidth={1.8} />
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
            {/* PARTNERS & CUSTOMERS */}
                  {/* PARTNERS & CUSTOMERS */}
      <section className="section section--blue">
        <div className="container">
          <SectionHeading
            eyebrow="Our Network"
            title="Our partners and customers"
            description="Organisations we collaborate with and serve."
            align="center"
          />
        </div>

        <div className="network">
          <h3 className="network__label">Partners</h3>
          <Marquee items={partners} duration={32} />

          <h3 className="network__label">Customers</h3>
          <Marquee items={customers} reverse duration={36} />
        </div>
      </section>
      {/* FINAL CTA */}
      <section className="cta-final">
        <div className="cta-final__bg" aria-hidden="true">
          <div className="cta-final__glow" />
          <svg className="cta-final__circuit" viewBox="0 0 600 300" preserveAspectRatio="none">
            <path d="M0 150 Q150 30 300 150 T600 150" stroke="rgba(212,175,55,0.25)" strokeWidth="1" fill="none" />
            <path d="M0 200 Q150 80 300 200 T600 200" stroke="rgba(79,127,255,0.25)" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="container cta-final__inner">
          <motion.div {...fadeUp}>
            <span className="eyebrow">Get in Touch</span>
            <h2>Let's build the future of technology together.</h2>
            <p>Reach out to discuss quantum technologies, quantum-safe security, and how we can help shape what's next.</p>
            <Link to="/contact" className="btn btn--gold btn--lg">
              Contact Us <ArrowRight size={18} className="btn__icon" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}