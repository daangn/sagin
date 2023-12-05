/* TypeScript file generated from Model_User.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as Model_UserBS__Es6Import from './Model_User.bs.js';
const Model_UserBS: any = Model_UserBS__Es6Import;

export type membership = 
    { kind: "pending"; readonly requestedAt: Date }
  | { kind: "declined"; readonly decliendAt: Date }
  | { kind: "active"; readonly activatedAt: Date }
  | { kind: "inactive"; readonly deactivatedAt: Date };

export type membershipStatus = "pending" | "declined" | "active" | "inactive";

export const MembershipStatus_Pending: membershipStatus = Model_UserBS.MembershipStatus.Pending;

export const MembershipStatus_Declined: membershipStatus = Model_UserBS.MembershipStatus.Declined;

export const MembershipStatus_Active: membershipStatus = Model_UserBS.MembershipStatus.Active;

export const MembershipStatus_Inactive: membershipStatus = Model_UserBS.MembershipStatus.Inactive;

export const MembershipStatus: {
  Declined: membershipStatus; 
  Pending: membershipStatus; 
  Inactive: membershipStatus; 
  Active: membershipStatus
} = Model_UserBS.MembershipStatus
