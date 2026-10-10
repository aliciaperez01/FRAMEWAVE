

/* =========================
   INICIALIZAR INTERFAZ
========================= */

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
        document.body.classList.toggle("light-mode");

        if (themeIcon) {
            themeIcon.textContent =
                document.body.classList.contains("light-mode")
                    ? "☀"
                    : "◐";
        }
    });


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