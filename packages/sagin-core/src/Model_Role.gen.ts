/* TypeScript file generated from Model_Role.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as Model_RoleBS__Es6Import from './Model_Role.bs.js';
const Model_RoleBS: any = Model_RoleBS__Es6Import;

export type t = "user" | "admin" | "sys_admin";

export const User: t = Model_RoleBS.User;

export const Admin: t = Model_RoleBS.Admin;

export const SystemAdmin: t = Model_RoleBS.SystemAdmin;

export const check: (requiredRole:t, userRole:t) => boolean = Model_RoleBS.check;
