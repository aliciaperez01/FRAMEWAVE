
import {
    obtenerFavoritos,
    alternarFavorito,
    mostrarNotificacionFavoritos
} from "../js/favoritos.js";

export default class Pelicula {
    constructor({
        id,
        titulo,
        anio,
        nota,
        poster,
        generos = [],
        generoIds = []
    }) {
        this.id = id;
        this.titulo = titulo;
        this.anio = anio;
        this.nota = nota;
        this.poster = poster;
        this.generos = generos;
        this.generoIds = generoIds;
    }

    // URL del póster para las tarjetas.
    get posterUrl() {
        if (!this.poster) return null;

        return `https://image.tmdb.org/t/p/w342${this.poster}`;
    }

    // URL del póster en mayor resolución para la ficha.
    get posterUrlGrande() {
        if (!this.poster) return null;

        return `https://image.tmdb.org/t/p/w780${this.poster}`;
    }

    // Convierte los datos de TMDB en una instancia de Pelicula.
    static desdeTMDB({
        id,
        title,
        release_date,
        vote_average,
        poster_path = null,
        genre_ids = [],
        genres = []
    }) {
        // Los resultados de búsqueda contienen genre_ids.
        // Los detalles de una película pueden contener genres.
        const generoIds = genre_ids.length
            ? genre_ids
            : genres.map(genero => genero.id);

        return new Pelicula({
            id,
            titulo: title,
            anio: release_date
                ? release_date.slice(0, 4)
                : "----",
            nota: vote_average,
            poster: poster_path,
            generos: genres.map(genero => genero.name),
            generoIds
        });
    }

    // Actualiza el aspecto y la accesibilidad del botón favorito.
    static pintarFavorito(boton, titulo, esFavorita) {
        boton.textContent = esFavorita ? "♥" : "♡";

        boton.classList.toggle(
            "is-favorite",
            esFavorita
        );

        boton.setAttribute(
            "aria-label",
            esFavorita
                ? `Quitar ${titulo} de favoritas`
                : `Añadir ${titulo} a favoritas`
        );
    }

    // Crea la tarjeta de la película.
    toCard() {
        const card = document.createElement("article");

        card.className = "card";
        card.dataset.id = this.id;

        // Identificadores necesarios para filtrar por género.
        card.dataset.genreIds = this.generoIds.join(",");

        // Accesibilidad y navegación por teclado.
        card.tabIndex = 0;
        card.setAttribute("role", "button");

        card.setAttribute(
            "aria-label",
            `Ver detalles de ${this.titulo}, ${this.anio}`
        );

        // Póster.
        const img = document.createElement("img");

        img.alt = `Póster de ${this.titulo}`;
        img.loading = "lazy";

        if (this.posterUrl) {
            img.src = this.posterUrl;

            // Si no se encuentra el póster, se conserva la tarjeta.
            img.addEventListener(
                "error",
                () => {
                    img.remove();
                    card.classList.add("sin-poster");
                },
                { once: true }
            );

            card.append(img);
        } else {
            card.classList.add("sin-poster");
        }

        // Título.
        const titulo = document.createElement("h3");
        titulo.textContent = this.titulo;

        // Botón de favoritos.
        const favorito = document.createElement("button");

        favorito.className = "favorite-button";
        favorito.type = "button";

        Pelicula.pintarFavorito(
            favorito,
            this.titulo,
            obtenerFavoritos().includes(String(this.id))
        );

        favorito.addEventListener("click", event => {
            event.stopPropagation();

            const esFavorita = alternarFavorito(this.id);

            Pelicula.pintarFavorito(
                favorito,
                this.titulo,
                esFavorita
            );

                        
            if (esFavorita) {
                mostrarNotificacionFavoritos();
            }

            window.dispatchEvent(
                new CustomEvent("framewaveFavoritasActualizadas")
            );
        });

        const fila = document.createElement("div");
        fila.className = "card-title-row";
        fila.append(titulo, favorito);

        // Año y valoración.
        const info = document.createElement("p");
        const nota = Number(this.nota);

        info.textContent = `${this.anio} · ${
            Number.isFinite(nota)
                ? nota.toFixed(1)
                : "—"
        }`;

        card.append(fila, info);

        return card;
    }
}