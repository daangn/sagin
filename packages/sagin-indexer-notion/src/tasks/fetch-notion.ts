import * as Worker from 'graphile-worker';

import notion, { blocksToMarkdown, interleaveFullContent } from '~/lib/notion.ts';
import { collectAsync } from '~/lib/utils.ts';

type Payload = {
  pageId: string;
};

export default async function fetchNotion(payload: Payload, helpers: Worker.Helpers) {
  console.log('start');
  const blocks = await collectAsync(interleaveFullContent(notion, payload.pageId));
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
