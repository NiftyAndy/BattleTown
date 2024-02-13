import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { GTAG_CONTRACT, GTAG_IMPLEMENTATION, TIER_TARGETS } from '@/constants';
import { ABI } from '@/constants/abi';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

type Inventory = [bigint, bigint, bigint];

export async function GET(request: NextRequest): Promise<NextResponse> {
  // const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${GTAG_IMPLEMENTATION}&apikey=${ETHERSCAN_KEY}`;
  // const response = await fetch(url);
  // if (!response.ok) {
  //   return new NextResponse(response.statusText, {
  //     status: response.status,
  //   });
  // }

  // const data = await response.json();
  // const abi: Abi = data.result;

  const [uncommon, rare, epic] = (await client.readContract({
    address: GTAG_CONTRACT,
    abi: ABI,
    functionName: 'batchGetInventory',
  })) as Inventory;

  const data = {
    EPIC: TIER_TARGETS.EPIC - Number(epic),
    RARE: TIER_TARGETS.RARE - Number(rare),
    UNCOMMON: TIER_TARGETS.UNCOMMON - Number(uncommon),
    COMMON: TIER_TARGETS.COMMON + 2 * Number(uncommon),
    TOTAL: 0,
  };

  data.TOTAL = data.COMMON + data.UNCOMMON + data.RARE + data.EPIC;

  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}
