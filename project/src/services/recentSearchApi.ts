import { supabase } from '../lib/supabase';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api/v1';

const getAuthHeader = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? `Bearer ${token}` : null;
};

export interface RecentSearchEntry {
  id: string;
  query: string;
  searched_at: string;
}

export const fetchRecentSearches = async (): Promise<RecentSearchEntry[]> => {
  const auth = await getAuthHeader();
  if (!auth) return [];

  const res = await fetch(`${API_BASE_URL}/recent-searches`, {
    headers: { Authorization: auth },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
};

export const saveRecentSearch = async (query: string): Promise<void> => {
  const auth = await getAuthHeader();
  if (!auth) return;

  const res = await fetch(`${API_BASE_URL}/recent-searches`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message || 'Failed to save recent search');
  }
};

export const deleteRecentSearch = async (query: string): Promise<void> => {
  const auth = await getAuthHeader();
  if (!auth) return;

  await fetch(`${API_BASE_URL}/recent-searches`, {
    method: 'DELETE',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
};

export const clearRecentSearches = async (): Promise<void> => {
  const auth = await getAuthHeader();
  if (!auth) return;

  await fetch(`${API_BASE_URL}/recent-searches/clear`, {
    method: 'DELETE',
    headers: { Authorization: auth },
  });
};
