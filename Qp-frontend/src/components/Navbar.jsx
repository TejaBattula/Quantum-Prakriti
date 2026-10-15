import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Languages } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';
import qprakritimark from  "./q-prakriti-mark.png"
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Q-Prakriti home">
          <span className="nav__mark">
            <img src={qprakritimark} alt="logo"/>
          </span>
          <span className="nav__word">Q-Prakriti</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <button className="nav__icon-btn" aria-label="Language">
            <Languages size={16} />
          </button>
          <button className="nav__icon-btn" aria-label="Region">
            <Globe size={16} />
          </button>

          {/* Theme toggle pill */}
          <button
            className="nav__theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            data-active={theme}
          >
            <div className="nav__theme-toggle__track">
              <span className="nav__theme-toggle__icon" aria-hidden>🌙</span>
              <span className="nav__theme-toggle__icon" aria-hidden>☀️</span>
            </div>
            <span className="nav__theme-toggle__knob" />
          </button>

          <Link to="/contact" className="nav__portal">Client Portal</Link>
          <Link to="/contact" className="nav__consult">
            Consultation
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
        </div>

        <button
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container nav__mobile-inner">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `nav__mobile-link ${isActive ? 'is-active' : ''}`}
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="nav__mobile-actions">
                <Link to="/contact" className="nav__portal nav__portal--block">Client Portal</Link>
                <Link to="/contact" className="nav__consult nav__consult--block">Consultation ↗</Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}