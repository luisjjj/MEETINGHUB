import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarGroupVariants = cva(
  'flex items-center -space-x-2',
  {
    variants: {
      size: {
        sm: '[&>div]:h-6 [&>div]:w-6 [&>div]:text-xs',
        md: '[&>div]:h-8 [&>div]:w-8 [&>div]:text-sm',
        lg: '[&>div]:h-10 [&>div]:w-10 [&>div]:text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface AvatarGroupItem {
  src?: string;
  fallback: string;
}

interface AvatarGroupProps extends VariantProps<typeof avatarGroupVariants> {
  items: AvatarGroupItem[];
  max?: number;
  className?: string;
}

export function AvatarGroup({ items, max = 4, size, className }: AvatarGroupProps) {
  const visibleItems = items.slice(0, max);
  const remaining = items.length - max;

  return (
    <div className={cn(avatarGroupVariants({ size }), className)}>
      {visibleItems.map((item, index) => (
        <div
          key={index}
          className="relative flex items-center justify-center rounded-full bg-primary-500 text-primary-foreground font-medium ring-2 ring-background"
        >
          {item.src ? (
            <img src={item.src} alt={item.fallback} className="h-full w-full rounded-full" />
          ) : (
            <span>{item.fallback}</span>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="relative flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium ring-2 ring-background">
          <span>+{remaining}</span>
        </div>
      )}
    </div>
  );
}
