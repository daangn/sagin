'use client';

import * as Icon from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { AuthUser } from '~/lib/auth.ts';
import { useSaginConfig } from '~/lib/config.client.tsx';
import { cn } from '~/lib/ui.ts';
import { Avatar, AvatarFallback, AvatarImage } from '~/lib/ui/avatar';
import { Button, buttonVariants } from '~/lib/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/lib/ui/dropdown-menu';

type Props = {
  user: AuthUser;
};

export default function SiteHeader({ user }: Props) {
  const config = useSaginConfig();
  const pathname = usePathname();

  const username = user.name ?? 'Unnamed';
  const fallbackProfileName = username.slice(0, 1).toUpperCase();

  return (
    <header className='flex h-16 px-4 items-center justify-between bg-gray-100'>
      <nav className='flex gap-4'>
        <h1 className='inline-flex items-center text-xl font-bold'>{config.site_name}</h1>
        <ul className='flex'>
          <li>
            <Link
              href='/'
              className={cn(
                buttonVariants({ variant: 'link' }),
                'hover:text-foreground/80',
                pathname === '/' ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              Documents
            </Link>
          </li>
          <li>
            <Link
              href='/admin'
              title='Toggle admin pannel'
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hover:bg-background',
                pathname.startsWith('/admin') && 'bg-background',
              )}
            >
              <Icon.Settings2 className='w-4 h-4' />
            </Link>
          </li>
        </ul>
      </nav>
      <div className='flex items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar>
                <AvatarImage src={user.image || ''} alt={`${username}'s picture`} />
                <AvatarFallback>{fallbackProfileName}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-48'>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{username}</p>
                <p className='text-xs text-muted-foreground leading-none'>{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button type='button' className='block w-full text-left' onClick={() => signOut()}>
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
