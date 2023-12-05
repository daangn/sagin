import * as assert from 'node:assert/strict';
import { type Role, type User } from '@sagin/core/models';
import { type SelectUser } from '@sagin/db/schema';

export type Member = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role.t;
  membershipStatus: User.membershipStatus;
};

type MemberSelection = Pick<
  SelectUser,
  'id' | 'name' | 'email' | 'image' | 'role' | 'membershipStatus'
>;

export function mapMember(selection: MemberSelection): Member {
  assert.ok(selection.membershipStatus === 'active' || selection.membershipStatus === 'inactive');
  return {
    id: selection.id,
    image: selection.image,
    name: selection.name || 'Unnamed',
    email: selection.email,
    role: selection.role,
    membershipStatus: selection.membershipStatus,
  };
}

export type MemberRequest = {
  id: string;
};

export function mapMemberRequest(selection: SelectUser) {}
