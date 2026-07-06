# Laboratorio Virtual de Física

Plataforma educativa de simuladores de Física desarrollada para publicarse como sitio estático en GitHub Pages. El proyecto funciona como un catálogo escalable: cada simulador vive en su propia carpeta, tiene URL directa y se registra desde `data/simulators.json`.

## Créditos

Simuladores desarrollados por Yandri Franco  
Diseño Web Washington Indacochea  
para los estudiantes de la Unidad Educativa 30 de Septiembre.

## Simuladores incluidos

- Ley de Hooke: dinamómetro virtual para analizar masa, gravedad, fuerza, constante elástica `k`, elongación y la relación `F = kx`.
- Movimiento Parabólico: laboratorio de lanzamientos con velocidad inicial, ángulo, gravedad, trayectoria, gráficas, altura máxima, alcance y tiempo de vuelo.

## Capturas

Espacio reservado para capturas del catálogo y de cada simulador:

- `assets/images/catalogo.png`
- `assets/images/hooke.png`
- `assets/images/movimiento-parabolico.png`

## Estructura

```text
/
├── index.html
├── simulators/
│   ├── hooke/
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── style.css
│   │   └── thumbnail.webp
│   ├── movimiento-parabolico/
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── style.css
│   │   └── thumbnail.webp
│   └── futuros-simuladores/
├── assets/
│   ├── css/
│   ├── js/
│   ├── icons/
│   └── images/
├── data/
│   └── simulators.json
├── i18n/
│   ├── es.json
│   └── en.json
└── README.md
```

## Probar localmente

Como el catálogo y las traducciones se cargan con `fetch`, usa un servidor local:

```bash
python3 -m http.server 8000
```

Luego abre:

```text
http://localhost:8000/
```

## Desplegar en GitHub Pages

1. Sube los cambios al repositorio `wachin/yandri-franco-simulators`.
2. En GitHub, entra a `Settings > Pages`.
3. En `Build and deployment`, selecciona `Deploy from a branch`.
4. Elige la rama principal y la carpeta `/root`.
5. Guarda la configuración.

La URL pública tendrá esta forma:

```text
https://wachin.github.io/yandri-franco-simulators/
```

## Añadir un nuevo simulador

1. Crea una carpeta en `simulators/`, por ejemplo `simulators/pendulo-simple/`.
2. Añade sus archivos `index.html`, `script.js`, `style.css` y `thumbnail.webp`.
3. Registra el simulador en `data/simulators.json`:

```json
{
  "id": "pendulo-simple",
  "slug": "pendulo-simple",
  "url": "simulators/pendulo-simple/",
  "thumbnail": "simulators/pendulo-simple/thumbnail.webp",
  "status": "available",
  "level": "Bachillerato",
  "topics": ["oscillations", "gravity"]
}
```

4. Añade sus textos en `i18n/es.json` y `i18n/en.json`, dentro de `simulators`.
5. No es necesario modificar el JavaScript principal del catálogo.

## Añadir un nuevo idioma

1. Crea un archivo en `i18n/`, por ejemplo `fr.json`.
2. Replica la estructura de claves de `es.json`.
3. Añade el idioma en `assets/js/i18n.js`, dentro de `supportedLanguages`.
4. Añade una opción en los selectores de idioma de `index.html` y de cada simulador.

## Tecnologías

- HTML5
- CSS moderno responsive
- JavaScript modular para sitio estático
- Canvas 2D para las simulaciones
- WebP para miniaturas ligeras

## Licencia

Licencia pendiente de definir por los autores del proyecto.
