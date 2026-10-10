


const CLAVE_FAVORITOS = "framewaveFavoritas";

export function obtenerFavoritos() {
    return JSON.parse(
        localStorage.getItem(CLAVE_FAVORITOS) ?? "[]"
    );
}

export function alternarFavorito(id) {
    const favoritos = obtenerFavoritos();
    const idPelicula = String(id);

    const nuevosFavoritos = favoritos.includes(idPelicula)
        ? favoritos.filter(favorito => favorito !== idPelicula)
        : [...favoritos, idPelicula];

    localStorage.setItem(
        CLAVE_FAVORITOS,
        JSON.stringify(nuevosFavoritos)
    );

    window.dispatchEvent(
        new Event("framewaveFavoritasActualizadas")
    );

    return nuevosFavoritos.includes(idPelicula);
}