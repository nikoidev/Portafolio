'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  /** Delay before the first child starts (seconds) */
  delay?: number;
  /** Time between each child animation (seconds) */
  staggerChildren?: number;
}

const containerVariants = (delay: number, stagger: number) => ({
  hidden: {},
  show: {
    transition: {
      delayChildren: delay,
      staggerChildren: stagger,
    },
  },
});

/**
 * Wraps children in a motion.div that staggers their entrance animations.
 * Direct children should use <RevealItem> (or any motion element with hidden/show variants).
 */
export function StaggerGroup({
  children,
  className,
  delay = 0,
  staggerChildren = 0.08,
}: StaggerGroupProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants(delay, staggerChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}
