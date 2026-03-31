const USE_SPRING_BOOT = import.meta.env.VITE_USE_SPRING_BOOT === 'true';
const SPRING_BOOT_URL = "http://localhost:8081/api/v1";
const NODE_URL = "http://localhost:3000/api/v1";

const API_BASE_URL = USE_SPRING_BOOT ? SPRING_BOOT_URL : NODE_URL;

const getToken = () => localStorage.getItem("token");

export async function getLandingData() {
  const res = await fetch(`${API_BASE_URL}/landing`);
  if (!res.ok) {
    throw new Error("Failed to fetch landing data");
  }
  return res.json();
}

export async function postRequest(endpoint: string, body: unknown){
  const res = await fetch(`${API_BASE_URL}${endpoint}`,{
    method: "POST",
    headers:{
      "content-type":"application/json",
    },
    body: JSON.stringify(body),
  } );

  if(!res.ok){
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(errorMessage);
  }

  // Only try to parse JSON if there's content
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const getAuthRequest = async (url: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(errorMessage);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const postAuthRequest = async (url: string, body: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(errorMessage);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const deleteAuthRequest = async (url: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (res.status === 204) {
    return;
  }

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};