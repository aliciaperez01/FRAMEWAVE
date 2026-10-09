
/* =========================
   TEMA
========================= */

const themeButton =
    document.getElementById("themeButton");

const themeIcon =
    document.querySelector(".theme-icon");

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeIcon.textContent = "☀";
    } else {
        themeIcon.textContent = "◐";
    }
});


/* =========================
   MENÚ MÓVIL
========================= */

const menuButton = document.getElementById("menuButton");

const menuList = document.getElementById("menuList");

menuButton.addEventListener("click", () => {

const abierto = menuList.classList.toggle("is-open");

    menuButton.classList.toggle("is-open",abierto);

    menuButton.setAttribute("aria-expanded",abierto);
});

const desktopSearchButton = document.getElementById("desktopSearchButton");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");

function alternarBusqueda() {
    const abierta = searchForm.classList.toggle("is-open");

    if (abierta) {
        searchInput.focus();
    }
}

desktopSearchButton.addEventListener("click", alternarBusqueda);


searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const texto = searchInput.value.trim().toLowerCase();

    if (!texto) return;

    const peliculaEncontrada = peliculasFrameWave.find(
        (titulo) => titulo.toLowerCase() === texto
    );

    if (!peliculaEncontrada) {
        searchMessage.textContent = "No está :(";
        searchMessage.classList.add("is-visible");
        return;
    }

    searchMessage.textContent = "";
    searchMessage.classList.remove("is-visible");

    const pelicula = await buscarPelicula(peliculaEncontrada);

    if (pelicula) {
        abrirFicha(pelicula.id);
    }
});



/* =========================
   CERRAR MENÚ AL NAVEGAR
========================= */

const menuLinks =
    menuList.querySelectorAll("a");

menuLinks.forEach((link) => {

    link.addEventListener("click", () => {

        menuList.classList.remove("is-open");

        menuButton.classList.remove("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});







    