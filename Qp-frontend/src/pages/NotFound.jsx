import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="section section--dark" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', paddingTop: 160 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow">404</span>
          <h1>Page not found</h1>
          <p>The page you are looking for doesn't exist or has moved.</p>
          <Link to="/" className="btn btn--gold btn--md"><Home size={16} /> Back to Home</Link>
        </motion.div>
      </div>
    </section>
  );
}