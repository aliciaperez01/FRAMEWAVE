



/* =========================
   INICIALIZAR INTERFAZ
========================= */

export function iniciarInterfaz({
    peliculasFrameWave,
    buscarPelicula,
    abrirFicha,
    cambiarIdioma
}) {

    /* =========================
       TEMA
    ========================= */

    const themeButton =
        document.getElementById("themeButton");

    const themeIcon =
        document.querySelector(".theme-icon");


    themeButton?.addEventListener("click", () => {
    const claro = document.documentElement.classList.toggle("light-mode");

    if (themeIcon) {
        themeIcon.textContent = claro ? "☀" : "◐";
    }
});


    /* =========================
       IDIOMA
    ========================= */

    const languageButton =
        document.getElementById("languageButton");

    if (languageButton) {
        const idiomaInicial =
            document.documentElement.lang === "en" ? "en" : "es";

        languageButton.textContent =
            idiomaInicial === "es" ? "EN" : "ES";

        languageButton.addEventListener("click", async () => {
            const idiomaNuevo =
                document.documentElement.lang === "es" ? "en" : "es";

            try {
                if (cambiarIdioma) {
                    await cambiarIdioma(idiomaNuevo);
                }

                document.documentElement.lang = idiomaNuevo;

                languageButton.textContent =
                    idiomaNuevo === "es" ? "EN" : "ES";

                languageButton.setAttribute(
                    "aria-label",
                    idiomaNuevo === "es"
                        ? "Change language to English"
                        : "Cambiar idioma a español"
                );
            } catch (error) {
                console.error("Error al cambiar el idioma:", error);
            }
        });
    }


    /* =========================
       MENÚ MÓVIL
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

            const texto =
                searchInput.value.trim().toLowerCase();

            if (!texto) return;

            const peliculaEncontrada =
                peliculasFrameWave.find(
                    titulo => titulo.toLowerCase() === texto
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
                    searchInput.placeholder = "No está :(";
                    return;
                }

                searchForm.classList.remove("is-open");
                searchMessage?.classList.remove("is-visible");
                searchInput.blur();

                abrirFicha(pelicula.id);

            } catch (error) {
                console.error("Error al buscar la película:", error);
            }
        });


        /* Cerrar búsqueda al pulsar una tarjeta */

        document.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;

            const card = event.target.closest(".card");

            if (!card) return;

            searchForm.classList.remove("is-open");
            searchMessage?.classList.remove("is-visible");
            searchInput.blur();
        });
    }


    
    /* =========================
       CARRUSEL DE PELÍCULAS
    ========================= */

    const moviesGrid = document.getElementById("rejilla");
    const moviesPrev = document.getElementById("moviesPrev");
    const moviesNext = document.getElementById("moviesNext");
    const moviesProgress = document.getElementById("moviesProgress");

    if (moviesGrid && moviesPrev && moviesNext) {

        function actualizarCarrusel() {
            const maxScroll =
                moviesGrid.scrollWidth - moviesGrid.clientWidth;

            const posicion = moviesGrid.scrollLeft;

            moviesPrev.disabled = posicion <= 2;
            moviesNext.disabled = posicion >= maxScroll - 2;

            if (moviesProgress) {
                const progreso =
                    maxScroll > 0
                        ? (posicion / maxScroll) * 100
                        : 100;

                moviesProgress.style.width = `${progreso}%`;
            }
        }

        function moverCarrusel(direccion) {
            const tarjeta = moviesGrid.querySelector(".card");

            if (!tarjeta) return;

            const estilos = getComputedStyle(moviesGrid);
            const espacio = parseFloat(estilos.columnGap) || 0;
            const distancia = tarjeta.getBoundingClientRect().width + espacio;

            moviesGrid.scrollBy({
                left: distancia * direccion,
                behavior: "smooth"
            });
        }

        moviesPrev.addEventListener("click", () => {
            moverCarrusel(-1);
        });

        moviesNext.addEventListener("click", () => {
            moverCarrusel(1);
        });

        moviesGrid.addEventListener("scroll", actualizarCarrusel, {
            passive: true
        });

        window.addEventListener("resize", actualizarCarrusel);

        /*
         * Las películas se cargan después desde TMDB.
         * Observamos los cambios para actualizar las flechas.
         */

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
