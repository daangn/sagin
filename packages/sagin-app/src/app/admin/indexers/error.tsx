'use client';

import * as React from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminIndexersError({ error }: Props) {
  console.log(error);

  return <div>Error</div>;
}
