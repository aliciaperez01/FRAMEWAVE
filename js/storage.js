

/* =========================
   ALMACENAMIENTO LOCAL
========================= */

const CLAVE_FAVORITOS = "framewaveFavoritas";
const CLAVE_HISTORIAL = "framewaveHistorial";
const LIMITE_HISTORIAL = 10;


/* =========================
   FAVORITOS
========================= */

export function obtenerFavoritos() {
    try {
        return JSON.parse(
            localStorage.getItem(CLAVE_FAVORITOS) ?? "[]"
        );
    } catch (error) {
        console.error("Error al leer los favoritos:", error);
        return [];
    }
}

export function guardarFavoritos(favoritos) {
    localStorage.setItem(
        CLAVE_FAVORITOS,
        JSON.stringify(favoritos)
    );
}


/* =========================
   HISTORIAL DE BÚSQUEDAS
========================= */

export function obtenerHistorialBusquedas() {
    try {
        return JSON.parse(
            localStorage.getItem(CLAVE_HISTORIAL) ?? "[]"
        );
    } catch (error) {
        console.error("Error al leer el historial:", error);
        return [];
    }
}

export function guardarBusqueda(titulo) {
    const nombre = titulo.trim();

    if (!nombre) return obtenerHistorialBusquedas();

    const historial = obtenerHistorialBusquedas();

    const historialActualizado = [
        nombre,
        ...historial.filter(
            pelicula =>
                pelicula.toLowerCase() !== nombre.toLowerCase()
        )
    ].slice(0, LIMITE_HISTORIAL);

    localStorage.setItem(
        CLAVE_HISTORIAL,
        JSON.stringify(historialActualizado)
    );

    return historialActualizado;
}