import { router } from './router/_base.ts';
import { sourceRouter } from './router/source.ts';

export { type TrpcContext } from './router/_context.ts';

export type IndexerRouter = typeof indexerRouter;
export const indexerRouter = router({
  source: sourceRouter,
});
