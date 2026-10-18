import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Languages, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';
import qprakritimark from './q-prakriti-mark.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact Us' },
];

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const getSavedLang = () => {
  try {
    return localStorage.getItem('qp-lang') || 'en';
  } catch {
    return 'en';
  }
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(getSavedLang);
  const langRef = useRef(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Close the language dropdown on outside click / Escape
  useEffect(() => {
    if (!langOpen) return;

    const onPointerDown = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setLangOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  // Remember choice + set <html lang>
  const chooseLang = (code) => {
    setLang(code);
    setLangOpen(false);
    document.documentElement.lang = code;
    try {
      localStorage.setItem('qp-lang', code);
    } catch {
      /* ignore */
    }
    // TODO: hook up real translation here (react-i18next / Google Translate)
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Q-Prakriti home">
          <span className="nav__mark">
            <img src={qprakritimark} alt="logo" />
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
          {/* Language dropdown */}
          <div className="nav__lang" ref={langRef}>
            <button
              type="button"
              className="nav__lang-btn"
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Change language"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <Languages size={16} />
              <ChevronDown
                size={13}
                className={`nav__lang-chevron ${langOpen ? 'is-open' : ''}`}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  className="nav__lang-menu"
                  role="listbox"
                  aria-label="Language"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                >
                  {languages.map((l) => (
                    <li key={l.code} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={lang === l.code}
                        className={`nav__lang-option ${lang === l.code ? 'is-active' : ''}`}
                        onClick={() => chooseLang(l.code)}
                      >
                        <span className="nav__lang-native">{l.native}</span>
                        <span className="nav__lang-label">{l.label}</span>
                        {lang === l.code && <Check size={14} />}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

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

          <Link to="/contact" className="nav__consult">
            Book a Demo
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
                {/* Mobile language */}
                <div className="nav__mobile-theme">
                  <span className="nav__mobile-theme-label">Language</span>
                  <select
                    className="nav__mobile-lang"
                    value={lang}
                    onChange={(e) => chooseLang(e.target.value)}
                    aria-label="Change language"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.native} ({l.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile theme toggle */}
                <div className="nav__mobile-theme">
                  <span className="nav__mobile-theme-label">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>

                  <button
                    className="nav__theme-toggle"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    aria-pressed={theme === 'light'}
                    data-active={theme}
                  >
                    <div className="nav__theme-toggle__track">
                      <span className="nav__theme-toggle__icon" aria-hidden="true">🌙</span>
                      <span className="nav__theme-toggle__icon" aria-hidden="true">☀️</span>
                    </div>
                    <span className="nav__theme-toggle__knob" />
                  </button>
                </div>

                <Link to="/contact" className="nav__consult nav__consult--block">
                  Book ↗
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}