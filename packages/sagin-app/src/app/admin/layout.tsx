import { Role } from '@sagin/core/models';
import { type NextLayoutProps } from 'next';
import * as React from 'react';

import { authCache, userRequired } from '~/lib/auth.ts';
import { Separator } from '~/lib/ui/separator.tsx';

import { type NavItem } from './_common.ts';
import SectionHeader from './_section-header.tsx';
import SidebarNav from './_sidebar-nav.tsx';

const navItems: NavItem[] = [
  {
    path: '/admin/general',
    title: 'General',
  },
  {
    path: '/admin/sources',
    title: 'Sources',
  },
  {
    path: '/admin/indexers',
    title: 'Indexers',
  },
  {
    path: '/admin/members',
    title: 'Members',
    description: 'Manage members and roles',
  },
];

export default async function AdminLayout({ children }: NextLayoutProps) {
  const session = await authCache();
  userRequired(session?.user, Role.Admin);

  return (
    <div className='my-8 mx-auto max-w-7xl'>
      <h2 className='text-xl'>Admin Panel</h2>
      <Separator className='my-6' />
      <div className='flex flex-col space-y-4 lg:flex-row lg:space-x-8 lg:space-y-0'>
        <aside className='lg:w-1/5'>
          <SidebarNav navItems={navItems} />
        </aside>
        <div className='flex-1 w-full'>
          <div className='space-y-6'>
            <SectionHeader navItems={navItems} />
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
