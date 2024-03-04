export type CompostStandName =
  | 'hakaveret'
  | 'food_forest_park_hahurshot'
  | 'tel_hubez'
  | 'ginat_hahistadrut'
  | 'alexander_zaid'
  | 'de_modina'
  | 'shiffer'
  | 'burma'
  | 'park_sonya'
  | 'kerem_hazeitim'
  | 'hizkiyahu_hamelech'
  | 'masalant'
  | 'cafe_shapira';

export interface CompostStand {
  id: string;
  name: CompostStandName;
}

