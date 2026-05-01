'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type RevealVariant = 'fade' | 'fade-up' | 'fade-down' | 'scale' | 'slide-left' | 'slide-right';

const variantMap: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  'fade-up': {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -24 },
    show: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0 },
  },
};

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Wraps children in a motion.div that fades/slides in when it enters the viewport.
 * Use as a standalone wrapper OR as a child of <StaggerGroup> — in both cases
 * it exposes hidden/show variants so stagger works automatically.
 */
export function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.5,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A single Reveal item meant to be a direct child of <StaggerGroup>.
 * Does not set its own whileInView — inherits from the parent StaggerGroup.
 */
export function RevealItem({
  children,
  variant = 'fade-up',
  className,
}: Omit<RevealProps, 'delay' | 'duration'>) {
  return (
    <motion.div
      className={className}
      variants={variantMap[variant]}
    >
      {children}
    </motion.div>
  );
}
