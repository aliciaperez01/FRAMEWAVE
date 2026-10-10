

import {
    obtenerFavoritos,
    alternarFavorito
} from "./favoritos.js";

import {
    obtenerDetallesPelicula
} from "../api_services/tmdb.js";

import {
    mostrarGaleriaFotogramas
} from "./fotogramas.js";


/* =========================
   FICHA TÉCNICA
========================= */

export async function abrirFicha(id) {
    try {

        const {
            detalle,
            videos,
            director,
            fotogramas
        } = await obtenerDetallesPelicula(id);


        /* =========================
        GALERÍA DE FOTOGRAMAS
        ========================= */


        mostrarGaleriaFotogramas(fotogramas, detalle);


        const movieModal =
            document.getElementById("movieDetail");

        const movieDetailTitle =
            document.getElementById("movieDetailTitle");
        
        const movieDetailFavorite =
        document.getElementById("movieDetailFavorite");

        const movieDetailYear =
            document.getElementById("movieDetailYear");

        const movieDetailMeta =
            document.getElementById("movieDetailMeta");

        const movieDetailOverview =
            document.getElementById("movieDetailOverview");

        const movieDetailExtra =
            document.getElementById("movieDetailExtra");

        const movieDetailTrailer =
            document.getElementById("movieDetailTrailer");

            
console.log("Elementos de la ficha:", {
    movieModal,
    movieDetailTitle,
    movieDetailFavorite,
    movieDetailYear,
    movieDetailMeta,
    movieDetailOverview,
    movieDetailExtra,
    movieDetailTrailer
});


        /* =========================
           INFORMACIÓN DE LA PELÍCULA
        ========================= */

        movieDetailTitle.textContent =
            detalle.title;

    /* =========================
        BOTÓN DE FAVORITOS
    ========================= */

    function actualizarCorazon() {
        const favoritos = obtenerFavoritos();
        const esFavorita = favoritos.includes(String(id));

        movieDetailFavorite.textContent =
            esFavorita ? "♥" : "♡";

        movieDetailFavorite.classList.toggle(
            "is-favorite",
            esFavorita
        );

        movieDetailFavorite.setAttribute(
            "aria-pressed",
            String(esFavorita)
        );

        movieDetailFavorite.setAttribute(
            "aria-label",
            esFavorita
                ? "Quitar de favoritas"
                : "Añadir a favoritas"
        );
    }

    actualizarCorazon();

    movieDetailFavorite.onclick = () => {
        alternarFavorito(id);
        actualizarCorazon();
    };


        movieDetailYear.textContent =
            detalle.release_date?.slice(0, 4) ?? "----";

        movieDetailMeta.textContent =
            `${detalle.vote_average.toFixed(1)} ★ · ${detalle.genres
                .map(genero => genero.name)
                .join(" · ")}`;

        const duracion = detalle.runtime
            ? `${detalle.runtime} min`
            : "Duración no disponible";

        const pais = detalle.production_countries?.[0]?.name
            ?? "País no disponible";

        movieDetailExtra.innerHTML = `
            <span>${duracion}</span>
            <span>${pais}</span>
            <span>${director}</span>
        `;

        movieDetailOverview.textContent =
            detalle.overview || "No hay descripción disponible.";


        /* =========================
           TRÁILER
        ========================= */

        const trailer = videos.find(
            video => video.site === "YouTube" && video.type === "Trailer"
        );

        if (trailer) {

            movieDetailTrailer.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${trailer.key}"
                    title="Tráiler de ${detalle.title}"
                    allowfullscreen>
                </iframe>
            `;

        } else {

            const busquedaYouTube =
                `https://www.youtube.com/results?search_query=${encodeURIComponent(
                    detalle.title + " trailer"
                )}`;

            movieDetailTrailer.innerHTML = `
                <a
                    href="${busquedaYouTube}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="movie-trailer-link"
                >
                    Ver tráiler en YouTube ↗
                </a>
            `;

        }


        /* =========================
           ABRIR FICHA
        ========================= */

        movieModal.classList.add("is-open");
        movieModal.setAttribute("aria-hidden", "false");

    } catch (error) {

        console.error("Error cargando la ficha:", error);

    }

}



/* =========================
   CERRAR FICHA
========================= */

const movieModal = document.getElementById("movieDetail");
const movieDetailClose = document.getElementById("movieDetailClose");

function cerrarFicha() {
    if (!movieModal) return;

    movieModal.classList.remove("is-open");
    movieModal.setAttribute("aria-hidden", "true");

    movieDetailClose?.blur();
}

movieDetailClose?.addEventListener("click", cerrarFicha);

/* Cerrar al pulsar el fondo de la ficha */

movieModal?.addEventListener("click", (event) => {
    if (event.target === movieModal) {
        cerrarFicha();
    }
});

/* Cerrar con Escape */

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        movieModal?.classList.contains("is-open")
    ) {
        cerrarFicha();
    }
});

