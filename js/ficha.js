

import {
    obtenerFavoritos
} from "./storage.js";

import {
    alternarFavorito,
    mostrarNotificacionFavoritos
} from "./favoritos.js";

import {
    obtenerDetallesPelicula
} from "../api_services/tmdb.js";

import {
    mostrarGaleriaFotogramas
} from "./fotogramas.js";

import {
    mostrarMapaProduccion
} from "./mapa.js";


/* =========================
   ESTADO DE LA FICHA
========================= */

let scrollAnterior = 0;

const movieModal =
    document.getElementById("movieDetail");

const movieDetailClose =
    document.getElementById("movieDetailClose");


/* =========================
   CAPA EXTERIOR DE LA FICHA
========================= */

let movieDetailOverlay = null;
let movieDetailBackdrop = null;

function prepararCapaFicha() {
    if (!movieModal) return;

    // Evitar crear la capa más de una vez
    if (movieDetailOverlay) return;

    movieDetailOverlay = document.createElement("div");
    movieDetailOverlay.className = "movie-detail-overlay";

    movieDetailBackdrop = document.createElement("div");
    movieDetailBackdrop.className = "movie-detail-backdrop";

    movieDetailBackdrop.setAttribute("aria-hidden", "true");

    movieDetailOverlay.appendChild(movieDetailBackdrop);

    document.body.appendChild(movieDetailOverlay);
    movieDetailOverlay.appendChild(movieModal);

    // Cerrar al pulsar el fondo
    movieDetailBackdrop.addEventListener(
        "click",
        cerrarFicha
    );

    movieDetailOverlay.addEventListener("click", (event) => {
        if (event.target === movieDetailOverlay) {
            cerrarFicha();
        }
    });
}

// Preparar la capa al cargar el módulo
prepararCapaFicha();



/* =========================
   FICHA TÉCNICA
========================= */

export async function abrirFicha(id) {
    if (!movieModal) {
        console.error(
            'No se encuentra el elemento HTML "#movieDetail".'
        );
        return;
    }

    prepararCapaFicha();

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

    const movieDetailReadMore =
        document.getElementById("movieDetailReadMore");

    const movieDetailExtra =
        document.getElementById("movieDetailExtra");

    const movieDetailTrailer =
        document.getElementById("movieDetailTrailer");


    /* =========================
       FAVORITOS · CORAZÓN
    ========================= */

    function actualizarCorazon() {
        if (!movieDetailFavorite) return;

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

    if (movieDetailFavorite) {
        movieDetailFavorite.onclick = () => {
            const seHaAñadido = alternarFavorito(id);

            actualizarCorazon();

            // Notificar únicamente cuando se añade
            if (seHaAñadido) {
                mostrarNotificacionFavoritos();
            }
        };
    }


    /* =========================
       ABRIR LA FICHA
    ========================= */

    if (!movieModal.classList.contains("is-open")) {
        scrollAnterior = window.scrollY;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollAnterior}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
    }

    movieDetailOverlay?.classList.add("is-open");
    movieModal.classList.add("is-open");

    movieModal.setAttribute("aria-hidden", "false");


    /* =========================
       CARGAR INFORMACIÓN
    ========================= */

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

    mostrarMapaProduccion(
        detalle.production_countries ?? []
    );

        // La galería gestiona la imagen principal y sus controles.
// Así evitamos que dos funciones compitan por el mismo src.
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
           INFORMACIÓN DE LA PELÍCULA
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


        /* =========================
           SINOPSIS · LEER MÁS
        ========================= */

        if (movieDetailOverview) {
            movieDetailOverview.textContent =
                detalle.overview ||
                "No hay descripción disponible.";

            movieDetailOverview.classList.remove("is-expanded");

            if (movieDetailReadMore) {
                movieDetailReadMore.hidden = true;
                movieDetailReadMore.textContent = "Leer más ↓";

                movieDetailReadMore.setAttribute(
                    "aria-expanded",
                    "false"
                );

                requestAnimationFrame(() => {
                    const necesitaDesplegar =
                        movieDetailOverview.scrollHeight >
                        movieDetailOverview.clientHeight + 1;

                    movieDetailReadMore.hidden =
                        !necesitaDesplegar;
                });

                movieDetailReadMore.onclick = () => {
                    const expandida =
                        movieDetailOverview.classList.toggle(
                            "is-expanded"
                        );

                    movieDetailReadMore.textContent =
                        expandida
                            ? "Leer menos ↑"
                            : "Leer más ↓";

                    movieDetailReadMore.setAttribute(
                        "aria-expanded",
                        String(expandida)
                    );
                };
            }
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

function cerrarFicha() {
    if (!movieModal?.classList.contains("is-open")) {
        return;
    }

    // Cerrar los desplegables del mapa y del tráiler.
    document.querySelector(".movie-map-disclosure")?.removeAttribute("open");
    document.querySelector(".movie-trailer-disclosure")?.removeAttribute("open");

    const posicionGuardada = scrollAnterior;

    movieDetailClose?.blur();

    movieModal.classList.remove("is-open");
    movieModal.setAttribute("aria-hidden", "true");

    movieDetailOverlay?.classList.remove("is-open");

    // Restaurar los estilos originales del body.
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    // Restaurar la posición de scroll.
    document.documentElement.style.scrollBehavior = "auto";

    requestAnimationFrame(() => {
        window.scrollTo(0, posicionGuardada);

        requestAnimationFrame(() => {
            document.documentElement.style.scrollBehavior = "";
        });
    });
}




/* =========================
   EVENTOS DE CIERRE
========================= */

// Cerrar con la X
movieDetailClose?.addEventListener(
    "click",
    cerrarFicha
);

// Cerrar con Escape
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        movieModal?.classList.contains("is-open")
    ) {
        cerrarFicha();
    }
});

