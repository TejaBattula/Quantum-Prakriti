import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users, Rocket, Sparkles, Briefcase, Mail } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import '../styles/careers.css';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

export default function Careers() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <motion.div {...fade}>
            <span className="eyebrow">Careers</span>
            <h1>Grow with a team building for the quantum era</h1>
            <p className="page-hero__lead">
              We are interested in people who are curious about quantum technologies,
              security, and the future of digital infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section section--blue">
        <div className="container">
          <SectionHeading eyebrow="Culture" title="How we work" />
          <div className="grid grid-3">
            {[
              { icon: Sparkles, title: 'Curiosity First', desc: 'We value people who explore, question, and learn.' },
              { icon: Users, title: 'Collaborative', desc: 'We work across disciplines and share knowledge.' },
              { icon: GraduationCap, title: 'Learning Culture', desc: 'Continuous learning is part of how we operate.' },
              { icon: Rocket, title: 'Impact-Oriented', desc: 'We aim to work on things that matter.' },
            ].map((c, i) => (
              <motion.div key={c.title} className="culture-card" {...fade} transition={{ ...fade.transition, delay: i * 0.05 }}>
                <c.icon size={22} strokeWidth={1.8} />
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHeading
            eyebrow="Learning & Growth"
            title="Opportunities to develop"
            description="We aim to create space for continuous learning across quantum technologies, security, and software engineering."
          />
          <div className="grid grid-2">
            <motion.div className="growth-card" {...fade}>
              <GraduationCap size={22} />
              <h3>Internships</h3>
              <p>Internship opportunities may be available from time to time. Reach out to express interest in future openings.</p>
            </motion.div>
            <motion.div className="growth-card" {...fade}>
              <Rocket size={22} />
              <h3>Early-Career Growth</h3>
              <p>We want to support people early in their careers who are excited about emerging technologies.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section--blue">
        <div className="container">
          <SectionHeading
            eyebrow="Openings"
            title="Current opportunities"
            description="We do not currently list confirmed openings on this page. If you are interested in future roles, please reach out."
            align="center"
          />

          <motion.div className="careers-empty" {...fade}>
            <Briefcase size={32} strokeWidth={1.5} />
            <h3>No confirmed openings at this time</h3>
            <p>
              We welcome expressions of interest from candidates interested in quantum
              technologies, quantum-safe security, and software engineering. Please
              contact us to share your interest.
            </p>
            <div className="cta-row">
              <Link to="/contact" className="btn btn--gold btn--md">
                Contact Us <ArrowRight size={16} />
              </Link>
              <a href="mailto:careers@q-prakrithi.example" className="btn btn--ghost btn--md">
                <Mail size={16} /> careers@q-prakrithi.example
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow="Apply" title="Share your interest" align="center" />
          <motion.form
            className="apply-form"
            {...fade}
            onSubmit={(e) => {
              e.preventDefault();
              alert('This form is a UI demonstration. To actually apply, please email careers@q-prakrithi.example.');
            }}
          >
            <div className="form-row">
              <label>Full Name<input type="text" required placeholder="Your name" /></label>
              <label>Email<input type="email" required placeholder="you@example.com" /></label>
            </div>
            <label>Role of Interest<input type="text" placeholder="e.g. Quantum Engineering, Security, Software" /></label>
            <label>Cover Letter<textarea rows="5" placeholder="Tell us briefly about your interest" /></label>
            <button type="submit" className="btn btn--gold btn--md">Submit Interest <ArrowRight size={16} /></button>
            <p className="form-note">
              <em>UI demonstration only. Applications are currently received via email.</em>
            </p>
          </motion.form>
        </div>
      </section>
    </>
  );
}