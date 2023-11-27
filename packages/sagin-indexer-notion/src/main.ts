import closeWithGrace from 'close-with-grace';
import Fastify from 'fastify';

import { setupTrpc } from './api.ts';
import { setupWorker } from './worker.ts';

const app = Fastify({
  logger: true,
  maxParamLength: 5000, // tRPC uses URL params for queries
});

app.register(setupTrpc);
app.register(setupWorker);

await app.ready();

try {
  await app.listen({ port: 9700 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

if (import.meta.env.PROD) {
  closeWithGrace({ delay: 1000 }, async ({ err }) => {
    if (err) {
      app.log.error(err);
    }
    app.log.info('closing...');
    await app.close();
  });
}

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', async () => {
    await app.close();
  });

  import.meta.hot.dispose(async () => {
    await app.close();
  });
}
