import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import '../styles/qtech-modal.css';

export default function QTechModalCards({ cards }) {
  const [activeId, setActiveId] = useState(null);
  const active = cards.find((c) => c.id === activeId);
  const close = () => setActiveId(null);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [activeId]);

  return (
    <>
      <div className="grid grid-3 qtech__grid">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="qmodal__item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <motion.button
              type="button"
              layoutId={`qcard-${card.id}`}
              className="qtech__card qmodal__card"
              onClick={() => setActiveId(card.id)}
              aria-haspopup="dialog"
            >
              <div className="qtech__icon"><card.icon size={22} strokeWidth={1.8} /></div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <span className="qmodal__hint">Learn more <ArrowUpRight size={14} /></span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              className="qmodal__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            >
              <motion.div
                layoutId={`qcard-${active.id}`}
                className="qmodal__panel"
                role="dialog"
                aria-modal="true"
                aria-label={active.title}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="qmodal__close" onClick={close} aria-label="Close">
                  <X size={20} />
                </button>
                <div className="qtech__icon qmodal__icon">
                  <active.icon size={26} strokeWidth={1.8} />
                </div>
                <h3>{active.title}</h3>
                <p className="qmodal__lead">{active.desc}</p>
                <p className="qmodal__body">{active.details}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}