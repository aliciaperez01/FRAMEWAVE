
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

    const imagenes = Array.isArray(fotogramas)
        ? fotogramas.filter(imagen => imagen?.file_path)
        : [];

    // En escritorio, priorizar el fotograma horizontal
    // con mayor resolución para la cabecera de la ficha.
    const escritorio = window.matchMedia(
        "(min-width: 1024px)"
    ).matches;

    let galeria = [...imagenes];

    if (escritorio) {
        const horizontales = galeria
            .filter(imagen => {
                const ancho = Number(imagen.width ?? 0);
                const alto = Number(imagen.height ?? 0);

                return (
                    ancho > 0 &&
                    alto > 0 &&
                    ancho / alto >= 1.5
                );
            })
            .sort((a, b) => {
                const resolucionA =
                    Number(a.width) * Number(a.height);

                const resolucionB =
                    Number(b.width) * Number(b.height);

                return resolucionB - resolucionA;
            });

        if (horizontales.length) {
            const primera = horizontales[0];

            galeria = [
                primera,
                ...galeria.filter(
                    imagen => imagen.file_path !== primera.file_path
                )
            ];
        }
    }

    // Si no hay fotogramas, recurrir al fondo de TMDB.
    if (!galeria.length && detalle?.backdrop_path) {
        galeria = [{
            file_path: detalle.backdrop_path
        }];
    }

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

        // Resolución adecuada para el marco de la ficha.
        const resolucion = escritorio ? "w1280" : "original";

        movieDetailPoster.removeAttribute("srcset");
        movieDetailPoster.removeAttribute("sizes");

        movieDetailPoster.src =
            `https://image.tmdb.org/t/p/${resolucion}${fotograma.file_path}`;

        movieDetailPoster.alt =
            `Fotograma ${indiceFotograma + 1} de ${
                detalle?.title || detalle?.name || "la película"
            }`;

        galleryCounter.textContent =
            `${indiceFotograma + 1} / ${galeria.length}`;

        const mostrarFlechas = galeria.length > 1;

        galleryPrev.hidden = !mostrarFlechas;
        galleryNext.hidden = !mostrarFlechas;
        galleryCounter.hidden = !mostrarFlechas;
    }

    galleryPrev.onclick = () => {
        if (!galeria.length) return;

        indiceFotograma =
            (indiceFotograma - 1 + galeria.length) % galeria.length;

        mostrarFotograma();
    };

    galleryNext.onclick = () => {
        if (!galeria.length) return;

        indiceFotograma =
            (indiceFotograma + 1) % galeria.length;

        mostrarFotograma();
    };

    mostrarFotograma();
}
