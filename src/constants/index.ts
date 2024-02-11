import type { ClassTotals } from '@/types';

export const COLLECTION_API = '/api/collection';
export const RANK_API = '/api/ranking';

export const MY_GTAGS = [
  30577, 30587, 30566, 30572, 30686, 30570, 30579, 30568, 30583, 30588, 30576,
  30578, 30571, 30585, 30567, 30458, 30573, 30581, 30569, 30582,
];

export const TIER_COUNT = {
  TOTAL: 10743,
  COMMON: 9027,
  UNCOMMON: 779,
  RARE: 689,
  EPIC: 301,
};

export const INITIAL_CLASS_TOTALS: ClassTotals = {
  name: '',
  total: 0,
  epic: 0,
  rare: 0,
  uncommon: 0,
  common: 0,
};

export enum SORT {
  POPCORN = 'total',
  BELLS = 'bell',
}

export enum RARITY {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  ALL = 'All',
}

export enum CLASS {
  golem = 'Golem',
  kraken = 'Kraken',
  megajaw = 'MegaJaw',
  mosura = 'Mosura',
  ninetails = 'Ninetails',
  swampy = 'Swampy',
  toadz = 'Toadz',
  even = 'Even Load',
  none = 'Unloaded Popcorn',
}
