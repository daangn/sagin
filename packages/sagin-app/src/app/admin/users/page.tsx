import db from '@sagin/db';
import {} from '@tanstack/react-table';
import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow } from '~/components/ui/table.tsx';

const getUsers = React.cache(async () => {});

export default async function AdminUsersPage() {
  const users = await db.query.users.findMany();

  return (
    <ul>
      <li>
        {users.map(user => (
          <div key={user.id}>{user.email}</div>
        ))}
      </li>
    </ul>
  );
}
