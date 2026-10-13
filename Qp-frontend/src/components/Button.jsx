import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'gold',
  size = 'md',
  icon: Icon,
  type = 'button',
  disabled = false,
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size}`;
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {Icon && <Icon size={18} strokeWidth={2} className="btn__icon" />}
    </>
  );

  const props = { className: classes, onClick, disabled, ...rest };

  if (to) return <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}><Link to={to} {...props}>{content}</Link></motion.span>;
  if (href) return <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href={href} {...props}>{content}</motion.a>;
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type={type} {...props}>
      {content}
    </motion.button>
  );
}