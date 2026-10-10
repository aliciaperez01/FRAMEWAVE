

import { API_KEY } from "./api.js";
import Pelicula from "../modelos/modelo.js";

const BASE_URL = "https://api.themoviedb.org/3";

export async function pedirTMBD(url, extra = "") {
    const rutaURL =
        `${BASE_URL}${url}?api_key=${API_KEY}&language=es-ES${extra}`;

    const res = await fetch(rutaURL);

    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    return res.json();
}

export async function buscarPeliculas(texto) {
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

export async function obtenerDetallesPelicula(id) {
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
        console.warn(
            "No se pudieron cargar los fotogramas:",
            error
        );
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
   FOTOGRAMAS
========================= */

export async function buscarFotogramasPelicula(id) {
    const data = await pedirTMBD(
        `/movie/${id}/images`,
        "&include_image_language=es,null"
    );

    return data.backdrops?.[0] ?? null;
}