import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import '../styles/team.css';

/* ------------------------------------------------------------------
   TEAM PAGE: temporarily showing "Coming Soon".
   The original page is kept below (commented out) so it can be
   restored once official team information is available.
------------------------------------------------------------------- */

/*
import { BriefcaseBusiness, Mail, User } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';

const placeholders = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  name: 'Team Member',
  role: 'Designation Placeholder',
  bio: 'Short professional biography will appear here once official team information is provided.',
}));
*/

export default function Team() {
  return (
    <>
      {/* ORIGINAL TEAM PAGE (commented out)

      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="eyebrow">Our Team</span>
            <h1>The people behind Q-Prakrithi</h1>
            <p className="page-hero__lead">
              A multidisciplinary team spanning technology, security, and research.
              Official team information will be added soon.
            </p>
          </motion.div>
        </div>
      </section>

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
                <div className="team-card__avatar">
                  <User size={36} strokeWidth={1.5} />
                </div>
                <h3 className="team-card__name">{m.name}</h3>
                <p className="team-card__role">{m.role}</p>
                <p className="team-card__bio">{m.bio}</p>
                <div className="team-card__socials">
                  <span aria-hidden="true"><BriefcaseBusiness size={14} /></span>
                  <span aria-hidden="true"><Mail size={14} /></span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      */}

      {/* COMING SOON */}
      <section className="section section--dark team-soon">
        <div className="container">
          <motion.div
            className="team-soon__inner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="team-soon__icon" aria-hidden="true">
              <Users size={38} strokeWidth={1.5} />
            </div>
            <span className="eyebrow">Our Team</span>
            <h1 className="team-soon__title">Coming Soon</h1>
            <p className="team-soon__text">
              We are putting together our team page. Meet the people behind
              Q-Prakrithi very soon.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}