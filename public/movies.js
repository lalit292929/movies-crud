import { checkAuth, api_url, fetchRefreshToken } from "./auth-service.js";

const buttonDeleteToken = document.getElementById("button-delete-token");
const buttonAddMovie = document.getElementById("button-add-movie");
const movieTable = document.getElementById("movie-table");
let MOVIES = [];

buttonDeleteToken.onclick = async () => {
  window.localStorage.clear();
  document.location = "index.html";
};

buttonAddMovie.onclick = async () => {
  document.location = "movies-form.html";
};

async function fetchMoviesList() {
  const accessToken = window.localStorage.getItem("accessToken");
  const res = await fetch(`${api_url}/movies/`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return await res.json();
}

async function deleteMovie(record_id) {
  const accessToken = window.localStorage.getItem("accessToken");
  const res = await fetch(`${api_url}/movies?record_id=${record_id}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  const deleteResult = await res.json();
  if (deleteResult.error) {
    alert(deleteResult.error);
  } else {
    alert("Movie Deleted");
  }
  location.reload();
}

async function editMovie(record_id) {
  for (let i = 0; i < MOVIES.length; i++) {
    if (MOVIES[i].record_id === record_id) {
      let { movie_name, rating, movie_cast, genre, release_date } = MOVIES[i];
      document.location = `movies-form.html?record_id=${record_id}&movie_name=${movie_name}&rating=${rating}&movie_cast=${movie_cast}&genre=${genre}&release_date=${release_date}`;
    }
  }
}

async function displayMoviesList() {
  const movieList = await fetchMoviesList();
  if (
    movieList &&
    movieList.movies &&
    Array.isArray(movieList.movies) &&
    movieList.movies.length
  ) {
    let temp = "";
    MOVIES = movieList.movies;
    movieList.movies.forEach((movieData) => {
      temp += "<tr>";
      temp += "<td>" + movieData.movie_name + "</td>";
      temp += "<td>" + movieData.rating + "</td>";
      temp += "<td>" + movieData.movie_cast + "</td>";
      temp += "<td>" + movieData.genre + "</td>";
      temp += "<td>" + movieData.release_date + "</td>";
      temp +=
        "<td>" +
        `<button id="${movieData.record_id}"
        class = "edit-button">EDIT</button>` +
        "</td>";
      temp +=
        "<td>" +
        `<button id="${movieData.record_id}"
        class = "delete-button">DEL</button>` +
        "</td>";
      temp += "</tr>";
    });
    movieTable.innerHTML = temp;
    let delButtons = document.getElementsByClassName("delete-button");
    for (let i = 0; i < delButtons.length; i++) {
      delButtons[i].onclick = function (e) {
        deleteMovie(this.id);
      };
    }
    let editButtons = document.getElementsByClassName("edit-button");
    for (let i = 0; i < editButtons.length; i++) {
      editButtons[i].onclick = function (e) {
        editMovie(this.id);
      };
    }
  }
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
      await displayMoviesList();
    } else if (authResult.error) {
      document.location = "index.html";
    } else {
      await displayMoviesList();
    }
  } catch (error) {
    alert(error);
  }
})();
