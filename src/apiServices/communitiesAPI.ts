import { SERVER_URL } from './config';

export interface Community {
  id: string;
  CommunityName: string;
  CommunityLocation: string;
  Coin: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const response = await fetch(`${SERVER_URL}/communities`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || 'Failed to fetch communities');
  }
  return response.json();
};
