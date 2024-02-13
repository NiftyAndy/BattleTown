import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, GTAG } from '@/types';

const BASE_API = 'https://battle.town/api/gtags';

// In-memory cache
const cache: { [key: string]: { data: GTAG[]; timestamp: number } } = {};
const CACHE_KEY_PREFIX = 'apiCache_';
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');

  const cacheKey = `${CACHE_KEY_PREFIX}${page}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return new NextResponse(JSON.stringify(cachedData), {
      status: 200,
    });
  }

  const url = `${BASE_API}/ranking?rankBy=bell&page=${page}`;
  const response = await fetch(url);
  const data: ApiResponse = await response.json();

  // Add the necessary headers to allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  cacheData(cacheKey, data.gtags.result);

  return new NextResponse(JSON.stringify(data.gtags.result), {
    headers,
    status: 200,
  });
}

function getCachedData(cacheKey: string): GTAG[] | null {
  const cachedData = cache[cacheKey];
  if (cachedData) {
    const { data, timestamp } = cachedData;
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      return data;
    }
  }
  return null;
}

function cacheData(cacheKey: string, data: GTAG[]): void {
  const cachedData = {
    data,
    timestamp: Date.now(),
  };
  cache[cacheKey] = cachedData;
}
