import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';
import animeSpinnerData from '@/assets/animations/animeSpinner.json';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 48,
  md: 84,
  lg: 108,
};

export const LoadingSpinner = ({ size = 'md', fullScreen = false, className }: LoadingSpinnerProps) => {
  const dimension = sizeMap[size] ?? sizeMap.md;

  const spinner = (
    <div className="relative">
      <Lottie
        animationData={animeSpinnerData}
        loop
        autoPlay
        style={{ width: dimension, height: dimension }}
      />
      <div className="absolute inset-0 rounded-full pointer-events-none shadow-[0_0_40px_rgba(236,72,153,0.5)]" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
        <p className="mt-4 text-muted-foreground text-sm">Loading anime...</p>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      {spinner}
    </div>
  );
};
