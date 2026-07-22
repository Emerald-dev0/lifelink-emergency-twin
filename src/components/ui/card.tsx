'use client';

import { type HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glow = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -2 } : undefined}
        className={cn(
          'rounded-2xl border border-card-border bg-card-bg backdrop-blur-sm p-6',
          'transition-all duration-300',
          hover && 'hover:border-border-subtle hover:bg-card-hover',
          glow && 'animate-twin-pulse',
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

export { Card };
export type { CardProps };
