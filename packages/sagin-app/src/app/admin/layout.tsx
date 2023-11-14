import * as React from 'react';

import { Separator } from '~/components/ui/separator.tsx';

import { type NavItem } from './_common.ts';
import SectionHeader from './_section-header.tsx';
import SidebarNav from './_sidebar-nav.tsx';

type Props = {
  children: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: 'Sources',
    path: '/admin/sources',
  },
  {
    title: 'Users',
    path: '/admin/users',
  },
  {
    title: 'Indexers',
    path: '/admin/indexers',
  },
];

export default function AdminLayout({ children }: Props) {
  return (
    <div className='m-5'>
      <h2 className='text-xl'>Admin Panel</h2>
      <Separator className='my-6' />
      <div className='flex flex-col space-y-4 lg:flex-row lg:space-x-8 lg:space-y-0'>
        <aside className='lg:w-1/5'>
          <SidebarNav navItems={navItems} />
        </aside>
        <div className='flex-1 lg:max-w-2xl'>
          <div className='space-y-6'>
            <SectionHeader navItems={navItems} />
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
