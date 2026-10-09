const BASE_URL = "https://api.themoviedb.org/3";

async function pedirTMBD(url, extra = "") {

    const rutaURL =
        `${BASE_URL}${url}?api_key=${API_KEY}&language=es-ES${extra}`;

    const res =
        await fetch(rutaURL);

    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    return res.json();
}

async function buscarPeliculas(texto) {
    const { results } = await pedirTMBD(
        "/search/movie",
        `&query=${encodeURIComponent(texto)}`
    );

    return {
        pelis: results.map(json => Pelicula.desdeTMDB(json))
    };
}





/* =========================
   DATOS DE LA FICHA
========================= */

async function obtenerDetallesPelicula(id) {

    const [detalle, videos, creditos] = await Promise.all([

        pedirTMBD(`/movie/${id}`),

        pedirTMBD(`/movie/${id}/videos`),

        pedirTMBD(`/movie/${id}/credits`)

    ]);

    let fotogramas = [];

    try {
        const imagenes = await pedirTMBD(
            `/movie/${id}/images`,
            "&include_image_language=es,en,null"
        );

        fotogramas = imagenes.backdrops ?? [];

    } catch (error) {
        console.warn("No se pudieron cargar los fotogramas:", error);
    }

    const director =
        creditos.crew.find(
            persona => persona.job === "Director"
        )?.name ?? "Director no disponible";

    return {
        detalle,
        videos: videos.results ?? [],
        director,
        fotogramas
    };
}




/* =========================
   DETALLES PELICULAS
========================= */

async function obtenerDetallesPelicula(id) {

    const [detalle, videos, creditos] = await Promise.all([
        pedirTMBD(`/movie/${id}`),
        pedirTMBD(`/movie/${id}/videos`),
        pedirTMBD(`/movie/${id}/credits`)
    ]);

    const director =
        creditos.crew.find(
            persona => persona.job === "Director"
        )?.name ?? "Director no disponible";

    let fotogramas = [];

    try {

        const imagenes = await pedirTMBD(
            `/movie/${id}/images`,
            "&include_image_language=es,en,null"
        );

        fotogramas = imagenes.backdrops ?? [];

    } catch (error) {

        console.warn(
            "No se pudieron cargar los fotogramas:",
            error
        );

    }

    return {
        detalle,
        videos: videos.results ?? [],
        director,
        fotogramas
    };
}



/* =========================
   FOTOGRAMAS
========================= */

async function buscarFotogramasPelicula(id) {

    const data =
        await pedirTMBD(
            `/movie/${id}/images`,
            "&include_image_language=es,null"
        );

    if (
        data.backdrops &&
        data.backdrops.length > 0
    ) {
        return data.backdrops[0];
    }

    return null;
}

