
export default class Pelicula {
    constructor({id, titulo, anio, nota, poster}) {
        this.id = id;
        this.titulo = titulo;
        this.anio = anio;
        this.poster = poster;
        this.nota = nota;
    }

    get posterUrl() {
        if (!this.poster) return null;
        return `https://image.tmdb.org/t/p/w342${this.poster}`;
    }

    static desdeTMDB({id, title, release_date, vote_average, poster_path = null}) {
        const anio = release_date
            ? release_date.slice(0, 4)
            : "----";

        return new Pelicula({
            id,
            titulo: title,
            anio,
            nota: vote_average,
            poster: poster_path
        });
    }

    //BOTON FAVORITO


    
toCard() {
    const card = document.createElement("article");
    card.className = "card";

    card.dataset.id = this.id;

    if (this.posterUrl) {
        const img = document.createElement("img");
        img.src = this.posterUrl;
        img.alt = `Poster de ${this.titulo}`;
        card.append(img);
    }

    const tituloFila = document.createElement("div");
    tituloFila.className = "card-title-row";

    const titulo = document.createElement("h3");
    titulo.textContent = this.titulo;

    const info = document.createElement("p");
    info.textContent = `${this.anio} * ${this.nota.toFixed(1)}`;

    const favorito = document.createElement("button");
    favorito.className = "favorite-button";
    favorito.type = "button";

    favorito.setAttribute(
        "aria-label",
        `Añadir ${this.titulo} a favoritas`
    );

    // Recuperar favoritos guardados
    const favoritosGuardados = JSON.parse(
        localStorage.getItem("framewaveFavoritas") || "[]"
    );

    const idPelicula = String(this.id);
    const esFavorita = favoritosGuardados.includes(idPelicula);

    favorito.textContent = esFavorita ? "♥" : "♡";

    if (esFavorita) {
        favorito.classList.add("is-favorite");
        favorito.setAttribute(
            "aria-label",
            `Quitar ${this.titulo} de favoritas`
        );
    }

    tituloFila.append(titulo, favorito);

    card.append(tituloFila, info);


    // GESTIONAR CLICK EN FAVORITOS

    favorito.addEventListener("click", (event) => {
        event.stopPropagation();

        const favoritos = JSON.parse(
            localStorage.getItem("framewaveFavoritas") || "[]"
        );

        const id = String(this.id);
        const indice = favoritos.indexOf(id);

        if (indice === -1) {
            favoritos.push(id);
        } else {
            favoritos.splice(indice, 1);
        }

        localStorage.setItem(
            "framewaveFavoritas",
            JSON.stringify(favoritos)
        );

        window.dispatchEvent(
            new CustomEvent("framewaveFavoritasActualizadas")
        );

        const ahoraEsFavorita = favoritos.includes(id);

        favorito.classList.toggle(
            "is-favorite",
            ahoraEsFavorita
        );

        favorito.textContent = ahoraEsFavorita ? "♥" : "♡";

        favorito.setAttribute(
            "aria-label",
            ahoraEsFavorita
                ? `Quitar ${this.titulo} de favoritas`
                : `Añadir ${this.titulo} a favoritas`
        );
    });

    return card;
}};