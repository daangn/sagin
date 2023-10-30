import * as React from 'react';

import db from '~/lib/db';

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
