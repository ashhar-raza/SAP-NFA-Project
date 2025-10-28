import { getToken } from "./auth";

const BASE_URL = "https://b201b415trial-dev-nfadb-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/nfa-form";

const getErrorMessage = async (res) => {
  let message = `${res.status} ${res.statusText}`;
  try {
    const errData = await res.json();
    if (errData?.error?.message) {
      message = errData.error.message;
    }
  } catch {
    // fallback if response is not JSON
  }
  return message;
};

// ✅ GET
export const getEntityData = async (entity, params = {}) => {
  const token = getToken();
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  const url = `${BASE_URL}/${entity}?${query}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = await getErrorMessage(res);
    throw new Error(message);
  }

  const data = await res.json();
  return data.value || [];
};

// ✅ POST
export const postEntityData = async (entity, payload) => {
  const token = getToken();
  const url = `${BASE_URL}/${entity}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await getErrorMessage(res);
    throw new Error(message);
  }

  return await res.json();
};

// ✅ DELETE
export const deleteEntityData = async (entityWithId) => {
  const token = getToken();
  const url = `${BASE_URL}/${entityWithId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = await getErrorMessage(res);
    throw new Error(message);
  }

  return true;
};
