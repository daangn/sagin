'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { buttonVariants } from '~/components/ui/button.tsx';
import { cn } from '~/lib/utils.ts';

import { type NavItem } from './_common.ts';

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  navItems: NavItem[];
};

export default function SidebarNav({ className, navItems, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      {navItems.map(item => (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.path ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
