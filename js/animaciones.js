


/* =========================
   INICIAR ANIMACIONES
========================= */

export function iniciarAnimaciones() {

    /* =========================
       SCROLL + HERO
    ========================= */

    const framewave =
        document.getElementById("framewave");

    const heroDescription =
        document.querySelector(".hero-description");

    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;

        const progress = Math.min(
            scroll / (window.innerHeight * 1.4),
            1
        );

        const descriptionMove =
            progress * (window.innerHeight * 0.08);

        const descriptionOpacity =
            1 - Math.min(progress * 1.8, 1);

        if (heroDescription) {
            heroDescription.style.transform =
                `translate(-50%, ${-descriptionMove}px)`;

            heroDescription.style.opacity =
                descriptionOpacity;
        }

        if (!framewave) return;

        /* MÓVIL */

        if (window.innerWidth <= 600) {

            const scale = 1 - (progress * 0.35);

            const nav =
                document.querySelector(".navigation");

            if (!nav) return;

            const navRect = nav.getBoundingClientRect();

            const destino =
                navRect.top + navRect.height / 2 - 28;

            const posicionInicial =
                window.innerHeight * 0.25;

            const posicionActual =
                posicionInicial -
                progress * (posicionInicial - destino);

            const vertical =
                posicionActual - posicionInicial;

            framewave.style.transform =
                `translate(-50%, ${vertical}px) scale(${scale})`;

        /* TABLET */

        } else if (window.innerWidth <= 900) {

            const scale = 1 - (progress * 0.45);

            const vertical =
                progress * (window.innerHeight * 0.17);

            framewave.style.transform =
                `translate(-50%, ${-vertical}px) scale(${scale})`;

        /* ESCRITORIO */

        } else {

            const scale = 1 - (progress * 0.40);

            const vertical =
                progress * (window.innerHeight * 0.19);

            framewave.style.transform =
                `translate(-50%, ${-vertical}px) scale(${scale})`;
        }
    });


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
                `${mouseX * -55 * depth}px`
            );

            genre.style.setProperty(
                "--move-y",
                `${mouseY * -40 * depth}px`
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