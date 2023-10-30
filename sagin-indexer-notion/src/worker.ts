import * as path from 'node:path';
import { type FastifyInstance } from 'fastify';
import * as Worker from 'graphile-worker';

import { sharedPool } from '~/lib/db';

export async function setupWorker(app: FastifyInstance): Promise<void> {
  const crontab = `
    * * * * * hello { name: "Hyeseong" }
  `;

  const logger = new Worker.Logger(function graphileLoggerFactory(scope) {
    return (level, message, _meta) => {
      switch (level) {
        case 'info':
          app.log.info(scope, message);
          break;
        case 'warning':
          app.log.warn(scope, message);
          break;
        case 'error':
          app.log.error(scope, message);
          break;
        case 'debug':
          app.log.debug(scope, message);
          break;
      }
    };
  });

  const runner = await Worker.run({
    pgPool: sharedPool,
    taskList: getTaskList(),
    noHandleSignals: true,
    crontab,
    logger,
  });

  app.decorate('addJob', runner.addJob).addHook('onClose', async () => {
    await runner.stop();
    await runner.promise;
  });
  app.addJob('fetch-notion', {});
}

function getTaskList() {
  const handlerModules = import.meta.glob(['./tasks/*.ts', '!./tasks/_*.ts'], {
    import: 'default',
    eager: true,
  });

  const handlerEntries: Array<[jobName: string, handler: Worker.Task]> = [];
  for (const [modulePath, module] of Object.entries(handlerModules)) {
    if (module) {
      const jobName = path.basename(modulePath, '.ts');
      handlerEntries.push([jobName, module as Worker.Task]);
    }
  }

  return Object.fromEntries(handlerEntries);
}
