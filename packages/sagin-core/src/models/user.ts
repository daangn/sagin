import { type ValueOf } from '@sagin/core/utils';

export const UserMembershipStatus = Object.freeze({
  Pending: 'pending',
  Declined: 'declined',
  Active: 'active',
  Inactive: 'inactive',
});

export type UserMembershipStatus = ValueOf<typeof UserMembershipStatus>;
