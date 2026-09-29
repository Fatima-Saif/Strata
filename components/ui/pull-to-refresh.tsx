'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  pullThreshold?: number;
  maxPull?: number;
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  pullThreshold = 80,
  maxPull = 120,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // y position of the content
  const y = useMotionValue(0);
  
  // Transform y to rotation and opacity for the indicator
  const indicatorOpacity = useTransform(y, [0, pullThreshold], [0, 1]);
  const indicatorRotation = useTransform(y, [0, pullThreshold], [0, 180]);
  
  const handleDragEnd = async () => {
    const currentY = y.get();
    
    if (currentY >= pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      // Snap to threshold while refreshing
      animate(y, pullThreshold, { type: 'spring', stiffness: 300, damping: 30 });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        // Animate back to 0
        animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
      }
    } else {
      // Snap back to 0 if threshold not met
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  // Only allow dragging if we are at the top of the scroll container
  const [isAtTop, setIsAtTop] = React.useState(true);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsAtTop(e.currentTarget.scrollTop <= 0);
  };

  return (
    <div 
      className={cn("relative overflow-hidden w-full h-full", className)}
      onScroll={handleScroll}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center -z-10"
        style={{
          y: useTransform(y, (val) => val / 2), // Parallax effect
          opacity: indicatorOpacity,
        }}
      >
        <div className="mt-4 bg-background shadow-sm border border-border rounded-full p-2 flex items-center justify-center">
          <motion.div
            style={{ rotate: indicatorRotation }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : undefined}
          >
            <RefreshCcw className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        ref={containerRef}
        className="w-full h-full overflow-y-auto overscroll-y-none touch-pan-x"
        style={{ y }}
        drag={isAtTop ? "y" : false}
        dragConstraints={{ top: 0, bottom: maxPull }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
