/* TypeScript file generated from Model_User.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as Model_UserBS from './Model_User.bs.js';

export type membership = 
    { kind: "pending"; readonly requestedAt: Date }
  | { kind: "declined"; readonly decliendAt: Date }
  | { kind: "active"; readonly activatedAt: Date }
  | { kind: "inactive"; readonly deactivatedAt: Date };

export type membershipStatus = "pending" | "declined" | "active" | "inactive";

export const MembershipStatus_Pending: membershipStatus = Model_UserBS.MembershipStatus.Pending as any;

export const MembershipStatus_Declined: membershipStatus = Model_UserBS.MembershipStatus.Declined as any;

export const MembershipStatus_Active: membershipStatus = Model_UserBS.MembershipStatus.Active as any;

export const MembershipStatus_Inactive: membershipStatus = Model_UserBS.MembershipStatus.Inactive as any;

export const MembershipStatus: {
  Declined: membershipStatus; 
  Pending: membershipStatus; 
  Inactive: membershipStatus; 
  Active: membershipStatus
} = Model_UserBS.MembershipStatus as any;
