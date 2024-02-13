import { CLASS, RARITY, SORT } from '@/constants';

export type GTAG = {
  [key: string]: number | string | boolean | undefined;
  id: string;
  tokenId: number;
  swampy: number;
  kraken: number;
  ninetails: number;
  toadz: number;
  mosura: number;
  golem: number;
  megajaw: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  isDirtyS3: boolean;
  isDirtyOpenSea: boolean;
  isLocked: boolean;
  bell: number;
  position: string;
  rarity: RARITY;
  tomoLevel?: number;
};

export type ClassTotals = {
  name: string;
  total: number;
  epic: number;
  rare: number;
  uncommon: number;
  common: number;
};

export type ApiResponse = {
  gtags: {
    result: GTAG[];
  };
};

export interface RankTableProps {
  classFilter: CLASS | string;
  gtags: GTAG[];
  isLoading: boolean;
  rarityFilter: RARITY;
  setClassFilter: React.Dispatch<React.SetStateAction<CLASS | string>>;
  setRarityFilter: React.Dispatch<React.SetStateAction<RARITY>>;
  setSorting: React.Dispatch<React.SetStateAction<SORT>>;
  sorting: SORT;
}

export interface SummaryTableProps {
  classFilter: CLASS | string;
  gtags: GTAG[];
  isLoading: boolean;
}

export interface SupplyTableProps {
  classFilter: CLASS | string;
  gtags: GTAG[];
  isLoading: boolean;
}

export type Collection = {
  contractAddress: string;
  name: string;
  collectionSlug: string;
  imageUrl: string;
  totalSupply: number;
  numberOwners: number;
  floorPrice: {
    amount: string;
    unit: string;
  };
  floorPriceOneDay: {
    amount: string;
    unit: string;
  };
  floorPriceOneWeek: {
    amount: string;
    unit: string;
  };
  volumeFifteenMinutes: null;
  volumeOneDay: {
    amount: string;
    unit: string;
  };
  volumeOneWeek: {
    amount: string;
    unit: string;
  };
  bestCollectionBid: {
    amount: string;
    unit: string;
  };
  totalCollectionBidValue: {
    amount: string;
    unit: string;
  };
  traitFrequencies: {
    TIER: {
      [key: string]: number;
      __magic_null_trait_value: number;
    };
    Tier: {
      [key: string]: number;
      __magic_null_trait_value: number;
    };
    BELLS: {
      [key: string]: number;
      __magic_null_trait_value: number;
    };
  };
  bestCollectionLoanOffer: null;
};

export type CollectionResponse = {
  success: boolean;
  collection: Collection;
};

export type MarketplaceToken = {
  token_address: string;
  token_id: string;
  amount: string;
  token_hash?: string;
  block_number_minted?: string;
  contract_type: string;
  name?: string;
  symbol?: string;
  token_uri?: string;
  metadata?: string;
  last_token_uri_sync?: string;
  last_metadata_sync?: string;
  minter_address?: string;
  possible_spam?: boolean;
  verified_collection?: boolean;
  normalized_metadata: {
    name: string;
    description?: string;
    animation_url?: string;
    external_link?: string;
    image?: string;
    attributes: {
      trait_type: string;
      value: string;
      display_type?: string;
      max_value?: string;
      trait_count?: number;
      order?: string;
    }[];
  };
};

export type MarketplaceResponse = {
  raw: {
    cursor?: string;
    page?: number;
    page_size?: number;
    result: MarketplaceToken[];
  };
};

export type MarketplaceResult = {
  popcorn: {
    golem: number;
    kraken: number;
    megajaw: number;
    mosura: number;
    ninetails: number;
    swampy: number;
    toadz: number;
  };
  bells: number;
};
