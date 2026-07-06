import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const statusVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        error: 'bg-destructive/10 text-destructive border border-destructive/20',
        info: 'bg-info/10 text-info border border-info/20',
        default: 'bg-muted text-muted-foreground border border-border',
        scheduled: 'bg-primary-50/10 text-primary-500 border border-primary-200',
        in_progress: 'bg-info/10 text-info border border-info/20',
        completed: 'bg-success/10 text-success border border-success/20',
        cancelled: 'bg-destructive/10 text-destructive border border-destructive/20',
        pending: 'bg-warning/10 text-warning border border-warning/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  variant,
  size,
  dot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <div className={cn(statusVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', {
            'bg-success': variant === 'success' || variant === 'completed',
            'bg-warning': variant === 'warning' || variant === 'pending',
            'bg-destructive': variant === 'error' || variant === 'cancelled',
            'bg-info': variant === 'info' || variant === 'in_progress',
            'bg-muted-foreground': variant === 'default',
            'bg-primary-500': variant === 'scheduled',
          })}
        />
      )}
      {children}
    </div>
  );
}
