import {CompostStand} from "./CompostStandTypes";

export interface SuccessApiResponse<T> {
  data: T;
  status: number;
}

export interface FailApiResponse {
  status: 400;
  error: string
}

export type ApiServiceReturnType<T> = SuccessApiResponse<T> | Error

export type ApiResponse<T> = FailApiResponse | SuccessApiResponse<T>

export interface DepositsWeightsByStand extends CompostStand {
  weight: number;
}

export interface CompostStandDataDTO {
  depositsWeightsByStands: DepositsWeightsByStand[],
  period: number;
}
