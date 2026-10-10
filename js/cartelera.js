


import Pelicula from "../modelos/modelo.js";
import {
    pedirTMBD
} from "../api_services/tmdb.js";
import { abrirFicha } from "./ficha.js";
import { iniciarInterfaz } from "./script.js";
import { iniciarAnimaciones } from "./animaciones.js";
import { obtenerFavoritos } from "./favoritos.js";

/* =========================
   PELÍCULAS FRAMEWAVE
========================= */

const peliculasFrameWave = [
    "La favorita",
    "Fallen Angels",
    "Frankenstein",
    "Enter the Void",
    "Holy Motors",
    "Mulholland Drive",
    "Gummo",
    "The Substance",
    "Déjame entrar",
    "The Love Witch",
    "Poor Things",
    "A Scanner Darkly",
    "Waking Life",
    "La Belle Verte",
    "The Neon Demon",
    "The Lobster",
    "Being John Malkovich",
    "Byzantium",
    "La hermanastra fea",
    "Gaua",
    "Mārama",
    "The VVitch",
    "Breathing In",
    "La acompañante",
    "Solo los amantes sobreviven",
    "El laberinto del fauno",
    "La forma del agua",
    "Crimson Peak",
    "Air Doll",
    "Don't Worry Darling",
    "La cura del bienestar",
    "Lost in Translation"
];

const peliculasCargadas = [];

/* =========================
   BUSCAR UNA PELÍCULA
========================= */

async function buscarPelicula(titulo) {
    const { results } = await pedirTMBD(
        "/search/movie",
        `&query=${encodeURIComponent(titulo)}`
    );

    return results[0] ?? null;
}

/* =========================
   CARGAR CARTELERA
========================= */

async function iniciarCartelera() {
    const rejilla = document.querySelector("#rejilla");

    if (!rejilla) return;

    try {
        for (const titulo of peliculasFrameWave) {
            const resultado = await buscarPelicula(titulo);

            if (!resultado) continue;

            const pelicula = Pelicula.desdeTMDB(resultado);

            peliculasCargadas.push(pelicula);

            const card = pelicula.toCard();

            card.style.setProperty(
                "--i",
                rejilla.children.length
            );

            rejilla.append(card);
        }

        actualizarFavoritas();

    } catch (error) {
        console.error("Error cargando la cartelera:", error);
        rejilla.textContent = "No se ha podido cargar la cartelera.";
    }
}

/* =========================
   ACTUALIZAR FAVORITAS
========================= */

function actualizarFavoritas() {
    const favoritesGrid =
        document.querySelector("#favoritesGrid");

    if (!favoritesGrid) return;

    const favoritosGuardados = obtenerFavoritos();

    favoritesGrid.replaceChildren();

    peliculasCargadas.forEach((pelicula) => {
        if (favoritosGuardados.includes(String(pelicula.id))) {
            favoritesGrid.append(pelicula.toCard());
        }
    });
}

window.addEventListener(
    "framewaveFavoritasActualizadas",
    actualizarFavoritas
);

/* =========================
   ABRIR FICHA AL PULSAR TARJETA
========================= */

document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest(".card");

    if (!card || event.target.closest(".favorite-button")) return;

    const id = card.dataset.id;

    if (id) {
        abrirFicha(id);
    }
});

/* =========================
   INICIAR FRAMEWAVE
========================= */

iniciarInterfaz({
    peliculasFrameWave,
    buscarPelicula,
    abrirFicha
});

iniciarAnimaciones();

iniciarCartelera();