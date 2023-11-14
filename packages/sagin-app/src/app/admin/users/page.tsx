import db from '@sagin/db';
import * as React from 'react';

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
