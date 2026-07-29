'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionWrapper({ children, className, delay = 0 }: SectionWrapperProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      // With reduced motion we still fade in (no positional travel), so the
      // section reads as intentional rather than popping in unstyled.
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduce ? 0.3 : 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
