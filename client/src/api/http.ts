const API_BASE_URL = "http://localhost:3000/api/v1";

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
  const data  = await res.json();

  if(!res.ok){
    throw new Error(data.message || "Request failed");
  }

  return data;  
}

export const getAuthRequest = async (url: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
};

export const postAuthRequest = async (url: string, body: any) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const deleteAuthRequest = async (url: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};