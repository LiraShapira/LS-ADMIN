import { SERVER_URL } from "./config";
import { ApiServiceReturnType } from "../types/ApiTypes";
import { User, UserDataDTO } from "../types/UserTypes";

export const fetchUserData = async (params?: { period?: number; communityId?: string }): Promise<ApiServiceReturnType<UserDataDTO>> => {
  let urlString = `${SERVER_URL}/userStats?`;
  if (params?.period) {
    urlString += `period=${params.period}`;
  }
  if (params?.communityId) {
    urlString += (urlString.endsWith('?') ? '' : '&') + `communityId=${encodeURIComponent(params.communityId)}`;
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
    if (response.status === 501) {
      throw new Error(JSONResponse.error || 'Endpoint not yet implemented');
    }

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}

export const fetchUsers = async (communityId?: string): Promise<ApiServiceReturnType<User[]>> => {
  let urlString = `${SERVER_URL}/users`;
  if (communityId) {
    urlString += `?communityId=${encodeURIComponent(communityId)}`;
  }
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

export const verifyUser = async (userId: string): Promise<ApiServiceReturnType<User>> => {
  try {
    const response: Response = await fetch(`${SERVER_URL}/verifyUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const JSONResponse = await response.json();
    if (response.status === 400) {
      throw new Error(JSONResponse.error);
    }

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}

export const toggleBanUser = async (userId: string): Promise<ApiServiceReturnType<User>> => {
  try {
    const response: Response = await fetch(`${SERVER_URL}/toggleBanUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const JSONResponse = await response.json();
    if (response.status === 400) {
      throw new Error(JSONResponse.error);
    }

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}

export const deleteUser = async (userId: string): Promise<ApiServiceReturnType<{ success: boolean }>> => {
  try {
    const response: Response = await fetch(`${SERVER_URL}/deleteUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const JSONResponse = await response.json();
    if (response.status >= 400) {
      throw new Error(JSONResponse.error || 'Failed to delete user');
    }

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}