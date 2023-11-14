import * as Worker from 'graphile-worker';

type Payload = {
  name: string;
};

export default async function hello(payload: Payload, helpers: Worker.Helpers) {
  helpers.logger.info(`Hello, ${payload.name}!!`, { payload });
}

declare module 'fastify' {
  interface AddJobFunction {
    (id: 'hello', payload: Payload, spec?: Worker.TaskSpec): Promise<Worker.Job>;
  }

  interface FastifyInstance {
    addJob: AddJobFunction;
  }
}
