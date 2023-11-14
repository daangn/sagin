import { z } from 'zod';

import { publicProcedure, router } from './_base.ts';

const systemStatusSchema = z.object({
  category: z.enum(['healthy', 'not_healthy']),
  label: z.string(),
  description: z.string().optional(),
});

export type SystemStatus = z.infer<typeof systemStatusSchema>;

export interface SystemService {
  healthCheck(): Promise<SystemStatus>;
}

export type SystemRouter = typeof systemRouter;
export const systemRouter = router({
  healthCheck: publicProcedure
    .output(
      z.object({
        status: systemStatusSchema,
      }),
    )
    .query(async ({ ctx }) => {
      try {
        const status = await ctx.services.system.healthCheck();
        return { status };
      } catch (e) {
        return {
          status: {
            category: 'not_healthy',
            label: 'Unavailable',
          },
        };
      }
    }),
});
