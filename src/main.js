import "../src/styles/styles.css";

const API_KEY = "c1ace0a25ec8526c8301d5578a34b088";

const $form = document.querySelector("#form");
const $peliculaABuscar = document.querySelector("#searchInput");
const $results = document.querySelector("#results");

$form.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = $peliculaABuscar.value.trim();

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}&page=1`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      $results.innerHTML = "";

      if (data.results.length === 0) {
        creadorDeTarjetasNO();
        return;
      }

      data.results.forEach((movie) => {
        creadorDeTarjetas(movie);
      });
    })
    .catch((error) => console.error(error));
});

function creadorDeTarjetas(movie) {
  const div = document.createElement("div");
  div.className =
    "max-w-sm rounded overflow-hidden shadow-lg bg-white gap-3 mb-4";
  div.innerHTML = `
    <img
      class="w-full h-80 object-cover"
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      alt="${movie.title}"
    />
    <div class="px-6 py-4">
      <div class="flex flex-col gap-[10px] font-bold text-xl mb-2">${
        movie.title
      }</div>
      <p class="text-gray-700 text-base mb-2">Año: ${
        movie.release_date.split("-")[0]
      }</p>
      <p class="text-gray-700 text-sm">${
        movie.overview || "Sin descripción disponible."
      }</p>
      <p class="mt-[10px] text-gray-700 text-sm">País de lanzamiento: ${
        movie.original_language.toUpperCase() || ""
      }</p>
    </div>
  `;
  $results.appendChild(div);
}
function creadorDeTarjetasNO() {
  const div = document.createElement("div");
  div.className =
    "max-w-sm rounded overflow-hidden shadow-lg bg-white gap-3 mb-4";
  div.innerHTML = `
    <p>NO HAY PELICULAS </p>
  `;
  $results.appendChild(div);
}
