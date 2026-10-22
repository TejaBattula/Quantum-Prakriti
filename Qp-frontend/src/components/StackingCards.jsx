import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './StackingCards.css';

/**
 * items: [{ icon, label, description, image, to? }]
 * Same shape as your serviceItems; `to` (optional) adds a "Learn more" link.
 */
export default function StackingCards({ items, stackGap = 22 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="stack" ref={ref}>
      {items.map((item, i) => (
        <StackCard
          key={item.label}
          item={item}
          index={i}
          stackGap={stackGap}
          progress={scrollYProgress}
          range={[i / items.length, 1]}
          targetScale={1 - (items.length - 1 - i) * 0.05}
        />
      ))}
    </div>
  );
}

function StackCard({ item, index, stackGap, progress, range, targetScale }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // Card shrinks slightly as the next card stacks on top of it
  const scale = useTransform(progress, range, reduce ? [1, 1] : [1, targetScale]);

  // Image eases in as the card arrives
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.5, 1]);

  return (
    <div className="stack__item" ref={ref}>
      <motion.article
        className="stack__card"
        style={{ scale, top: `calc(-4vh + ${index * stackGap}px)` }}
      >
        <div className="stack__body">
          {item.icon}
          <h3 className="stack__title">{item.label}</h3>
          <p className="stack__desc">{item.description}</p>
          {item.to && (
            <Link to={item.to} className="stack__link">
              Learn more <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="stack__media" aria-hidden="true">
          <motion.div
            className="stack__img"
            style={{ scale: imageScale, backgroundImage: `url("${item.image}")` }}
          />
        </div>
      </motion.article>
    </div>
  );
}
