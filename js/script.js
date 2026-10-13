

/* =========================
   INICIALIZAR INTERFAZ
========================= */

import { guardarBusqueda } from "./storage.js";

export function iniciarInterfaz({
    peliculasFrameWave,
    buscarPelicula,
    abrirFicha
}) {

    /* =========================
       TEMA
    ========================= */

    const themeButton =
        document.getElementById("themeButton");

    const themeIcon =
        document.querySelector(".theme-icon");

    themeButton?.addEventListener("click", () => {
        const claro =
            document.documentElement.classList.toggle("light-mode");

        if (themeIcon) {
            themeIcon.textContent = claro ? "☀" : "◐";
        }
    });



    /* =========================
       MENÚ
    ========================= */

    const menuButton =
        document.getElementById("menuButton");

    const menuList =
        document.getElementById("menuList");

    menuButton?.addEventListener("click", () => {
        if (!menuList) return;

        const abierto =
            menuList.classList.toggle("is-open");

        menuButton.classList.toggle("is-open", abierto);

        menuButton.setAttribute(
            "aria-expanded",
            String(abierto)
        );
    });


    /* =========================
       BÚSQUEDA
    ========================= */

    const desktopSearchButton =
        document.getElementById("desktopSearchButton");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");

    const searchMessage =
        document.getElementById("searchMessage");

    if (searchInput && searchForm) {

        const placeholderOriginal =
            searchInput.placeholder;

        function normalizarTitulo(titulo) {
            return titulo
                .trim()
                .toLocaleLowerCase("es")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ");
        }

        searchInput.addEventListener("input", () => {
            searchInput.placeholder = placeholderOriginal;

            searchMessage?.classList.remove("is-visible");
        });

        function alternarBusqueda() {
            const abierta =
                searchForm.classList.toggle("is-open");

            if (abierta) {
                searchInput.focus();
            } else {
                searchMessage?.classList.remove("is-visible");
            }
        }

        desktopSearchButton?.addEventListener(
            "click",
            alternarBusqueda
        );

        searchForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const texto = normalizarTitulo(searchInput.value);

            if (!texto) return;

            const peliculaEncontrada =
                peliculasFrameWave.find(
                    titulo => normalizarTitulo(titulo) === texto
                );

            if (!peliculaEncontrada) {
                searchInput.value = "";
                searchInput.placeholder = "No está :(";

                searchMessage?.classList.remove("is-visible");
                return;
            }

            try {
                const pelicula =
                    await buscarPelicula(peliculaEncontrada);

                if (!pelicula) {
                    searchInput.value = "";
                    searchInput.placeholder = "No está :(";
                    return;
                }

                guardarBusqueda(peliculaEncontrada);
                searchInput.value = "";

                searchForm.classList.remove("is-open");
                searchMessage?.classList.remove("is-visible");
                searchInput.blur();

                await abrirFicha(pelicula.id);

            } catch (error) {
                console.error(
                    "Error al buscar la película:",
                    error
                );
            }
        });
    }

    /* =========================
       ABRIR FICHA DESDE TARJETAS
    ========================= */

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;

        const card = event.target.closest(
        "#rejilla .card, #favoritesGrid .card, #genreMovies .card"
    );

        if (!card) return;

        // Evita abrir la ficha al pulsar el corazón de favoritos.
        if (event.target.closest("button")) return;

        searchForm?.classList.remove("is-open");
        searchMessage?.classList.remove("is-visible");
        searchInput?.blur();

        const id = card.dataset.id;

        if (id) {
            abrirFicha(id);
        }
    });


    /* =========================
       ABRIR FICHA CON EL TECLADO
    ========================= */

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (!(event.target instanceof Element)) return;

        const card = event.target.closest(
        "#rejilla .card, #favoritesGrid .card, #genreMovies .card"
    );

        if (!card || event.target.closest("button")) return;

        event.preventDefault();

        if (card.dataset.id) {
            abrirFicha(card.dataset.id);
        }
    });


    /* =========================
       CARRUSEL DE PELÍCULAS
    ========================= */

    const moviesGrid =
        document.getElementById("rejilla");

    const moviesPrev =
        document.getElementById("moviesPrev");

    const moviesNext =
        document.getElementById("moviesNext");

    const moviesProgress =
        document.getElementById("moviesProgress");

    if (moviesGrid && moviesPrev && moviesNext) {

        /* Actualizar estado y progreso */

        function actualizarCarrusel() {
            const maxScroll =
                moviesGrid.scrollWidth - moviesGrid.clientWidth;

            const posicion =
                moviesGrid.scrollLeft;

            moviesPrev.disabled = posicion <= 2;

            moviesNext.disabled =
                posicion >= maxScroll - 2;

            if (moviesProgress) {
                const progreso = maxScroll > 0
                    ? (posicion / maxScroll) * 100
                    : 100;

                moviesProgress.style.width =
                    `${progreso}%`;
            }
        }


        /* Mover carrusel */

        
    function moverCarrusel(direccion) {
        const tarjeta = moviesGrid.querySelector(".card");

        if (!tarjeta) return;

        const estilos = getComputedStyle(moviesGrid);
        const espacio = parseFloat(estilos.columnGap) || 0;

        const distanciaTarjeta =
            tarjeta.getBoundingClientRect().width + espacio;

        // Avanzar cuatro tarjetas en cada pulsación.
        const numeroTarjetas = 4;
        const distancia = distanciaTarjeta * numeroTarjetas;

        const maxScroll =
            moviesGrid.scrollWidth - moviesGrid.clientWidth;

        const destino = Math.max(
            0,
            Math.min(
                moviesGrid.scrollLeft + distancia * direccion,
                maxScroll
            )
        );

        moviesGrid.scrollTo({
            left: destino,
            behavior: "smooth"
        });
    }


        /* Eventos de las flechas */

        moviesPrev.addEventListener("click", () => {
            moverCarrusel(-1);
        });

        moviesNext.addEventListener("click", () => {
            moverCarrusel(1);
        });


        /* Actualizaciones del carrusel */

        moviesGrid.addEventListener(
            "scroll",
            actualizarCarrusel,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            actualizarCarrusel
        );


        /* Observar cambios en las tarjetas */

        const observer = new MutationObserver(() => {
            requestAnimationFrame(actualizarCarrusel);
        });

        observer.observe(moviesGrid, {
            childList: true
        });

        actualizarCarrusel();
    }


    /* =========================
       CERRAR MENÚ AL NAVEGAR
    ========================= */

    menuList?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuList.classList.remove("is-open");

            menuButton?.classList.remove("is-open");

            menuButton?.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });

}