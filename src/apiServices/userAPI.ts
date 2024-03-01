import {ApiResponse} from "../../types/ApiTypes";
import {SERVER_URL} from "./config";

interface UserStatsRes {
  userCount: number;
  newUserCount: number;
  transactionsPerUser: number[];
  averageTransactionsPerUser: number;
  depositsPerUser: number[];
  period: number;
  balanceCounts: any;
}

export const fetchUserStats = async (params?: { period?: number }): Promise<ApiResponse<UserStatsRes>> => {
  let urlString = `${SERVER_URL}/userStats?`
  console.log({urlString})
  if (params?.period) {
    urlString = urlString + `period=${ params.period }`;
  }
  try {
    const response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json', // Set the correct Content-Type header
      },
    })
    const JSONresponse = await response.json();
    if (response.status !== 201) {
      throw new Error(JSONresponse.error);
    }
    return {data: JSONresponse, status: response.status};
  } catch (e: any) {
    return e;
  }
}
