'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className, prefix = '', suffix = '', duration = 1.5 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const rounded = useTransform(springValue, (latest) => {
    // Format to 1 decimal place if it's a small number, else integer
    if (value < 10 && !Number.isInteger(value)) {
      return latest.toFixed(1);
    }
    return Math.floor(latest).toLocaleString();
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  return (
    <span ref={ref} className={cn("inline-flex items-center", className)}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
