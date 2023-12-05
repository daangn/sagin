import { User } from '@sagin/core/models';
import db from '@sagin/db';
import * as React from 'react';

import MembersControlPanel from './_members-control-panel.tsx';
import { mapMember } from './_models.ts';

const getMembers = React.cache(async (keyword?: string) => {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      membershipStatus: true,
    },
    where: (users, { and, or, eq, ilike }) =>
      and(
        or(
          eq(users.membershipStatus, User.MembershipStatus.Active),
          eq(users.membershipStatus, User.MembershipStatus.Inactive),
        ),
        keyword ? or(ilike(users.name, keyword), ilike(users.email, keyword)) : undefined,
      ),
    orderBy: (users, { asc }) => [asc(users.membershipStatus), asc(users.email)],
    limit: 20,
  });
  return users.map(mapMember);
});

export default function AdminUsersPage() {
  const initialMembersPromise = getMembers();

  return <MembersControlPanel initialMembersPromise={initialMembersPromise} />;
}
