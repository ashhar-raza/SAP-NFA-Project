// const BASE_URL = "https://b201b415trial-dev-nfaapplication-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/nfa-form";

const BASE_URL = "/odata/v4/nfa-form";

// Generic GET helper
export const getEntityData = async (entity, params = {}) => {
  let query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  const url = `${BASE_URL}/${entity}?${query}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add authorization headers if required
    },
  });
  const data = await res.json();
  return data.value || [];
};

// Generic POST helper
export const postEntityData = async (entity, payload) => {
  const url = `${BASE_URL}/${entity}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
};

// Generic DELETE helper
export const deleteEntityData = async (entityWithId) => {
  const url = `${BASE_URL}/${entityWithId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Delete failed");
  return true;
};
