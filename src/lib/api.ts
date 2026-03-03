export const API_URL = "https://api.pixelplush.dev/v1";
export const STATS_URL = "https://stats.pixelplush.dev/v1";
export const TWITCH_CLIENT_ID = "8m07ghhogjy0q09moeunnpdu51i60n";

export async function fetchWithAuth(url: string, token: string) {
  const res = await fetch(url, {
    headers: { Twitch: token },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchAccount(token: string) {
  return fetchWithAuth(`${STATS_URL}/accounts`, token);
}

export async function fetchCatalog() {
  return fetch("https://www.pixelplush.dev/assets/catalog.json").then((r) =>
    r.json()
  );
}

export async function fetchLiveStreams(): Promise<string[]> {
  return fetch(`${API_URL}/analytics/sessions/live/short`).then((r) =>
    r.json()
  );
}
