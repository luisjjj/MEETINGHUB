import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'in_progress' | 'pending';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4 pb-8">
          {index < items.length - 1 && (
            <div className="absolute left-4 top-8 h-full w-px bg-border" />
          )}
          <div
            className={cn(
              'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background',
              {
                'border-success bg-success/10': item.status === 'completed',
                'border-info bg-info/10': item.status === 'in_progress',
                'border-muted-foreground/30': item.status === 'pending' || !item.status,
              }
            )}
          >
            {item.icon || (
              <div
                className={cn('h-2 w-2 rounded-full', {
                  'bg-success': item.status === 'completed',
                  'bg-info': item.status === 'in_progress',
                  'bg-muted-foreground/50': item.status === 'pending' || !item.status,
                })}
              />
            )}
          </div>
          <div className="flex-1 pt-1">
            <p className="font-medium">{item.title}</p>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
