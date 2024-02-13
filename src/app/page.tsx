'use client';

import { useEffect, useState } from 'react';
import type { GTAG } from '@/types';
import { CLASS, RANK_API, RARITY, SORT } from '@/constants';
import { highestClass } from '@/utils';
import RankTable from '@/components/RankTable';
import SummaryTable from '@/components/SummaryTable';
import SupplyTable from '@/components/SupplyTable';

export default function App() {
  const [sorting, setSorting] = useState<SORT>(SORT.POPCORN);
  const [rarityFilter, setRarityFilter] = useState<RARITY>(RARITY.ALL);
  const [classFilter, setClassFilter] = useState<CLASS | string>('');
  const [cachedGtags, setCachedGtags] = useState<GTAG[]>([]);
  const [gtags, setGtags] = useState<GTAG[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGtags = async () => {
      try {
        setIsLoading(true);

        let page = 1;
        let allGtags: GTAG[] = [];

        while (true) {
          const response = await fetch(`${RANK_API}?page=${page}`);
          const result = await response.json();
          if (result.length === 0) break;

          allGtags = [...allGtags, ...result];
          page++;
        }

        setCachedGtags(allGtags);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching gtags:', error);
        setIsLoading(false);
      }
    };

    fetchGtags();
  }, []);

  useEffect(() => {
    if (cachedGtags.length > 0) {
      setIsLoading(true);

      let sortedGtags: GTAG[] = [];
      if (sorting === SORT.POPCORN) {
        sortedGtags = [...cachedGtags].sort((a, b) => b.total - a.total);
      } else if (sorting === SORT.BELLS) {
        sortedGtags = [...cachedGtags].sort((a, b) => b.bell - a.bell);
      }

      let filteredGtags = sortedGtags;
      if (rarityFilter !== RARITY.ALL) {
        filteredGtags = sortedGtags.filter(
          gtag => gtag.rarity === rarityFilter
        );
      }

      if (classFilter.length > 0) {
        filteredGtags = filteredGtags.filter(
          gtag => highestClass(gtag) === classFilter
        );
      }

      setGtags(filteredGtags);
      setIsLoading(false);
    }
  }, [sorting, rarityFilter, classFilter, cachedGtags]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <SummaryTable
        classFilter={classFilter}
        gtags={gtags}
        isLoading={isLoading}
      />
      <SupplyTable gtags={gtags} isLoading={isLoading} />
      <RankTable
        classFilter={classFilter}
        gtags={gtags}
        isLoading={isLoading}
        rarityFilter={rarityFilter}
        setClassFilter={setClassFilter}
        setRarityFilter={setRarityFilter}
        setSorting={setSorting}
        sorting={sorting}
      />
    </main>
  );
}
