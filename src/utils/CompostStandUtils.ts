import { CompostReportFromAPI, CompostStandFromAPI } from "../apiServices/CompostStandAPI";
import { CompostStandName, CompostReport } from "../types/CompostStandTypes";
import { CompostStandDataDTO, DepositsWeightsByStand } from "../types/ApiTypes";

/** Inclusive calendar-day range for "last N days" ending today. */
export function getPeriodDateRange(periodDays: number): { from: Date; to: Date } {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date();
  from.setDate(to.getDate() - periodDays);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

export function isReportInPeriod(report: { date?: string | null }, periodDays: number): boolean {
  if (!report.date) {
    return true;
  }
  const reportDate = new Date(report.date);
  if (Number.isNaN(reportDate.getTime())) {
    return true;
  }
  const { from, to } = getPeriodDateRange(periodDays);
  return reportDate >= from && reportDate <= to;
}

/** Format a Date as YYYY-MM-DD in local time (for date inputs). */
export function formatLocalDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function filterReportsByDateRange<T extends { date?: string | null }>(
  reports: T[],
  fromDateStr: string,
  toDateStr: string,
): T[] {
  const from = new Date(`${fromDateStr}T00:00:00`);
  const to = new Date(`${toDateStr}T23:59:59.999`);
  return reports.filter((report) => {
    if (!report.date) {
      return true;
    }
    const d = new Date(report.date);
    return !Number.isNaN(d.getTime()) && d >= from && d <= to;
  });
}

export function filterReportsByPeriod(
  reports: CompostReportFromAPI[],
  periodDays: number,
): CompostReportFromAPI[] {
  return reports.filter((report) => isReportInPeriod(report, periodDays));
}

export function buildCompostStandDataFromReports(
  reports: CompostReportFromAPI[],
  period: number,
): CompostStandDataDTO {
  const filtered = filterReportsByPeriod(reports, period);
  const statsByStand = new Map<
    number,
    { sum: number; count: number; users: Set<string> }
  >();

  for (const report of filtered) {
    const standId = report.compostStandId;
    if (!statsByStand.has(standId)) {
      statsByStand.set(standId, { sum: 0, count: 0, users: new Set() });
    }
    const stats = statsByStand.get(standId)!;
    const weight = Number(report.depositWeight || 0);
    stats.sum += Number.isFinite(weight) ? weight : 0;
    stats.count += 1;
    if (report.userId) {
      stats.users.add(report.userId);
    }
  }

  const depositsWeightsByStands: DepositsWeightsByStand[] = Array.from(
    statsByStand.entries(),
  ).map(([standId, stats]) => ({
    id: String(standId),
    name: (standsIdToNameMap[standId] || `stand_${standId}`) as CompostStandName,
    depositWeightSum: Number(stats.sum.toFixed(2)),
    averageDepositWeight:
      stats.count > 0 ? Number((stats.sum / stats.count).toFixed(2)) : 0,
    depositCount: stats.count,
    depositUsersCount: stats.users.size,
  }));

  return { depositsWeightsByStands, period };
}

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
