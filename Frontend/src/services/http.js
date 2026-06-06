const BASE = "http://localhost:3000";

async function request(url, options = {}) {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { "content-type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getJson(url) {
  const res = await request(url);
  if (!res) return [];
  return await res.json();
}

export async function postJson(url, data) {
  return await request(url, { method: "POST", body: JSON.stringify(data) });
}

export async function putJson(url, data) {
  return await request(url, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteReq(url) {
  return await request(url, { method: "DELETE" });
}
