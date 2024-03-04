import {SERVER_URL} from "./config";
import {ApiServiceReturnType, CompostStandDataDTO} from "../types/ApiTypes";

export const fetchCompostStandData = async (params?: { period?: number }): Promise<ApiServiceReturnType<CompostStandDataDTO>> => {
  let urlString = `${ SERVER_URL }/compostStandStats?`
  if (params?.period) {
    urlString = urlString + `period=${ params.period }`;
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

    return {data: JSONResponse, status: response.status};
  } catch (e: any) {
    return e;
  }
}
