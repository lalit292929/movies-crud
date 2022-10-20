import { checkAuth, api_url } from "./auth-service.js";

const formRegister = document.getElementById("form-register");

async function register(data) {
  const res = await fetch(`${api_url}/users/`, {
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

formRegister.onsubmit = async (e) => {
  e.preventDefault();
  if (
    formRegister.name.value &&
    formRegister.email.value &&
    formRegister.password.value
  ) {
    const userDetails = await register({
      name: formRegister.name.value,
      email: formRegister.email.value,
      password: formRegister.password.value,
    });
    if (userDetails.error) {
      alert(userDetails.error);
      return;
    } else {
      window.localStorage.setItem("accessToken", userDetails.accessToken);
      window.localStorage.setItem("refreshToken", userDetails.refreshToken);
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
