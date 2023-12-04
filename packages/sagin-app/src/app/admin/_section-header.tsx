'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

import { type NavItem } from './_common.ts';

type Props = {
  navItems: NavItem[];
};

export default function AdminSectionHeader({ navItems }: Props) {
  const pathname = usePathname();
  const activeNavItem = navItems.find(item => item.path === pathname);

  return (
    <div className='mb-8'>
      <h3 className='text-lg font-medium'>{activeNavItem?.title || 'No title'}</h3>
      {activeNavItem?.description && (
        <p className='text-sm text-muted-foreground'>{activeNavItem.description}</p>
      )}
    </div>
  );
}
