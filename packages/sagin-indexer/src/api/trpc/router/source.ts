import { z } from 'zod';

import { publicProcedure, router } from './_base.ts';

export type SourceRouter = typeof sourceRouter;
export const sourceRouter = router({});
