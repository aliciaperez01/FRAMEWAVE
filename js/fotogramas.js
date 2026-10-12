

/* ========================= 
    GALERÍA DE FOTOGRAMAS 
========================= */

export function mostrarGaleriaFotogramas(fotogramas, detalle) {
    const movieDetailPoster =
        document.getElementById("movieDetailPoster");

    const galleryPrev =
        document.getElementById("galleryPrev");

    const galleryNext =
        document.getElementById("galleryNext");

    const galleryCounter =
        document.getElementById("galleryCounter");

    // Comprobar que los elementos de la galería existen.
    if (
        !movieDetailPoster ||
        !galleryPrev ||
        !galleryNext ||
        !galleryCounter
    ) {
        console.error(
            "No se encuentran todos los elementos de la galería de fotogramas."
        );
        return;
    }

    // Utilizar los fotogramas disponibles.
    // Si no hay ninguno, recurrir a la imagen de fondo de TMDB.
    const galeria = fotogramas?.length
        ? fotogramas.filter(fotograma => fotograma.file_path)
        : detalle?.backdrop_path
            ? [{ file_path: detalle.backdrop_path }]
            : [];

    let indiceFotograma = 0;

    function mostrarFotograma() {
        if (!galeria.length) {
            movieDetailPoster.removeAttribute("src");
            movieDetailPoster.alt = "";

            galleryPrev.hidden = true;
            galleryNext.hidden = true;
            galleryCounter.hidden = true;

            return;
        }

        const fotograma = galeria[indiceFotograma];

        // Recuperar la imagen panorámica.
        movieDetailPoster.src =
            `https://image.tmdb.org/t/p/original${fotograma.file_path}`;

        movieDetailPoster.alt =
            `Fotograma ${indiceFotograma + 1} de ${
                detalle.title || detalle.name || "la película"
            }`;

        // Actualizar el contador.
        galleryCounter.textContent =
            `${indiceFotograma + 1} / ${galeria.length}`;

        // Las flechas y el contador solo aparecen
        // cuando hay más de un fotograma.
        const mostrarFlechas = galeria.length > 1;

        galleryPrev.hidden = !mostrarFlechas;
        galleryNext.hidden = !mostrarFlechas;
        galleryCounter.hidden = !mostrarFlechas;
    }

    // Fotograma anterior.
    galleryPrev.onclick = () => {
        if (!galeria.length) return;

        indiceFotograma =
            (indiceFotograma - 1 + galeria.length) % galeria.length;

        mostrarFotograma();
    };

    // Fotograma siguiente.
    galleryNext.onclick = () => {
        if (!galeria.length) return;

        indiceFotograma =
            (indiceFotograma + 1) % galeria.length;

        mostrarFotograma();
    };

    // Mostrar el primer fotograma al abrir la ficha.
    mostrarFotograma();
}

