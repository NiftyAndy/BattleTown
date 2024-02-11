import { NextRequest, NextResponse } from 'next/server';
import type { CollectionResponse } from '@/types';

const BASE_API = 'https://core-api.prod.blur.io/v1/collections';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = `${BASE_API}/10ktf-gtags`;
  const response = await fetch(url);
  const data: CollectionResponse = await response.json();

  // Add the necessary headers to allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return new NextResponse(JSON.stringify(data.collection), {
    headers,
    status: 200,
  });
}
