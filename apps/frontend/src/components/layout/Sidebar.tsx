import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  UserCheck,
  Video,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Create Meeting', href: '/meetings/create', icon: PlusCircle },
  { name: 'Participants', href: '/participants', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: UserCheck },
  { name: 'Recordings', href: '/recordings', icon: Video },
  { name: 'AI Workspace', href: '/ai-workspace', icon: Sparkles },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <span className="text-lg font-semibold">MeetingHub</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-primary-500')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@company.com</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
