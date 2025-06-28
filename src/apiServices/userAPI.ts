import { SERVER_URL } from "./config";
import { ApiServiceReturnType } from "../types/ApiTypes";
import { User, UserDataDTO } from "../types/UserTypes";

export const fetchUserData = async (params?: { period?: number }): Promise<ApiServiceReturnType<UserDataDTO>> => {
  let urlString = `${SERVER_URL}/userStats?`
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

export const fetchUsers = async (): Promise<ApiServiceReturnType<User[]>> => {
  let urlString = `${SERVER_URL}/users`

  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json', // Set the correct Content-Type header
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
