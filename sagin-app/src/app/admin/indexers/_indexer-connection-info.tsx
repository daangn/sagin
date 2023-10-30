import * as React from 'react';
import { type IndexerConnection } from '~/common/indexer';
import { createIndexerClient } from '~/lib/indexer';

type Props = {
  connection: IndexerConnection;
};

export default async function IndexerConnectionInfo({ connection }: Props) {
  const indexer = React.useMemo(() => {
    const url = new URL(connection.url);
    const client = createIndexerClient(url);
    return client;
  }, [connection.url]);

  const result = await indexer.system.healthCheck.query();

  return <div>{result.status.label}</div>;
}
