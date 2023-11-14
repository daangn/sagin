import * as Worker from 'graphile-worker';

type Payload = {
  foo: number;
};

export default async function hello2(payload: Payload, helpers: Worker.Helpers) {
  helpers.logger.info('test', payload);
}

declare module 'fastify' {
  interface AddJobFunction {
    (id: 'hello2', payload: Payload, spec?: Worker.TaskSpec): Promise<Worker.Job>;
  }

  interface FastifyInstance {
    addJob: AddJobFunction;
  }
}
