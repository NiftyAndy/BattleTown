'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { RankTableProps } from '@/types';
import { CLASS, MY_GTAGS, RARITY, SORT } from '@/constants';
import { highestClass, calculateRangeRarity } from '@/utils';

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
      <h2 className="mb-4 text-2xl font-bold text-center text-white">
        Leaderboard
      </h2>
      <div className="flex justify-between mb-4 ml-auto">
        <select
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-sm"
          value={sorting}
          onChange={e => setSorting(e.target.value as SORT)}
        >
          <option value={SORT.POPCORN}>Sort by Popcorn</option>
          <option value={SORT.BELLS}>Sort by Bells</option>
          <option value={SORT.RARITY}>Sort by Rarity</option>
          <option value={SORT.TRAITS}>Sort by Traits</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-sm"
          value={rarityFilter}
          onChange={e => setRarityFilter(e.target.value as RARITY)}
        >
          <option value={RARITY.ALL}>All Rarities</option>
          <option value={RARITY.COMMON}>Common</option>
          <option value={RARITY.UNCOMMON}>Uncommon</option>
          <option value={RARITY.RARE}>Rare</option>
          <option value={RARITY.EPIC}>Epic</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md mr-4 text-sm"
          value={classFilter}
          onChange={e => setClassFilter(e.target.value as CLASS)}
        >
          <option value={''}>All Classes</option>
          <option value={CLASS.none}>{CLASS.none}</option>
          <option value={CLASS.even}>{CLASS.even}</option>
          <option value={CLASS.golem}>{CLASS.golem}</option>
          <option value={CLASS.kraken}>{CLASS.kraken}</option>
          <option value={CLASS.megajaw}>{CLASS.megajaw}</option>
          <option value={CLASS.mosura}>{CLASS.mosura}</option>
          <option value={CLASS.ninetails}>{CLASS.ninetails}</option>
          <option value={CLASS.swampy}>{CLASS.swampy}</option>
          <option value={CLASS.toadz}>{CLASS.toadz}</option>
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
          <tr className="font-bold bg-gray-300">
            <th className="py-2 px-4 border-b">RANK</th>
            <th className="py-2 px-4 border-b">TOKEN ID</th>
            <th className="py-2 px-4 border-b">RARITY</th>
            <th className="py-2 px-4 border-b">CLASS</th>
            <th className="py-2 px-4 border-b">TOTAL POPCORN</th>
            <th className="py-2 px-4 border-b">BELLS</th>
            <th className="py-2 px-4 border-b">TOMO</th>
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
                    gtag.rarity === RARITY.COMMON
                      ? 'bg-gray-300'
                      : gtag.rarity === RARITY.UNCOMMON
                      ? 'bg-green-300'
                      : gtag.rarity === RARITY.RARE
                      ? 'bg-blue-300'
                      : gtag.rarity === RARITY.EPIC
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
                <td className="py-2 px-4 border-b text-center">
                  {gtag.tomoLevel && gtag.tomoLevel > 0 ? (
                    <Image
                      src={`/tomo/L${gtag.tomoLevel}.svg`}
                      alt={`tomo-${gtag.tomoLevel}`}
                      width={24}
                      height={18}
                      style={{ margin: 'auto' }}
                    />
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankTable;
