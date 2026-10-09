

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

async function buscarPelicula(titulo) {
    const { results } =
        await pedirTMBD(
            "/search/movie",
            `&query=${encodeURIComponent(titulo)}`
        );

    return results[0];
}

async function iniciar() {
    const rejilla =
        document.querySelector("#rejilla");

    try {
        for (const titulo of peliculasFrameWave) {
            const resultado =
                await buscarPelicula(titulo);

            if (resultado) {
                const pelicula =
                    Pelicula.desdeTMDB(resultado);

                const card =
                    pelicula.toCard();

                card.style.setProperty(
                    "--i",
                    rejilla.children.length
                );

                rejilla.append(card);
            }
        }

    } catch (error) {
        rejilla.textContent =
            `No hay na ${error.message}`;
    }
}

iniciar();



