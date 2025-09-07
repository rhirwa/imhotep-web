'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

interface NavItem {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  disabled?: boolean;
}

const items: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Demand Forecast',
    href: '/dashboard/demand-forecast',
    icon: 'calendar',
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: 'file',
    disabled: true,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: 'file',
    disabled: true,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  
  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => {
        const Icon = Icons[item.icon] || Icons['file'];
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.disabled ? '#' : item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
              item.disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-disabled={item.disabled}
            tabIndex={item.disabled ? -1 : undefined}
          >
            <Icon className="mr-3 h-4 w-4" />
            <span>{item.title}</span>
            {item.disabled && (
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
