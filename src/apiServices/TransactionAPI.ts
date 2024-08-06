import { ApiServiceReturnType } from "../types/ApiTypes";
import { Transaction } from "../types/TransactionTypes";
import { SERVER_URL } from "./config";
import { mockEvent1 } from "../mocks/mockEvents";
console.log(mockEvent1);
export interface LoadTransactionsReturn {
  count: number;
  transactions: Transaction[]
}

export const fetchTransactionStats = async (params?: { period?: number }): Promise<ApiServiceReturnType<LoadTransactionsReturn>> => {

  let urlString = `${SERVER_URL}/transactionStats?`
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
