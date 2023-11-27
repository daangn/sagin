'use client';

import { type ColumnDef } from '@tanstack/react-table';

export type User = {
  id: string;
  status: 'pending' | 'available';
};
