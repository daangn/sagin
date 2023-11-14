import { z } from 'zod';

import { publicProcedure, router } from './_base.ts';

export interface SourceService {
  validateSourceId(id: string): Promise<boolean>;
}

export type SourceRouter = typeof sourceRouter;
export const sourceRouter = router({
  validate: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return {
        success: await ctx.services.source.validateSourceId(input.id),
      };
    }),
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string().url(),
      }),
    )
    .output(z.object({}))
    .mutation(async ({ input, ctx }) => {}),
});
