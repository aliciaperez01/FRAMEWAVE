
class Pelicula {
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

        const titulo = document.createElement("h3");
        titulo.textContent = this.titulo;

        const info = document.createElement("p");
        info.textContent = `${this.anio} * ${this.nota.toFixed(1)}`;

        const favorito = document.createElement("button");
        favorito.className = "favorite-button";
        favorito.type = "button";
        favorito.textContent = "♡";
        favorito.setAttribute("aria-label", `Añadir ${this.titulo} a favoritas`);


        card.append(titulo, info, favorito);


        favorito.addEventListener("click", () => {
        favorito.classList.toggle("is-favorite");


        if (favorito.classList.contains("is-favorite")) {
            favorito.textContent = "♥";
            favorito.setAttribute(
                "aria-label",
                `Quitar ${this.titulo} de favoritas`
            );
        } else {
            favorito.textContent = "♡";
            favorito.setAttribute(
                "aria-label",
                `Añadir ${this.titulo} a favoritas`
            );
        }
    });

        return card;

        
    }
}