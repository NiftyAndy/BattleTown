import type { GTAG, ClassTotals } from '@/types';
import { CLASS, RARITY } from '@/constants';

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
