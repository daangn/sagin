'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

import { type NavItem } from './_common';

type Props = {
  navItems: NavItem[];
};

export default function AdminSectionHeader({ navItems }: Props) {
  const pathname = usePathname();
  const activeNavItem = navItems.find(item => item.path === pathname);

  return <h3 className='text-lg font-medium'>{activeNavItem?.title || 'No title'}</h3>;
}
