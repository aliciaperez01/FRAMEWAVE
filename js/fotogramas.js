
/* =========================
   GALERÍA DE FOTOGRAMAS
========================= */


function mostrarGaleriaFotogramas(fotogramas, detalle) {



    const movieDetailPoster =
        document.getElementById("movieDetailPoster");

    const galleryPrev =
        document.getElementById("galleryPrev");

    const galleryNext =
        document.getElementById("galleryNext");

    const galleryCounter =
        document.getElementById("galleryCounter");


    const galeria = fotogramas?.length
        ? fotogramas
        : detalle.backdrop_path
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

        movieDetailPoster.src =
            `https://image.tmdb.org/t/p/w780${fotograma.file_path}`;

        movieDetailPoster.alt =
            `Fotograma ${indiceFotograma + 1} de ${detalle.title}`;

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