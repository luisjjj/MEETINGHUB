import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  className?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ className, fullScreen = true }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'fixed inset-0 z-50 bg-background',
        !fullScreen && 'py-8',
        className
      )}
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">MeetingHub</h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
