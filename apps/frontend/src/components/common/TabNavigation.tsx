import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const tabsVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-background text-muted-foreground hover:text-foreground',
        underline: 'border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border',
        pills: 'rounded-full',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps extends VariantProps<typeof tabsVariants> {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  variant,
  size,
  className,
}: TabNavigationProps) {
  return (
    <div className={cn('flex', variant === 'underline' && 'border-b', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            tabsVariants({ variant, size }),
            activeTab === tab.id && variant === 'underline' && 'border-primary-500 text-foreground',
            activeTab === tab.id && variant === 'pills' && 'bg-primary-500 text-primary-foreground',
            tab.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
