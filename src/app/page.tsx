'use client';

import { useEffect, useState, useRef, use } from 'react';
import type { GTAG } from '@/app/api/ranking/route';
import { MY_GTAGS, TIER_COUNT } from '@/constants/gtags';

const RANK_API = '/api/ranking';

enum SORT {
  POPCORN = 'total',
  BELLS = 'bell',
}

enum RARITY_FILTER {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  ALL = 'ALL',
}

enum CLASS {
  golem = 'Golem',
  kraken = 'Kraken',
  megajaw = 'MegaJaw',
  mosura = 'Mosura',
  ninetails = 'Ninetails',
  swampy = 'Swampy',
  toadz = 'Toadz',
  none = 'None',
}

const highestClass = (gtag: GTAG): CLASS => {
  const filteredClasses = Object.keys(CLASS).filter(c => c !== 'none');
  const highest = filteredClasses.reduce((a, b) =>
    Number(gtag[a as keyof GTAG]) > Number(gtag[b as keyof GTAG]) ? a : b
  ) as keyof typeof CLASS;

  if (gtag.total === 0) {
    return CLASS.none;
  }

  return CLASS[highest];
};

interface RankTableProps {
  classFilter: CLASS | string;
  gtags: GTAG[];
  isLoading: boolean;
  rarityFilter: RARITY_FILTER;
  setClassFilter: React.Dispatch<React.SetStateAction<CLASS | string>>;
  setRarityFilter: React.Dispatch<React.SetStateAction<RARITY_FILTER>>;
  setSorting: React.Dispatch<React.SetStateAction<SORT>>;
  sorting: SORT;
}

const RankTable: React.FC<RankTableProps> = ({
  classFilter,
  gtags,
  isLoading,
  rarityFilter,
  setClassFilter,
  setRarityFilter,
  setSorting,
  sorting,
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchTokenId, setSearchTokenId] = useState<string>('');
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (searchTokenId && tableRef.current) {
      const row = Array.from(tableRef.current.getElementsByTagName('tr')).find(
        tr => tr.id === searchTokenId
      );
      if (row) {
        row.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchTokenId]);

  const handleSearch = () => {
    setSearchTokenId(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTokenId(searchInput);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-center text-white">Ranks</h2>
      <div className="flex justify-between mb-4 ml-auto">
        <select
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-sm"
          value={sorting}
          onChange={e => setSorting(e.target.value as SORT)}
        >
          <option value={SORT.POPCORN}>Sort by Popcorn</option>
          <option value={SORT.BELLS}>Sort by Bells</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-sm"
          value={rarityFilter}
          onChange={e => setRarityFilter(e.target.value as RARITY_FILTER)}
        >
          <option value={RARITY_FILTER.ALL}>All Rarities</option>
          <option value={RARITY_FILTER.COMMON}>Common</option>
          <option value={RARITY_FILTER.UNCOMMON}>Uncommon</option>
          <option value={RARITY_FILTER.RARE}>Rare</option>
          <option value={RARITY_FILTER.EPIC}>Epic</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md mr-4 text-sm"
          value={classFilter}
          onChange={e => setClassFilter(e.target.value as CLASS)}
        >
          <option value={''}>All Classes</option>
          <option value={CLASS.none}>None</option>
          <option value={CLASS.golem}>Golem</option>
          <option value={CLASS.kraken}>Kraken</option>
          <option value={CLASS.megajaw}>MegaJaw</option>
          <option value={CLASS.ninetails}>Ninetails</option>
          <option value={CLASS.swampy}>Swampy</option>
          <option value={CLASS.toadz}>Toadz</option>
        </select>
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-sm"
          placeholder="Search by Token ID"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="px-4 py-2 border bg-white border-gray-300 rounded-md text-sm"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <table
        className="w-full bg-white border border-gray-300 rounded-lg shadow"
        ref={tableRef}
      >
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 border-b">RANK</th>
            <th className="py-2 px-4 bg-gray-100 border-b">TOKEN ID</th>
            <th className="py-2 px-4 bg-gray-100 border-b">RARITY</th>
            <th className="py-2 px-4 bg-gray-100 border-b">CLASS</th>
            <th className="py-2 px-4 bg-gray-100 border-b">TOTAL POPCORN</th>
            <th className="py-2 px-4 bg-gray-100 border-b">BELLS</th>
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
            gtags.map((gtag, index) => (
              <tr
                key={gtag.tokenId}
                id={`${gtag.tokenId}`}
                className={`${index % 2 === 0 ? 'bg-gray-50' : ''} ${
                  MY_GTAGS.includes(gtag.tokenId) ? 'font-bold' : ''
                }`}
              >
                <td className="py-2 px-4 border-b text-center font-bold">
                  {(index + 1).toLocaleString()}
                </td>
                <td className={'py-2 px-4 border-b text-center'}>
                  <a
                    href={`https://opensea.io/assets/ethereum/0x2358693f4faec9d658bb97fc9cd8885f62105dc1/${gtag.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {gtag.tokenId.toLocaleString()}
                  </a>
                </td>
                <td
                  className={`py-2 px-4 border-b text-center ${
                    gtag.rarity === RARITY_FILTER.COMMON
                      ? 'bg-gray-300'
                      : gtag.rarity === RARITY_FILTER.UNCOMMON
                      ? 'bg-green-300'
                      : gtag.rarity === RARITY_FILTER.RARE
                      ? 'bg-blue-300'
                      : gtag.rarity === RARITY_FILTER.EPIC
                      ? 'bg-purple-300'
                      : ''
                  }`}
                >
                  {gtag.rarity}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {highestClass(gtag)}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {gtag.total.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {gtag.bell.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

type ClassTotals = {
  name: string;
  total: number;
  epic: number;
  rare: number;
  uncommon: number;
  common: number;
};

interface SummaryTableProps {
  gtags: GTAG[];
  isLoading: boolean;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ isLoading, gtags }) => {
  const [totals, setTotals] = useState<ClassTotals[]>([]);

  useEffect(() => {
    if (gtags.length > 0) {
      const totals: ClassTotals[] = [];
      Object.values(CLASS).forEach(c => {
        const classGtags = gtags.filter(g => highestClass(g) === c);
        const total = classGtags.length;
        const epic = classGtags.filter(
          g => g.rarity === RARITY_FILTER.EPIC
        ).length;
        const rare = classGtags.filter(
          g => g.rarity === RARITY_FILTER.RARE
        ).length;
        const uncommon = classGtags.filter(
          g => g.rarity === RARITY_FILTER.UNCOMMON
        ).length;
        const common = classGtags.filter(
          g => g.rarity === RARITY_FILTER.COMMON
        ).length;
        totals.push({ name: c, total, epic, rare, uncommon, common });
      });
      // setTotals(totals);

      const noneTotal: ClassTotals = totals.find(
        t => t.name === CLASS.none
      ) as ClassTotals;
      const otherTotals: ClassTotals[] = totals.filter(
        t => t.name !== CLASS.none
      );

      const updatedNoneTotal = {
        ...noneTotal,
        total:
          TIER_COUNT.TOTAL -
          otherTotals.reduce((sum, classTotals) => sum + classTotals.total, 0),
        epic:
          TIER_COUNT.EPIC -
          otherTotals.reduce((sum, classTotals) => sum + classTotals.epic, 0),
        rare:
          TIER_COUNT.RARE -
          otherTotals.reduce((sum, classTotals) => sum + classTotals.rare, 0),
        uncommon:
          TIER_COUNT.UNCOMMON -
          otherTotals.reduce(
            (sum, classTotals) => sum + classTotals.uncommon,
            0
          ),
        common:
          TIER_COUNT.COMMON -
          otherTotals.reduce((sum, classTotals) => sum + classTotals.common, 0),
      };

      const updatedTotals: ClassTotals[] = [...otherTotals, updatedNoneTotal];

      setTotals(updatedTotals);
    }
  }, [gtags]);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-center text-white">
        Summary
      </h2>
      <table className="w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 border-b">Class</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Total Count</th>
            <th className="py-2 px-4 bg-gray-100 border-b">EPIC</th>
            <th className="py-2 px-4 bg-gray-100 border-b">RARE</th>
            <th className="py-2 px-4 bg-gray-100 border-b">UNCOMMON</th>
            <th className="py-2 px-4 bg-gray-100 border-b">COMMON</th>
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
              {totals.map((classTotals, index) => (
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
              {
                <tr className="font-bold bg-gray-300">
                  <td className="py-2 px-4 border-b text-center">Total</td>
                  <td className="py-2 px-4 border-b text-center">
                    {totals
                      .reduce((sum, classTotals) => sum + classTotals.total, 0)
                      .toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {totals
                      .reduce((sum, classTotals) => sum + classTotals.epic, 0)
                      .toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {totals
                      .reduce((sum, classTotals) => sum + classTotals.rare, 0)
                      .toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {totals
                      .reduce(
                        (sum, classTotals) => sum + classTotals.uncommon,
                        0
                      )
                      .toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {totals
                      .reduce((sum, classTotals) => sum + classTotals.common, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              }
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function Home() {
  const [sorting, setSorting] = useState<SORT>(SORT.POPCORN);
  const [rarityFilter, setRarityFilter] = useState<RARITY_FILTER>(
    RARITY_FILTER.ALL
  );
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
      if (rarityFilter !== RARITY_FILTER.ALL) {
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
      <SummaryTable gtags={gtags} isLoading={isLoading} />
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
