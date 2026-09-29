import { Variants, Transition } from 'framer-motion';

// Standardized transition timings for a snappy, premium feel
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const snappyTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 1,
};

export const easeOutTransition: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
};

// Variants

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: easeOutTransition },
  exit: { opacity: 0, transition: easeOutTransition },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: springTransition },
  exit: { opacity: 0, y: 15, transition: easeOutTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: springTransition },
  exit: { opacity: 0, scale: 0.95, transition: easeOutTransition },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: springTransition },
  exit: { opacity: 0, x: 20, transition: easeOutTransition },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: springTransition },
  exit: { opacity: 0, x: -20, transition: easeOutTransition },
};
