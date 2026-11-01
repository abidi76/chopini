export const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('chopini_token');
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem('chopini_token', token);
    else localStorage.removeItem('chopini_token');
  } catch {}
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const m = data?.message;
    throw new Error(Array.isArray(m) ? m.join(', ') : m ?? 'Une erreur est survenue');
  }
  return data as T;
}

export const CONDITIONS: Record<string, string> = {
  NEW_WITH_TAG: 'Neuf avec étiquette',
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  FAIR: 'État correct',
};
