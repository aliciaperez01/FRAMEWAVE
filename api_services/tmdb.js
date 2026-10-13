
import { API_KEY } from "./api.js";

const BASE_URL = "https://api.themoviedb.org/3";

let idiomaTMDB = "es-ES";


/* =========================
   PETICIONES A TMDB
========================= */

export async function pedirTMDB(ruta, parametros = {}) {
    const url = new URL(`${BASE_URL}${ruta}`);

    url.search = new URLSearchParams({
        api_key: API_KEY,
        language: idiomaTMDB,
        ...parametros
    });

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`TMDB ${ruta}: error ${res.status}`);
    }

    return res.json();
}

/* =========================
   DATOS DE LA FICHA
========================= */

export async function obtenerDetallesPelicula(id) {
    const detalle = await pedirTMDB(`/movie/${id}`, {
        append_to_response: "videos,credits,images",
        include_video_language: "es,en",
        include_image_language: "es,en,null"
    });

    const director = detalle.credits?.crew
        .find(persona => persona.job === "Director")?.name
        ?? (
            idiomaTMDB === "en"
                ? "Director unavailable"
                : "Director no disponible"
        );

    return {
        detalle,
        videos: detalle.videos?.results ?? [],
        director,
        fotogramas: detalle.images?.backdrops ?? []
    };
}