


/* =========================
   INICIAR ANIMACIONES
========================= */

export function iniciarAnimaciones() {


    
    /* =========================
       CREAR BURBUJAS DEL FONDO
    ========================= */

    const pageBackground = document.querySelector(".page-background");

    if (pageBackground && !pageBackground.querySelector(".page-bubble")) {
        const bubbles = [
            "bubble-one",
            "bubble-two",
            "bubble-three",
            "bubble-four",
            "bubble-five",
            "bubble-six"
        ];

        bubbles.forEach((bubbleClass) => {
            const bubble = document.createElement("div");

            bubble.classList.add("page-bubble", bubbleClass);
            bubble.setAttribute("aria-hidden", "true");

            pageBackground.appendChild(bubble);
        });
    }


    /* =========================
       SCROLL + HERO
    ========================= */

    const framewave = document.getElementById("framewave");
    const heroDescription = document.querySelector(".hero-description");

    function actualizarHero() {
        const scroll = window.scrollY;
        const progress = Math.min(
            scroll / (window.innerHeight * 1.4),
            1
        );

        /* Movimiento de la descripción */
        const descriptionMove =
            progress * (window.innerHeight * 0.08);

        if (heroDescription) {
            heroDescription.style.transform =
                `translate(-50%, ${-descriptionMove}px)`;

            heroDescription.style.opacity =
                1 - Math.min(progress * 1.8, 1);
        }

        
        /* Movimiento del logo */
        if (!framewave) return;

        let scale;
        let vertical;

        if (window.innerWidth <= 1023) {
            // Móvil y tablet: el logo termina centrado en la navegación
            scale = 1 - progress * 0.35;

            const nav = document.querySelector(".navigation");
            if (!nav) return;

            const navRect = nav.getBoundingClientRect();
            const centroNav = navRect.top + navRect.height / 2;

            const centroInicial =
                window.innerHeight * 0.25 + framewave.offsetHeight / 2;

            vertical = progress * (centroNav - centroInicial);

            framewave.style.transform =
                `translate(-50%, ${vertical}px) scale(${scale})`;

            return;
        }

        // Escritorio: conservar el movimiento actual
        scale = 1 - progress * 0.40;
        vertical = progress * window.innerHeight * 0.19;

        framewave.style.transform =
            `translate(-50%, ${-vertical}px) scale(${scale})`;
    }

    let pendiente = false;

    function alMoverse() {
        if (pendiente) return;
        pendiente = true;

        requestAnimationFrame(() => {
            actualizarHero();
            pendiente = false;
        });
    }

    window.addEventListener("scroll", alMoverse, { passive: true });
    window.addEventListener("resize", alMoverse);

    actualizarHero();


    /* =========================
       REVEAL
    ========================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            revealObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.2 }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    /* =========================
       ESFERA DE GÉNEROS
    ========================= */

    const genresList =
        document.querySelector(".genres-list");

    if (!genresList) return;

    const genreLinks =
        genresList.querySelectorAll("a");

    
        genresList.addEventListener("mousemove", (event) => {

            const rect = genresList.getBoundingClientRect();

            const mouseX =
                (event.clientX - rect.left) / rect.width - 0.5;

            const mouseY =
                (event.clientY - rect.top) / rect.height - 0.5;

            genreLinks.forEach((genre) => {

                const depth =
                    parseFloat(
                        getComputedStyle(genre)
                            .getPropertyValue("--depth")
                    ) || 1;

                genre.style.setProperty(
                    "--move-x",
                    `${mouseX * -35 * depth}px`
                );

                genre.style.setProperty(
                    "--move-y",
                    `${mouseY * -25 * depth}px`
                );
            });
        });

    genresList.addEventListener("mouseleave", () => {

        genreLinks.forEach((genre) => {
            genre.style.setProperty("--move-x", "0px");
            genre.style.setProperty("--move-y", "0px");
        });
    });
}