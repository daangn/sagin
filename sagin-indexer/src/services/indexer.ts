import { router } from './_base';
import { sourceRouter } from './source';
import { systemRouter } from './system';

export type IndexerRouter = typeof indexerRouter;
export const indexerRouter = router({
  source: sourceRouter,
  system: systemRouter,
});
