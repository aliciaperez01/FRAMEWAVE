

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
    const movieModal =
        document.getElementById("movieDetail");

    if (!movieModal) {
        console.error(
            'No se encuentra el elemento HTML "#movieDetail".'
        );
        return;
    }

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

    /* =========================
       ABRIR LA FICHA
    ========================= */

    movieModal.classList.add("is-open");
    movieModal.setAttribute("aria-hidden", "false");

    try {
        const {
            detalle,
            videos,
            director,
            fotogramas
        } = await obtenerDetallesPelicula(id);

        if (!detalle) {
            throw new Error(
                "No se han recibido los detalles de la película."
            );
        }

        /* =========================
           GALERÍA DE FOTOGRAMAS
        ========================= */

        try {
            mostrarGaleriaFotogramas(
                fotogramas,
                detalle
            );
        } catch (error) {
            console.error(
                "Error cargando la galería:",
                error
            );
        }

        /* =========================
           INFORMACIÓN
        ========================= */

        if (movieDetailTitle) {
            movieDetailTitle.textContent =
                detalle.title ?? "Película";
        }

        if (movieDetailYear) {
            movieDetailYear.textContent =
                detalle.release_date?.slice(0, 4) ?? "----";
        }

        if (movieDetailMeta) {
            const nota = Number(detalle.vote_average ?? 0);

            const generos = (detalle.genres ?? [])
                .map(genero => genero.name)
                .join(" · ");

            movieDetailMeta.textContent =
                `${nota.toFixed(1)} ★${generos ? ` · ${generos}` : ""}`;
        }

        if (movieDetailExtra) {
            const duracion = detalle.runtime
                ? `${detalle.runtime} min`
                : "Duración no disponible";

            const pais =
                detalle.production_countries?.[0]?.name
                ?? "País no disponible";

            movieDetailExtra.replaceChildren();

            [duracion, pais, director || ""]
                .filter(Boolean)
                .forEach(texto => {
                    const elemento = document.createElement("span");
                    elemento.textContent = texto;
                    movieDetailExtra.append(elemento);
                });
        }

        if (movieDetailOverview) {
            movieDetailOverview.textContent =
                detalle.overview ||
                "No hay descripción disponible.";
        }

        /* =========================
           FAVORITOS
        ========================= */

        if (movieDetailFavorite) {
            function actualizarCorazon() {
                const favoritos = obtenerFavoritos();

                const esFavorita = favoritos.includes(
                    String(id)
                );

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
        }

        /* =========================
           TRÁILER
        ========================= */

        if (movieDetailTrailer) {
            const trailer = (videos ?? []).find(
                video =>
                    video.site === "YouTube" &&
                    video.type === "Trailer" &&
                    video.key
            );

            if (trailer) {
                const iframe = document.createElement("iframe");

                iframe.src =
                    `https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}`;

                iframe.title =
                    `Tráiler de ${detalle.title ?? "la película"}`;

                iframe.allowFullscreen = true;

                iframe.setAttribute(
                    "allow",
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                );

                movieDetailTrailer.replaceChildren(iframe);
            } else {
                const enlace = document.createElement("a");

                enlace.href =
                    `https://www.youtube.com/results?search_query=${
                        encodeURIComponent(
                            `${detalle.title ?? ""} trailer`
                        )
                    }`;

                enlace.target = "_blank";
                enlace.rel = "noopener noreferrer";
                enlace.className = "movie-trailer-link";
                enlace.textContent = "Ver tráiler en YouTube ↗";

                movieDetailTrailer.replaceChildren(enlace);
            }
        }

    } catch (error) {
        console.error(
            "Error cargando la ficha:",
            error
        );

        if (movieDetailTitle) {
            movieDetailTitle.textContent =
                "No se ha podido cargar la película";
        }

        if (movieDetailOverview) {
            movieDetailOverview.textContent =
                "Ha ocurrido un error al cargar los detalles. Cierra la ficha e inténtalo de nuevo.";
        }
    }
}

/* =========================
   CERRAR FICHA
========================= */

const movieModal = document.getElementById("movieDetail");

const movieDetailClose =
    document.getElementById("movieDetailClose");

function cerrarFicha() {
    if (!movieModal) return;

    movieModal.classList.remove("is-open");
    movieModal.setAttribute("aria-hidden", "true");

    movieDetailClose?.blur();
}

movieDetailClose?.addEventListener(
    "click",
    cerrarFicha
);

/* Cerrar al pulsar el fondo */

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