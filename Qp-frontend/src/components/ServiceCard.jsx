import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ServiceCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.article
      className="svc-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="svc-card__icon">
        {Icon && <Icon size={22} strokeWidth={1.8} />}
      </div>
      <h3 className="svc-card__title">{title}</h3>
      <p className="svc-card__desc">{description}</p>
      <span className="svc-card__arrow"><ArrowUpRight size={16} /></span>
    </motion.article>
  );
}