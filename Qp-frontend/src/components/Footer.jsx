import { Link } from 'react-router-dom';
import { Atom, Mail, MapPin, BriefcaseBusiness, X, Code2, ArrowUpRight } from 'lucide-react';
import './Footer.css';

const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact Us' },
];

const focusAreas = [
  'Quantum Computing',
  'Post-Quantum Cryptography',
  'Quantum-Safe Migration',
  'Cryptographic Inventory & CBOM',
  'Emerging Technologies',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand-col">
            <Link to="/" className="footer__brand">
              <span className="footer__mark"><Atom size={20} /></span>
              Q·Prakrithi
            </Link>
            <p className="footer__tag">
              Engineering a quantum-ready future through advanced quantum technologies
              and quantum-safe digital infrastructure.
            </p>
          </div>

          <div>
            <h4 className="footer__heading">Navigate</h4>
            <ul className="footer__list">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Focus Areas</h4>
            <ul className="footer__list">
              {focusAreas.map((f) => (<li key={f}>{f}</li>))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__list footer__list--contact">
              <li><Mail size={14} /> <span>contact@q-prakrithi.example</span></li>
              <li><MapPin size={14} /> <span>Office Address — Placeholder</span></li>
            </ul>
            <div className="footer__socials">
              <a href="#" aria-label="LinkedIn"><BriefcaseBusiness size={16} /></a>
              <a href="#" aria-label="X"><X size={16} /></a>
              <a href="#" aria-label="GitHub">
                <Code2 size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__base">
          <span>© {new Date().getFullYear()} Q-Prakrithi Private Limited. All rights reserved.</span>
          <Link to="/contact" className="footer__cta">
            Start a conversation <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}