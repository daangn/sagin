import { redirect } from 'next/navigation';
import * as React from 'react';

export default function AdminPage() {
  return redirect('/admin/general');
}
