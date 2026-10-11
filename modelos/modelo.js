
import { obtenerFavoritos, alternarFavorito } from "../js/favoritos.js";

export default class Pelicula {
    constructor({ id, titulo, anio, nota, poster, generos }) {
        this.id = id;
        this.titulo = titulo;
        this.anio = anio;
        this.nota = nota;
        this.poster = poster;
        this.generos = generos;

    }

    
    get posterUrl() {
        if (!this.poster) return null;
        return `https://image.tmdb.org/t/p/w342${this.poster}`;
    }

    get posterUrlGrande() {
        if (!this.poster) return null;
        return `https://image.tmdb.org/t/p/w780${this.poster}`;
    }

    static desdeTMDB({
        id,
        title,
        release_date,
        vote_average,
        poster_path = null,
        genres = []
    }) {

    return new Pelicula({
        id,
        titulo: title,
        anio: release_date ? release_date.slice(0, 4) : "----",
        nota: vote_average,
        poster: poster_path,
        generos: genres.map(genero => genero.name)

    });
}

    /* Aspecto del botón de favorito según su estado */
    static pintarFavorito(boton, titulo, esFavorita) {
        boton.textContent = esFavorita ? "♥" : "♡";
        boton.classList.toggle("is-favorite", esFavorita);
        boton.setAttribute(
            "aria-label",
            esFavorita
                ? `Quitar ${titulo} de favoritas`
                : `Añadir ${titulo} a favoritas`
        );
    }

    
toCard() {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = this.id;

    // Accesibilidad y navegación por teclado
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
        "aria-label",
        `Ver detalles de ${this.titulo}, ${this.anio}`
    );

    if (this.posterUrl) {
        const img = document.createElement("img");
        img.src = this.posterUrl;
        img.alt = `Póster de ${this.titulo}`;
        img.loading = "lazy";
        card.append(img);
    }

    const titulo = document.createElement("h3");
    titulo.textContent = this.titulo;

    const favorito = document.createElement("button");
    favorito.className = "favorite-button";
    favorito.type = "button";

    Pelicula.pintarFavorito(
        favorito,
        this.titulo,
        obtenerFavoritos().includes(String(this.id))
    );

    favorito.addEventListener("click", (event) => {
        event.stopPropagation();

        const esFavorita = alternarFavorito(this.id);
        Pelicula.pintarFavorito(
            favorito,
            this.titulo,
            esFavorita
        );
    });

    const fila = document.createElement("div");
    fila.className = "card-title-row";
    fila.append(titulo, favorito);

    const info = document.createElement("p");
    info.textContent = `${this.anio} · ${this.nota.toFixed(1)}`;

    card.append(fila, info);

    return card;
}}
