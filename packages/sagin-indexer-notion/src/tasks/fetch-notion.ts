import * as Worker from 'graphile-worker';
import notion, { blocksToMarkdown, interleaveFullContent } from '~/lib/notion';
import { collectAsync } from '~/lib/utils';

type Payload = {};

export default async function fetchNotion(payload: Payload, helpers: Worker.Helpers) {
  console.log('start');
  const blocks = await collectAsync(interleaveFullContent(notion, '6a32536d494b4530a6828358970491b1'));
  const text = blocksToMarkdown(blocks);
  console.log(text);
}

declare module 'fastify' {
  interface AddJobFunction {
    (id: 'fetch-notion', payload: Payload, spec?: Worker.TaskSpec): Promise<Worker.Job>;
  }

  interface FastifyInstance {
    addJob: AddJobFunction;
  }
}
