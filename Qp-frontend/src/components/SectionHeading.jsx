import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      className={`section-title ${align === 'center' ? 'is-center' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  );
}