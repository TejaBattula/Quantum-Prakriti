import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Atom, ShieldCheck, Network, FlaskConical, Cpu, Sparkles,
  ArrowRight, Lock, Fingerprint, FileSearch, GitBranch, ScanSearch,
  Puzzle, HeartHandshake, Lightbulb, ShieldAlert
} from 'lucide-react';
import QuantumVisual from '../components/QuantumVisual.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import '../styles/home.css'
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid-lines" />
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
            <span className="eyebrow">Quantum · Security · Innovation</span>
            <h1>
              Engineering a <span className="text-gradient-gold">Quantum-Ready</span> Future
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

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuantumVisual/>
          </motion.div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="section section--blue">
        <div className="container intro">
          <motion.div className="intro__content" {...fadeUp}>
            <span className="eyebrow">Who We Are</span>
            <h2>A technology company built for the quantum era</h2>
            <p>
              Q-Prakrithi Private Limited is a technology-focused company exploring
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

          <motion.div className="intro__pillars" {...fadeUp}>
            {[
              { icon: Atom, label: 'Quantum Computing' },
              { icon: ShieldCheck, label: 'Quantum-Safe Security' },
              { icon: FlaskConical, label: 'Applied Research' },
              { icon: Network, label: 'Resilient Infrastructure' },
            ].map(({ icon: Icon, label }) => (
              <div className="intro__pillar" key={label}>
                <Icon size={20} strokeWidth={1.8} />
                <span>{label}</span>
              </div>
            ))}
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

          <div className="grid grid-3 qtech__grid">
            {[
              {
                icon: Cpu,
                title: 'Quantum Computing',
                desc: 'Uses quantum bits (qubits) which can exist in superpositions, enabling new computational paradigms.'
              },
              {
                icon: Atom,
                title: 'Qubits & Quantum Circuits',
                desc: 'Qubits are the fundamental units of quantum information; quantum circuits sequence quantum operations.'
              },
              {
                icon: Sparkles,
                title: 'Applications',
                desc: 'Areas under active research include materials science, chemistry simulation, and optimisation problems.'
              },
              {
                icon: GitBranch,
                title: 'Classical vs Quantum',
                desc: 'Quantum computers are not universally faster — for many tasks classical computers remain more efficient.'
              },
              {
                icon: Lightbulb,
                title: 'The Future',
                desc: 'Continued advances in error correction and hardware will shape real-world quantum usefulness.'
              },
              {
                icon: Puzzle,
                title: 'Related Technologies',
                desc: 'Quantum sensing, communication, and networking extend the quantum technology landscape.'
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="qtech__card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="qtech__icon"><item.icon size={22} strokeWidth={1.8} /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUANTUM-SAFE CYBERSECURITY */}
      <section className="section qs">
        <div className="container">
          <SectionHeading
            eyebrow="Quantum-Safe Cybersecurity"
            title="Preparing cryptography for a post-quantum world"
            description="Quantum computing and post-quantum cryptography are related but distinct fields. Post-quantum cryptography refers to cryptographic algorithms designed to remain secure against attacks from both classical and future quantum computers."
          />

          <div className="qs__layout">
            <motion.div className="qs__flow" {...fadeUp}>
              {[
                { icon: FileSearch, label: 'Cryptographic Discovery', desc: 'Identify where cryptography is used across systems.' },
                { icon: ShieldAlert, label: 'Quantum Threat Assessment', desc: 'Evaluate exposure to future quantum attacks.' },
                { icon: Lock, label: 'Post-Quantum Cryptography', desc: 'Adopt PQC algorithms such as ML-KEM, ML-DSA, and SLH-DSA.' },
                { icon: ShieldCheck, label: 'Quantum-Safe Migration', desc: 'Transition systems to quantum-resistant cryptography.' },
              ].map((s, i, arr) => (
                <div className="qs__step" key={s.label}>
                  <div className="qs__step-marker">
                    <s.icon size={18} strokeWidth={1.9} />
                  </div>
                  <div className="qs__step-body">
                    <h4>{s.label}</h4>
                    <p>{s.desc}</p>
                  </div>
                  {i < arr.length - 1 && <span className="qs__step-line" aria-hidden="true" />}
                </div>
              ))}
            </motion.div>

            <motion.aside className="qs__side" {...fadeUp}>
              <h3>Concepts we focus on</h3>
              <ul className="qs__list">
                <li><Fingerprint size={16} /> Post-Quantum Cryptography (PQC)</li>
                <li><Lock size={16} /> ML-KEM — shared-secret establishment</li>
                <li><Fingerprint size={16} /> ML-DSA — digital signatures</li>
                <li><Fingerprint size={16} /> SLH-DSA — hash-based digital signatures</li>
                <li><ScanSearch size={16} /> Cryptographic Bill of Materials (CBOM)</li>
                <li><ShieldCheck size={16} /> Quantum-Safe Migration</li>
                <li><ShieldAlert size={16} /> Cryptographic Risk Assessment</li>
              </ul>
              <p className="qs__note">
                <em>These are technology focus areas. Service availability should be confirmed with Q-Prakrithi directly.</em>
              </p>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section section--blue">
        <div className="container">
          <SectionHeading
            eyebrow="Capabilities"
            title="Proposed service categories"
            description="Draft categories reflecting our technology direction. Confirm with Q-Prakrithi for final service offerings."
          />
          <div className="grid grid-3">
            {[
              { icon: ShieldCheck, title: 'Quantum-Safe Security', description: 'Designing and evaluating systems for a post-quantum security posture.' },
              { icon: Lock, title: 'Post-Quantum Cryptography', description: 'Exploring PQC standards including ML-KEM, ML-DSA, and SLH-DSA.' },
              { icon: ScanSearch, title: 'Cryptographic Inventory & CBOM', description: 'Structured discovery and documentation of cryptographic assets.' },
              { icon: ShieldAlert, title: 'Security Assessment', description: 'Reviewing systems for cryptographic risk and quantum-readiness.' },
              { icon: Cpu, title: 'Software Development', description: 'Building secure, modern software with a future-ready mindset.' },
              { icon: Atom, title: 'Emerging Technologies', description: 'Investigating quantum and adjacent technologies for practical impact.' },
            ].map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
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
          <SectionHeading eyebrow="Why Q-Prakrithi" title="Principles that guide our work" align="center" />
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