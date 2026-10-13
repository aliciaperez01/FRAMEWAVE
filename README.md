# FrameWave

**FrameWave** es una web dedicada al cine de culto, alternativo y a las películas con universos visuales y narrativos singulares. Permite explorar una selección cinematográfica, consultar información de películas, descubrir géneros y guardar favoritas.

## Características

* Catálogo de 40 películas seleccionadas.
* Consulta de información cinematográfica mediante la API de The Movie Database (TMDB).
* Fichas de películas con sinopsis, puntuación, duración y director, cuando estos datos están disponibles.
* Galería de fotogramas y acceso a tráileres cuando existen.
* Sistema de películas favoritas mediante `localStorage`.
* Filtros por género.
* Buscador de películas.
* Interfaz adaptable a dispositivos móviles y escritorio.
* Cambio entre español e inglés.
* Modo claro y modo oscuro.

## Tecnologías utilizadas

* HTML5.
* CSS3.
* JavaScript moderno (ES6+).
* Módulos JavaScript.
* Programación orientada a objetos.
* API REST de TMDB.
* `fetch` y funciones asíncronas con `async/await`.
* `localStorage`.
* Git y GitHub Pages.

## Estructura del proyecto

* `index.html`: estructura principal de la web.
* `style/`: hojas de estilos organizadas por secciones.
* `js/`: lógica de la interfaz, catálogo, favoritos, fichas y animaciones.
* `modelos/`: clases y modelos de las películas.
* `api_services/`: comunicación con la API de TMDB.
* `fonts/`: tipografías del proyecto.

## Requisitos

Para ejecutar el proyecto localmente necesitas un navegador moderno y un servidor local que permita cargar los módulos JavaScript.

## Ejecución local

1. Clona el repositorio.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Ejecuta `index.html` mediante una extensión de servidor local, como Live Server.
4. Comprueba que la configuración de TMDB está disponible en `api_services/api.js`.

## API de películas

FrameWave utiliza [The Movie Database (TMDB)](https://www.themoviedb.org/) para recuperar información cinematográfica.

El uso de su API está sujeto a sus condiciones y atribución correspondientes.

## Publicación

El proyecto está publicado mediante GitHub Pages.

## Autoría

Proyecto académico desarrollado como práctica de diseño web y programación con JavaScript.
