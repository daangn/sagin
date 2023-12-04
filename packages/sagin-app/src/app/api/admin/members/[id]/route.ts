import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword');
}
