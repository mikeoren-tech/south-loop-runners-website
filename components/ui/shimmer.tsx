
import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({
  className,
  children,
  shimmerColor = 'rgba(255,255,255,0.1)',
  shimmerSize = '100%',
  shimmerDuration = '2.5s',
  ...props
}) => {
  const shimmerStyle: React.CSSProperties = {
    '--shimmer-color': shimmerColor,
    '--shimmer-size': shimmerSize,
    '--shimmer-duration': shimmerDuration,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'after:absolute after:top-0 after:left-[-100%] after:h-full after:w-[200%]',
        'after:bg-gradient-to-r after:from-transparent after:via-[var(--shimmer-color)] after:to-transparent',
        'after:animate-shimmer after:content-[""]',
        className
      )}
      style={shimmerStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default Shimmer;
