const API_KEY = "c1ace0a25ec8526c8301d5578a34b088";

const $form = document.querySelector("#form");
const $peliculaABuscar = document.querySelector("#searchInput");
const $results = document.querySelector("#results");
const $orderSelect = document.querySelector("#order"); // El select para ordenar las películas

// Escuchar el cambio del select para ordenar
$orderSelect.addEventListener("change", () => {
  // Solo actualizamos cuando se selecciona un valor distinto de "Ordenar por"
  if ($orderSelect.value !== "Ordenar por") {
    buscarPeliculas();
  }
});

$form.addEventListener("submit", (event) => {
  event.preventDefault();

  buscarPeliculas();
});

// Función para realizar la búsqueda y ordenar las películas
function buscarPeliculas() {
  const query = $peliculaABuscar.value.trim();
  const order = $orderSelect.value; // Obtener el valor seleccionado del select
  
  const URL_MOVIE = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}&page=1`;
  const URL_GEN = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;

  fetch(URL_MOVIE)
    .then((response) => response.json())
    .then((data) => {
      $results.innerHTML = "";

      if (data.results.length === 0) {
        creadorDeTarjetasNO();
        return;
      }

      // Ordenar las películas según la opción seleccionada
      let sortedMovies = [...data.results]; // Creamos una copia para no modificar el original

      if (order === "Año: Menor a mayor") {
        sortedMovies = sortedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateA - dateB; // Orden ascendente (más antigua primero)
        });
      } else if (order === "Año: Mayor a menor") {
        sortedMovies = sortedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB - dateA; // Orden descendente (más reciente primero)
        });
      }

      fetch(URL_GEN)
        .then((res) => res.json())
        .then((dataGen) => {
          const genresFromTMDB = dataGen.genres;

          // Iterar sobre las películas ordenadas
          sortedMovies.forEach((movie) => {
            const genresNames = getGenresNames(movie.genre_ids, genresFromTMDB);
            creadorDeTarjetas(movie, genresNames);
          });
        });
    })
    .catch((error) => console.error(error));
}

// Función para obtener los nombres de los géneros
function getGenresNames(genresIds, genresFromTMDB) {
  return genresIds.map((id) => {
    const genre = genresFromTMDB.find((genre) => genre.id === id);
    return genre ? genre.name : null;
  }).filter(Boolean); // Filtra los valores nulos
}

// Función para crear la tarjeta de la película
function creadorDeTarjetas(movie, genresNames) {
  const div = document.createElement("div");
  div.className = "max-w-sm rounded overflow-hidden shadow-lg bg-white gap-3 mb-4";

  div.innerHTML = `
    <img
      class="w-full h-80 object-cover"
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      alt="${movie.title}"
    />
    <div class="px-6 py-4">
      <div class="flex flex-col gap-[10px] font-bold text-xl mb-2">${movie.title}</div>
      <p class="text-gray-700 text-base mb-2">Año: ${movie.release_date.split("-")[0]}</p>
      <p class="text-gray-700 text-base mb-2">Género: ${genresNames.join(', ') || 'Género no disponible'}</p> 
      <p class="text-gray-700 text-sm">${movie.overview || "Sin descripción disponible."}</p>
      <p class="mt-[10px] text-gray-700 text-sm">País de lanzamiento: ${movie.original_language.toUpperCase() || ""}</p>
    </div>
  `;
  $results.appendChild(div);
}

// Función para mostrar un mensaje cuando no se encuentren películas
function creadorDeTarjetasNO() {
  const div = document.createElement("div");
  div.className = "max-w-sm rounded overflow-hidden shadow-lg bg-white gap-3 mb-4";
  div.innerHTML = `<p>No se encontraron películas.</p>`;
  $results.appendChild(div);
}
