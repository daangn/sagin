'use client';

import * as React from 'react';

import { Input } from '~/lib/ui/input.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/lib/ui/tabs.tsx';

import MembersList from './_members-list.tsx';
import { type Member } from './_models.ts';

type Props = {
  initialMembersPromise: Promise<Member[]>;
};

export default function MembersControlPanel({ initialMembersPromise }: Props) {
  const [search, setSearch] = React.useState('');
  const deferredSearch = React.useDeferredValue(search);

  return (
    <Tabs defaultValue='members'>
      <div className='flex justify-between mb-4'>
        <TabsList>
          <TabsTrigger value='members'>Members</TabsTrigger>
          <TabsTrigger value='pending-requests'>Pending requests</TabsTrigger>
          <TabsTrigger value='declined-requests'>Decliend requests</TabsTrigger>
        </TabsList>
        <Input
          type='text'
          className='w-80'
          placeholder='Search name or email...'
          value={search}
          onChange={e => {
            setSearch(e.currentTarget.value);
          }}
        />
      </div>
      <TabsContent value='members'>
        <React.Suspense fallback='loading...'>
          <MembersList initialMembersPromise={initialMembersPromise} search={deferredSearch} />
        </React.Suspense>
      </TabsContent>
      <TabsContent value='pending-requests'>Pending</TabsContent>
      <TabsContent value='decliend-requests'>Declined</TabsContent>
    </Tabs>
  );
}
