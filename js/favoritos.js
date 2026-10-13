

import {
    obtenerFavoritos,
    guardarFavoritos
} from "./storage.js";

let temporizadorNotificacion;

export function alternarFavorito(id) {
    const favoritos = obtenerFavoritos();
    const idPelicula = String(id);

    const nuevosFavoritos = favoritos.includes(idPelicula)
        ? favoritos.filter(favorito => favorito !== idPelicula)
        : [...favoritos, idPelicula];

    guardarFavoritos(nuevosFavoritos);

    window.dispatchEvent(
        new Event("framewaveFavoritasActualizadas")
    );

    return nuevosFavoritos.includes(idPelicula);
}

export function mostrarNotificacionFavoritos() {
    let notificacion = document.getElementById(
        "favoritosNotificacion"
    );

    if (!notificacion) {
        notificacion = document.createElement("div");
        notificacion.id = "favoritosNotificacion";
        notificacion.setAttribute("role", "status");
        notificacion.setAttribute("aria-live", "polite");

        document.body.append(notificacion);
    }

    notificacion.textContent = "Se ha añadido a favoritos";

    notificacion.classList.remove("is-visible");

    clearTimeout(temporizadorNotificacion);

    requestAnimationFrame(() => {
        notificacion.classList.add("is-visible");
    });

    temporizadorNotificacion = setTimeout(() => {
        notificacion.classList.remove("is-visible");
    }, 2400);
}