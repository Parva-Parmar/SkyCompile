const API_BASE_URL = "http://localhost:3000/api/v1";

export async function getLandingData() {
  const res = await fetch(`${API_BASE_URL}/landing`);
  if (!res.ok) {
    throw new Error("Failed to fetch landing data");
  }
  return res.json();
}
