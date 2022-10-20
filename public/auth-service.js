export const api_url = "/api";

export async function checkAuth() {
  const accessToken = window.localStorage.getItem("accessToken");
  const res = await fetch(`${api_url}/auth/`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    mode: "cors",
  });
  return await res.json();
}

export async function fetchRefreshToken() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const res = await fetch(`${api_url}/auth/refresh_token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + refreshToken,
    },
    mode: "cors",
  });
  const jsonResponse = await res.json();
  return jsonResponse;
}
