import { router } from './_base.ts';
import { sourceRouter } from './source.ts';
import { systemRouter } from './system.ts';

export type IndexerRouter = typeof indexerRouter;
export const indexerRouter = router({
  source: sourceRouter,
  system: systemRouter,
});
