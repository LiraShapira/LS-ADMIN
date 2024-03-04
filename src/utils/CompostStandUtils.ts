import {CompostStandName} from "../types/CompostStandTypes";
import {DepositsWeightsByStand} from "../types/ApiTypes";

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

export const createCompostStandData = (depositsWeightsByStand: DepositsWeightsByStand[]): DepositsWeightsByStand[] => {
  return Object.entries(standsIdToNameMap).map(([id, name]) => {
    const compostStandDTO = depositsWeightsByStand.find(n => n.id === id);
    const weight = compostStandDTO ? compostStandDTO.weight : '0';
    return {
      id,
      name,
      weight
    }
  })
}
