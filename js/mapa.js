


/* =========================
   MAPA · PAÍSES DE PRODUCCIÓN
========================= */

const CONTENEDOR_MAPA = "#movieProductionMap";
const TEXTO_PAISES = "#movieDetailMapCountries";

const URL_PAISES =
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

let mapaProduccion = null;
let capaPaises = null;
let capaSeleccionados = null;
let datosPaises = null;
let peticionPaises = null;


/* =========================
   CARGAR MAPA BASE
========================= */

async function obtenerPaisesGeoJSON() {
    
    if (datosPaises) return datosPaises;

    if (!peticionPaises) {
        peticionPaises = fetch(URL_PAISES)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error(
                        "No se han podido descargar los países."
                    );
                }

                return respuesta.json();
            })
            .then(datos => {
                datosPaises = datos;
                return datosPaises;
            })
            .catch(error => {
                peticionPaises = null;
                throw error;
            });
    }

    return peticionPaises;
}


function prepararMapa() {
    const contenedor =
        document.querySelector(CONTENEDOR_MAPA);

    if (!contenedor || typeof L === "undefined") {
        throw new Error(
            "No se encuentra el contenedor o Leaflet no está cargado."
        );
    }

    if (mapaProduccion) return;

    mapaProduccion = L.map(contenedor, {
        scrollWheelZoom: false,
        worldCopyJump: true
    }).setView([20, 0], 2);

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }
    ).addTo(mapaProduccion);
}

    
        


/* =========================
   MOSTRAR PAÍSES
========================= */

export async function mostrarMapaProduccion(paises = []) {
    const textoPaises =
        document.querySelector(TEXTO_PAISES);

    const contenedor =
        document.querySelector(CONTENEDOR_MAPA);

    if (!contenedor || !textoPaises) return;

    const paisesValidos = paises.filter(
        pais => pais.iso_3166_1 && pais.name
    );

    textoPaises.textContent = paisesValidos.length
        ? paisesValidos.map(pais => pais.name).join(" · ")
        : "Países de producción no disponibles";

    try {
        prepararMapa();

        const datos = await obtenerPaisesGeoJSON();
            
        const codigos = new Set(
            paisesValidos.map(pais =>
                pais.iso_3166_1.toUpperCase()
            )
        );

        if (capaPaises) {
            mapaProduccion.removeLayer(capaPaises);
        }

        if (capaSeleccionados) {
            mapaProduccion.removeLayer(capaSeleccionados);
        }

        // Contornos discretos de todos los países.
        capaPaises = L.geoJSON(datos, {
            style: {
                color: "#718675",
                weight: 0.6,
                opacity: 0.65,
                fillColor: "#181D29",
                fillOpacity: 0.35
            }
        }).addTo(mapaProduccion);

        // Resaltar los países de producción.
        capaSeleccionados = L.geoJSON(datos, {
        
        filter: feature => {
            const propiedades = feature.properties ?? {};

            const posiblesCodigos = [
                propiedades.ISO_A2,
                propiedades.ISO_A2_EH,
                propiedades.ISO3166_1,
                propiedades["ISO3166-1-Alpha-2"],
                propiedades.iso_a2,
                propiedades.iso_3166_1
            ];

            const coincidePorCodigo = posiblesCodigos.some(codigo =>
                codigo &&
                codigo !== "-99" &&
                codigos.has(String(codigo).toUpperCase())
            );

            // Algunos países del GeoJSON tienen el código ISO como "-99".
            // En esos casos, comparamos el nombre con el de TMDB.
            const nombresTMDB = new Set(
                paisesValidos.map(pais =>
                    pais.name.trim().toLowerCase()
                )
            );

            const coincidePorNombre = propiedades.name &&
                nombresTMDB.has(
                    propiedades.name.trim().toLowerCase()
                );

            return coincidePorCodigo || coincidePorNombre;
        },

            style: {
                color: "#D5DED0",
                weight: 1.5,
                opacity: 1,
                fillColor: "#718675",
                fillOpacity: 0.8
            },

            onEachFeature: (feature, capa) => {
                const nombre =
                    feature.properties?.ADMIN ??
                    feature.properties?.name ??
                    "País de producción";

                capa.bindTooltip(nombre);
            }
        }).addTo(mapaProduccion);

    
    const limites = L.latLngBounds([]);

    capaSeleccionados.eachLayer(capa => {
        const nombre = capa.feature?.properties?.name;
        const geometria = capa.feature?.geometry;

        if (
            nombre === "United States of America" &&
            geometria?.type === "MultiPolygon"
        ) {
            // Evita que Alaska y Hawái alejen el encuadre.
            const territorioContinental =
                geometria.coordinates.find(poligono =>
                    poligono[0]?.some(
                        ([longitud, latitud]) =>
                            longitud >= -125 &&
                            longitud <= -66 &&
                            latitud >= 24 &&
                            latitud <= 50
                    )
                );

            if (territorioContinental?.[0]) {
                territorioContinental[0].forEach(
                    ([longitud, latitud]) => {
                        limites.extend([latitud, longitud]);
                    }
                );
            }
        } else {
            const bounds = capa.getBounds();

            if (bounds.isValid()) {
                limites.extend(bounds);
            }
        }
    });

   

    setTimeout(() => {
        if (!mapaProduccion) return;

        mapaProduccion.invalidateSize(true);

        if (limites.isValid()) {
            mapaProduccion.fitBounds(limites, {
                padding: [20, 20],
                maxZoom: 5,
                animate: false
            });
        } else {
            mapaProduccion.setView([20, 0], 2);
        }
    }, 250);

    
    } catch (error) {
        console.error(
            "Error al mostrar el mapa de producción:",
            error
        );

        textoPaises.textContent =
            paisesValidos.length
                ? paisesValidos.map(pais => pais.name).join(" · ")
                : "No se ha podido cargar el mapa.";
    }
}