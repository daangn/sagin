'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/lib/ui/avatar.tsx';
import { Button } from '~/lib/ui/button.tsx';

import { type Member } from './_models.ts';

type Props = {
  search: string;
  initialMembersPromise: Promise<Member[]>;
};

export default function MembersList({ search, initialMembersPromise }: Props) {
  const ct = useTranslations('common');
  const vt = useTranslations('admin.members');

  const initialMembers = React.use(initialMembersPromise);
  const [members, setMembers] = React.useState(() => initialMembers);

  React.useEffect(() => {
    console.log(search);
  }, [search]);

  return (
    <ul className='w-full'>
      {members.map(user => (
        <li key={user.id}>
          <div className='flex justify-between border p-4'>
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src={user.image ?? ''} alt={user.name} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
              <div className='grid'>
                <div className='text-md font-semibold'>{user.name}</div>
                <div className='text-md text-muted-foreground'>{user.email}</div>
              </div>
            </div>
            {user.membershipStatus === 'active' && (
              <div className='flex gap-4 items-center'>
                <div>{ct(`role.${user.role}`)}</div>
                <Button variant='outline' className='cursor-pointer'>
                  {vt('change_role')}
                </Button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
