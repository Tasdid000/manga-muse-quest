import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MangaCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured';
}

export function MangaCardSkeleton({ variant = 'default' }: MangaCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-4 overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-card/80 to-card/40 p-4">
        <Skeleton className="h-28 w-20 flex-shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col justify-center">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <div className="mt-3 flex items-center gap-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'overflow-hidden rounded-2xl border border-border/40 bg-card',
      variant === 'featured' && 'md:flex md:h-80'
    )}>
      <Skeleton className={cn(
        'w-full',
        variant === 'featured' ? 'h-56 md:h-full md:w-52' : 'aspect-[3/4]'
      )} />
      <div className={cn(
        'p-4',
        variant === 'featured' && 'md:flex md:flex-1 md:flex-col md:justify-center md:p-6'
      )}>
        <Skeleton className="h-6 w-3/4" />
        {variant === 'featured' && (
          <Skeleton className="mt-3 h-16 w-full" />
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-4 w-1/2" />
      </div>
    </div>
  );
}
