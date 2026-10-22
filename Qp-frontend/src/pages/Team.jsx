
import { motion } from 'framer-motion';

import {
  BriefcaseBusiness,
  Mail,
  User,
} from 'lucide-react';

import {
  FaGithub,
  FaLinkedinIn,
} from 'react-icons/fa';

import SectionHeading from '../components/SectionHeading.jsx';
import '../styles/team.css';

const placeholders = Array.from({ length: 3 }).map((_, i) => ({
  id: i,
  name: 'Team Member',
  role: 'Designation Placeholder',
  bio: 'Short professional biography will appear here once official team information is provided.',

  social: {
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    email: 'mailto:contact@quantumprakriti.com',
    portfolio: 'https://quantumprakriti.com/',
  },
}));

export default function Team() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow">Our Team</span>

            <h1>The people behind Q-Prakrithi</h1>

            <p className="page-hero__lead">
              A multidisciplinary team spanning technology, security, and
              research. Official team information will be added soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading
            eyebrow="Placeholder Profiles"
            title="Team information coming soon"
            description="We do not currently display real names, photographs, or designations. These cards are placeholders awaiting official content."
            align="center"
          />

          <div className="grid grid-3">
            {placeholders.map((m, i) => (
              <motion.article
                key={m.id}
                className="team-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {/* Avatar */}
                <div className="team-card__avatar">
                  <User size={36} strokeWidth={1.5} />
                </div>

                <h3 className="team-card__name">{m.name}</h3>

                <p className="team-card__role">{m.role}</p>

                <p className="team-card__bio">{m.bio}</p>

                {/* Social Media Links */}
                <div className="team-card__socials">
                  <a
                    href={m.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    title="LinkedIn"
                  >
                    <FaLinkedinIn size={18} />
                  </a>

                  <a
                    href={m.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on GitHub`}
                    title="GitHub"
                  >
                    <FaGithub size={18} />
                  </a>

                  <a
                    href={m.social.email}
                    aria-label={`Email ${m.name}`}
                    title="Email"
                  >
                    <Mail size={18} />
                  </a>

                  
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
