import type { ClassTotals } from '@/types';

export const COLLECTION_API = '/api/collection';
export const MARKETPLACE_API = '/api/marketplace';
export const RANK_API = '/api/ranking';
export const SUPPLY_API = '/api/supply';

export const GTAG_CONTRACT = '0x2358693f4faec9d658bb97fc9cd8885f62105dc1';
export const GTAG_IMPLEMENTATION = '0x9753166cc946c8c71b8b15bf71a0fc24f996b819';
export const POPCORN_BELLS_CONTRACT =
  '0x93553928ca776e2e1dc48059fddcc1c4d1060941';

export const MY_RARES = [
  30577, 30587, 30566, 30572, 30686, 30570, 30579, 30568, 30583, 30588, 30576,
  30578, 30571, 30585, 30567, 30458, 30573, 30581, 30569, 30582,
];
export const MY_UNCOMMONS = [20824, 20825, 20827];
export const MY_COMMONS = [
  833, 4831, 4832, 4848, 5466, 961, 1958, 4830, 9543, 11607, 11680, 12508,
  12510, 12511, 12517, 12518, 15525, 15526,
];
export const MY_GTAGS = [...MY_RARES, ...MY_UNCOMMONS, ...MY_COMMONS];

export const TIER_TARGETS = {
  TOTAL: 10000,
  COMMON: 7599,
  UNCOMMON: 1411,
  RARE: 689,
  EPIC: 301,
};

export const TIER_COUNT = {
  TOTAL: 10622,
  COMMON: 8843,
  UNCOMMON: 789,
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

export const POPCORN_MARKETPLACE = {
  golem: 100 * 3233 + 1000 * 1034 + 10000 * 148,
  kraken: 100 * 3347 + 1000 * 1092 + 10000 * 165,
  megajaw: 100 * 3350 + 1000 * 1097 + 10000 * 155,
  mosura: 100 * 3460 + 1000 * 1137 + 10000 * 151,
  ninetails: 100 * 3411 + 1000 * 1180 + 10000 * 158,
  swampy: 100 * 3780 + 1000 * 1166 + 10000 * 166,
  toadz: 100 * 3549 + 1000 * 1029 + 10000 * 148,
};

export const BELLS_MARKETPLACE = {
  10: 10 * 720,
  100: 100 * 508,
  1000: 1000 * 60,
};

export const TRAIT_WEIGHTS = {
  CLASS: {
    GOLEM: 1430 / 10000,
    KRAKEN: 1430 / 10000,
    MEGAJAW: 1430 / 10000,
    MOSURA: 1430 / 10000,
    NINETAILS: 1430 / 10000,
    SWAMPY: 1430 / 10000,
    TOADZ: 1430 / 10000,
  },
  TIER: {
    EPIC: 301 / 10000,
    RARE: 689 / 10000,
    UNCOMMON: 1411 / 10000,
    COMMON: 7599 / 10000,
  },
  TOMO: {
    T3: 179 / 10000,
    T2: 364 / 10000,
    T1: 752 / 10000,
    NONE: 8705 / 10000,
  },
  POPCORN: {
    EYES: 0.1,
    FEET: 0.1,
    HANDS: 0.1,
    HEAD: 0.1,
    MOUTH: 0.1,
    ORIGIN: {
      T4: (1430 * 0.1) / 10000,
      T3: (1430 * 0.2) / 10000,
      T2: (1430 * 0.3) / 10000,
      T1: (1430 * 0.4) / 10000,
    },
  },
  LOADOUT: {},
};

export enum SORT {
  POPCORN = 'total',
  BELLS = 'bell',
  RARITY = 'rarity',
  TRAITS = 'traits',
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
