import { SERVER_URL } from "./config";
import { ApiServiceReturnType, CompostStandDataDTO } from "../types/ApiTypes";
import { StandStats } from "../components/CompostStands/CompostStandChart";

export interface CompostStandFromAPI {
  compostStandId: number;
  name: string;
  name_he: string;
  name_en: string;
  isActive: boolean;
  displayName: string;
}

export interface CompostReportFromAPI {
  compostStandId: number;
  userId: string;
  date: string;
  depositWeight: number | string;
}

export interface CreateCompostStandParams {
  name_en: string;
  name_he: string;
  communityId: string;
}

export interface UpdateCompostStandParams {
  compostStandId: number;
  name_he?: string;
  name_en?: string;
  isActive?: boolean;
}

export const fetchCompostStandData = async (params?: { period?: number; communityId?: string }): Promise<ApiServiceReturnType<CompostStandDataDTO>> => {
  let urlString = `${SERVER_URL}/compostStandStats?`;
  if (params?.period) {
    urlString += `period=${params.period}`;
  }
  if (params?.communityId) {
    urlString += (urlString.endsWith('?') ? '' : '&') + `communityId=${encodeURIComponent(params.communityId)}`;
  }
  urlString += (urlString.endsWith('?') ? '' : '&') + 'includeOrg=1';
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

export const fetchAllCompostStands = async (communityId?: string): Promise<ApiServiceReturnType<CompostStandFromAPI[]>> => {
  try {
    let url = `${SERVER_URL}/compostStands?includeInactive=true`;
    if (communityId) {
      url += `&communityId=${encodeURIComponent(communityId)}`;
    }
    const response: Response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const JSONResponse = await response.json();
    if (response.status !== 200) {
      throw new Error(JSONResponse.error || 'Failed to fetch compost stands');
    }
    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
};

export const createCompostStand = async (params: CreateCompostStandParams): Promise<ApiServiceReturnType<CompostStandFromAPI>> => {
  try {
    const response: Response = await fetch(`${SERVER_URL}/compostStand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const JSONResponse = await response.json();
    if (response.status !== 200) {
      throw new Error(JSONResponse.error || 'Failed to create compost stand');
    }
    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
};

export const updateCompostStand = async (params: UpdateCompostStandParams): Promise<ApiServiceReturnType<CompostStandFromAPI>> => {
  try {
    const response: Response = await fetch(`${SERVER_URL}/compostStand`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const JSONResponse = await response.json();
    if (response.status !== 200) {
      throw new Error(JSONResponse.error || 'Failed to update compost stand');
    }
    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
};

export const fetchCompostReportData = async (params?: { period?: number; communityId?: string }): Promise<ApiServiceReturnType<StandStats[]>> => {
  let urlString = `${SERVER_URL}/compostReportStats?`;
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

    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
}

export const fetchCompostReports = async (params?: {
  communityId?: string;
  from?: string;
  to?: string;
  period?: number;
}): Promise<ApiServiceReturnType<CompostReportFromAPI[]>> => {
  const searchParams = new URLSearchParams();
  if (params?.communityId) {
    searchParams.set('communityId', params.communityId);
  }
  if (params?.from) {
    searchParams.set('from', params.from);
  }
  if (params?.to) {
    searchParams.set('to', params.to);
  }
  if (params?.period) {
    searchParams.set('period', String(params.period));
  }

  const query = searchParams.toString();
  const urlString = `${SERVER_URL}/getCompostReports${query ? `?${query}` : ''}`;

  try {
    const response: Response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
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

export interface BackfillCompostReportsResult {
  since: string;
  communityId: string | null;
  depositTransactions: number;
  created: number;
  skipped: number;
  dryRun: boolean;
  samples: unknown[];
}

export const backfillMissingCompostReports = async (params?: {
  communityId?: string;
  since?: string;
}): Promise<ApiServiceReturnType<BackfillCompostReportsResult>> => {
  const adminId = localStorage.getItem('adminId');
  if (!adminId) {
    return new Error('Not authenticated');
  }

  const searchParams = new URLSearchParams();
  if (params?.communityId) {
    searchParams.set('communityId', params.communityId);
  }
  if (params?.since) {
    searchParams.set('since', params.since);
  }

  const query = searchParams.toString();
  const urlString = `${SERVER_URL}/admin/backfillCompostReports${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(urlString, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminId}`,
      },
    });
    const JSONResponse = await response.json();
    if (!response.ok) {
      throw new Error(JSONResponse.error || 'Backfill failed');
    }
    return { data: JSONResponse, status: response.status };
  } catch (e: any) {
    return e;
  }
};
