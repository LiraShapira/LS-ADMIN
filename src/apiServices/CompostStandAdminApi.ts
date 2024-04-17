import { SERVER_URL } from "./config";
import { ApiServiceReturnType } from "../types/ApiTypes";
import { CompostStand } from "../types/CompostStandTypes";

export interface CompostStandAdminParams {
  userId: string;
  compostStandId: number;
}

export const addCompostStandAdmin = async (params: CompostStandAdminParams): Promise<ApiServiceReturnType<CompostStand>> => {
  let urlString = `${SERVER_URL}/addCompostStandAdmin`

  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      method: 'POST'
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


export const removeCompostAdmin = async (params: CompostStandAdminParams): Promise<ApiServiceReturnType<CompostStand>> => {
  let urlString = `${SERVER_URL}/removeCompostStandAdmin`

  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      method: 'POST'
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
