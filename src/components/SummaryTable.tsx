'use client';

import { useEffect, useState } from 'react';
import type { ClassTotals, Collection, SummaryTableProps } from '@/types';
import {
  CLASS,
  COLLECTION_API,
  INITIAL_CLASS_TOTALS,
  TIER_COUNT,
} from '@/constants';
import { calculateClassSums } from '@/utils';

const SummaryTable: React.FC<SummaryTableProps> = ({
  classFilter,
  gtags,
  isLoading,
}) => {
  const [classSums, setClassSums] = useState<ClassTotals[]>([]);
  const [totalLoaded, setTotalLoaded] =
    useState<ClassTotals>(INITIAL_CLASS_TOTALS);
  const [totalUnloaded, setTotalUnloaded] =
    useState<ClassTotals>(INITIAL_CLASS_TOTALS);
  const [tierCount, setTierCount] = useState(TIER_COUNT);

  useEffect(() => {
    if (gtags.length > 0) {
      const sums = calculateClassSums(gtags);
      const noneTotal: ClassTotals = sums.find(
        c => c.name === CLASS.none
      ) as ClassTotals;
      const otherTotals: ClassTotals[] = sums.filter(
        c => c.name !== CLASS.none
      );
      setTotalUnloaded(noneTotal);
      setClassSums(otherTotals);

      setTotalLoaded(
        otherTotals.reduce(
          (sum, classTotals) => {
            sum.total += classTotals.total;
            sum.epic += classTotals.epic;
            sum.rare += classTotals.rare;
            sum.uncommon += classTotals.uncommon;
            sum.common += classTotals.common;
            return sum;
          },
          { ...INITIAL_CLASS_TOTALS }
        )
      );
    }
  }, [gtags]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(COLLECTION_API);
        if (response.ok) {
          const result: Collection = await response.json();
          const { totalSupply, traitFrequencies } = result;

          setTierCount({
            TOTAL: totalSupply,
            COMMON: traitFrequencies.Tier[0],
            UNCOMMON: traitFrequencies.Tier[1],
            RARE: traitFrequencies.Tier[2],
            EPIC: traitFrequencies.Tier[3],
          });
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
      }
    };

    fetchCollection();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-center text-white">
        Summary
      </h2>
      <table className="w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr className="font-bold bg-gray-300">
            <th className="py-2 px-4 border-b">CLASS</th>
            <th className="py-2 px-4 border-b">TOTAL COUNT</th>
            <th className="py-2 px-4 border-b">EPIC</th>
            <th className="py-2 px-4 border-b">RARE</th>
            <th className="py-2 px-4 border-b">UNCOMMON</th>
            <th className="py-2 px-4 border-b">COMMON</th>
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
              {classSums.map((classTotals, index) => (
                <tr
                  key={`${classTotals.name}`}
                  className={`${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <td className="py-2 px-4 border-b text-center font-bold">
                    {classTotals.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {classTotals.total.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {classTotals.epic.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {classTotals.rare.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {classTotals.uncommon.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {classTotals.common.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-300">
                <td className="py-2 px-4 border-b text-center">Total Loaded</td>
                <td className="py-2 px-4 border-b text-center">
                  {totalLoaded.total.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalLoaded.epic.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalLoaded.rare.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalLoaded.uncommon.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {totalLoaded.common.toLocaleString()}
                </td>
              </tr>
              {classFilter === '' && (
                <>
                  <tr className="font-bold bg-gray-50">
                    <td className="py-2 px-4 border-b text-center">
                      {totalUnloaded.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {totalUnloaded.total.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {totalUnloaded.epic.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {totalUnloaded.rare.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {totalUnloaded.uncommon.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {totalUnloaded.common.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2 px-4 border-b text-center">
                      Popcorn Never Loaded
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {(
                        tierCount.TOTAL -
                        totalLoaded.total -
                        totalUnloaded.total
                      ).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {(
                        tierCount.EPIC -
                        totalLoaded.epic -
                        totalUnloaded.epic
                      ).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {(
                        tierCount.RARE -
                        totalLoaded.rare -
                        totalUnloaded.rare
                      ).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {(
                        tierCount.UNCOMMON -
                        totalLoaded.uncommon -
                        totalUnloaded.uncommon
                      ).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {(
                        tierCount.COMMON -
                        totalLoaded.common -
                        totalUnloaded.common
                      ).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="font-bold bg-gray-300">
                    <td className="py-2 px-4 border-b text-center">Total</td>
                    <td className="py-2 px-4 border-b text-center">
                      {tierCount.TOTAL.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {tierCount.EPIC.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {tierCount.RARE.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {tierCount.UNCOMMON.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {tierCount.COMMON.toLocaleString()}
                    </td>
                  </tr>
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
