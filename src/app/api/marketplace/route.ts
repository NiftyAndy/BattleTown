import { NextRequest, NextResponse } from 'next/server';
import Moralis from 'moralis';
import type {
  MarketplaceToken,
  MarketplaceResponse,
  MarketplaceResult,
} from '@/types';
import {
  POPCORN_MARKETPLACE,
  BELLS_MARKETPLACE,
  POPCORN_BELLS_CONTRACT,
} from '@/constants';

const MORALIS_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjAwYzI5Y2ViLTdkMzAtNDNhNi05N2Q5LTFkNzQ1ZmIxMmI4NSIsIm9yZ0lkIjoiMzc3MDQ4IiwidXNlcklkIjoiMzg3NDcwIiwidHlwZUlkIjoiY2FhNzExNzctYTI3OC00YzBhLTk0MzctY2YwZThiMGI1N2I4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDc4MzMyOTUsImV4cCI6NDg2MzU5MzI5NX0.7X5Y1U2Mi96ra_aw5UGWkyvg4y9VyvtwKwhp8jCajn0';

const calculateQuantity = (tokens: MarketplaceToken[]) => {
  return tokens.reduce(
    (sum, t) =>
      (sum +=
        parseInt(t.amount) *
        parseInt(
          t.normalized_metadata.attributes.find(
            a => a.trait_type === 'Quantity'
          )?.value || '0'
        )),
    0
  );
};

const calculateBellsSupply = (result: MarketplaceToken[]) => {
  const bells = result.filter(t =>
    t.normalized_metadata.name?.includes('Bells')
  );
  return calculateQuantity(bells);
};

const calculatePopcornSupply = (result: MarketplaceToken[]) => {
  return {
    golem: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Golem'))
    ),
    kraken: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Kraken'))
    ),
    megajaw: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Megajaw'))
    ),
    mosura: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Mosura'))
    ),
    ninetails: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Ninetails'))
    ),
    swampy: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Swampy'))
    ),
    toadz: calculateQuantity(
      result.filter(t => t.normalized_metadata.name?.includes('Toadz'))
    ),
  };
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!Moralis?.Core?.isStarted) {
    await Moralis.start({ apiKey: MORALIS_API_KEY });
  }

  const response = (await Moralis.EvmApi.nft.getContractNFTs({
    chain: '0x1',
    format: 'decimal',
    limit: 100,
    normalizeMetadata: true,
    mediaItems: false,
    address: POPCORN_BELLS_CONTRACT,
  })) as unknown as MarketplaceResponse;

  if (!response?.raw?.result || response.raw.result.length === 0) {
    const data: MarketplaceResult = {
      popcorn: { ...POPCORN_MARKETPLACE },
      bells: Object.values(BELLS_MARKETPLACE).reduce((sum, c) => (sum += c), 0),
    };
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  }

  const { result } = response.raw;

  const data = {
    popcorn: calculatePopcornSupply(result),
    bells: calculateBellsSupply(result),
  };

  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}
