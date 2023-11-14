import { redirect } from 'next/navigation';
import * as React from 'react';

import { getCurrentUser } from '~/lib/auth.ts';

export default async function IndexPage() {
  return <main />;
}
