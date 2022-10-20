import { checkAuth, api_url } from "./auth-service.js";

const formLogin = document.getElementById("form-login");

async function login(data) {
  const res = await fetch(`${api_url}/auth/login`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

formLogin.onsubmit = async (e) => {
  e.preventDefault();
  if (formLogin.email.value && formLogin.password.value) {
    const loginDetails = await login({
      email: formLogin.email.value,
      password: formLogin.password.value,
    });
    if (loginDetails.error) {
      alert(loginDetails.error);
      location.reload();
    } else {
      window.localStorage.setItem("accessToken", loginDetails.accessToken);
      window.localStorage.setItem("refreshToken", loginDetails.refreshToken);
      document.location = "movies.html";
    }
  } else {
    alert("Invalid form data");
  }
};

(async () => {
  try {
    const authResult = await checkAuth();
    if (authResult.auth) {
      document.location = "movies.html";
    } else {
      window.localStorage.clear();
    }
  } catch (error) {
    alert(error);
  }
})();
