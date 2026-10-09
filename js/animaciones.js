

/* =========================
   SCROLL + HERO
========================= */

const framewave =
    document.getElementById("framewave");

window.addEventListener("scroll", () => {

    const scroll =
        window.scrollY;

    const progress =
        Math.min(
            scroll / (window.innerHeight * 1.4),
            1
        );

    const heroDescription =
        document.querySelector(".hero-description");

    const descriptionMove =
        progress * (window.innerHeight * 0.08);

    const descriptionOpacity =
        1 - Math.min(progress * 1.8, 1);

    heroDescription.style.transform =
        `translate(
            -50%,
            ${-descriptionMove}px
        )`;

    heroDescription.style.opacity =
        descriptionOpacity;


    /* =========================
       MÓVIL
    ========================= */

    if (window.innerWidth <= 600) {

        const scale =
            1 - (progress * 0.50);

        const vertical =
            progress * (window.innerHeight * 0.15);

        framewave.style.transform =
            `translate(
                -50%,
                ${-vertical}px
            )
            scale(${scale})`;
    }


    /* =========================
       TABLET
    ========================= */

    else if (window.innerWidth <= 900) {

        const scale =
            1 - (progress * 0.45);

        const vertical =
            progress * (window.innerHeight * 0.17);

        framewave.style.transform =
            `translate(
                -50%,
                ${-vertical}px
            )
            scale(${scale})`;
    }


    /* =========================
       ESCRITORIO
    ========================= */

    else {

        const scale =
            1 - (progress * 0.40);

        const vertical =
            progress * (window.innerHeight * 0.19);

        framewave.style.transform =
            `translate(
                -50%,
                ${-vertical}px
            )
            scale(${scale})`;
    }

});

    /* =========================
        REVEAL
    ========================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }

                });

            },
            {
                threshold: 0.2
            }
        );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    /* =========================
        ESFERA DE GÉNEROS
    ========================= */

    const genresList = document.querySelector(".genres-list");
    const genreLinks = genresList.querySelectorAll("a");

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


        const moveX = mouseX * -55 * depth;
        const moveY = mouseY * -40 * depth;


        genre.style.setProperty(
            "--move-x",
            `${moveX}px`
        );

        genre.style.setProperty(
            "--move-y",
            `${moveY}px`
        );

    });

});


genresList.addEventListener("mouseleave", () => {

    genreLinks.forEach((genre) => {

        genre.style.setProperty(
            "--move-x",
            "0px"
        );

        genre.style.setProperty(
            "--move-y",
            "0px"
        );

    });

});