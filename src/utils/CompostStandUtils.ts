import { CompostStandFromAPI } from "../apiServices/CompostStandAPI";
import { CompostStandName, CompostReport } from "../types/CompostStandTypes";
import { DepositsWeightsByStand } from "../types/ApiTypes";

export const standsIdToNameMap: Record<number, CompostStandName> = {
  2: 'hakaveret',
  3: 'food_forest_park_hahurshot',
  4: 'tel_hubez',
  5: 'ginat_hahistadrut',
  6: 'alexander_zaid',
  7: 'de_modina',
  8: 'shiffer',
  9: 'burma',
  10: 'park_sonya',
  11: 'kerem_hazeitim',
  12: 'hizkiyahu_hamelech',
  13: 'masalant',
  14: 'cafe_shapira',
};

export const standsNameToIdMap: Record<CompostStandName, number> = {
  hakaveret: 2,
  food_forest_park_hahurshot: 3,
  tel_hubez: 4,
  ginat_hahistadrut: 5,
  alexander_zaid: 6,
  de_modina: 7,
  shiffer: 8,
  burma: 9,
  park_sonya: 10,
  kerem_hazeitim: 11,
  hizkiyahu_hamelech: 12,
  masalant: 13,
  cafe_shapira: 14,
};

export interface CompostStandWithDepositData {
  id: string;
  name: string;
  reports: CompostReport[];
  weight: number;
  averageDepositWeight: number;
  depositCount: number;
  depositUsersCount: number;
}

/** Rows for the admin table: one row per stand in the community, with period stats when present. */
export function mergeAllStandsWithDepositStats(
  allStands: CompostStandFromAPI[],
  depositsWeightsByStands: DepositsWeightsByStand[],
): CompostStandWithDepositData[] {
  const statsById = new Map<number, DepositsWeightsByStand>();
  for (const s of depositsWeightsByStands) {
    statsById.set(Number(s.id), s);
  }

  return [...allStands]
    .sort((a, b) =>
      (a.displayName || a.name_en || "").localeCompare(b.displayName || b.name_en || "", undefined, {
        sensitivity: "base",
      }),
    )
    .map((stand) => {
      const dto = statsById.get(stand.compostStandId);
      const displayName =
        stand.displayName || stand.name_en || stand.name_he || stand.name || `Stand ${stand.compostStandId}`;

      if (!dto) {
        return {
          id: String(stand.compostStandId),
          name: displayName,
          reports: [],
          weight: 0,
          averageDepositWeight: 0,
          depositCount: 0,
          depositUsersCount: 0,
        };
      }

      return {
        id: String(stand.compostStandId),
        name: displayName,
        reports: [],
        weight: dto.depositWeightSum,
        averageDepositWeight: dto.averageDepositWeight,
        depositCount: dto.depositCount,
        depositUsersCount: dto.depositUsersCount ?? 0,
      };
    });
}

/** Legacy: fixed stand IDs for single-community / chart compatibility. Prefer mergeAllStandsWithDepositStats for admin tables. */
export const createCompostStandData = (depositsWeightsByStand: DepositsWeightsByStand[]): CompostStandWithDepositData[] => {
  return Object.entries(standsIdToNameMap).map(([id, name]) => {
    const compostStandDTO = depositsWeightsByStand.find(n => Number(n.id) === Number(id));
    if (!compostStandDTO || !compostStandDTO.depositWeightSum) {
      return {
        id,
        name: name as string,
        reports: [],
        weight: 0,
        averageDepositWeight: 0,
        depositCount: 0,
        depositUsersCount: 0
      }
    } else {
      const weight = compostStandDTO.depositWeightSum;
      const averageDepositWeight = compostStandDTO.averageDepositWeight;
      const depositCount = compostStandDTO.depositCount;
      const depositUsersCount = compostStandDTO.depositUsersCount;
      return {
        id,
        name: name as string,
        reports: [],
        weight,
        averageDepositWeight,
        depositCount,
        depositUsersCount
      }
    }
  })
}
