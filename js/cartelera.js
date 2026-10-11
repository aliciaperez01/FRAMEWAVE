

import Pelicula from "../modelos/modelo.js";
import {
    pedirTMDB,
    establecerIdiomaTMDB
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
const idsPeliculas = new Map();

let idiomaActual =
    localStorage.getItem("framewaveIdioma") === "en"
        ? "en"
        : "es";

establecerIdiomaTMDB(idiomaActual);
document.documentElement.lang = idiomaActual;

/* =========================
   BUSCAR UNA PELÍCULA
========================= */

async function buscarPelicula(titulo) {
    const { results } = await pedirTMDB(
        "/search/movie",
        { query: titulo }
    );

    return results[0] ?? null;
}


/* =========================
   FILTRAR POR GÉNERO
========================= */

let generoActivo = "all";

function normalizarGenero(genero) {
    return genero
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

const equivalenciasGeneros = {
    "Terror": ["terror", "horror"],
    "Thriller": ["thriller", "suspense"]
};

function mostrarPeliculas(rejilla) {
    const peliculasFiltradas =
        generoActivo === "all"
            ? peliculasCargadas
            : peliculasCargadas.filter((pelicula) => {
                const generosBuscados =
                    equivalenciasGeneros[generoActivo] ??
                    [normalizarGenero(generoActivo)];

                return pelicula.generos.some((genero) =>
                    generosBuscados.includes(
                        normalizarGenero(genero)
                    )
                );
            });

    rejilla.replaceChildren();

    peliculasFiltradas.forEach((pelicula, indice) => {
        const card = pelicula.toCard();

        card.style.setProperty("--i", indice);

        rejilla.append(card);
    });
}



function prepararFiltrosGenero(rejilla) {
    const filtros = document.querySelector("#genreFilters");
    const desplegable = document.querySelector("#genreFilterDropdown");
    const botonToggle = document.querySelector("#genreFilterToggle");
    const etiqueta = document.querySelector("#genreFilterLabel");

    if (!filtros || !desplegable || !botonToggle || !etiqueta) return;

    const cerrarDesplegable = () => {
        filtros.hidden = true;
        botonToggle.setAttribute("aria-expanded", "false");
        desplegable.classList.remove("is-open");
    };

    botonToggle.onclick = () => {
        const abierto = !filtros.hidden;

        filtros.hidden = abierto;
        botonToggle.setAttribute("aria-expanded", String(!abierto));
        desplegable.classList.toggle("is-open", !abierto);
    };

    filtros.onclick = (event) => {
        if (!(event.target instanceof Element)) return;

        const boton = event.target.closest(".genre-filter");

        if (!boton) return;

        generoActivo = boton.dataset.genre;

        filtros.querySelectorAll(".genre-filter").forEach((filtro) => {
            const seleccionado = filtro === boton;

            filtro.classList.toggle("is-active", seleccionado);
            filtro.setAttribute("aria-pressed", String(seleccionado));
        });

        etiqueta.textContent = generoActivo === "all"
            ? "Filtrar por género"
            : `Género: ${boton.textContent.trim()}`;

        cerrarDesplegable();
        mostrarPeliculas(rejilla);

        rejilla.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    };

    document.addEventListener("click", (event) => {
        if (
            event.target instanceof Node &&
            !desplegable.contains(event.target)
        ) {
            cerrarDesplegable();
        }
    });
}



/* =========================
   BOTÓN VER TODO
========================= */

function prepararBotonVerTodo(rejilla) {
    const barra = document.querySelector(".movies-toolbar");

    if (!barra) {
        console.error("No se encuentra .movies-toolbar en el HTML.");
        return;
    }

    let boton = document.querySelector("#verTodasPeliculas");

    if (!boton) {
        boton = document.createElement("button");

        boton.id = "verTodasPeliculas";
        boton.className = "view-all-button";
        boton.type = "button";
    }

    barra.append(boton);

    actualizarTextoBoton(boton, rejilla);

    boton.onclick = () => {
        const vistaCompleta =
            rejilla.classList.toggle("ver-todas");

        boton.setAttribute(
            "aria-expanded",
            String(vistaCompleta)
        );

        actualizarTextoBoton(boton, rejilla);

        rejilla.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    };

    return boton;
}


/* =========================
   ACTUALIZAR TEXTO DEL BOTÓN
========================= */

function actualizarTextoBoton(boton, rejilla) {
    const vistaCompleta =
        rejilla.classList.contains("ver-todas");

    boton.textContent = vistaCompleta
        ? idiomaActual === "en"
            ? "Back to carousel"
            : "Volver al carrusel"
        : idiomaActual === "en"
            ? "View all"
            : "Ver todo";

    boton.setAttribute(
        "aria-expanded",
        String(vistaCompleta)
    );
}

/* =========================
   CARGAR CARTELERA
========================= */

async function iniciarCartelera() {
    const rejilla = document.querySelector("#rejilla");

    if (!rejilla) return;

    prepararBotonVerTodo(rejilla);
    prepararFiltrosGenero(rejilla);

    rejilla.replaceChildren();
    peliculasCargadas.length = 0;

    try {
        for (const titulo of peliculasFrameWave) {
            let resultado;

            const idGuardado = idsPeliculas.get(titulo);

            if (idGuardado) {
                resultado = await pedirTMDB(
                    `/movie/${idGuardado}`
                );
            } else {
                resultado = await buscarPelicula(titulo);

                if (!resultado) continue;

                idsPeliculas.set(titulo, resultado.id);

                resultado = await pedirTMDB(
                    `/movie/${resultado.id}`
                );
            }

            const pelicula = Pelicula.desdeTMDB(resultado);

            peliculasCargadas.push(pelicula);
        }

        mostrarPeliculas(rejilla);
        actualizarFavoritas();

    } catch (error) {
        console.error(
            "Error cargando la cartelera:",
            error
        );

        rejilla.textContent =
            idiomaActual === "en"
                ? "The movie collection could not be loaded."
                : "No se ha podido cargar la cartelera.";
    }
}

/* =========================
   ACTUALIZAR FAVORITAS
========================= */

function actualizarFavoritas() {
    const favoritesGrid =
        document.querySelector("#favoritesGrid");

    const rejilla =
        document.querySelector("#rejilla");

    if (!favoritesGrid || !rejilla) return;

    const favoritosGuardados = obtenerFavoritos();

    favoritesGrid.replaceChildren();

    peliculasCargadas.forEach((pelicula) => {
        if (
            favoritosGuardados.includes(
                String(pelicula.id)
            )
        ) {
            favoritesGrid.append(pelicula.toCard());
        }
    });

    document.querySelectorAll(
        "#rejilla .card, #favoritesGrid .card"
    ).forEach((card) => {
        const pelicula = peliculasCargadas.find(
            (p) => String(p.id) === card.dataset.id
        );

        const boton =
            card.querySelector(".favorite-button");

        if (pelicula && boton) {
            Pelicula.pintarFavorito(
                boton,
                pelicula.titulo,
                favoritosGuardados.includes(
                    String(pelicula.id)
                )
            );
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

function gestionarAperturaFicha(event) {
        if (!(event.target instanceof Element)) return;

        const card = event.target.closest(".card");

        if (!card) return;

        // El botón de favoritos mantiene su propio comportamiento
        if (event.target.closest(".favorite-button")) {
            return;
        }

        const id = card.dataset.id;

        if (!id) {
            console.error("La tarjeta no tiene data-id.");
            return;
        }

        abrirFicha(id).catch((error) => {
            console.error("Fallo al ejecutar abrirFicha:", error);
        });
    }

            // Abrir con ratón o pantalla táctil
            document.addEventListener("click", gestionarAperturaFicha);

            // Abrir con Enter o barra espaciadora
            document.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;

        if (!(event.target instanceof Element)) return;

        const card = event.target.closest(".card");

        if (!card) return;

        // No interferir con botones ni otros controles
        if (
            event.target.closest(
                "button, a, input, textarea, select, [contenteditable='true']"
            )
        ) {
            return;
        }

        event.preventDefault();
        gestionarAperturaFicha(event);
    });

/* =========================
   INICIAR FRAMEWAVE
========================= */

iniciarInterfaz({
    peliculasFrameWave,
    buscarPelicula,
    abrirFicha,

    cambiarIdioma: async (idioma) => {
        idiomaActual = idioma;

        establecerIdiomaTMDB(idiomaActual);

        localStorage.setItem(
            "framewaveIdioma",
            idiomaActual
        );

        document.documentElement.lang = idiomaActual;

        await iniciarCartelera();
    }
});

iniciarAnimaciones();

iniciarCartelera();