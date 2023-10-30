import { z } from 'zod';

import { publicProcedure, router } from './_base';

const systemStatusSchema = z.object({
  category: z.enum(['healthy', 'not_healthy']),
  label: z.string(),
  description: z.string().optional(),
});

export type SystemStatus = z.infer<typeof systemStatusSchema>;

export interface SystemService {
  healthCheck(): Promise<SystemStatus>;
}

export const systemRouter = router({
  healthCheck: publicProcedure
    .output(
      z.object({
        status: systemStatusSchema,
      }),
    )
    .query(async ({ ctx }) => {
      return {
        status: await ctx.services.system.healthCheck(),
      };
    }),
});
