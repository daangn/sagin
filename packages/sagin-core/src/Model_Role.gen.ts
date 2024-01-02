/* TypeScript file generated from Model_Role.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as Model_RoleBS from './Model_Role.bs.js';

export type t = "user" | "admin" | "sys_admin";

export const User: t = Model_RoleBS.User as any;

export const Admin: t = Model_RoleBS.Admin as any;

export const SystemAdmin: t = Model_RoleBS.SystemAdmin as any;

export const check: (requiredRole:t, userRole:t) => boolean = Model_RoleBS.check as any;
