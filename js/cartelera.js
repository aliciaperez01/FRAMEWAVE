

import Pelicula from "../modelos/modelo.js";
import { pedirTMDB } from "../api_services/tmdb.js";
import { obtenerFavoritos } from "./storage.js";
import { abrirFicha } from "./ficha.js";
import { iniciarInterfaz } from "./script.js";
import { iniciarAnimaciones } from "./animaciones.js";


/* =========================
   SELECCIÓN FRAMEWAVE
   Orden cromático de carteles
========================= */

export const peliculasFrameWave = 

[
    "La acompañante",
    "The Neon Demon",
    "The Love Witch",
    "La hermanastra fea",
    "Poor Things",
    "Black Swan",
    "The Substance",
    "Byzantium",
    "Crimson Peak",
    "Solo los amantes sobreviven",
    "Abierto Hasta El Amanecer",
    "The Lure",
    "El Quinto Elemento",
    "Big Fish",
    "El Imaginario del Doctor Parnassus",
    "Don't Worry Darling",
    "La favorita",
    "La cura del bienestar",
    "El laberinto del fauno",
    "Gummo",
    "Trainspotting",
    "Athena",
    "Being John Malkovich",
    "Holy Motors",
    "Gaua",
    "La forma del agua",
    "El Atlas de las Nubes",
    "La Belle Verte",
    "The Lobster",
    "Breathing In",
    "Mārama",
    "The VVitch",
    "Waking Life",
    "A Scanner Darkly",
    "Lost in Translation",
    "Fallen Angels",
    "Mulholland Drive",
    "Enter the Void",
    "Air Doll",
    "Under The Skin",
]

/* =========================
   ESTADO DE LA CARTELERA
========================= */

export const peliculasCargadas = [];

/* IDs oficiales de los géneros de TMDB */

const GENEROS_TMDB = {
    "Drama": 18,
    "Terror": 27,
    "Comedia": 35,
    "Romance": 10749,
    "Thriller": 53,
    "Misterio": 9648,
    "Animación": 16,
    "Crimen": 80
};

/* =========================
   BUSCAR EN TMDB
========================= */

export async function buscarPelicula(titulo) {
    const respuesta = await pedirTMDB(
        "/search/movie",
        { query: titulo }
    );

    return respuesta.results?.[0] ?? null;
}


/* =========================
   GÉNEROS · VENTANA EDITORIAL
========================= */

function iniciarPeliculasGeneros() {
    const esfera = document.querySelector(".genres-list");

    if (!esfera) return;

    

    const clasificacionEditorial = {
        "Ciencia ficción": {
            descripcion:
                "Realidades alteradas, futuros inciertos y preguntas sobre lo que significa ser humano.",
            peliculas: [
                "The Substance",
                "A Scanner Darkly",
                "El Atlas de las Nubes",
                "Under The Skin",
                "El Quinto Elemento"
            ]
        },

        "Fantástico": {
            descripcion:
                "Mundos imposibles, criaturas extraordinarias y una realidad que se transforma ante nuestros ojos.",
            peliculas: [
                "Poor Things",
                "El laberinto del fauno",
                "La forma del agua",
                "El Imaginario del Doctor Parnassus",
                "Big Fish"
            ]
        },

        "Horror": {
            descripcion:
                "Lo que permanece oculto, lo que se transforma y aquello que nunca llegamos a comprender del todo.",
            peliculas: [
                "The VVitch",
                "La cura del bienestar",
                "Crimson Peak",
                "Mārama",
                "Abierto Hasta El Amanecer"
            ]
        },

        "Drama psicológico": {
            descripcion:
                "Identidades fragmentadas, obsesiones y personajes que habitan territorios inciertos de la mente.",
            peliculas: [
                "Mulholland Drive",
                "La favorita",
                "Black Swan",
                "Lost in Translation",
                "Trainspotting"
            ]
        },

        "Fantasía oscura": {
            descripcion:
                "Cuentos retorcidos, belleza inquietante y universos donde lo maravilloso también puede ser terrible.",
            peliculas: [
                "La hermanastra fea",
                "Gaua",
                "The Love Witch",
                "Byzantium",
                "The Lure"
            ]
        },

        "Surrealismo": {
            descripcion:
                "Sueños, símbolos y narrativas que rompen las reglas de la lógica para explorar otras formas de percibir el mundo.",
            peliculas: [
                "Holy Motors",
                "Waking Life",
                "Being John Malkovich",
                "La Belle Verte",
                "Enter the Void"
            ]
        },

        "Romance": {
            descripcion:
                "Amores insólitos, encuentros fugaces y relaciones que escapan de las convenciones románticas.",
            peliculas: [
                "Solo los amantes sobreviven",
                "Fallen Angels",
                "Air Doll",
                "The Neon Demon",
                "The Lobster"
            ]
        },

        "Experimental": {
            descripcion:
                "Cine que juega con la forma, el ritmo y las imágenes para descubrir maneras diferentes de contar historias.",
            peliculas: [
                "Gummo",
                "Breathing In",
                "La acompañante",
                "Don't Worry Darling",
                "Athena"
            ]
        }
    };
    

    /* Crear la ventana una sola vez */

    let ventana = document.querySelector("#genreWindow");

    if (!ventana) {
        ventana = document.createElement("div");
        ventana.id = "genreWindow";
        ventana.className = "genre-window";
        ventana.hidden = true;

        ventana.innerHTML = `
            <section
                class="genre-window-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="genreWindowTitle"
                aria-describedby="genreWindowDescription"
                tabindex="-1"
            >
                <button
                    class="genre-window-close"
                    type="button"
                    aria-label="Cerrar ventana de género"
                >×</button>

                <div class="genre-window-heading">
                    <span class="genre-window-kicker">
                        EXPLORAR EL UNIVERSO
                    </span>

                    <h2 id="genreWindowTitle"></h2>

                    <p id="genreWindowDescription"></p>
                </div>

                <div
                    id="genreWindowPosters"
                    class="genre-window-posters"
                    aria-label="Películas de este género"
                ></div>
            </section>
        `;

        document.body.append(ventana);
    }

    const panel = ventana.querySelector(".genre-window-panel");
    const titulo = ventana.querySelector("#genreWindowTitle");
    const descripcion = ventana.querySelector(
        "#genreWindowDescription"
    );
    const carteles = ventana.querySelector("#genreWindowPosters");
    const botonCerrar = ventana.querySelector(".genre-window-close");

    let enlaceActivo = null;

    function cerrarVentana(devolverFoco = true) {
        ventana.hidden = true;
        document.body.classList.remove("genre-window-open");

        if (enlaceActivo) {
            enlaceActivo.classList.remove("is-selected");
            enlaceActivo.setAttribute("aria-pressed", "false");
        }

        const ultimoEnlace = enlaceActivo;
        enlaceActivo = null;

        if (devolverFoco && ultimoEnlace) {
            ultimoEnlace.focus();
        }
    }

    function mostrarGenero(genero, enlace) {
        const contenido = clasificacionEditorial[genero];

        if (!contenido) return;

        const peliculas = contenido.peliculas
            .map(nombre =>
                peliculasCargadas.find(
                    pelicula =>
                        pelicula.tituloFrameWave === nombre
                )
            )
            .filter(Boolean);

        if (peliculas.length === 0) return;

        if (enlaceActivo) {
            enlaceActivo.classList.remove("is-selected");
            enlaceActivo.setAttribute("aria-pressed", "false");
        }

        enlaceActivo = enlace;
        enlaceActivo.classList.add("is-selected");
        enlaceActivo.setAttribute("aria-pressed", "true");

        titulo.textContent = genero;
        descripcion.textContent = contenido.descripcion;
        carteles.replaceChildren();

        peliculas.forEach((pelicula, indice) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "genre-window-poster";
            boton.dataset.id = String(pelicula.id);
            boton.style.setProperty("--poster-index", indice);
            boton.setAttribute(
                "aria-label",
                `Abrir ficha de ${pelicula.titulo}`
            );

            const imagen = document.createElement("img");
            imagen.src = pelicula.posterUrl;
            imagen.alt = pelicula.titulo;
            imagen.loading = "lazy";

            const nombre = document.createElement("span");
            nombre.className = "genre-window-poster-title";
            nombre.textContent = pelicula.titulo;

            boton.append(imagen, nombre);

            boton.addEventListener("click", () => {
                const id = pelicula.id;

                cerrarVentana(false);
                abrirFicha(id);
            });

            carteles.append(boton);
        });

        ventana.hidden = false;
        document.body.classList.add("genre-window-open");

        requestAnimationFrame(() => {
            panel.focus({ preventScroll: true });
        });
    }

    /* Seleccionar un género */

    esfera.querySelectorAll("a[data-genre]").forEach(enlace => {
        enlace.setAttribute("aria-pressed", "false");

        enlace.addEventListener("click", event => {
            event.preventDefault();

            const genero = enlace.dataset.genre;

            if (enlaceActivo === enlace && !ventana.hidden) {
                cerrarVentana();
                return;
            }

            mostrarGenero(genero, enlace);
        });
    });

    /* Cerrar con el botón */

    botonCerrar.addEventListener("click", () => {
        cerrarVentana();
    });

    /* Cerrar al pulsar fuera del panel */

    ventana.addEventListener("click", event => {
        if (event.target === ventana) {
            cerrarVentana();
        }
    });

    /* Cerrar con Escape */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !ventana.hidden) {
            cerrarVentana();
        }
    });
}

/* =========================
   FILTRAR POR GÉNERO TMDB
========================= */

function iniciarFiltroGeneros() {
    const dropdown = document.querySelector("#genreFilterDropdown");
    const toggle = document.querySelector("#genreFilterToggle");
    const contenedor = document.querySelector("#genreFilters");
    const etiqueta = document.querySelector("#genreFilterLabel");
    const rejilla = document.querySelector("#rejilla");

    if (!dropdown || !toggle || !contenedor || !rejilla) {
        console.warn(
            "No se ha encontrado el HTML del filtro de géneros."
        );
        return;
    }

    const botones = [...contenedor.querySelectorAll(".genre-filter")];

    let generoSeleccionado = "all";

    function cerrarDesplegable() {
        contenedor.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    }

    function actualizarFiltro() {
        const idGenero = GENEROS_TMDB[generoSeleccionado];

        rejilla.querySelectorAll(".card").forEach(card => {
            const ids = (card.dataset.genreIds || "")
                .split(",")
                .filter(Boolean)
                .map(Number);

            const coincide =
                generoSeleccionado === "all" ||
                (
                    idGenero !== undefined &&
                    ids.includes(idGenero)
                );

            card.hidden = !coincide;
        });

        rejilla.scrollLeft = 0;

        requestAnimationFrame(() => {
            rejilla.dispatchEvent(new Event("scroll"));
        });
    }

    toggle.addEventListener("click", () => {
        const abrir = contenedor.hidden;

        contenedor.hidden = !abrir;
        toggle.setAttribute("aria-expanded", String(abrir));
    });

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            generoSeleccionado = boton.dataset.genre || "all";

            botones.forEach(otroBoton => {
                const activo = otroBoton === boton;

                otroBoton.classList.toggle("is-active", activo);
                otroBoton.setAttribute(
                    "aria-pressed",
                    String(activo)
                );
            });

            if (etiqueta) {
                etiqueta.textContent =
                    generoSeleccionado === "all"
                        ? "Filtrar por género"
                        : boton.textContent.trim();
            }

            actualizarFiltro();
            cerrarDesplegable();
        });
    });

    document.addEventListener("click", event => {
        if (!dropdown.contains(event.target)) {
            cerrarDesplegable();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            cerrarDesplegable();
            toggle.focus();
        }
    });

    return actualizarFiltro;
}



/* =========================
   GRÁFICA · GÉNEROS FAVORITOS
========================= */

let graficaGenerosFavoritas = null;
const nombresGenerosTMDB = new Map();


async function cargarGenerosParaGrafica() {
    try {
        const respuesta = await pedirTMDB("/genre/movie/list");

        console.log("Géneros recibidos:", respuesta.genres);

        respuesta.genres.forEach(genero => {
            nombresGenerosTMDB.set(genero.id, genero.name);
        });

        actualizarGraficaFavoritas();
    } catch (error) {
        console.error(
            "Error al cargar los géneros de la gráfica:",
            error
        );
    }
}



function actualizarGraficaFavoritas() {
    const canvas = document.querySelector("#favoritesGenreChart");
    const contenedor = document.querySelector(".favorites-chart-container");
    const mensajeVacio = document.querySelector("#favoritesChartEmpty");

    if (!canvas || !contenedor || !mensajeVacio) return;

    const idsFavoritos = obtenerFavoritos().map(String);

    const favoritas = peliculasCargadas.filter(pelicula =>
        idsFavoritos.includes(String(pelicula.id))
    );

    if (favoritas.length === 0) {
        contenedor.hidden = true;
        mensajeVacio.hidden = false;

        graficaGenerosFavoritas?.destroy();
        graficaGenerosFavoritas = null;

        return;
    }

    if (nombresGenerosTMDB.size === 0) return;

    const recuentoGeneros = new Map();

    favoritas.forEach(pelicula => {
        pelicula.generoIds.forEach(idGenero => {
            const nombre = nombresGenerosTMDB.get(idGenero);

            if (nombre) {
                recuentoGeneros.set(
                    nombre,
                    (recuentoGeneros.get(nombre) || 0) + 1
                );
            }
        });
    });

    const etiquetas = [...recuentoGeneros.keys()];
    const cantidades = [...recuentoGeneros.values()];

    mensajeVacio.hidden = true;
    contenedor.hidden = false;

  
    contenedor.style.height =
        `${Math.max(280, etiquetas.length * 36)}px`;

    if (!graficaGenerosFavoritas) {
        graficaGenerosFavoritas = new Chart(canvas, {
            type: "bar",

            data: {
                labels: etiquetas,

                datasets: [{
                    label: "Películas",
                    data: cantidades,

                    backgroundColor: [
                        "#718675",
                        "#A87596",
                        "#B89A5A",
                        "#8A91B5",
                        "#465B4B",
                        "#D5DED0",
                        "#986889",
                        "#80658F"
                    ],

                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 17,
                    maxBarThickness: 20
                }]
            },

            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: contexto =>
                                ` ${contexto.parsed.x} películas`
                        }
                    }
                },

                scales: {
                    x: {
                        beginAtZero: true,

                        ticks: {
                            precision: 0,
                            stepSize: 1
                        },

                        grid: {
                            color: "rgba(113, 134, 117, 0.15)"},

                        border: {display: false

                        }
                    },

                    y: {
                        grid: {display: false

                        },

                        border: {
                            display: false
                        },

                        ticks: {
                            padding: 12
                        }
                    }
                }
            }
        });

        return;
    }

    graficaGenerosFavoritas.data.labels = etiquetas;
    graficaGenerosFavoritas.data.datasets[0].data = cantidades;

    contenedor.style.height =
        `${Math.max(280, etiquetas.length * 36)}px`;

    graficaGenerosFavoritas.update(); 
} 


/* =========================
   ACTUALIZAR FAVORITAS
========================= */

let mostrarTodasLasFavoritas = false;

function ajustarFilasFavoritas() {
    const grid = document.querySelector("#favoritesGrid");
    const boton = document.querySelector("#favoritesToggle");

    if (!grid) return;

    const tarjetas = [...grid.querySelectorAll(".card")];

    tarjetas.forEach(tarjeta => {
        tarjeta.classList.remove("favorites-extra-row");
    });

    if (tarjetas.length > 0) {
        const primeraFila = tarjetas[0].offsetTop;

        tarjetas.forEach(tarjeta => {
            if (tarjeta.offsetTop > primeraFila) {
                tarjeta.classList.add("favorites-extra-row");
            }
        });
    }

    const hayMasFilas = tarjetas.some(tarjeta =>
        tarjeta.classList.contains("favorites-extra-row")
    );

    if (!hayMasFilas) {
        mostrarTodasLasFavoritas = false;
    }

    grid.classList.toggle("show-all", mostrarTodasLasFavoritas);

    if (boton) {
        boton.hidden = !hayMasFilas;

        boton.textContent = mostrarTodasLasFavoritas
            ? "Mostrar menos"
            : "Ver todas las favoritas";

        boton.setAttribute(
            "aria-expanded",
            String(mostrarTodasLasFavoritas)
        );
    }
}

export function actualizarFavoritas() {
    const grid = document.querySelector("#favoritesGrid");

    if (!grid) return;

    const idsFavoritos = obtenerFavoritos().map(String);

    const favoritas = peliculasCargadas.filter(pelicula =>
        idsFavoritos.includes(String(pelicula.id))
    );

    grid.replaceChildren();

    favoritas.forEach(pelicula => {
        grid.append(pelicula.toCard());
    });

    requestAnimationFrame(ajustarFilasFavoritas);

    document.querySelectorAll(
        "#rejilla .card, #favoritesGrid .card, #genreMovies .card"
    ).forEach(card => {
        const pelicula = peliculasCargadas.find(
            p => String(p.id) === card.dataset.id
        );

        const boton = card.querySelector(".favorite-button");

        if (pelicula && boton) {
            Pelicula.pintarFavorito(
                boton,
                pelicula.titulo,
                idsFavoritos.includes(String(pelicula.id))
            );
        }
    });
}

/* =========================
   DESPLEGAR FAVORITAS
========================= */

const botonFavoritas = document.querySelector("#favoritesToggle");

botonFavoritas?.addEventListener("click", () => {
    const grid = document.querySelector("#favoritesGrid");

    if (!grid) return;

    mostrarTodasLasFavoritas = !mostrarTodasLasFavoritas;

    grid.classList.toggle("show-all", mostrarTodasLasFavoritas);

    botonFavoritas.textContent = mostrarTodasLasFavoritas
        ? "Mostrar menos"
        : "Ver todas las favoritas";

    botonFavoritas.setAttribute(
        "aria-expanded",
        String(mostrarTodasLasFavoritas)
    );
});

window.addEventListener(
    "framewaveFavoritasActualizadas",
    () => {
        actualizarFavoritas();
        actualizarGraficaFavoritas();
    }
);

window.addEventListener("resize", () => {
    requestAnimationFrame(ajustarFilasFavoritas);
});

/* =========================
   VER TODAS LAS PELÍCULAS
========================= */

const botonVerTodas = document.querySelector("#verTodasPeliculas");
const rejillaPeliculas = document.querySelector("#rejilla");

let mostrarTodasLasPeliculas = false;

botonVerTodas?.addEventListener("click", () => {
    if (!rejillaPeliculas) return;

    mostrarTodasLasPeliculas = !mostrarTodasLasPeliculas;

    rejillaPeliculas.classList.toggle(
        "ver-todas",
        mostrarTodasLasPeliculas
    );

    botonVerTodas.textContent = mostrarTodasLasPeliculas
        ? "Mostrar menos"
        : "Ver todas";

    botonVerTodas.setAttribute(
        "aria-expanded",
        String(mostrarTodasLasPeliculas)
    );
});


/* =========================
   INICIALIZAR APLICACIÓN
========================= */

const actualizarFiltroGenero = iniciarFiltroGeneros();

iniciarInterfaz({
    peliculasFrameWave,
    buscarPelicula,
    abrirFicha
});

/* =========================
   CARGAR CARTELERA
========================= */

export async function iniciar() {
    const rejilla = document.querySelector("#rejilla");

    if (!rejilla) {
        console.error('No se encuentra la rejilla "#rejilla".');
        return;
    }

    rejilla.replaceChildren();
    peliculasCargadas.length = 0;

    for (const titulo of peliculasFrameWave) {
        try {
            const resultado = await buscarPelicula(titulo);

            if (!resultado) {
                console.warn(`No se encontró en TMDB: ${titulo}`);
                continue;
            }

            const pelicula = Pelicula.desdeTMDB(resultado);

            // Identificador editorial independiente del idioma de TMDB.
            pelicula.tituloFrameWave = titulo;

            peliculasCargadas.push(pelicula);

            const tarjeta = pelicula.toCard();

            tarjeta.style.setProperty(
                "--i",
                String(rejilla.children.length)
            );

            rejilla.append(tarjeta);

        } catch (error) {
            console.error(
                `Error cargando "${titulo}":`,
                error
            );
        }
    }

    actualizarFavoritas();
    actualizarGraficaFavoritas();

    // Mantener el filtro de la cartelera.
    actualizarFiltroGenero?.();

    // Actualizar flechas y progreso del carrusel.
    requestAnimationFrame(() => {
        rejilla.dispatchEvent(new Event("scroll"));
    });

    // Si había un género seleccionado, refrescar sus tarjetas.
    const generoActivo = document.querySelector(
        ".genres-list a.is-selected"
    );

    if (generoActivo) {
        const evento = new Event("click", {
            bubbles: true,
            cancelable: true
        });

        // No simulamos el clic, porque eso deseleccionaría el género.
        // La selección se conserva y las películas se pueden volver a elegir.
    }
}

iniciarPeliculasGeneros();

iniciarAnimaciones();

iniciar();

cargarGenerosParaGrafica();

actualizarGraficaFavoritas();

