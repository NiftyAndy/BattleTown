import type { GTAG, ClassTotals } from '@/types';
import { CLASS, RARITY, TRAIT_WEIGHTS } from '@/constants';

export const highestClass = (gtag: GTAG): CLASS => {
  const filteredClasses = Object.keys(CLASS).filter(
    c => c !== 'none' && c !== 'even'
  );
  const highest = filteredClasses.reduce((a, b) =>
    Number(gtag[a as keyof GTAG]) > Number(gtag[b as keyof GTAG]) ? a : b
  ) as keyof typeof CLASS;

  if (gtag.total === 0) return CLASS.none;

  const isEven = filteredClasses.every(
    c =>
      Number(gtag[c as keyof GTAG]) ===
      Number(gtag[filteredClasses[0] as keyof GTAG])
  );
  if (isEven) return CLASS.even;

  return CLASS[highest];
};

export const calculateClassSums = (gtags: GTAG[]): ClassTotals[] => {
  const classSums: ClassTotals[] = [];
  Object.values(CLASS)
    // .filter(c => c !== CLASS.none)
    .forEach(c => {
      const classGtags = gtags.filter(g => highestClass(g) === c);
      const total = classGtags.length;
      const epic = classGtags.filter(g => g.rarity === RARITY.EPIC).length;
      const rare = classGtags.filter(g => g.rarity === RARITY.RARE).length;
      const uncommon = classGtags.filter(
        g => g.rarity === RARITY.UNCOMMON
      ).length;
      const common = classGtags.filter(g => g.rarity === RARITY.COMMON).length;
      classSums.push({ name: c, total, epic, rare, uncommon, common });
    });

  return classSums;
};

export const sortByRarity = (a: GTAG, b: GTAG): number => {
  const rarityOrder = ['EPIC', 'RARE', 'UNCOMMON', 'COMMON'];
  const aIndex = rarityOrder.indexOf(a.rarity);
  const bIndex = rarityOrder.indexOf(b.rarity);

  if (aIndex < bIndex) return -1;
  if (aIndex > bIndex) return 1;
  return b.total - a.total;
};

export const calculateRangeRarity = (total: number): number => {
  const min = 0.0001;
  const max = 0.25;
  const normalizedTotal = Math.min(total + 1, 300000) / 300000;
  const logScale = Math.log10(min / max);
  const calculatedValue = Math.pow(10, normalizedTotal * logScale) * max;
  return Number(calculatedValue.toFixed(4));
};

const getTraitRarity = (tag: GTAG) => {
  const classRarity = 1430 / 10000;
  const tierRarity =
    TRAIT_WEIGHTS.TIER[tag.rarity as keyof typeof TRAIT_WEIGHTS.TIER];
  const tomoRarity = tag.tomoLevel
    ? TRAIT_WEIGHTS.TOMO[`T${tag.tomoLevel}` as keyof typeof TRAIT_WEIGHTS.TOMO]
    : TRAIT_WEIGHTS.TOMO.NONE;
  const popcornRarity = calculateRangeRarity(tag.total);

  const eyeRarity = popcornRarity / 20;
  const feetRarity = popcornRarity / 50;
  const handsRarity = popcornRarity / 75;
  const headRarity = popcornRarity / 35;
  const mouthRarity = popcornRarity / 10;
  const originRarity = popcornRarity / 4;

  const popcornRarityNormalized =
    eyeRarity *
    feetRarity *
    handsRarity *
    headRarity *
    mouthRarity *
    originRarity;

  const rarityNormalized =
    (classRarity / 7) *
    (tierRarity / 4) *
    (tomoRarity / 4) *
    popcornRarityNormalized;

  return rarityNormalized / 1;
};
export const sortByTraits = (a: GTAG, b: GTAG): number => {
  return getTraitRarity(a) - getTraitRarity(b);
};
