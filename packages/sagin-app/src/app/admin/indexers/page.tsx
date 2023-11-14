import * as React from 'react';
import IndexerConnectionInfo from './_indexer-connection-info.tsx';

type IndexerConnection = {
  type: 'notion';
  url: string;
};

const connections: IndexerConnection[] = [
  {
    type: 'notion',
    url: 'http://localhost:9700/api/trpc',
  },
];

export default function AdminIndexersPage() {
  return (
    <ul>
      {connections.map(connection => (
        <li key={connection.url}>
          <React.Suspense fallback='Loading...'>
            <IndexerConnectionInfo connection={connection} />
          </React.Suspense>
        </li>
      ))}
    </ul>
  );
}
