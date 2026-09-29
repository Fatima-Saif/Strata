'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] p-6 lg:p-8"
    >
      {children}
    </motion.div>
  );
}
