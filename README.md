# Formulario de Solicitud (React + TypeScript, sin BD)

Proyecto mínimo que reproduce el formulario mostrado en la imagen. No usa base de datos; al enviar se muestra la solicitud en JSON (simulado).

Requisitos
- Node.js 16+ y npm

Instalación y ejecución (PowerShell en Windows):

```powershell
cd "c:/Users/Mario/Downloads/tareade webii/form-solicitud"
npm install
npm run dev
```

La app quedará disponible típicamente en http://localhost:5173

Qué incluye
- `src/components/RequestForm.tsx`: el formulario completo con validaciones básicas y funcionalidad de añadir integrantes.
- `src/styles.css`: estilos simples responsivos.

Siguientes pasos opcionales
- Enviar los datos a una API (POST) o guardarlos en localStorage.
- Mejorar validaciones y accesibilidad.

Publicar en GitHub Pages
- Asegúrate de limpiar y commitear los cambios locales:

```powershell
git add .
git commit -m "Preparo repo para GitHub Pages (workflow)"
git push origin main
```

El workflow `.github/workflows/deploy.yml` construirá el proyecto y publicará `dist/` en `gh-pages`. También se ajustó `vite.config.ts` para usar `base: '/FormularioServWebII/'`.

