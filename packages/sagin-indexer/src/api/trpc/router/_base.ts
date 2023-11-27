import { initTRPC } from '@trpc/server';

import { type TrpcContext } from './_context.ts';

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
