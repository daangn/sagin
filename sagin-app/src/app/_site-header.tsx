'use client';

import * as Icon from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';

type Props = {
  profile: {
    image: string;
    email: string;
    name: string;
  };
};

export default function SiteHeader({ profile }: Props) {
  const pathname = usePathname();
  const fallbackProfileName = profile.name.slice(0, 1).toUpperCase();

  return (
    <header className='flex h-16 px-4 items-center justify-between bg-gray-100'>
      <nav className='flex gap-4'>
        <h1 className='inline-flex items-center text-xl font-bold'>SAGIN</h1>
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
                <AvatarImage src={profile.image} alt={profile.email} />
                <AvatarFallback>{fallbackProfileName}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-48'>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{profile.name}</p>
                <p className='text-xs text-muted-foreground leading-none'>{profile.email}</p>
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
