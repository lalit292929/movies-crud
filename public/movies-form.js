import { checkAuth, api_url, fetchRefreshToken } from "./auth-service.js";

const buttonDeleteToken = document.getElementById("button-delete-token");
const pageHeading = document.getElementById("page-heading");
const buttonMovieList = document.getElementById("button-movie-list");
const formAddMovie = document.getElementById("form-add-movie");
const inputMovieName = document.getElementById("movie_name");
const inputRating = document.getElementById("rating");
const inputMovieCast = document.getElementById("movie_cast");
const inputGenre = document.getElementById("genre");
const inputReleaseDate = document.getElementById("release_date");

let isEditForm = false;
let RECORD_ID = "";

formAddMovie.onsubmit = async (e) => {
  e.preventDefault();
  if (
    formAddMovie.movie_name.value &&
    formAddMovie.rating.value &&
    formAddMovie.movie_cast.value &&
    formAddMovie.genre.value &&
    formAddMovie.release_date.value
  ) {
    if (!isEditForm) {
      const movieDetails = await addMovie({
        movie_name: formAddMovie.movie_name.value,
        rating: formAddMovie.rating.value,
        movie_cast: formAddMovie.movie_cast.value.split(","),
        genre: formAddMovie.genre.value,
        release_date: formAddMovie.release_date.value,
      });
      if (movieDetails.error) {
        alert(movieDetails.error);
      } else {
        alert("Movie Added to list with Success");
      }
    } else {
      // edit wala function
      const movieDetails = await editMovie({
        record_id: RECORD_ID,
        movie_name: formAddMovie.movie_name.value,
        rating: formAddMovie.rating.value,
        movie_cast: formAddMovie.movie_cast.value.split(","),
        genre: formAddMovie.genre.value,
        release_date: formAddMovie.release_date.value,
      });
      if (movieDetails.error) {
        alert(movieDetails.error);
      } else {
        alert("Movie Edited with Success");
      }
    }
    document.location = "movies.html";
  } else {
    alert("Invalid form data");
  }
};

async function addMovie(data) {
  const accessToken = window.localStorage.getItem("accessToken");
  const res = await fetch(`${api_url}/movies/`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

async function editMovie(data) {
  const accessToken = window.localStorage.getItem("accessToken");
  const res = await fetch(`${api_url}/movies/`, {
    method: "PUT",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

buttonDeleteToken.onclick = async () => {
  window.localStorage.clear();
  document.location = "index.html";
};

buttonMovieList.onclick = async () => {
  document.location = "movies.html";
};

async function checkIfAddOrUpdate() {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  const params = {};
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    params[pair[0]] = pair[1];
  }
  if (params && params.record_id) {
    isEditForm = true;
    pageHeading.innerHTML = "Update Movie";
    RECORD_ID = params.record_id;
    inputMovieName.value = decodeURIComponent(params.movie_name);
    inputGenre.value = decodeURIComponent(params.genre);
    inputMovieCast.value = decodeURIComponent(params.movie_cast);
    inputRating.value = decodeURIComponent(params.rating);
    inputReleaseDate.value = decodeURIComponent(params.release_date);
  }
  return params;
}

(async () => {
  try {
    const authResult = await checkAuth();
    if (authResult.error === "jwt expired") {
      const refreshDetails = await fetchRefreshToken();
      if (refreshDetails.error) {
        document.location = "index.html";
      }
      window.localStorage.setItem("accessToken", refreshDetails.accessToken);
      window.localStorage.setItem("refreshToken", refreshDetails.refreshToken);
      await checkIfAddOrUpdate();
    } else if (authResult.error) {
      document.location = "index.html";
    } else {
      await checkIfAddOrUpdate();
    }
  } catch (error) {
    alert(error);
  }
})();
