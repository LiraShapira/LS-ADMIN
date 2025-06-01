import { SERVER_URL } from "./config";
import { ApiServiceReturnType, CompostStandDataDTO } from "../types/ApiTypes";
import { StandStats } from "../components/CompostStands/CompostStandChart";

export const fetchCompostStandData = async (params?: { period?: number }): Promise<ApiServiceReturnType<CompostStandDataDTO>> => {
  let urlString = `${SERVER_URL}/compostStandStats?`
  if (params?.period) {
    urlString = urlString + `period=${params.period}`;
  }
  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const JSONResponse = await response.json();
    if (response.status === 400) {
      throw new Error(JSONResponse.error);
    }

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}

export const fetchCompostReportData = async (params?: { period?: number }): Promise<ApiServiceReturnType<StandStats[]>> => {
  let urlString = `${SERVER_URL}/compostReportStats?`
  if (params?.period) {
    urlString = urlString + `period=${params.period}`;
  }
  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const JSONResponse = await response.json();
    if (response.status === 400) {
      throw new Error(JSONResponse.error);
    }

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}
