/* =========================
   FICHA TÉCNICA
========================= */

async function abrirFicha(id) {
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
            document.getElementById("movieModal");

        const movieDetailTitle =
            document.getElementById("movieDetailTitle");

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
           INFORMACIÓN DE LA PELÍCULA
        ========================= */

        movieDetailTitle.textContent =
            detalle.title;

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

document.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (!card) return;

    const id = card.dataset.id;

    if (id) {
        abrirFicha(id);
    }
});



//CERRAR FICHA

const movieModal = document.getElementById("movieModal");
const movieDetailClose = document.getElementById("movieDetailClose");

movieDetailClose.addEventListener("click", () => {
    movieModal.classList.remove("is-open");
    movieModal.setAttribute("aria-hidden", "true");
});

const movieModalBackdrop = document.querySelector(".movie-modal-backdrop");

movieModalBackdrop.addEventListener("click", () => {
    movieModal.classList.remove("is-open");
    movieModal.setAttribute("aria-hidden", "true");
});