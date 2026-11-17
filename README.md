# Educación Ciudadana Interactiva · 3.º medio

Plataforma local de estudio para una prueba semestral de Educación Ciudadana. Incluye 17 lecciones, atlas individual de los 30 artículos de la DUDH, actividades con retroalimentación, glosario, repaso de errores, mapas esquemáticos y evaluación de 40 preguntas / 56 puntos.

## Abrir en Windows

1. Instala Node.js si todavía no está instalado.
2. Ejecuta INICIAR.bat.
3. La primera ejecución instala dependencias; al iniciar el servidor se abre http://127.0.0.1:5173.
4. Mantén la ventana de consola abierta mientras estudias. Usa Ctrl+C para detener la aplicación.

Alternativa manual desde esta carpeta: ejecuta npm install y luego npm run dev.

## Compilación de producción

Ejecuta npm run build. El resultado se guarda en dist/. Para probarlo localmente, usa npm run preview.

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` compila `dist/` y lo publica automáticamente con GitHub Pages al recibir cambios en `main`. En el repositorio público, selecciona **Settings → Pages → Build and deployment → GitHub Actions** si Pages aún no se ha configurado. La base de Vite se calcula usando el nombre real del repositorio, por lo que funciona tanto bajo `/<repositorio>/` como en un sitio de usuario u organización.

Al crear el repositorio, no agregues documentos escolares, credenciales ni archivos `.env`. `.gitignore` excluye dependencias, `dist/`, capturas locales y archivos de configuración privada. La URL tendrá el formato `https://<propietario>.github.io/<repositorio>/`; si el repositorio se llama `<propietario>.github.io`, la URL será `https://<propietario>.github.io/`.

## Comprobación visual

La comprobación Playwright comprueba las 17 lecciones, navegación, búsqueda, glosario, atlas, mapas, participantes, evaluación, nota, guardado local y vistas responsivas. Para habilitarla, ejecuta `npx playwright install chromium` una vez y luego `npm run qa`. Las capturas verificadas quedan en `evidence/` (esta carpeta se excluye del repositorio público).

## Privacidad y funcionamiento

- El progreso se guarda localmente en LocalStorage del navegador y no se envía a ningún servidor.
- Las fotografías y el concepto visual están dentro de public/assets/; la aplicación no necesita descargar imágenes al abrirse.
- La aplicación funciona en local después de instalar dependencias. Los enlaces de fuentes oficiales requieren conexión al abrirse.
- Los mapas son esquemáticos y pedagógicos, no sustituyen cartografía oficial ni establecen límites legales.

Consulta CREDITOS.md para atribuciones fotográficas y src/data/sources.js para fuentes normativas y académicas.
