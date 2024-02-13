'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SupplyTableProps, MarketplaceResult } from '@/types';
import { CLASS, MARKETPLACE_API, POPCORN_MARKETPLACE } from '@/constants';

const SupplyTable: React.FC<SupplyTableProps> = ({
  classFilter,
  gtags,
  isLoading,
}) => {
  const [cornMarketplace, setCornMarketplace] = useState<{
    [key: string]: number;
  }>(POPCORN_MARKETPLACE);
  const [bellsMarketplace, setBellsMarketplace] = useState(0);

  const totalPopcornLoaded = useMemo(
    () => gtags.reduce((sum, g) => (sum += g.total), 0),
    [gtags]
  );
  const totalBellsLoaded = useMemo(
    () => gtags.reduce((sum, g) => (sum += g.bell), 0),
    [gtags]
  );

  const totalPopcornMarketplace = useMemo(() => {
    if (
      classFilter === '' ||
      classFilter === CLASS.even ||
      classFilter === CLASS.none
    ) {
      return Object.values(cornMarketplace).reduce((sum, c) => (sum += c), 0);
    }
    console.log('classFilter', classFilter);
    return cornMarketplace[classFilter.toLowerCase()];
  }, [classFilter, cornMarketplace]);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const response = await fetch(MARKETPLACE_API);
        if (response.ok) {
          const result: MarketplaceResult = await response.json();
          setCornMarketplace(result.popcorn);
          setBellsMarketplace(result.bells);
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
      }
    };

    fetchMarketplace();
  }, []);

  const estPopcornSupply = 100000000;
  const popcornKnownSupply = totalPopcornLoaded + totalPopcornMarketplace;
  const estBullsSupply = 350000;
  const bellsKnownSupply = totalBellsLoaded + bellsMarketplace;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-center text-white">
        Popcorn & Bells Supply
      </h2>
      <table className="w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr className="font-bold bg-gray-300">
            <th className="py-2 px-4 border-b">TYPE</th>
            <th className="py-2 px-4 border-b">LOADED</th>
            <th className="py-2 px-4 border-b">MARKETPLACE</th>
            <th className="py-2 px-4 border-b">KNOWN SUPPLY</th>
            <th className="py-2 px-4 border-b">OFF-CHAIN</th>
            <th className="py-2 px-4 border-b">ESTIMATED SUPPLY</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-8 text-center font-bold">
                Loading...
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td className="font-bold py-2 px-4 border-b text-center">
                  Popcorn
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalPopcornLoaded.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalPopcornMarketplace.toLocaleString()}
                </td>
                <td className="font-bold py-2 px-4 border-b text-center">
                  {popcornKnownSupply.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <span className="text-red-500">
                    {(estPopcornSupply - popcornKnownSupply).toLocaleString()} ?
                  </span>
                </td>
                <td className="font-bold py-2 px-4 border-b text-center">
                  {estPopcornSupply.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="font-bold py-2 px-4 border-b text-center">
                  Bells
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalBellsLoaded.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {bellsMarketplace.toLocaleString()}
                </td>
                <td className="font-bold py-2 px-4 border-b text-center">
                  {bellsKnownSupply.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <span className="text-red-500">
                    {(estBullsSupply - bellsKnownSupply).toLocaleString()} ?
                  </span>
                </td>
                <td className="font-bold py-2 px-4 border-b text-center">
                  {estBullsSupply.toLocaleString()}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyTable;
