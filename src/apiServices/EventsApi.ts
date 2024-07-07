import { ApiServiceReturnType } from "../types/ApiTypes";
import { LSEvent } from "../types/EventTypes";
import { SERVER_URL } from "./config";
import { Location } from "../types/EventTypes";

export const fetchLSEventsData = async (): Promise<ApiServiceReturnType<LSEvent[]>> => {
  let urlString = `${SERVER_URL}/events`
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


export const fetchLocations = async (): Promise<ApiServiceReturnType<Location[]>> => {
  let urlString = `${SERVER_URL}/locations`
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

export const saveEventToDatabase = async (event: LSEvent): Promise<ApiServiceReturnType<LSEvent>> => {
  let urlString = `${SERVER_URL}/addEvent`
  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      method: "POST"
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

export const updateEventInDatabase = async (event: Partial<LSEvent>): Promise<ApiServiceReturnType<LSEvent[]>> => {
  let urlString = `${SERVER_URL}/updateEvent`
  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      method: "POST"
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


export const deleteEventInDB = async ({ id }: { id: string }): Promise<ApiServiceReturnType<LSEvent[]>> => {
  try {
    const requestString = `${SERVER_URL}/deleteEvent`;
    const response = await fetch(requestString, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const JSONresponse = await response.json()

    if (response.status === 400) {
      throw new Error(JSONresponse.error);
    }
    return { data: JSONresponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}
