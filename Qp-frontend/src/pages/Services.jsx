import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Atom, Lock, ShieldCheck, ScanSearch, ShieldAlert, Cpu,
  ArrowRight
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import '../styles/services.css';

const services = [
  {
    icon: Atom,
    title: 'Quantum Computing & Emerging Technologies',
    description: 'Exploration of quantum computing and adjacent emerging technologies, including their practical implications and long-term direction.',
    bullets: ['Quantum computing concepts', 'Emerging technology research', 'Technology landscape analysis']
  },
  {
    icon: Lock,
    title: 'Post-Quantum Cryptography',
    description: 'Focus on post-quantum cryptographic algorithms including ML-KEM, ML-DSA, and SLH-DSA, and what they mean for modern systems.',
    bullets: ['PQC algorithm familiarity', 'ML-KEM / ML-DSA / SLH-DSA', 'Standards tracking']
  },
  {
    icon: ShieldCheck,
    title: 'Quantum-Safe Migration',
    description: 'Planning and evaluating pathways for migrating cryptographic systems towards quantum-resistant algorithms.',
    bullets: ['Migration planning', 'Risk-aware sequencing', 'Readiness assessment']
  },
  {
    icon: ScanSearch,
    title: 'Cryptographic Inventory & CBOM',
    description: 'Structured discovery of cryptographic assets and development of a Cryptographic Bill of Materials (CBOM).',
    bullets: ['Cryptographic discovery', 'CBOM development', 'Asset documentation']
  },
  {
    icon: ShieldAlert,
    title: 'Security Assessment',
    description: 'Reviewing systems for cryptographic risk, quantum-readiness, and security posture.',
    bullets: ['Cryptographic risk assessment', 'Quantum-readiness review', 'Findings & recommendations']
  },
  {
    icon: Cpu,
    title: 'Software Engineering',
    description: 'Building secure, modern software with a future-ready mindset and attention to maintainability.',
    bullets: ['Web applications', 'Secure by design', 'Modern toolchain']
  },
];

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="eyebrow">Services</span>
            <h1>Capabilities across quantum & security</h1>
            <p className="page-hero__lead">
              Draft service categories reflecting our technology direction. Confirmations
              with Q-Prakrithi are required before treating these as final offerings.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHeading
            eyebrow="Overview"
            title="Where we focus"
            description="Each area below is presented as a proposed focus. Descriptions are draft content and require company confirmation."
          />
          <div className="grid grid-3">
            {services.map((s, i) => <ServiceCard key={s.title} {...s} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section section--blue">
        <div className="container">
          <div className="grid grid-2 svc-detail">
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                className="svc-detail__item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="svc-detail__icon"><s.icon size={22} strokeWidth={1.8} /></div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ul className="svc-detail__list">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <Link to="/contact" className="svc-detail__cta">
                  Discuss this area <ArrowRight size={14} />
                </Link>
              </motion.article>
            ))}
          </div>
          <p className="services-note">
            <em>All service descriptions are draft content pending official confirmation from Q-Prakrithi Private Limited.</em>
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container center-cta">
          <h2>Have a specific requirement?</h2>
          <p>Reach out and we'll explore the right approach together.</p>
          <Link to="/contact" className="btn btn--gold btn--md">
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}